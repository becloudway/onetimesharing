import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as api_stack_service from "./api_stack_service";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface ApiStackProps extends cdk.StackProps {
	DynamoDBStorage: dynamodb.TableV2;
	environmentName: string;
	S3Storage: Bucket;
	Secret: Secret;
}

export class OneTimeSharingApiStack extends cdk.Stack {
	public readonly ApiGateway: RestApi;
	constructor(scope: Construct, id: string, props: ApiStackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here
		const apiStack = new api_stack_service.ApiStackService(
			this,
			"Secrets",
			props.DynamoDBStorage,
			props.environmentName,
			props.S3Storage,
			props.Secret
		);
		this.ApiGateway = apiStack.ApiGateway;
	}
}
