import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { eMethods } from "../types/enums";

export class ApiStackService extends Construct {
	constructor(scope: Construct, id: string, DynamoDBStorage: dynamodb.TableV2, environmentName: string) {
		super(scope, id);

		/*
            API Gateway
        */

		const api = new apigateway.RestApi(this, "secrets-api", {
			restApiName: `bolleje-${environmentName}-api-gateway`,
			description: "This service serves the secrets for the Temporary Secrets API.",
			deployOptions: {
				loggingLevel: apigateway.MethodLoggingLevel.OFF,
			},
			defaultCorsPreflightOptions: {
				allowOrigins: apigateway.Cors.ALL_ORIGINS,
				allowMethods: apigateway.Cors.ALL_METHODS,
				allowHeaders: ["*"],
			},
		});

		/*
            Lambda functions
        */

		const CodeBucket = Bucket.fromBucketName(this, "code-bucket", `bolleje-${environmentName}-s3-codestorage`);

		const getSHESecretHandler = new lambda.Function(this, "GetSecretHandler", {
			functionName: `bolleje-${environmentName}-getSHEsecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromBucket(CodeBucket, `${process.env.SHORT_SHA}-getSHEsecret.zip`),
			handler: "getSHEsecret.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const postSHESecretHandler = new lambda.Function(this, "PostSecretHandler", {
			functionName: `bolleje-${environmentName}-postSHEsecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromBucket(CodeBucket, `${process.env.SHORT_SHA}-postSHEsecret.zip`),
			handler: "postSHEsecret.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const getE2ESecretHandler = new lambda.Function(this, "GetE2ESecretHandler", {
			functionName: `bolleje-${environmentName}-getE2Esecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromBucket(CodeBucket, `${process.env.SHORT_SHA}-getE2Esecret.zip`),
			handler: "getE2Esecret.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const postE2ESecretHandler = new lambda.Function(this, "PostE2ESecretHandler", {
			functionName: `bolleje-${environmentName}-postE2Esecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromBucket(CodeBucket, `${process.env.SHORT_SHA}-postE2Esecret.zip`),
			handler: "postE2Esecret.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		/*
            API Gateway Lambda Integrations
        */

		const getSHESecretsIntegration = new apigateway.LambdaIntegration(getSHESecretHandler, {
			requestTemplates: { "application/json": '{ "statusCode": "200" }' },
		});

		const postSHESecretsIntegration = new apigateway.LambdaIntegration(postSHESecretHandler, {
			requestTemplates: { "application/json": '{ "body" : $input.json("$") }' },
			passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
		});

		const getPKISecretsIntegration = new apigateway.LambdaIntegration(getE2ESecretHandler, {
			requestTemplates: { "application/json": '{ "statusCode": "200" }' },
		});

		const postPKISecretsIntegration = new apigateway.LambdaIntegration(postE2ESecretHandler, {
			requestTemplates: { "application/json": '{ "body" : $input.json("$") }' },
			passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
		});

		/*
            Defining of the routes from the Gateway to the Lambda functions
        */

		api.root.addResource(eMethods.GET_SHE_SECRET).addResource("{uuid}").addMethod("GET", getSHESecretsIntegration); // GET /
		api.root.addResource(eMethods.POST_SHE_SECRET).addMethod("POST", postSHESecretsIntegration); // POST /

		api.root.addResource(eMethods.GET_E2E_SECRET).addResource("{uuid}").addMethod("GET", getPKISecretsIntegration); // GET /
		api.root.addResource(eMethods.POST_E2E_SECRET).addMethod("POST", postPKISecretsIntegration); // POST /

		/*
            Give the Lambda functions permissions to access the database.
        */

		DynamoDBStorage.grantReadWriteData(getSHESecretHandler);
		DynamoDBStorage.grantReadWriteData(postSHESecretHandler);
		DynamoDBStorage.grantReadWriteData(getE2ESecretHandler);
		DynamoDBStorage.grantReadWriteData(postE2ESecretHandler);
	}
}
