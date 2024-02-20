import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";

const StatusService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const uuid = (lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid) || "";
			const response: any = await SecretsRepository.StatusSecret(uuid);

			if (response.Item === undefined) {
				return this.#handleGetRequest({
					is_available: false,
				});
			} else {
				return this.#handleGetRequest({
					is_available: true,
					passwordProtected: response.Item.password ? response.Item.password !== "" : false,
				});
			}
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #handleGetRequest(response: any) {
		return buildResponseBody(200, JSON.stringify(response));
	}
};

export default StatusService;
