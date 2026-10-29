import { generateKeyPairSync } from "crypto";

// RSA-OAEP keypair used by the client to encrypt the URL fragment (first_half_key + iv).
// Both keys are returned as base64 DER so WebCrypto can import them directly (spki / pkcs8).
const generateFragmentKeyPair = (): { publicKey: string; privateKey: string } => {
	const { publicKey, privateKey } = generateKeyPairSync("rsa", {
		modulusLength: 2048,
		publicKeyEncoding: { type: "spki", format: "der" },
		privateKeyEncoding: { type: "pkcs8", format: "der" },
	});

	return {
		publicKey: publicKey.toString("base64"),
		privateKey: privateKey.toString("base64"),
	};
};

export { generateFragmentKeyPair };
