import axios from "axios";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const CognitoRepository = class {
	static Login = async (clientID: string, redirectURI: string, code: string) => {
		return new Promise(async (resolve, reject) => {
			const secret_name = "CognitoClientSecret";

			const client = new SecretsManagerClient({
				region: "eu-west-1",
			});

			let response;

			try {
				response = await client.send(
					new GetSecretValueCommand({
						SecretId: secret_name,
						VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
					})
				);
			} catch (error) {
				// For a list of exceptions thrown, see
				// https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
				throw error;
			}

			const secret = response.SecretString;

			const cognitoDomain = `${process.env.baseURL}/oauth2/token`;
			const data = {
				grant_type: "authorization_code",
				redirect_uri: redirectURI,
			};

			axios
				.post(
					cognitoDomain,
					new URLSearchParams({
						...data,
						code: code,
					}),
					{
						headers: {
							Authorization: `Basic ${btoa(`${clientID}:${secret}`)}`,
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				)
				.then((response) => {
					console.log(`Then function: ${response}`);
					if (response.status === 200) resolve(response.data);
				})
				.catch((error) => {
					console.log(`Catch function: ${error}`);
					reject(error);
				});
		});
	};
};

export default CognitoRepository;
