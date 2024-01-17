import axios from "axios";

const dev = process.env.NODE_ENV === "dev";
const apiURL: string = "";

export class Api {
	public static GetE2ESecret = async (uuid: string) => {
		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.get(`${dev && apiURL}/api/getE2E/${uuid}`, {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				})
				.then((res) => {
					resolve(res.data.cyphertext);
				})
				.catch((error) => {
					reject("Error getting secret: " + error.message);
				});
		});
	};

	public static PostE2ESecret = async (encryptedSecret: string) => {
		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.post(
					`${dev && apiURL}/api/addE2E`,
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
