import PostPublicKeyService from "./services/PostPublicKeyService";
import buildResponseBody from "./helper_functions/buildresponsebody";
import { eMethods } from "./types/enums";

import { Handler } from "aws-lambda";
import { PublicKeyRequestBody } from "./types/types";

export const handler: Handler = async (event) => {
	try {
		return await PostPublicKeyService.routeRequest(event, JSON.parse(event.body) as PublicKeyRequestBody, `/${eMethods.POST_PUBLIC_KEY}`);
	} catch (err: any) {
		return buildResponseBody(500, err.message || "Unknown server error");
	}
};
