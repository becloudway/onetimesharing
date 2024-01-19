import * as openpgp from "openpgp";

export default class OpenPGP {
	static async generateKeyPair(passphrase: string) {
		try {
			const { privateKey, publicKey } = await openpgp.generateKey({
				type: "ecc", // Type of the key, defaults to ECC
				curve: "curve25519", // ECC curve name, defaults to curve25519
				userIDs: [{ name: "Jensen", email: "test@test.com" }], // you can pass multiple user IDs
				passphrase: passphrase, // protects the private key
				format: "armored", // output key format, defaults to 'armored' (other options: 'binary' or 'object')
			});

			return { privateKey, publicKey };
		} catch (error) {
			throw error;
		}
	}

	static async encryptSecret(secret: string, publicKey: string) {
		try {
			const encryptionKeys = await openpgp.readKey({ armoredKey: publicKey });

			const encrypted = await openpgp.encrypt({
				message: await openpgp.createMessage({ text: secret }), // input as Message object
				encryptionKeys: encryptionKeys,
			});

			return encrypted;
		} catch (error) {
			throw error;
		}
	}

	private static replaceNewLines(inputString: string) {
		let stringWithoutNewLines = inputString.replace(/\n/g, "\n");
		let stringWithoutTabs = stringWithoutNewLines.replace(/\t/g, "");

		return stringWithoutTabs;
	}

	static async decryptSecret(message: string, privateKey: string, passphrase: string) {
		try {
			const privateKeyObj = await openpgp.decryptKey({
				privateKey: await openpgp.readPrivateKey({ armoredKey: this.replaceNewLines(privateKey) }),
				passphrase: passphrase,
			});

			const decrypted = await openpgp.decrypt({
				message: await openpgp.readMessage({ armoredMessage: this.replaceNewLines(message) }),
				decryptionKeys: [privateKeyObj],
			});

			return decrypted.data;
		} catch (error) {
			throw error;
		}
	}

	private static readFileAsync = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => resolve(event.target?.result as string);
			reader.onerror = (error) => reject(error);
			reader.readAsText(file);
		});
	};

	private static extractPublicKeyFromGPGFile = async (file: File) => {
		return new Promise(async (resolve: (value: string) => void, reject) => {
			try {
				const fileContent = await this.readFileAsync(file);

				// Parse the GPG file
				const keys = await openpgp.readKey({ armoredKey: fileContent });

				// Check if keys are present
				if (keys !== undefined) {
					// Extract the public key
					const publicKeyArmored = keys.toPublic().armor();
					resolve(publicKeyArmored);
				} else {
					reject("No keys found in the GPG file.");
				}
			} catch (error: any) {
				reject(`Error reading or parsing the GPG file: ${error.message}`);
			}
		});
	};

	public static handleFile = (file: any) => {
		return new Promise(async (resolve: (value: string) => void, reject) => {
			if (file) {
				this.extractPublicKeyFromGPGFile(file)
					.then((publicKey) => {
						resolve(publicKey);
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				reject("No file selected.");
			}
		});
	};
}
