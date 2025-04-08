import * as CryptoJS from "crypto-js";

export default class PasswordEncryption {
    // Constants
    private static SALT_LENGTH = 16; // Salt for key derivation (PBKDF2)
    private static IV_LENGTH = 16;   // AES-CBC IV length
    private static KEY_LENGTH = 256 / 32; // AES-256 key size in words (32 bytes)
    private static ITERATIONS = 100000; // PBKDF2 iterations

    private static deriveKey(password: string, salt: string): CryptoJS.lib.WordArray {
        return CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
            keySize: this.KEY_LENGTH,
            iterations: this.ITERATIONS,
            hasher: CryptoJS.algo.SHA256
        });
    }

    public static encrypt(text: string, password: string): string {
        const salt = CryptoJS.lib.WordArray.random(this.SALT_LENGTH).toString(CryptoJS.enc.Hex);
        const iv = CryptoJS.lib.WordArray.random(this.IV_LENGTH).toString(CryptoJS.enc.Hex);
        const key = this.deriveKey(password, salt);

        const encrypted = CryptoJS.AES.encrypt(text, key, {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC, // Use AES-CBC
            padding: CryptoJS.pad.Pkcs7
        });

        const hmac = CryptoJS.HmacSHA256(
            CryptoJS.enc.Hex.parse(encrypted.ciphertext.toString()), key
        ).toString(CryptoJS.enc.Hex);
        
        return `${salt}:${iv}:${encrypted.ciphertext.toString(CryptoJS.enc.Hex)}:${hmac}`;
    }

    public static decrypt(encryptedData: string, password: string): string {
        const [salt, iv, ciphertext, hmac] = encryptedData.split(":");
        const key = this.deriveKey(password, salt);

        // Verify HMAC for authentication
        const calculatedHmac = CryptoJS.HmacSHA256(
            CryptoJS.enc.Hex.parse(ciphertext), key
        ).toString(CryptoJS.enc.Hex);        
        if (calculatedHmac !== hmac) {
            throw new Error("Decryption failed: Authentication error (HMAC mismatch).");
        }

        const decrypted = CryptoJS.AES.decrypt(
            {
                ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
            } as CryptoJS.lib.CipherParams,
            key,
            {
                iv: CryptoJS.enc.Hex.parse(iv),
                mode: CryptoJS.mode.CBC, // Use AES-CBC
                padding: CryptoJS.pad.Pkcs7
            }
        );

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}
