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

	static async decryptSecret(encrypted: string, privateKey: string, passphrase: string) {
		try {
			const decryptionKey = await openpgp.decryptKey({
				privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
				passphrase: passphrase,
			});

			const decrypted = await openpgp.decrypt({
				message: await openpgp.readMessage({ armoredMessage: encrypted }), // parse armored message
				decryptionKeys: decryptionKey,
			});

			return decrypted.data; // Return the decrypted data
		} catch (error) {
			throw error;
		}
	}
}
