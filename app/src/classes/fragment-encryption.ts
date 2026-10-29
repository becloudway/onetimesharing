// Encrypts the URL fragment (first_half_key + iv) with the per-secret RSA-OAEP public key returned by the server.
// The matching private key is only returned by the server after the password check succeeded.
export default class FragmentEncryption {
	private static algorithm = { name: "RSA-OAEP", hash: "SHA-256" };

	public static async encrypt(plaintext: string, publicKey: string): Promise<string> {
		const key = await crypto.subtle.importKey("spki", this.base64ToBytes(publicKey), this.algorithm, false, ["encrypt"]);
		const encrypted = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, key, new TextEncoder().encode(plaintext));
		return this.bytesToBase64Url(new Uint8Array(encrypted));
	}

	public static async decrypt(ciphertext: string, privateKey: string): Promise<string> {
		const key = await crypto.subtle.importKey("pkcs8", this.base64ToBytes(privateKey), this.algorithm, false, ["decrypt"]);
		const decrypted = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, key, this.base64UrlToBytes(ciphertext));
		return new TextDecoder().decode(decrypted);
	}

	private static base64ToBytes(base64: string) {
		return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
	}

	private static base64UrlToBytes(base64Url: string) {
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		return this.base64ToBytes(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
	}

	private static bytesToBase64Url(bytes: Uint8Array): string {
		return btoa(String.fromCharCode(...bytes))
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");
	}
}
