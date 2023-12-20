const { OpenPGP } = require("./pgp.js");

const main = async () => {
	const keyPair = await OpenPGP.generateKeyPair("passphrase");
	console.log(keyPair.publicKey);
	console.log(keyPair.privateKey);

	const encrypted = await OpenPGP.encryptSecret("hallo dit is een test", keyPair.publicKey);
	const decrypted = await OpenPGP.decryptSecret(encrypted, keyPair.privateKey, "passphrase");

	console.log(encrypted);
	console.log(decrypted);
};

main();
