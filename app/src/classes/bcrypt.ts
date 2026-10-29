import bcrypt from "bcryptjs";
import * as CryptoJS from "crypto-js";

export default class BcryptJS {
    static async encryptPassword(password: string, first_half_key: string): Promise<string> {
        // Generate a reproducible salt based on the first half of the key
        const derivedSalt = BcryptJS.generateSaltFromKey(first_half_key);

        // Hash the password with the derived salt
        const hashedPassword = await bcrypt.hash(password, derivedSalt);
        return hashedPassword;
    }

    // Version 3: random salt, stored server-side and returned by the status endpoint
    static async generateSalt(): Promise<string> {
        return await bcrypt.genSalt(10);
    }

    static async encryptPasswordWithSalt(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    private static generateSaltFromKey(key: string): string {
        // Hash the first_half_key using SHA-256
        const hash = CryptoJS.SHA256(key).toString(CryptoJS.enc.Base64); // Use Base64 encoding

        // Take the first 22 characters for a bcrypt-compatible salt
        let saltBase = hash.replace(/[^A-Za-z0-9]/g, '').substring(0, 22); // Remove non-alphanumeric chars

        // Prepend bcrypt's version and cost to return the valid salt
        const bcryptSalt = `$2a$10$${saltBase}`;
        return bcryptSalt;
    }
}
