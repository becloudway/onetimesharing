import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class StorageStackService extends Construct {
	public readonly DynamoDBStorage: dynamodb.TableV2;
	public readonly S3Storage: Bucket;

	constructor(scope: Construct, id: string, environmentName: string) {
		super(scope, id);

		const table = new dynamodb.TableV2(this, "Secret DynamoDB", {
			partitionKey: { name: "uuid", type: dynamodb.AttributeType.STRING },
			timeToLiveAttribute: "ttl",
			removalPolicy: RemovalPolicy.DESTROY,
			tableName: `bolleje-${environmentName}-dynamodb`,
			globalSecondaryIndexes: [
				{
					indexName: "public_key_index",
					partitionKey: { name: "public_key_uuid", type: dynamodb.AttributeType.STRING },
					projectionType: dynamodb.ProjectionType.KEYS_ONLY,
				},
			],
		});

		const bucket = new Bucket(this, `bolleje-${environmentName}-s3-codestorage`, {
			bucketName: `bolleje-${environmentName}-public-key-storage`,
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
		});

		this.DynamoDBStorage = table;
		this.S3Storage = bucket;
	}
}
