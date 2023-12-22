import * as openpgp from "openpgp";

export default class OpenPGP {
	static async generateKeyPair(passphrase: string) {
		return new Promise(async (res, rej) => {
			const { privateKey, publicKey } = await openpgp.generateKey({
				type: "ecc", // Type of the key, defaults to ECC
				curve: "curve25519", // ECC curve name, defaults to curve25519
				userIDs: [{ name: "Jensen", email: "test@test.com" }], // you can pass multiple user IDs
				passphrase: passphrase, // protects the private key
				format: "armored", // output key format, defaults to 'armored' (other options: 'binary' or 'object')
			});

			res({ privateKey, publicKey });
		});
	}

	static async encryptSecret(secret: string, publicKey: string) {
		const key = await openpgp.readKey({ armoredKey: publicKey });

		const encrypted = await openpgp.encrypt({
			message: await openpgp.createMessage({ text: secret }), // input as Message object
			encryptionKeys: key,
		});

		return encrypted;
	}

	static async decryptSecret(encrypted: string, privateKey: string, passphrase: string) {
		const key = await openpgp.decryptKey({
			privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
			passphrase: passphrase,
		});

		const decrypted = await openpgp.decrypt({
			message: await openpgp.readMessage({ armoredMessage: encrypted }), // parse armored message
			decryptionKeys: key,
		});

		return decrypted.data;
	}
}
