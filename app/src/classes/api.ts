import axios from "axios";

const dev = process.env.NODE_ENV === "dev";
const apiURL: string = import.meta.env.VITE_DEV_URL;

export class Api {
	public static GetSHESecret = async (uuid: string) => {
		type ReturnType = { data: { cyphertext: string; second_half_key: string; iv: string } };
		return new Promise(async (resolve: (value: ReturnType) => void, reject) => {
			await axios
				.get(`${dev ? apiURL : ""}/api/getSHE/${uuid}`, {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				})
				.then((res: ReturnType) => {
					resolve(res);
				})
				.catch((error) => {
					reject("Error getting secret: " + error.message);
				});
		});
	};

	public static PostSHESecret = async (encryptedSecret: string, second_half_key: string) => {
		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.post(
					`${dev ? apiURL : ""}/api/addSHE`,
					{
						cyphertext: encryptedSecret,
						second_half_key: second_half_key,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					resolve(res.data.id);
				})
				.catch((error) => {
					reject(error.message);
				});
		});
	};

	public static GetE2ESecret = async (uuid: string) => {
		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.get(`${dev ? apiURL : ""}/api/getE2E/${uuid}`, {
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
					`${dev ? apiURL : ""}/api/addE2E`,
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

	public static GetPublicKey = async (uuid: string) => {
		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.get(`${dev ? apiURL : ""}/api/getpublickey/${uuid}`, {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				})
				.then((res) => {
					resolve(
						res.data.public_key
							.replace(/\\n/g, "\n")
							.replace(/\r?\n(?!\r?\n)/g, "\n")
							.replace(/\n$/, "")
					);
				})
				.catch((error) => {
					reject("Error getting secret: " + error.message);
				});
		});
	};

	public static PostPublicKey = async (publicKey: string) => {
		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.post(
					`${dev ? apiURL : ""}/api/postpublickey`,
					{
						public_key: publicKey.replace(/\r?\n+$/, "").replace(/\r?\n(?!\r?\n)/g, "\\n"),
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

	public static Login = async (code: string | null) => {
		return new Promise(async (resolve: (code: string) => void, reject) => {
			axios
				.get(
					`${dev ? apiURL : ""}/api/login?redirectURI=${encodeURIComponent(window.location.origin)}/callback${
						code !== "" && code !== null ? `&code=${code}` : ""
					}`,
					{
						withCredentials: true,
					}
				)
				.then((response) => {
					console.log(response);
					if (response.status === 200) resolve(JSON.parse(response.data).url);
				})
				.catch((error) => {
					const resp = error.response;
					if (resp) {
						const body = resp.data;
						if (resp.status === 302) {
							resolve(body.url);
						} else {
							reject(error);
						}
					} else {
						reject(error);
					}
				});
		});
	};
}
