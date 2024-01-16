import generateTTL from "../helper_functions/timeToLive";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { SecretsStructure, SignedURLResponse } from "../types/types";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const SecretsRepository = class {
	static client = new DynamoDBClient({});
	static dynamo = DynamoDBDocumentClient.from(this.client);

	//This should be of the type that the data is structured in
	static async PostItem(data: SecretsStructure) {
		const generatedUuid = uuidv4();
		const time_to_live = generateTTL();

		const item = {
			uuid: generatedUuid,
			encryption_type: data.Item.encryption_type || "SHE",
			cyphertext: data.Item.cyphertext || "",
			retrievedCount: 1,
			second_half_key: data.Item.second_half_key || "",
			ttl: time_to_live,
		};

		await this.dynamo.send(
			new PutCommand({
				TableName: process.env.tableName,
				Item: item,
			})
		);

		return generatedUuid;
	}

	static async GetSecret(uuid: string): Promise<SecretsStructure> {
		const response = await this.dynamo.send(
			new GetCommand({
				TableName: process.env.tableName,
				Key: {
					uuid: uuid,
				},
			})
		);

		await this.dynamo.send(
			new DeleteCommand({
				TableName: process.env.tableName,
				Key: {
					uuid: uuid,
				},
			})
		);

		return response as unknown as SecretsStructure;
	}

	static async GetS3URL() {
		const fileName = `${uuidv4()}.gpg`;

		const client = new S3Client({});
		const command = new PutObjectCommand({ Bucket: process.env.bucketName, Key: fileName });

		const response: SignedURLResponse = {
			signedURL: await getSignedUrl(client, command, { expiresIn: 3600 }),
			fileName: fileName,
		};

		return response;
	}
};

export default SecretsRepository;
