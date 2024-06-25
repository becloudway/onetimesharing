import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";

const GetPublicKeyService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const uuid = (lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid) || "";
			const response: any = await SecretsRepository.GetPublicKey(uuid);

			if (response === undefined) {
				return buildResponseBody(400, `No data was found for the uuid: ${uuid}`);
			} else {
				return this.#handleGetRequest(response);
			}
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static async stepFunctionRequest(event: any, context: any, callback: any) {
		const uuid = event.PublicKeyID || "";
		const response: any = await SecretsRepository.GetPublicKey(uuid);

		if (response === undefined) {
			return { Found: false };
		} else {
			return { PublicKeyID: uuid, Found: true };
		}
	}

	static #handleGetRequest(response: any) {
		return buildResponseBody(200, JSON.stringify(response));
	}
};

export default GetPublicKeyService;
