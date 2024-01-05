import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as api_stack_service from "./api_stack_service";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface ApiStackProps extends cdk.StackProps {
	DynamoDBStorage: dynamodb.TableV2;
	environmentName: string;
}

export class BolleJeApiStack extends cdk.Stack {
	public readonly ApiGateway: RestApi;
	constructor(scope: Construct, id: string, props: ApiStackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here
		const apiStack = new api_stack_service.ApiStackService(this, "Secrets", props.DynamoDBStorage, props.environmentName);
		this.ApiGateway = apiStack.ApiGateway;
	}
}
