import buildResponseBody from "../helper_functions/buildresponsebody";
import { APIGatewayProxyEvent } from "aws-lambda";
import CognitoRepository from "../repositories/CognitoRepository";
import { extractTokensFromCookie } from "../helper_functions/extractTokensFromCookie";

import validator from "validator";

const RefreshTokenService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const clientId = validator.escape(process.env.clientID || "");
			const cookie = validator.escape(lambdaEvent.headers.Cookie || "");
			const refresh_token = validator.escape(extractTokensFromCookie(cookie, "refresh_token") || "");

            if(refresh_token === "") return buildResponseBody(400, "The request should contain a refresh_token.");

			return CognitoRepository.RefreshToken(clientId, refresh_token)
				.then((response) => {
					return this.#handleRequest(response as { id_token: string; access_token: string; refresh_token: string });
				})
				.catch((err) => {
					return buildResponseBody(400, "Error fetching new tokens.");
				});
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #handleRequest(response: { id_token: string; access_token: string; refresh_token: string }) {
		return buildResponseBody(200, JSON.stringify({
            refreshed: true
        }), {}, {
			"Set-Cookie": [
				`id_token=${response.id_token}; Secure; HttpOnly;`,
				`access_token=${response.access_token}; Secure; HttpOnly;`,
				`refresh_token=${response.refresh_token}; Secure; HttpOnly;`,
			],
		});
	}
};

export default RefreshTokenService;
