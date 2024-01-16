import buildResponseBody from "./helper_functions/buildresponsebody";
import GetPublicKeyService from "./services/GetPublicKeyService";
import { eMethods } from "./types/enums";

import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
	try {
		return await GetPublicKeyService.routeRequest(event, `/${eMethods.GET_PUBLIC_KEY}`);
	} catch (err: any) {
		return buildResponseBody(500, err.message || "Unknown server error");
	}
};
