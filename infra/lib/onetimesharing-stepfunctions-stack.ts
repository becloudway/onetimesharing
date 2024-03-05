import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as asyncdelete_stack_service from "./asyncdelete_stack_service";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { StateMachine } from "aws-cdk-lib/aws-stepfunctions";

interface AsyncDeleteStackProps extends cdk.StackProps {
	environmentName: string;
	S3Storage: Bucket;
	DynamoDBStorage: Table;
}

export class OneTimeSharingAsyncDeleteStackService extends cdk.Stack {
	public readonly StateMachine: StateMachine;

	constructor(scope: Construct, id: string, props: AsyncDeleteStackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here
		this.StateMachine = new asyncdelete_stack_service.AsyncDeleteStackService(
			this,
			"Secrets",
			props.environmentName,
			props.S3Storage,
			props.DynamoDBStorage
		).StateMachine;
	}
}
