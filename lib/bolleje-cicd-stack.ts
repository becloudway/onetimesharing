import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cicd_stack_service from "./cicd_stack_service";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface CiCdStackProps extends cdk.StackProps {
	environmentName: string;
}

export class BolleJeCiCdStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: CiCdStackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here
		const CiCdStack = new cicd_stack_service.CiCdStackService(this, "Secrets", props.environmentName);
	}
}
