import bcrypt from "bcryptjs";
import crypto from "crypto";

export default class BcryptJS {
	static async encryptPassword(password: string, first_half_key: string): Promise<string> {
		// Generate a reproducible salt based on the first half of the key
		const derivedSalt = BcryptJS.generateSaltFromKey(first_half_key);

		// Hash the password with the derived salt
		const hashedPassword = await bcrypt.hash(password, derivedSalt);
		return hashedPassword;
	}

	private static generateSaltFromKey(key: string): string {
		// Hash the first_half_key using SHA-256
		const hash = crypto.createHash("sha256").update(key).digest("hex");

		// Take the first 16 bytes (32 characters in hex) as the salt
		const salt = hash.substring(0, 32); // 32 hex characters = 16 bytes
		return salt;
	}
}
