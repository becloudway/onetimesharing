import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { eMethods } from "../types/enums";
import * as cdk from "aws-cdk-lib";

export class ApiStackService extends Construct {
	public readonly ApiGateway: apigateway.RestApi;

	constructor(scope: Construct, id: string, DynamoDBStorage: dynamodb.TableV2, environmentName: string, S3Storage: Bucket) {
		super(scope, id);

		/*
            API Gateway
        */

		const apiGateway = new apigateway.RestApi(this, "secrets-api", {
			restApiName: `onetimesharing-${environmentName}-api-gateway`,
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

		const CodeBucket = Bucket.fromBucketName(this, "code-bucket", `${process.env.account}-onetimesharing-${environmentName}-codestorage`);

		const getSHESecretHandler = new lambda.Function(this, "GetSecretHandler", {
			functionName: `onetimesharing-${environmentName}-getSHEsecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-getSHEsecret.zip`),
			handler: "getSHEsecret.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const postSHESecretHandler = new lambda.Function(this, "PostSecretHandler", {
			functionName: `onetimesharing-${environmentName}-postSHEsecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-postSHEsecret.zip`),
			handler: "postSHEsecret.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const getE2ESecretHandler = new lambda.Function(this, "GetE2ESecretHandler", {
			functionName: `onetimesharing-${environmentName}-getE2Esecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-getE2Esecret.zip`),
			handler: "getE2Esecret.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const postE2ESecretHandler = new lambda.Function(this, "PostE2ESecretHandler", {
			functionName: `onetimesharing-${environmentName}-postE2Esecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-postE2Esecret.zip`),
			handler: "postE2Esecret.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const postPublicKeyHandler = new lambda.Function(this, "PostPublicKeyHandler", {
			functionName: `onetimesharing-${environmentName}-postPublicKeylambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-postPublicKey.zip`),
			handler: "postPublicKey.handler",
			environment: {
				bucketName: S3Storage.bucketName,
			},
		});

		const getPublicKeyHandler = new lambda.Function(this, "GetPublicKeyHandler", {
			functionName: `onetimesharing-${environmentName}-getPublicKeylambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-getPublicKey.zip`),
			handler: "getPublicKey.handler",
			environment: {
				bucketName: S3Storage.bucketName,
			},
		});

		const invalidatePublicKey = new lambda.Function(this, "InvalidatePublicKeyHandler", {
			functionName: `onetimesharing-${environmentName}-invalidatePublicKeylambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-invalidatePublicKey.zip`),
			handler: "invalidatePublicKey.handler",
			environment: {
				bucketName: S3Storage.bucketName,
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
		});

		const postPublicKeyIntegration = new apigateway.LambdaIntegration(postPublicKeyHandler, {
			requestTemplates: { "application/json": '{ "statusCode": "200" }' },
		});

		const getPublicKeyIntegration = new apigateway.LambdaIntegration(getPublicKeyHandler, {
			requestTemplates: { "application/json": '{ "statusCode": "200" }' },
		});

		const invalidatePublicKeyIntegration = new apigateway.LambdaIntegration(invalidatePublicKey, {
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

		apiRoute.addResource(eMethods.POST_PUBLIC_KEY).addMethod("POST", postPublicKeyIntegration); // GET /
		apiRoute.addResource(eMethods.GET_PUBLIC_KEY).addResource("{uuid}").addMethod("GET", getPublicKeyIntegration); // POST /

		apiRoute.addResource(eMethods.INVALIDATE_PUBLIC_KEY).addResource("{uuid}").addMethod("DELETE", invalidatePublicKeyIntegration); // POST /

		/*
            Give the Lambda functions permissions to access the database.
        */

		DynamoDBStorage.grantReadWriteData(getSHESecretHandler);
		DynamoDBStorage.grantReadWriteData(postSHESecretHandler);
		DynamoDBStorage.grantReadWriteData(getE2ESecretHandler);
		DynamoDBStorage.grantReadWriteData(postE2ESecretHandler);
		DynamoDBStorage.grantReadWriteData(invalidatePublicKey);

		S3Storage.grantWrite(postPublicKeyHandler);
		S3Storage.grantRead(getPublicKeyHandler);
		S3Storage.grantDelete(invalidatePublicKey);

		this.ApiGateway = apiGateway;
	}
}
