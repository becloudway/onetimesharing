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

    private static generateSaltFromKey(key: string): string {
        // Hash the first_half_key using SHA-256
        const hash = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex); // Use Hex encoding

        // Take the first 22 characters for a bcrypt-compatible salt
        let saltBase = hash.substring(0, 22);

        // Prepend bcrypt's version, cost, and return the valid salt
        const bcryptSalt = `$2a$10$${saltBase}`;
        return bcryptSalt;
    }
}
