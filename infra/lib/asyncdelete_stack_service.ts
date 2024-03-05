import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Arn, Duration } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export class AsyncDeleteStackService extends Construct {
	public readonly StateMachine: sfn.StateMachine;
	constructor(scope: Construct, id: string, environmentName: string, S3Storage: Bucket, DynamoDBStorage: Table) {
		super(scope, id);

		const getPublicKeyLambda = new lambda.Function(this, "Step-GetPublicKey", {
			functionName: `onetimesharing-${environmentName}-step-getpublickey`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-step-getPublicKey.zip`),
			handler: "step-getPublicKey.handler",
			environment: {
				bucketName: S3Storage.bucketName,
			},
		});

		const invalidatePublicKeyLambda = new lambda.Function(this, "Step-InvalidatePublicKey", {
			functionName: `onetimesharing-${environmentName}-step-invalidatepublickey`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-step-invalidatePublicKey.zip`),
			handler: "step-invalidatePublicKey.handler",
			environment: {
				bucketName: S3Storage.bucketName,
				tableName: DynamoDBStorage.tableName,
			},
		});

		DynamoDBStorage.grantFullAccess(invalidatePublicKeyLambda);

		S3Storage.grantRead(getPublicKeyLambda);
		S3Storage.grantReadWrite(invalidatePublicKeyLambda);

		const getPublicKey = new tasks.LambdaInvoke(this, "Fetch all the secrets related to this public key.", {
			lambdaFunction: getPublicKeyLambda,
		});

		const invalidatePublicKey = new tasks.LambdaInvoke(this, "Delete all the secrets related to this public key.", {
			lambdaFunction: invalidatePublicKeyLambda,
			outputPath: "$.Payload",
		});

		const jobFailed = new sfn.Fail(this, "Public Key has not been found", {
			cause: "Fetching of the public key found.",
			error: "GetPublicKey returned failed.",
		});

		const jobSucceed = new sfn.Succeed(this, "All secrets have been deleted!");

		const definition = getPublicKey.next(
			new sfn.Choice(this, "Public key found?", {
				outputPath: "$.Payload",
			})
				.when(sfn.Condition.booleanEquals("$.Payload.Found", false), jobFailed)
				.when(
					sfn.Condition.booleanEquals("$.Payload.Found", true),
					invalidatePublicKey.next(
						new sfn.Choice(this, "Check if there are more pages.")
							.when(sfn.Condition.isNotPresent("$.NextToken"), jobSucceed)
							.when(sfn.Condition.isPresent("$.NextToken"), invalidatePublicKey)
					)
				)
		);

		const stateMachine = new sfn.StateMachine(this, "AsyncDeleteStateMachine", {
			stateMachineName: `onetimesharing-${environmentName}-asyncdelete-state-machine`,
			definition,
			timeout: Duration.minutes(5),
		});

		this.StateMachine = stateMachine;
	}
}
