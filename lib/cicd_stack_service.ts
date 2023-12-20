import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class CiCdStackService extends Construct {
	constructor(scope: Construct, id: string) {
		super(scope, id);

		const table = new dynamodb.TableV2(this, "Secret DynamoDB", {
			partitionKey: { name: "uuid", type: dynamodb.AttributeType.STRING },
			timeToLiveAttribute: "ttl",
			removalPolicy: RemovalPolicy.DESTROY,
			tableName: "bolleje-dev-dynamodb",
		});
	}
}
