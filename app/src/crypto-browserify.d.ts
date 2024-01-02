// crypto-browserify.d.ts

declare module "crypto-browserify" {
	import { Buffer } from "buffer";

	export function randomBytes(size: number, callback: (err: Error, buf: Buffer) => void): void;
	export function randomBytes(size: number): Buffer;

	export function pbkdf2Sync(password: string | Buffer, salt: string | Buffer, iterations: number, keylen: number, digest: string): Buffer;

	export function createHash(algorithm: string): Hash;

	export class Hash {
		update(data: string | Buffer): this;
		digest(encoding?: string): string;
	}

	export function createCipheriv(algorithm: string, key: string | Buffer, iv: string | Buffer): Cipher;

	export class Cipher {
		update(data: string | Buffer, inputEncoding: string, outputEncoding: string): string;
		final(outputEncoding: string): string;
	}

	export function createDecipheriv(algorithm: string, key: string | Buffer, iv: string | Buffer): Decipher;

	export class Decipher {
		update(data: string | Buffer, inputEncoding: string, outputEncoding: string): string;
		final(outputEncoding: string): string;
	}

	// Add more declarations for other functions as needed...

	// Placeholder declarations for additional functions not covered above
	export interface CryptoFunction {
		// Add more function declarations here...
	}
}
