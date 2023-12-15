import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class StorageStackService extends Construct {
    public readonly DynamoDBStorage: dynamodb.TableV2;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const table = new dynamodb.TableV2(this, 'Secret DynamoDB', {
            partitionKey: { name: 'uuid', type: dynamodb.AttributeType.STRING },
            removalPolicy: RemovalPolicy.DESTROY,
            tableName: "bolleje-dev-dynamodb"
        });

        this.DynamoDBStorage = table;
    }
}