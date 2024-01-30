import axios from "axios";

const CognitoRepository = class {
	static Login = async (clientID: string, redirectURI: string, code: string) => {
		return new Promise(async (resolve, reject) => {
			const cognitoDomain = "https://onetimesharing-authorize.auth.eu-west-1.amazoncognito.com/oauth2/token";
			const data = {
				grant_type: "authorization_code",
				client_id: clientID,
				redirect_uri: redirectURI,
			};

			if (code === "") resolve(false);

			await axios
				.post(
					cognitoDomain,
					new URLSearchParams({
						...data,
						code: code,
					}),
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				)
				.then((response) => resolve(response))
				.catch((error) => reject(error));
		});
	};
};

export default CognitoRepository;
