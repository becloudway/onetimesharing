import buildResponseBody from "./helper_functions/buildresponsebody";
import GetPublicKeyService from "./services/GetPublicKeyService";

import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context, callback) => {
	try {
		return await GetPublicKeyService.stepFunctionRequest(event, context, callback);
	} catch (err: any) {
		return buildResponseBody(500, err.message || "Unknown server error");
	}
};
