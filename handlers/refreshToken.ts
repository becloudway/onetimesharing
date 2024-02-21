import RefreshTokenService from "./services/RefreshTokenService";
import buildResponseBody from "./helper_functions/buildresponsebody";
import { eMethods } from "./types/enums";

import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
	try {
		return await RefreshTokenService.routeRequest(event, `/${eMethods.REFRESH}`);
	} catch (err: any) {
		return buildResponseBody(500, err.message || "Unknown server error");
	}
};
