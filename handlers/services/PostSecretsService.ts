import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";
import { SecretsStructure } from "../types/types";

import validator from "validator";

const PostSecretsService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, data: SecretsStructure, route: string) {
		if (lambdaEvent.httpMethod === "POST" && lambdaEvent.path.includes(route)) {
			/*
          Still need to add the verification of the data.

          SHE encrypted secrets => Cyphertext needs to have a max of 20032 bytes,
          anything longer than this amount of bytes should be refused.
          E2E (RSA-2048) => Cyphertext needs to have a max of 256 bytes. Anything longer
          should be refused.
          E2E (RSA-4096) => Cyphertext needs to have a max of 512 bytes. Anything longer
          should be refused.

          The data that is expected by the PostItem function from the SecretsRepository is:
          {
            encryption_type: "SHE" || "E2E",
            cyphertext: string (the encrypted secret),
            retrievedCount: defaults to 1 at this moment in time,
            second_half_key: string (the second half of the encryption key in case of SHE)
            ttl: time-to-live 
          }
      */

		  let sanitizedData = {
			Item: {
				encryption_type: validator.escape(data.Item.encryption_type),
				cyphertext: validator.escape(data.Item.cyphertext),
				second_half_key: validator.escape(data.Item.second_half_key || ""),
				retrievedCount: data.Item.retrievedCount,
				passwordTries: data.Item.passwordTries,
				ttl: data.Item.ttl,
				public_key_uuid: validator.escape(data.Item.public_key_uuid || ""),
				password: validator.escape(data.Item.password || ""),
				version: data.Item.version
			}
		  } as SecretsStructure;

			let verification: true | ReturnType<typeof buildResponseBody> = true;

			if (route === "/addSHE") verification = this.#verifyPostSHErequest(sanitizedData);
			if (route === "/addE2E") verification = this.#verifyPostE2Erequest(sanitizedData);

			if (verification !== true) return verification;

			data.Item = {
				...data.Item,
				encryption_type: route === "/addSHE" ? "SHE" : "E2E",
				public_key_uuid: route === "/addE2E" ? (sanitizedData.Item.public_key_uuid ? sanitizedData.Item.public_key_uuid : undefined) : undefined,
			};

			const uuid = await SecretsRepository.PostItem(sanitizedData);
			return this.#handlePostRequest({
				id: uuid,
			});
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #verifyPostSHErequest(data: SecretsStructure) {
		const passwordIncluded = Object.keys(data.Item).includes("password");

		if (!Object.keys(data.Item).includes("cyphertext")) {
			return buildResponseBody(400, "Missing cyphertext field.");
		}

		if (!Object.keys(data.Item).includes("second_half_key")) {
			return buildResponseBody(400, "Missing second_half_key field.");
		}

		if (passwordIncluded && data.Item.password === "") {
			return buildResponseBody(400, "The password field cannot be empty!");
		}

		if (data.Item.second_half_key === "") {
			return buildResponseBody(400, "The second_half_key field must be set to a string of 32 characters.");
		}

		if (data.Item.second_half_key?.length !== 32) {
			return buildResponseBody(400, "The second_half_key field must be set to a string of 32 characters.");
		}

		if (data.Item.cyphertext === "") {
			return buildResponseBody(400, "The cyphertext field cannot be empty.");
		}

		if (data.Item.cyphertext.length > 20032) {
			return buildResponseBody(400, "Secret is too long.");
		}

		return true;
	}

	static #verifyPostE2Erequest(data: SecretsStructure) {
		const publicKeyIsIncluded = Object.keys(data.Item).includes("public_key_uuid");

		if (publicKeyIsIncluded) {
			if (Object.keys(data.Item).length !== 2) {
				if (!Object.keys(data.Item).includes("cyphertext")) {
					return buildResponseBody(400, "Missing cyphertext field.");
				}

				if (!Object.keys(data.Item).includes("public_key_uuid")) {
					return buildResponseBody(400, "Missing public_key_uuid field.");
				}

				return buildResponseBody(400, "The request body must only contain the following fields: cyphertext, public_key_uuid.");
			}
		} else {
			if (!Object.keys(data.Item).includes("cyphertext")) {
				return buildResponseBody(400, "Missing cyphertext field.");
			}

			if (data.Item.password === "") {
				return buildResponseBody(400, "The password field cannot be empty!");
			}
		}

		if (data.Item.cyphertext === "") {
			return buildResponseBody(400, "The cyphertext field cannot be empty.");
		}

		if (data.Item.cyphertext.length > 20032) {
			return buildResponseBody(400, "The cyphertext field must be set to a size of 20032 characters or less.");
		}

		if (publicKeyIsIncluded && data.Item.public_key_uuid === "") {
			return buildResponseBody(400, "The public_key_uuid field cannot be empty.");
		}

		if (publicKeyIsIncluded && data.Item.public_key_uuid?.length !== 36) {
			return buildResponseBody(400, "The public_key_uuid field must be set to a string of 36 characters.");
		}

		return true;
	}

	static #handlePostRequest(body: { id: string }) {
		return buildResponseBody(200, JSON.stringify(body));
	}
};

export default PostSecretsService;
