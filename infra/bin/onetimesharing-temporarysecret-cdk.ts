#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { OneTimeSharingApiStack } from "../lib/onetimesharing-api-stack";
import { OneTimeSharingStorageStack } from "../lib/onetimesharing-storage-stack";
import { OneTimeSharingCiCdStack } from "../lib/onetimesharing-cicd-stack";
import { OneTimeSharingFrontendStack } from "../lib/onetimesharing-frontend-stack";
import { OneTimeSharingCognitoStack } from "../lib/onetimesharing-cognito-stack";

const AWS_ENVIRONMENT = {
	account: process.env.CDK_DEFAULT_ACCOUNT,
	region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

const ProdStorageStack = new OneTimeSharingStorageStack(app, "OneTimeSharingStorageStack", {
	environmentName: "prod",
	env: AWS_ENVIRONMENT,
});

const ProdCiCdStack = new OneTimeSharingCiCdStack(app, "OneTimeSharingCiCdStack", {
	environmentName: "prod",
	env: AWS_ENVIRONMENT,
});

const ProdCognitoStack = new OneTimeSharingCognitoStack(app, "OneTimeSharingCognitoStack", {
	environmentName: "prod",
	env: AWS_ENVIRONMENT,
});

const ProdApiStack = new OneTimeSharingApiStack(app, "OneTimeSharingApiStack", {
	DynamoDBStorage: ProdStorageStack.DynamoDBStorage,
	environmentName: "prod",
	S3Storage: ProdStorageStack.S3Storage,
	env: AWS_ENVIRONMENT,
});

const ProdFrontendStack = new OneTimeSharingFrontendStack(app, "OneTimeSharingFrontendStack", {
	environmentName: "prod",
	apiGateway: ProdApiStack.ApiGateway,
	env: AWS_ENVIRONMENT,
});
