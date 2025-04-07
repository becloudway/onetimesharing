import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as frontend_stack_service from "./frontend_stack_service";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface FrontendStackProps extends cdk.StackProps {
	environmentName: string;
	apiGateway: RestApi;
}

export class OneTimeSharingFrontendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: FrontendStackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here
		const FrontendStackService = new frontend_stack_service.FrontendStackService(this, "Secrets", props.environmentName, props.apiGateway);
	}
}
