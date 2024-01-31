import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoStackService } from "./cognito_stack_service";

interface CognitoStackProps extends cdk.StackProps {
	environmentName: string;
}

export class OneTimeSharingCognitoStack extends cdk.Stack {
	public readonly cognitoClientID: string;
	public readonly hostedURL: string;

	constructor(scope: Construct, id: string, props: CognitoStackProps) {
		super(scope, id);

		// The code that defines your stack goes here
		const cognitoStack = new CognitoStackService(this, "Secrets", props.environmentName);
		this.cognitoClientID = cognitoStack.cognitoClientID;
		this.hostedURL = cognitoStack.hostedURL;

		new cdk.CfnOutput(this, "CognitoClientID", {
			value: this.cognitoClientID,
			exportName: "CognitoClientID",
		});
		new cdk.CfnOutput(this, "CognitoHostedURL", {
			value: this.hostedURL,
			exportName: "CognitoHostedURL",
		});
	}
}
