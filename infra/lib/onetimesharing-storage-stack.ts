import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as storage_stack_service from "./storage_stack_service";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface StorageStackProps extends cdk.StackProps {
	environmentName: string;
}

export class OneTimeSharingStorageStack extends cdk.Stack {
	public readonly DynamoDBStorage: any;
	public readonly S3Storage: any;

	constructor(scope: Construct, id: string, props: StorageStackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here
		const StorageStack = new storage_stack_service.StorageStackService(this, "Secrets", props.environmentName);
		this.DynamoDBStorage = StorageStack.DynamoDBStorage;
		this.S3Storage = StorageStack.S3Storage;
	}
}
