export type SecretsStructure = {
	Item: {
		encryption_type: "SHE" | "E2E";
		cyphertext: string;
		second_half_key?: string;
		retrievedCount?: number;
		ttl?: number;
	};
};

export type SignedURLResponse = {
	signedURL: string;
	fileName: string;
};
