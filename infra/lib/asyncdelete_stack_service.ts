import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

export class AsyncDeleteStackService extends Construct {
	constructor(scope: Construct, id: string, environmentName: string, apiGateway: RestApi) {
		super(scope, id);

		const LambdaFunction = new lambda.Function(this, "MyLambdaFunction", {
			code: lambda.Code.fromInline(`
				exports.handler = (event, context, callback) => {
					callback(null, "Hello World!");
				};
			`),
			runtime: lambda.Runtime.NODEJS_18_X,
			handler: "index.handler",
			timeout: Duration.seconds(3),
		});

		const fetchPublicKey = new tasks.CallApiGatewayRestApiEndpoint(this, "Endpoint", {
			api: apiGateway,
			stageName: "prod",
			method: tasks.HttpMethod.GET,
			integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
			headers: sfn.TaskInput.fromObject({
				TaskToken: sfn.JsonPath.array(sfn.JsonPath.taskToken),
			})
		});

		const getSecrets = new tasks.LambdaInvoke(this, "Fetch all the secrets related to this public key.", {
			lambdaFunction: LambdaFunction,
		});

		const deleteSecrets = new tasks.LambdaInvoke(this, "Delete all the secrets related to the public key.", {
			lambdaFunction: LambdaFunction,
		});

		const jobFailed = new sfn.Fail(this, "Job Failed", {
			cause: "AWS Batch Job Failed",
			error: "DeleteSecrets returned failed.",
		});

		const finalStatus = new sfn.Succeed(this, "Job Succeeded!");

		const definition = fetchPublicKey
			.next(getSecrets)
			.next(deleteSecrets)
			.next(
				new sfn.Choice(this, "Job Complete?")
					.when(sfn.Condition.stringEquals("$.status", "FAILED"), jobFailed)
					.when(sfn.Condition.stringEquals("$.status", "SUCCEEDED"), finalStatus)
			);

		new sfn.StateMachine(this, "AsyncDeleteStateMachine", {
			definition,
			timeout: Duration.minutes(5),
		});
	}
}
