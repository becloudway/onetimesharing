import axios from "axios";

export class Api {
	public static PostE2ESecret = async (encryptedSecret: string) => {
		return new Promise(async (resolve, reject) => {
			await axios
				.post(
					`/api/addE2E`,
					{
						cyphertext: encryptedSecret,
					},
					{
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						},
					}
				)
				.then((res) => {
					resolve(res.data.id);
				})
				.catch((error) => {
					reject(`Error posting secret: ${error.message}`);
				});
		});
	};
}
