import AuthenticationService from "./services/AuthenticationService";
import buildResponseBody from "./helper_functions/buildresponsebody";
import { eMethods } from "./types/enums";

import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
	try {
		return await AuthenticationService.routeRequest(event, `/${eMethods.LOGIN}`);
	} catch (err: any) {
		return buildResponseBody(500, err.message || "Unknown server error");
	}
};
