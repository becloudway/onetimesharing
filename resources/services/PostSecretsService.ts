import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";
import { SecretsStructure } from "../types/types";

const PostSecretsService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, data: SecretsStructure, route: string) {
		if (lambdaEvent.httpMethod === "POST" && lambdaEvent.path === route) {
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

			let verification: true | ReturnType<typeof buildResponseBody> = true;

			if (route === "/addSHE") verification = this.#verifyPostSHErequest(data);
			if (route === "/addE2E") verification = this.#verifyPostE2Erequest(data);

			if (verification !== true) return verification;

			const uuid = await SecretsRepository.PostItem(data as SecretsStructure);
			return this.#handlePostRequest({
				id: uuid,
			});
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #verifyPostSHErequest(data: SecretsStructure) {
		if (Object.keys(data.Item).length !== 2) {
			if (!Object.keys(data.Item).includes("cyphertext")) {
				return buildResponseBody(400, "Missing cyphertext field.");
			}

			if (!Object.keys(data.Item).includes("second_half_key")) {
				return buildResponseBody(400, "Missing second_half_key field.");
			}

			return buildResponseBody(400, "The request body must only contain the following fields 2: cyphertext, second_half_key.");
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
			return buildResponseBody(400, "The cyphertext field must be set to a string of 20032 characters or less.");
		}

		return true;
	}

	static #verifyPostE2Erequest(data: SecretsStructure) {
		if (Object.keys(data.Item).length !== 1) {
			if (!Object.keys(data.Item).includes("cyphertext")) {
				return buildResponseBody(400, "Missing cyphertext field.");
			}
			return buildResponseBody(400, "The request body must only contain the following field: cyphertext.");
		}

		if (data.Item.cyphertext === "") {
			return buildResponseBody(400, "The cyphertext field cannot be empty.");
		}

		//Diferentiate between RSA-2048 and RSA-4096
		if (data.Item.cyphertext.length > 512) {
			return buildResponseBody(400, "The cyphertext field must be set to a string of 512 characters or less.");
		}

		return true;
	}

	static #handlePostRequest(body: { id: string }) {
		return buildResponseBody(200, JSON.stringify(body));
	}
};

export default PostSecretsService;
