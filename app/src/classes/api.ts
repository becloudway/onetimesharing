import axios from "axios";
import DOMPurify from 'dompurify';

const dev = process.env.NODE_ENV === "dev";
const apiURL: string = import.meta.env.VITE_DEV_URL;

export class Api {
	public static GetSHESecret = async (uuid: string, password: string) => {
		uuid = DOMPurify.sanitize(uuid);
		password = DOMPurify.sanitize(password);

		type ReturnType = { data: { cyphertext: string; second_half_key: string; iv: string } };
		return new Promise(async (resolve: (value: ReturnType) => void, reject) => {
			await axios
				.post(`/api/getSHE/${uuid}`, { password: encodeURIComponent(password) }, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((res: ReturnType) => {
					resolve(res);
				})
				.catch((error) => {
					reject(error.response.data);
				});
		});
	};

	public static PostSHESecret = async (valuesObject: { cyphertext: string; second_half_key: string; password?: string }) => {
		valuesObject = {
			cyphertext: DOMPurify.sanitize(valuesObject.cyphertext),
			second_half_key: DOMPurify.sanitize(valuesObject.second_half_key),
			password: encodeURIComponent(DOMPurify.sanitize(valuesObject.password || ""))
		}

		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.post(`/api/addSHE`, valuesObject, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((res) => {
					resolve(res.data.id);
				})
				.catch((error) => {
					reject(error.response.data);
				});
		});
	};

	public static GetE2ESecret = async (uuid: string) => {
		uuid = DOMPurify.sanitize(uuid);

		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.get(`/api/getE2E/${uuid}`, {
					headers: {
						"Content-Type": "application/json",
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

	public static PostE2ESecret = async (encryptedSecret: string, loadedPublicKey: string) => {
		encryptedSecret = DOMPurify.sanitize(encryptedSecret);
		loadedPublicKey = DOMPurify.sanitize(loadedPublicKey);

		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.post(
					`/api/addE2E`,
					{
						cyphertext: encryptedSecret,
						public_key_uuid: loadedPublicKey,
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
					reject(`Error posting secret: ${error.message}`);
				});
		});
	};

	public static GetStatus = async (uuid: string) => {
		uuid = DOMPurify.sanitize(uuid);

		return new Promise(async (resolve: (value: { is_available: boolean; passwordProtected: boolean; version: number }) => void, reject) => {
			await axios
				.get(`/api/status/${uuid}`, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((res) => {
					resolve(res.data);
				})
				.catch((error) => {
					reject(`Error getting status: ${error.message}`);
				});
		});
	};

	public static GetPublicKey = async (uuid: string) => {
		uuid = DOMPurify.sanitize(uuid);

		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.get(`/api/getpublickey/${uuid}`, {
					headers: {
						"Content-Type": "application/json",
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
		publicKey = DOMPurify.sanitize(publicKey);

		return new Promise(async (resolve: (value: string) => void, reject) => {
			await axios
				.post(
					`/api/postpublickey`,
					{
						public_key: publicKey.replace(/\r?\n+$/, "").replace(/\r?\n(?!\r?\n)/g, "\\n"),
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
					reject(`Error posting secret: ${error.message}`);
				});
		});
	};

	public static Login = async (code: string | null) => {
		const sanitizedCode = DOMPurify.sanitize(code || "");
		code = sanitizedCode !== "" ? sanitizedCode : null;

		return new Promise(async (resolve: (code: any) => void, reject) => {
			axios
				.get(
					`/api/login?redirectURI=${encodeURIComponent(window.location.origin)}/callback${code !== "" && code !== null ? `&code=${code}` : ""
					}`,
					{
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					}
				)
				.then((response) => {
					resolve({
						data: response.data,
						status: 200,
					});
				})
				.catch((error) => {
					const resp = error.response;
					if (resp) {
						const body = resp.data;
						if (resp.status === 302) {
							resolve({
								data: body.url,
								status: 302,
							});
						} else {
							reject(error);
						}
					} else {
						reject(error);
					}
				});
		});
	};

	public static Logout = async () => {
		return new Promise(async (resolve, reject) => {
			axios
				.get(`${dev ? apiURL : ""}/api/logout`, {
					withCredentials: true,
				})
				.then((response) => {
					resolve({
						data: response.data,
						status: 200,
					});
				})
				.catch((error) => {
					reject(error);
				});
		});
	};
}
