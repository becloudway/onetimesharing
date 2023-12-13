import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class StorageStackService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const table = new dynamodb.TableV2(this, 'Secret DynamoDB', {
            partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
            tableName: "bolleje-dev-dynamodb"
          });
    }
}