import generateTTL from "../helper_functions/timeToLive";
import { DynamoDBClient, ExecuteStatementCommand, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, QueryCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { SecretsStructure } from "../types/types";

import { PutObjectCommand, S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDB } from "aws-sdk";
import { generateSHA256Hash } from "../helper_functions/generateSHA256Hash";

type DynamoDBSecretsStructure = {
	uuid: string;
	encryption_type: string;
	cyphertext: string;
	retrievedCount: number;
	second_half_key: string;
	ttl: number;
	password?: string;
	public_key_uuid?: string;
};

const SecretsRepository = class {
	static client = new DynamoDBClient({});
	static dynamo = DynamoDBDocumentClient.from(this.client);

	//This should be of the type that the data is structured in
	static async PostItem(data: SecretsStructure) {
		const generatedUuid = uuidv4();
		const time_to_live = generateTTL();

		let item: DynamoDBSecretsStructure = {
			uuid: generatedUuid,
			encryption_type: data.Item.encryption_type || "SHE",
			cyphertext: data.Item.cyphertext || "",
			retrievedCount: 1,
			second_half_key: data.Item.second_half_key || "",
			password: generateSHA256Hash(data.Item.password || ""),
			ttl: time_to_live,
		};

		if (data.Item.public_key_uuid) {
			item = {
				...item,
				public_key_uuid: data.Item.public_key_uuid,
			};
		}

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

		return response as unknown as SecretsStructure;
	}

	static async DeleteSecret(uuid: string): Promise<boolean> {
		try {
			await this.dynamo.send(
				new DeleteCommand({
					TableName: process.env.tableName,
					Key: {
						uuid: uuid,
					},
				})
			);

			return true;
		} catch {
			return false;
		}
	}

	static async ExecuteStatement(uuid: string, NextToken: string) {
		try {
			const results = await this.dynamo.send(
				new ExecuteStatementCommand({
					Statement: `SELECT * FROM "${process.env.tableName}"`,
					Limit: 10,
					NextToken: NextToken || undefined,
				})
			);

			if (!results.Items)
				return {
					NextToken: results.NextToken,
				};

			const items: UpdateCommandInput | any = results.Items.filter((el) => el.public_key_uuid?.S === uuid).map((element: any) => {
				if (element.public_key_uuid.S === uuid) {
					return {
						ExpressionAttributeNames: {
							"#TTL": "ttl",
							"#PK": "public_key_uuid",
						},
						ExpressionAttributeValues: {
							":ttl": {
								N: Math.floor(new Date(Date.now() - 1).getTime() / 1000).toString(),
							},
							":pk": {
								S: "REMOVED",
							},
						},
						Key: {
							uuid: {
								S: element.uuid.S,
							},
						},
						ReturnValues: "NONE",
						TableName: process.env.tableName || "",
						UpdateExpression: "SET #TTL = :ttl, #PK = :pk",
					};
				}
			});

			console.log(items);

			await Promise.all(
				await items.map(async (el: UpdateItemCommandInput | any) => {
					await this.dynamo.send(new UpdateItemCommand(el));
				})
			);

			return {
				PublicKeyID: uuid,
				NextToken: results.NextToken,
			};
		} catch (err) {
			console.log(err);
			return {
				error: true,
				message: err,
			};
		}
	}

	static async StatusSecret(uuid: string): Promise<SecretsStructure> {
		const response = await this.dynamo.send(
			new GetCommand({
				TableName: process.env.tableName,
				Key: {
					uuid: uuid,
				},
			})
		);

		console.log(`Retrieved count: ${response.Item?.retrievedCount} \n Id: ${response.Item?.}`);

		return response as unknown as SecretsStructure;
	}

	static async PostPublicKey(public_key: string) {
		const id = uuidv4();
		const fileName = `${id}.gpg`;

		const client = new S3Client({});
		const command = new PutObjectCommand({
			Bucket: process.env.bucketName,
			Key: fileName,
			Body: public_key,
			ContentType: "text/plain",
		});

		try {
			await client.send(command);
			return id;
		} catch (err) {
			console.log(err);
		}
	}

	static async GetPublicKey(public_key: string) {
		const fileName = `${public_key}.gpg`;

		const client = new S3Client({});
		const command = new GetObjectCommand({
			Bucket: process.env.bucketName,
			Key: fileName,
		});

		try {
			const response = await client.send(command);
			const str = await response.Body?.transformToString();
			return {
				public_key: str,
			};
		} catch (err) {
			console.log(err);
		}
	}

	static async RemovePublicKey(uuid: string) {
		const fileName = `${uuid}.gpg`;

		const client = new S3Client({});
		const command = new DeleteObjectCommand({
			Bucket: process.env.bucketName,
			Key: fileName,
		});

		try {
			await client.send(command);
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	static async InvalidateSecret(public_key_uuid: string) {
		const gsiResponse = await this.dynamo.send(
			new QueryCommand({
				TableName: process.env.tableName,
				IndexName: "public_key_index", // Replace with your GSI name
				KeyConditionExpression: "public_key_uuid = :public_key_uuid", // Include GSI partition key
				ExpressionAttributeValues: {
					":public_key_uuid": public_key_uuid,
				},
			})
		);

		console.log(gsiResponse);

		const itemsToDelete = gsiResponse.Items as DynamoDB.DocumentClient.AttributeMap[];

		const deletePromises = itemsToDelete.map((item) =>
			this.dynamo.send(
				new DeleteCommand({
					TableName: process.env.tableName,
					Key: {
						uuid: item.uuid,
					},
				})
			)
		);

		// Wait for all delete operations to complete
		await Promise.all(deletePromises);

		return itemsToDelete.length; // Return the number of items deleted
	}
};

export default SecretsRepository;
