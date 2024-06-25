import bcrypt from "bcryptjs";

export default class BcryptJS {
	static async encryptPassword(password: string): Promise<string> {
		const saltRounds = 10;
		//For more security, a generated salt would be better (up to discussion on how to implement this).
		//const salt = await bcrypt.genSalt(saltRounds);
		const salt = "$2a$10$i5FLINuWe.9DDAZ81vx0WO";
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	}
}
