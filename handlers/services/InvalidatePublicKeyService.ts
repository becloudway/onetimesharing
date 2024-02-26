import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";

const InvalidatePublicKeyService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "DELETE" && lambdaEvent.path.includes(route)) {
			const uuid = (lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid) || "";
			const response: boolean = await SecretsRepository.RemovePublicKey(uuid);

			if (!response) buildResponseBody(400, `No public key was found for the id: ${uuid}`);

			const deletedCount: number = await SecretsRepository.InvalidateSecret(uuid);

			if (!deletedCount) buildResponseBody(400, `No secrets were found for the public key with id: ${uuid}`);

			return this.#handleDeleteRequest(
				`The public key with ID "${uuid}" has successfully been deleted. Along with ${deletedCount} secrets.`
			);
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #handleDeleteRequest(response: string) {
		return buildResponseBody(200, response);
	}

	static stepFunctionRequest = async (event: any, context: any, handler: any) => {
		const uuid = event.PublicKeyID || "";

		const deletedPublicKey: boolean = await SecretsRepository.RemovePublicKey(uuid);

		const deletedCount: number = await SecretsRepository.InvalidateSecret(uuid);

		if (!deletedCount) return { PublicKeyDeleted: deletedPublicKey, SecretsDeleted: false };

		return { PublicKeyDeleted: deletedPublicKey, SecretsDeleted: true };
	};
};

export default InvalidatePublicKeyService;
