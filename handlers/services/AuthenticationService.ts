import buildResponseBody from "../helper_functions/buildresponsebody";
import { APIGatewayProxyEvent } from "aws-lambda";
import CognitoRepository from "../repositories/CognitoRepository";

const AuthenticationService = class {
	static async routeRequest(lambdaEvent: APIGatewayProxyEvent, route: string) {
		if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
			const clientId = process.env.clientID || "";
			const redirectURI = (lambdaEvent.queryStringParameters && lambdaEvent.queryStringParameters.redirectURI) || "";
			const code = (lambdaEvent.queryStringParameters && lambdaEvent.queryStringParameters.code) || "";

			//Handle the login
			if (lambdaEvent.path.includes("login")) {
				if (clientId === "") return buildResponseBody(400, "ClientID was not found.");
				if (redirectURI === "") return buildResponseBody(400, "The request should contain a redirectURI");

				return CognitoRepository.Login(clientId, redirectURI, code)
					.then((response) => {
						if (response === false) return buildResponseBody(302, "Should redirect.");
					})
					.catch((error) => {
						console.log(error);
					});
			}

			//Handle the logout
			if (lambdaEvent.path.includes("logout")) return this.#handleGetRequest("logout");
		}

		return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
	}

	static #handleGetRequest(response: any) {
		return buildResponseBody(200, JSON.stringify(response));
	}
};

export default AuthenticationService;
