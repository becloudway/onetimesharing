import buildResponseBody from "../helper_functions/buildresponsebody";
import { APIGatewayProxyEvent } from "aws-lambda";
import CognitoRepository from "../repositories/CognitoRepository";

const AuthenticationService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const clientId = process.env.clientID || "";
			const redirectURI = (lambdaEvent.queryStringParameters && lambdaEvent.queryStringParameters.redirectURI) || "";
			const code = (lambdaEvent.queryStringParameters && lambdaEvent.queryStringParameters.code) || "";

			console.log(`Redirect URL: ${redirectURI}`);
			console.log(`Code: ${code}`);

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
						return this.#handleGetRequest(response as { id_token: string; access_token: string; refresh_token: string });
					})
					.catch((error) => {
						console.log(error);
					});
			}

			//Handle the logout
			//if (lambdaEvent.path.includes("logout")) return this.#handleGetRequest();
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #handleGetRequest(response: { id_token: string; access_token: string; refresh_token: string }) {
		console.log(response);
		return buildResponseBody(
			200,
			JSON.stringify(response),
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
};

export default AuthenticationService;
