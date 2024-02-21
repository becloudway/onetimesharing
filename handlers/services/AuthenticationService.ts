import buildResponseBody from "../helper_functions/buildresponsebody";
import { APIGatewayProxyEvent } from "aws-lambda";
import CognitoRepository from "../repositories/CognitoRepository";
import { extractTokensFromCookie } from "../helper_functions/extractTokensFromCookie";

const AuthenticationService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const clientId = process.env.clientID || "";
			const redirectURI = (lambdaEvent.queryStringParameters && lambdaEvent.queryStringParameters.redirectURI) || "";
			const code = (lambdaEvent.queryStringParameters && lambdaEvent.queryStringParameters.code) || "";
			const refresh_token = (lambdaEvent.queryStringParameters && lambdaEvent.queryStringParameters.refresh_token) || "";

			//Handle the login
			if (lambdaEvent.path.includes("login")) {
				if (clientId === "") return buildResponseBody(400, "ClientID was not found.");
				if (redirectURI === "") return buildResponseBody(400, "The request should contain a redirectURI");

				if (code === "")
					return buildResponseBody(
						302,
						JSON.stringify({
							url: `${process.env.baseURL}/login?client_id=${process.env.clientID}&response_type=code&scope=email+openid&redirect_uri=${redirectURI}`,
						})
					);

				return CognitoRepository.Login(clientId, redirectURI, code)
					.then((response) => {
						return this.#handleLoginRequest(response as { id_token: string; access_token: string; refresh_token: string });
					})
					.catch((error) => {
						console.log(error);
					});
			}

			//Handle the logout
			if (lambdaEvent.path.includes("logout")) {
				const cookie = lambdaEvent.headers.Cookie || "";
				const refresh_token = extractTokensFromCookie(cookie, "refresh_token") || "";

				if (refresh_token === "") return buildResponseBody(200, "");

				return CognitoRepository.Logout(clientId, refresh_token)
					.then((response) => {
						return this.#handleLogoutRequest(response);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #handleLoginRequest(response: any) {
		return buildResponseBody(
			200,
			JSON.stringify({
				loggedIn: true,
			}),
			{},
			{
				"Set-Cookie": [
					`id_token=${response.id_token}; Secure; HttpOnly;`,
					`access_token=${response.access_token}; Secure; HttpOnly;`,
					`refresh_token=${response.refresh_token}; Secure; HttpOnly;`,
				],
			}
		);
	}

	static #handleLogoutRequest(response: any) {
		return buildResponseBody(
			200,
			JSON.stringify({
				loggedIn: false,
			}),
			{},
			{
				"Set-Cookie": [
					`id_token=; Secure; HttpOnly; expires=Thu 01, Jan 1970 00:00:00 GMT`,
					`access_token=; Secure; HttpOnly; expires=Thu 01, Jan 1970 00:00:00 GMT`,
					`refresh_token=; Secure; HttpOnly; expires=Thu 01, Jan 1970 00:00:00 GMT`,
				],
			}
		);
	}
};

export default AuthenticationService;
