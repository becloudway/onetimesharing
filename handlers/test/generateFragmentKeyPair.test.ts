import { webcrypto } from 'crypto';
import { generateFragmentKeyPair } from '../helper_functions/generateFragmentKeyPair';

// Mirrors the WebCrypto calls in app/src/classes/fragment-encryption.ts
describe('generateFragmentKeyPair', () => {
  test('keys round-trip through WebCrypto RSA-OAEP', async () => {
    const { publicKey, privateKey } = generateFragmentKeyPair();
    const algorithm = { name: 'RSA-OAEP', hash: 'SHA-256' };
    const plaintext = 'first_half_key=a02604a70dafdf7e0b30e493ac7354fc&iv=7e1656a2b9680d73de50cae58ed550df';

    const importedPublicKey = await webcrypto.subtle.importKey('spki', Buffer.from(publicKey, 'base64'), algorithm, false, ['encrypt']);
    const importedPrivateKey = await webcrypto.subtle.importKey('pkcs8', Buffer.from(privateKey, 'base64'), algorithm, false, ['decrypt']);

    const encrypted = await webcrypto.subtle.encrypt({ name: 'RSA-OAEP' }, importedPublicKey, new TextEncoder().encode(plaintext));
    const decrypted = await webcrypto.subtle.decrypt({ name: 'RSA-OAEP' }, importedPrivateKey, encrypted);

    expect(new TextDecoder().decode(decrypted)).toBe(plaintext);
  });
});
