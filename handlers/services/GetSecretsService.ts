import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";
import { SecretsStructure } from "../types/types";
import { generateSHA256Hash } from "../helper_functions/generateSHA256Hash";

const GetSecretsService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const uuid = (lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid) || "";
			const password = (lambdaEvent.queryStringParameters && lambdaEvent.queryStringParameters.password) || "";
			const response: any = await SecretsRepository.GetSecret(uuid);

			if (response.Item === undefined) {
				return buildResponseBody(400, `No data was found for the uuid: ${uuid}`);
			} else {
				if (response.Item.password && response.Item.password) {
					return await this.passwordValidation(uuid, response, password);
				} else {
					const deleted: boolean = await SecretsRepository.DeleteSecret(uuid);
					if (deleted) {
						return this.#handleGetRequest(response as SecretsStructure);
					} else {
						return buildResponseBody(400, "Failed to delete the cyphertext from the database!");
					}
				}
			}
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	private static passwordValidation = async (uuid: string, response: SecretsStructure, password: string) => {
		const hashedPassword = generateSHA256Hash(password);
		if (hashedPassword === response.Item.password) {
			const deleted: boolean = await SecretsRepository.DeleteSecret(uuid);
			if (deleted) {
				return this.#handleGetRequest(response as SecretsStructure);
			} else {
				return buildResponseBody(400, "Failed to delete the cyphertext from the database!");
			}
		} else {
			return buildResponseBody(403, `Wrong password!`);
		}
	};

	static #handleGetRequest(response: SecretsStructure) {
		return buildResponseBody(200, JSON.stringify(response.Item));
	}
};

export default GetSecretsService;
