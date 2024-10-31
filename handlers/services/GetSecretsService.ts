import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";
import { SecretsStructure } from "../types/types";
import { generateSHA256Hash } from "../helper_functions/generateSHA256Hash";

type GetSecretData = {
	Item: {
		password: string;
	}
}

const GetSecretsService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, data: GetSecretData, route: string) {
		if (lambdaEvent.httpMethod === "POST" && lambdaEvent.path.includes(route)) {
			const uuid = (lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid) || "";
			const password = (data && data.Item.password) || "";
			const response: SecretsStructure = await SecretsRepository.GetSecret(uuid);

			console.log(`Password: ${password}`);

			if (response.Item === undefined) {
				return buildResponseBody(400, `No secret was found in combination with this UUID.`);
			} else {
				return await this.passwordValidation(uuid, password);
			}
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	private static passwordValidation = async (uuid: string, password: string) => {
		const hashedPassword = generateSHA256Hash(password);
		const response = await SecretsRepository.CheckPassword(uuid, hashedPassword);
		if (!response || response === true) {
			return buildResponseBody(403, `Wrong password!`);
		} else {
			return this.fetchAndDeleteSecret(uuid, response as SecretsStructure);
		}
	};

	private static fetchAndDeleteSecret = async (uuid: string, response: SecretsStructure) => {
		const deleted: boolean = await SecretsRepository.DeleteSecret(uuid);
		if (deleted) {
			return this.#handleGetRequest(response as SecretsStructure);
		} else {
			return buildResponseBody(400, "Failed to delete the cyphertext from the database!");
		}
	};

	static #handleGetRequest(response: SecretsStructure) {
		return buildResponseBody(200, JSON.stringify(response.Item));
	}
};

export default GetSecretsService;
