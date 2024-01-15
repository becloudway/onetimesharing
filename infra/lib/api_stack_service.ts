import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { eMethods } from "../types/enums";

export class ApiStackService extends Construct {
	public readonly ApiGateway: apigateway.RestApi;

	constructor(scope: Construct, id: string, DynamoDBStorage: dynamodb.TableV2, environmentName: string, S3Storage: Bucket) {
		super(scope, id);

		/*
            API Gateway
        */

		const apiGateway = new apigateway.RestApi(this, "secrets-api", {
			restApiName: `bolleje-${environmentName}-api-gateway`,
			description: "This service serves the secrets for the Temporary Secrets API.",
			endpointConfiguration: {
				types: [apigateway.EndpointType.REGIONAL],
			},
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

		const getS3URLHandler = new lambda.Function(this, "GetS3URLHandler", {
			functionName: `bolleje-${environmentName}-getS3URLlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromBucket(CodeBucket, `${process.env.SHORT_SHA}-getS3URL.zip`),
			handler: "getS3URL.handler",
			environment: {
				bucketName: S3Storage.bucketName,
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
		});

		const getS3URLIntegration = new apigateway.LambdaIntegration(getS3URLHandler, {
			requestTemplates: { "application/json": '{ "statusCode": "200" }' },
		});

		/*
            Defining of the routes from the Gateway to the Lambda functions
        */

		const apiRoute = apiGateway.root.addResource("api"); // /api

		apiRoute.addResource(eMethods.GET_SHE_SECRET).addResource("{uuid}").addMethod("GET", getSHESecretsIntegration); // GET /
		apiRoute.addResource(eMethods.POST_SHE_SECRET).addMethod("POST", postSHESecretsIntegration); // POST /

		apiRoute.addResource(eMethods.GET_E2E_SECRET).addResource("{uuid}").addMethod("GET", getPKISecretsIntegration); // GET /
		apiRoute.addResource(eMethods.POST_E2E_SECRET).addMethod("POST", postPKISecretsIntegration); // POST /

		apiRoute.addResource(eMethods.GET_S3_URL).addResource("{filename}").addMethod("GET", getS3URLIntegration); // GET /

		/*
            Give the Lambda functions permissions to access the database.
        */

		DynamoDBStorage.grantReadWriteData(getSHESecretHandler);
		DynamoDBStorage.grantReadWriteData(postSHESecretHandler);
		DynamoDBStorage.grantReadWriteData(getE2ESecretHandler);
		DynamoDBStorage.grantReadWriteData(postE2ESecretHandler);

		this.ApiGateway = apiGateway;
	}
}
