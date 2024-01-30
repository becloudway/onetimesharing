import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoStackService } from "./cognito_stack_service";

type CognitoStackProps = {
	environmentName: string;
};

export class OneTimeSharingCognitoStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: CognitoStackProps) {
		super(scope, id);

		// The code that defines your stack goes here
		const cognitoStack = new CognitoStackService(this, "Secrets", props.environmentName);
	}
}
