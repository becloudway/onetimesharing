import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class AsyncDeleteStackService extends Construct {
	constructor(scope: Construct, id: string, environmentName: string, S3Storage: Bucket) {
		super(scope, id);

		// const LambdaFunction = new lambda.Function(this, "MyLambdaFunction", {
		// 	code: lambda.Code.fromInline(`
		// 		exports.handler = (event, context, callback) => {
		// 			callback(null, {"Comment": event.Comment});
		// 		};
		// 	`),
		// 	runtime: lambda.Runtime.NODEJS_18_X,
		// 	handler: "index.handler",
		// 	timeout: Duration.seconds(3),
		// });

		const getPublicKeyLambda = new lambda.Function(this, "Step-GetPublicKey", {
			functionName: `onetimesharing-${environmentName}-step-getpublickey`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-step-getPublicKey.zip`),
			handler: "step-getPublicKey.handler",
			environment: {
				bucketName: S3Storage.bucketName,
			},
		});

		S3Storage.grantRead(getPublicKeyLambda);

		// const fetchPublicKey = new tasks.CallApiGatewayRestApiEndpoint(this, "Endpoint", {
		// 	api: apiGateway,
		// 	stageName: "prod",
		// 	method: tasks.HttpMethod.GET,
		// 	integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
		// 	headers: sfn.TaskInput.fromObject({
		// 		TaskToken: sfn.JsonPath.array(sfn.JsonPath.taskToken),
		// 	}),
		// });

		const getSecrets = new tasks.LambdaInvoke(this, "Fetch all the secrets related to this public key.", {
			lambdaFunction: getPublicKeyLambda,
			resultPath: "$.Payload",
		});

		// const deleteSecrets = new tasks.LambdaInvoke(this, "Delete all the secrets related to the public key.", {
		// 	lambdaFunction: LambdaFunction,
		// });

		const jobFailed = new sfn.Fail(this, "Job Failed", {
			cause: "AWS Batch Job Failed",
			error: "DeleteSecrets returned failed.",
		});

		const finalStatus = new sfn.Succeed(this, "Found the Public Key!");

		const definition = getSecrets.next(
			new sfn.Choice(this, "Job Complete?")
				.when(sfn.Condition.booleanEquals("$.Payload.Payload.Found", false), jobFailed)
				.when(sfn.Condition.booleanEquals("$.Payload.Payload.Found", true), finalStatus)
		); //.next(deleteSecrets);

		new sfn.StateMachine(this, "AsyncDeleteStateMachine", {
			stateMachineName: `onetimesharing-${environmentName}-asyncdelete-state-machine`,
			definition,
			timeout: Duration.minutes(5),
		});
	}
}
