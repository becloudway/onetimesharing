import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cicd_stack_service from "./cicd_stack_service";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BolleJeDevCiCdStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here
		const CiCdStack = new cicd_stack_service.CiCdStackService(this, "Secrets");
	}
}
