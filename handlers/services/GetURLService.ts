import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";
import { SignedURLResponse } from "../types/types";

const GetURLService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const response: SignedURLResponse = await SecretsRepository.GetS3URL();

			if (response === undefined) {
				return buildResponseBody(400, `Cannot satisfy the request.`);
			} else {
				return this.#handleGetRequest(response);
			}
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod} for route ${route}`);
	}

	static #handleGetRequest(response: SignedURLResponse) {
		return buildResponseBody(200, JSON.stringify(response));
	}
};

export default GetURLService;
