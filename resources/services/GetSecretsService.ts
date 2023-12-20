import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";
import { SecretsStructure } from "../types/types";

const GetSecretsService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const uuid = (lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid) || "";
			const response: any = await SecretsRepository.GetSecret(uuid);

			if (response.Item === undefined) {
				return buildResponseBody(404, `No data was found for the uuid: ${uuid}`);
			} else {
				return this.#handleGetRequest(response as SecretsStructure);
			}
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #handleGetRequest(response: SecretsStructure) {
		return buildResponseBody(200, JSON.stringify(response.Item));
	}
};

export default GetSecretsService;
