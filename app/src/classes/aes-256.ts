import * as CryptoJS from "crypto-js";

export default class AES256 {
	private static generateAesKeyAndIV(): { key: string; iv: string } {
		try {
			// Generate a random 256-bit (32-byte) AES key
			const key = CryptoJS.lib.WordArray.random(32);

			// Generate a random 128-bit (16-byte) initialization vector (IV)
			const iv = CryptoJS.lib.WordArray.random(16);

			return {
				key: key.toString(CryptoJS.enc.Hex),
				iv: iv.toString(CryptoJS.enc.Hex),
			};
		} catch (error) {
			console.error("Error generating AES key and IV:", error);
			throw error;
		}
	}

	static async encryptSecret(secret: string): Promise<{ encrypted: string; key: string; iv: string }> {
		try {
			const { key, iv } = this.generateAesKeyAndIV();

			// Convert the key and IV to WordArray
			const cryptoKey = CryptoJS.enc.Hex.parse(key);
			const cryptoIV = CryptoJS.enc.Hex.parse(iv);

			// Encrypt the secret
			const encrypted = CryptoJS.AES.encrypt(secret, cryptoKey, { iv: cryptoIV }).toString();
			let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));

			return {
				encrypted: encData,
				key,
				iv,
			};
		} catch (error) {
			throw error;
		}
	}

	static async decryptSecret(encrypted: string, key: string, iv: string): Promise<string> {
		try {
			// Convert the key and IV to WordArray
			const cryptoKey = CryptoJS.enc.Hex.parse(key);
			const cryptoIV = CryptoJS.enc.Hex.parse(iv);

			// Decrypt the secret
			let decData = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Utf8);
			const decrypted = CryptoJS.AES.decrypt(decData, cryptoKey, { iv: cryptoIV });

			return decrypted.toString(CryptoJS.enc.Utf8);
		} catch (error) {
			console.error("Decryption error:", error);
			throw error;
		}
	}
}
