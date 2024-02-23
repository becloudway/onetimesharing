import buildResponseBody from "./helper_functions/buildresponsebody";
import InvalidatePublicKeyService from "./services/InvalidatePublicKeyService";

import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context, callback) => {
	try {
		return await InvalidatePublicKeyService.stepFunctionRequest(event, context, callback);
	} catch (err: any) {
		return buildResponseBody(500, err.message || "Unknown server error");
	}
};
