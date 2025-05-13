import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { eMethods } from "../types/enums";
import * as cdk from "aws-cdk-lib";
import * as sm from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";
import { State, StateMachine } from "aws-cdk-lib/aws-stepfunctions";

export class ApiStackService extends Construct {
	public readonly ApiGateway: apigateway.RestApi;

	constructor(
		scope: Construct,
		id: string,
		DynamoDBStorage: dynamodb.TableV2,
		environmentName: string,
		S3Storage: Bucket,
		Secret: sm.Secret,
		StateMachine: StateMachine
	) {
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
		});

		/*
            Lambda functions
        */

		const stack = cdk.Stack.of(this);

		const CodeBucket = Bucket.fromBucketName(this, "code-bucket", `${stack.account}-onetimesharing-${environmentName}-codestorage`);

		const statusHandler = new lambda.Function(this, "StatusHandler", {
			functionName: `onetimesharing-${environmentName}-statushandler`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-status.zip`),
			handler: "status.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const getSHESecretHandler = new lambda.Function(this, "GetSecretHandler", {
			functionName: `onetimesharing-${environmentName}-getSHEsecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-getSHEsecrets.zip`),
			handler: "getSHEsecrets.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const postSHESecretHandler = new lambda.Function(this, "PostSecretHandler", {
			functionName: `onetimesharing-${environmentName}-postSHEsecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-postSHEsecrets.zip`),
			handler: "postSHEsecrets.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const getE2ESecretHandler = new lambda.Function(this, "GetE2ESecretHandler", {
			functionName: `onetimesharing-${environmentName}-getE2Esecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-getE2Esecrets.zip`),
			handler: "getE2Esecrets.handler",
			environment: {
				tableName: DynamoDBStorage.tableName,
			},
		});

		const postE2ESecretHandler = new lambda.Function(this, "PostE2ESecretHandler", {
			functionName: `onetimesharing-${environmentName}-postE2Esecretlambda`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-postE2Esecrets.zip`),
			handler: "postE2Esecrets.handler",
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

		// const invalidatePublicKey = new lambda.Function(this, "InvalidatePublicKeyHandler", {
		// 	functionName: `onetimesharing-${environmentName}-invalidatePublicKeylambda`,
		// 	runtime: lambda.Runtime.NODEJS_18_X,
		// 	code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-invalidatePublicKey.zip`),
		// 	handler: "invalidatePublicKey.handler",
		// 	environment: {
		// 		bucketName: S3Storage.bucketName,
		// 		tableName: DynamoDBStorage.tableName,
		// 		statemachine_arn: `${StateMachine.stateMachineArn}`,
		// 	},
		// });

		// const cognitoClientID = cdk.Fn.importValue("CognitoClientID");
		// const hostedUI = cdk.Fn.importValue("CognitoHostedURL");

		/* const login = new lambda.Function(this, "LoginHandler", {
			functionName: `onetimesharing-${environmentName}-login`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-login.zip`),
			handler: "login.handler",
			environment: {
				baseURL: hostedUI,
				clientID: cognitoClientID,
			},
		});

		const logout = new lambda.Function(this, "LogoutHandler", {
			functionName: `onetimesharing-${environmentName}-logout`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-logout.zip`),
			handler: "logout.handler",
			environment: {
				baseURL: hostedUI,
				clientID: cognitoClientID,
			},
		});

		const refreshToken = new lambda.Function(this, "refreshTokenHandler", {
			functionName: `onetimesharing-${environmentName}-refreshToken`,
			runtime: lambda.Runtime.NODEJS_18_X,
			code: lambda.Code.fromAsset(`../handlers/dist/${process.env.SHORT_SHA}-refreshToken.zip`),
			handler: "refreshToken.handler",
			environment: {
				baseURL: hostedUI,
				clientID: cognitoClientID,
			},
		}); */

		/*
            API Gateway Lambda Integrations
        */

		const statusIntegration = new apigateway.LambdaIntegration(statusHandler, {
			requestTemplates: { "application/json": '{ "statusCode": "200" }' },
		});

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

		// const invalidatePublicKeyIntegration = new apigateway.LambdaIntegration(invalidatePublicKey, {
		// 	requestTemplates: { "application/json": '{ "statusCode": "200" }' },
		// });

		/* const loginIntegration = new apigateway.LambdaIntegration(login, {
			requestTemplates: { "application/x-www-form-urlencoded": '{ "statusCode": "200" }' },
		});

		const logoutIntegration = new apigateway.LambdaIntegration(logout, {
			requestTemplates: { "application/json": '{ "statusCode": "200" }' },
		});

		const refreshTokenIntegration = new apigateway.LambdaIntegration(refreshToken, {
			requestTemplates: { "application/json": '{ "statusCode": "200" }' },
		}); */

		/*
            Defining of the routes from the Gateway to the Lambda functions
        */

		const apiRoute = apiGateway.root.addResource("api"); // /api

		apiRoute.addResource(eMethods.STATUS).addResource("{uuid}").addMethod("GET", statusIntegration); // GET /

		apiRoute.addResource(eMethods.GET_SHE_SECRET).addResource("{uuid}").addMethod("POST", getSHESecretsIntegration); // POST /
		apiRoute.addResource(eMethods.POST_SHE_SECRET).addMethod("POST", postSHESecretsIntegration); // POST /

		/* apiRoute.addResource(eMethods.LOGIN).addMethod("GET", loginIntegration);
		apiRoute.addResource(eMethods.LOGOUT).addMethod("GET", logoutIntegration);
		apiRoute.addResource(eMethods.REFRESH).addMethod("GET", refreshTokenIntegration); */

		apiRoute.addResource(eMethods.GET_E2E_SECRET).addResource("{uuid}").addMethod("GET", getPKISecretsIntegration); // GET /
		apiRoute.addResource(eMethods.POST_E2E_SECRET).addMethod("POST", postPKISecretsIntegration); // POST /

		apiRoute.addResource(eMethods.POST_PUBLIC_KEY).addMethod("POST", postPublicKeyIntegration); // GET /
		apiRoute.addResource(eMethods.GET_PUBLIC_KEY).addResource("{uuid}").addMethod("GET", getPublicKeyIntegration); // POST /

		// Disabled for now as this could introduce the risk of being able to delete / invalidate public keys and secrets from someone else
		//apiRoute.addResource(eMethods.INVALIDATE_PUBLIC_KEY).addResource("{uuid}").addMethod("DELETE", invalidatePublicKeyIntegration); // POST /

		/*
            Give the Lambda functions permissions to access the database.
        */

		DynamoDBStorage.grantReadWriteData(getSHESecretHandler);
		DynamoDBStorage.grantReadWriteData(postSHESecretHandler);
		DynamoDBStorage.grantReadWriteData(getE2ESecretHandler);
		DynamoDBStorage.grantReadWriteData(postE2ESecretHandler);
		//DynamoDBStorage.grantReadWriteData(invalidatePublicKey);
		DynamoDBStorage.grantReadWriteData(statusHandler);

		S3Storage.grantWrite(postPublicKeyHandler);
		S3Storage.grantRead(getPublicKeyHandler);
		//S3Storage.grantDelete(invalidatePublicKey);

		//StateMachine.grantStartExecution(invalidatePublicKey);

		Secret.addToResourcePolicy(
			new iam.PolicyStatement({
				principals: [new iam.AnyPrincipal()],
				actions: ["secretsmanager:GetSecretValue"],
				resources: ["*"],
			})
		);

		this.ApiGateway = apiGateway;
	}
}
