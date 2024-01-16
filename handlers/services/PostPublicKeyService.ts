import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";
import { PublicKeyRequestBody, SignedURLResponse } from "../types/types";

const PostPublicKeyService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, data: PublicKeyRequestBody, route: string) {
		/**
		 * Check if the request is a POST request and if the route is correct.
		 */
		if (lambdaEvent.httpMethod === "POST" && lambdaEvent.path.includes(route)) {
			/**
			 * Verifies the request body.
			 */
			const verification: true | ReturnType<typeof buildResponseBody> = this.#verifiyPublicKeyRequest(data);
			if (verification !== true) return verification;

			/**
			 * Sends the request to the SecretsRepository.
			 */
			const response: SignedURLResponse = await SecretsRepository.PostPublicKey(data.public_key);

			/**
			 * Handles the response from the SecretsRepository.
			 */
			if (response === undefined) {
				return buildResponseBody(400, `Cannot satisfy the request.`);
			} else {
				return this.#handlePostRequest(response);
			}
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod} for route ${route}`);
	}

	static #verifiyPublicKeyRequest = (body: PublicKeyRequestBody) => {
		/**
		 * Verify if there is any data in the request body.
		 */
		if (body === undefined || body === null) return buildResponseBody(400, "Missing request body.");
		/**
		 * Verifies the request body.
		 */
		if (!Object.keys(body).includes("public_key")) return buildResponseBody(400, "Missing public_key field.");
		if (Object.keys(body).length !== 1) return buildResponseBody(400, "Too many fields in the request body.");

		/**
		 * Verifies the public key.
		 */
		const regex = new RegExp(/^-----BEGIN PGP PUBLIC KEY BLOCK-----[\s\S]+-----END PGP PUBLIC KEY BLOCK-----$/);
		if (!regex.test(body.public_key)) return buildResponseBody(400, "Invalid public key.");

		/**
		 * Returns true if the request body is valid.
		 */
		return true;
	};

	static #handlePostRequest(response: any) {
		return buildResponseBody(200, JSON.stringify(response));
	}
};

export default PostPublicKeyService;
