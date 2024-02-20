import * as crypto from "crypto";

const generateSHA256Hash = (data: string): string => {
	if (data === "") return "";
	const hash = crypto.createHash("sha256");
	hash.update(data);
	const hashedData = hash.digest("hex");
	return hashedData;
};

export { generateSHA256Hash };
