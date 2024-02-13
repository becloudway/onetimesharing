import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";

const StatusService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const uuid = (lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid) || "";
			const response: any = await SecretsRepository.StatusSecret(uuid);

			console.log(response);

			if (response === undefined) {
				return buildResponseBody(400, `No data was found for the uuid: ${uuid}`);
			} else {
				return this.#handleGetRequest(response);
			}
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #handleGetRequest(response: any) {
		return buildResponseBody(200, JSON.stringify(response.Item));
	}
};

export default StatusService;
