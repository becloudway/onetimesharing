import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as asyncdelete_stack_service from "./asyncdelete_stack_service";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

interface AsyncDeleteStackProps extends cdk.StackProps {
	environmentName: string;
    apiGateway: RestApi;
}

export class OneTimeSharingAsyncDeleteStackService extends cdk.Stack {
	constructor(scope: Construct, id: string, props: AsyncDeleteStackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here
		new asyncdelete_stack_service.AsyncDeleteStackService(this, "Secrets", props.environmentName, props.apiGateway);
	}
}
