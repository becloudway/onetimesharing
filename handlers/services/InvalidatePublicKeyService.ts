import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { APIGatewayProxyEvent } from "aws-lambda";

import validator from "validator";

const InvalidatePublicKeyService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "DELETE" && lambdaEvent.path.includes(route)) {
			const uuid = validator.escape((lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid) || "");

			if (!process.env.statemachine_arn) return buildResponseBody(400, "Failed to get Arn");

			const client = new SFNClient();
			const input = {
				stateMachineArn: process.env.statemachine_arn,
				input: `{"PublicKeyID": "${uuid}"}`,
			};

			const command = new StartExecutionCommand(input);
			const response = await client.send(command);

			return this.#handleDeleteRequest("The secrets and the public key are being deleted.");
		}
		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #handleDeleteRequest(response: string) {
		return buildResponseBody(200, response);
	}

	static stepFunctionRequest = async (event: any) => {
		const uuid = event.PublicKeyID || "";
		const NextToken = event.NextToken || "";

		return await SecretsRepository.ExecuteStatement(uuid, NextToken);
	};
};

export default InvalidatePublicKeyService;
