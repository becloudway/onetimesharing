import bcrypt from "bcryptjs";

export default class BcryptJS {
	static async encryptPassword(password: string, first_half_key: string): Promise<string> {
		const salt = first_half_key;
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	}
}
