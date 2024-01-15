import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";

const GetURLService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const filename = (lambdaEvent.pathParameters && lambdaEvent.pathParameters.filename) || "";
			const response: any = await SecretsRepository.GetS3URL(filename);

			if (response === undefined) {
				return buildResponseBody(400, `Cannot satisfy the request for ${filename}`);
			} else {
				return this.#handleGetRequest(response);
			}
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod} for route ${route}`);
	}

	static #handleGetRequest(response: string) {
		return buildResponseBody(200, response);
	}
};

export default GetURLService;
