import axios from "axios";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const CognitoRepository = class {
	private static GetSecret = async () => {
		return new Promise(async (resolve, reject) => {
			const secret_name = "CognitoClientSecret";

			const client = new SecretsManagerClient({
				region: "eu-west-1",
			});

			try {
				resolve(
					await client.send(
						new GetSecretValueCommand({
							SecretId: secret_name,
							VersionStage: "AWSCURRENT",
						})
					)
				);
			} catch (error) {
				reject(error);
			}
		});
	};

	static Login = async (clientID: string, redirectURI: string, code: string) => {
		return new Promise(async (resolve, reject) => {
			const secret = await this.GetSecret()
				.then((response: any) => response.SecretString)
				.catch((err) => console.log(err));

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
					if (response.status === 200) resolve(response.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	};

	static Logout = async (clientID: string, refresh_token: string) => {
		return new Promise(async (resolve, reject) => {
			const secret = await this.GetSecret()
				.then((response: any) => response.SecretString)
				.catch((err) => console.log(err));

			const cognitoDomain = `${process.env.baseURL}/oauth2/revoke`;

			axios
				.post(
					cognitoDomain,
					new URLSearchParams({
						token: refresh_token,
					}),
					{
						headers: {
							Authorization: `Basic ${btoa(`${clientID}:${secret}`)}`,
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				)
				.then((response) => {
					console.log(`Then function: ${response.data}`);
					if (response.status === 200) resolve(response.data);
				})
				.catch((error) => {
					console.log(`Catch function: ${error}`);
					reject(error);
				});
		});
	};

	static RefreshToken = async (clientID: string, refresh_token: string) => {
		return new Promise(async (resolve, reject) => {
			const secret = await this.GetSecret()
				.then((response: any) => response.SecretString)
				.catch((err) => console.log(err));

			const cognitoDomain = `${process.env.baseURL}/oauth2/token`;
			const data = {
				grant_type: "refresh_token",
				client_id: clientID,
				refresh_token: refresh_token
			};

			axios
				.post(
					cognitoDomain,
					new URLSearchParams({
						...data,
					}),
					{
						headers: {
							Authorization: `Basic ${btoa(`${clientID}:${secret}`)}`,
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				)
				.then((response) => {
					if (response.status === 200)
						resolve({
							...response.data,
							refresh_token: refresh_token,
						});
				})
				.catch((error) => {
					reject(error);
				});
		});
	};
};

export default CognitoRepository;
2;
