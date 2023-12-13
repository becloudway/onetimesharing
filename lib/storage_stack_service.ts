import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class StorageStackService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);
    }
}