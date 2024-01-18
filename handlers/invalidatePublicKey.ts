import InvalidatePublicKeyService from "./services/InvalidatePublicKeyService";
import buildResponseBody from "./helper_functions/buildresponsebody";
import { eMethods } from "./types/enums";

import { Handler } from "aws-lambda";

export const handler: Handler = async (event: any) => {
	try {
		return await InvalidatePublicKeyService.routeRequest(event, `/${eMethods.INVALIDATE_PUBLIC_KEY}`);
	} catch (err: any) {
		return buildResponseBody(500, err.message || "Unknown server error");
	}
};
