#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BolleJeApiStack } from "../lib/bolleje-api-stack";
import { BolleJeStorageStack } from "../lib/bolleje-storage-stack";
import { BolleJeCiCdStack } from "../lib/bolleje-cicd-stack";
import { BolleJeFrontendStack } from "../lib/bolleje-frontend-stack";
import { BolleJeCognitoStack } from "../lib/bolleje-cognito-stack";

const app = new cdk.App();

/*
	Production stack
*/

const ProdStorageStack = new BolleJeStorageStack(app, "BolleJeProdStorageStack", {
	environmentName: "prod",
});
const ProdCiCdStack = new BolleJeCiCdStack(app, "BolleJeProdCiCdStack", {
	environmentName: "prod",
});
const ProdApiStack = new BolleJeApiStack(app, "BolleJeProdApiStack", {
	DynamoDBStorage: ProdStorageStack.DynamoDBStorage,
	environmentName: "prod",
	S3Storage: ProdStorageStack.S3Storage,
});
const ProdFrontendStack = new BolleJeFrontendStack(app, "BolleJeProdFrontendStack", {
	environmentName: "prod",
	apiGateway: ProdApiStack.ApiGateway,
});

/*
	Development stack
*/

const DevStorageStack = new BolleJeStorageStack(app, "BolleJeDevStorageStack", {
	environmentName: "dev",
});
const DevCiCdStack = new BolleJeCiCdStack(app, "BolleJeDevCiCdStack", {
	environmentName: "dev",
});
const DevApiStack = new BolleJeApiStack(app, "BolleJeDevApiStack", {
	DynamoDBStorage: DevStorageStack.DynamoDBStorage,
	environmentName: "dev",
	S3Storage: DevStorageStack.S3Storage,
	/* If you don't specify 'env', this stack will be environment-agnostic.
	 * Account/Region-dependent features and context lookups will not work,
	 * but a single synthesized template can be deployed anywhere. */

	/* Uncomment the next line to specialize this stack for the AWS Account
	 * and Region that are implied by the current CLI configuration. */
	// env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

	/* Uncomment the next line if you know exactly what Account and Region you
	 * want to deploy the stack to. */
	// env: { account: '123456789012', region: 'us-east-1' },

	/* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
const DevFrontendStack = new BolleJeFrontendStack(app, "BolleJeDevFrontendStack", {
	environmentName: "dev",
	apiGateway: DevApiStack.ApiGateway,
});

const CognitoUserPool = new BolleJeCognitoStack(app, "BolleJeTestCognitoStack");
