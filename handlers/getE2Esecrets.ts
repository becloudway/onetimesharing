import GetSecretsService from "./services/GetSecretsService";
import buildResponseBody from "./helper_functions/buildresponsebody";
import { eMethods } from "./types/enums";

import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
	try {
		return await GetSecretsService.routeRequest(event, `/${eMethods.GET_E2E_SECRET}`);
	} catch (err: any) {
		return buildResponseBody(500, err.message || "Unknown server error");
	}
};
