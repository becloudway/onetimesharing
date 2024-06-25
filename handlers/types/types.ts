export type SecretsStructure = {
	Item: {
		encryption_type: "SHE" | "E2E";
		cyphertext: string;
		second_half_key?: string;
		retrievedCount?: number;
		passwordTries: number;
		ttl?: number;
		public_key_uuid?: string;
		password?: string;
		version?: number;
	};
};

export type SignedURLResponse = {
	signedURL: string;
	fileName: string;
};

export type PublicKeyRequestBody = {
	public_key: string;
};
