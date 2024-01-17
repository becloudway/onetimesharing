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
}
