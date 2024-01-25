import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoStackService } from "./cognito_stack_service";

export class BolleJeCognitoStack extends cdk.Stack {
	constructor(scope: Construct, id: string) {
		super(scope, id);

		// The code that defines your stack goes here
		const cognitoStack = new CognitoStackService(this, "Secrets");
	}
}
