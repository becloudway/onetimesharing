import PostSecretsService from "./services/PostSecretsService";
import buildResponseBody from "./helper_functions/buildresponsebody";
import { eMethods } from "./types/enums";

import { Handler } from "aws-lambda";

export const handler: Handler = async (event: any) => {
	try {
		return await PostSecretsService.routeRequest(event, { Item: JSON.parse(event.body) }, `/${eMethods.POST_SHE_SECRET}`);
	} catch (err: any) {
		return buildResponseBody(500, err.message || "Unknown server error");
	}
};
