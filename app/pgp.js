const openpgp = require("openpgp");

module.exports.OpenPGP = class {
	static async generateKeyPair(passphrase) {
		const { privateKey, publicKey } = await openpgp.generateKey({
			type: "ecc", // Type of the key, defaults to ECC
			curve: "curve25519", // ECC curve name, defaults to curve25519
			userIDs: [{ name: "Jensen", email: "test@test.com" }], // you can pass multiple user IDs
			passphrase: passphrase, // protects the private key
			format: "armored", // output key format, defaults to 'armored' (other options: 'binary' or 'object')
		});

		return { privateKey, publicKey };
	}

	static async encryptSecret(secret, publicKey) {
		const key = await openpgp.readKey({ armoredKey: publicKey });

		const encrypted = await openpgp.encrypt({
			message: await openpgp.createMessage({ text: secret }), // input as Message object
			encryptionKeys: key,
		});

		return encrypted;
	}

	static async decryptSecret(encrypted, privateKey, passphrase) {
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
};
