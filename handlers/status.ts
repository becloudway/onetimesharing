import StatusService from "./services/StatusService";
import buildResponseBody from "./helper_functions/buildresponsebody";
import { eMethods } from "./types/enums";

import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
	try {
		return await StatusService.routeRequest(event, `/${eMethods.STATUS}`);
	} catch (err: any) {
		return buildResponseBody(500, err.message || "Unknown server error");
	}
};
