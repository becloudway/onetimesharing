#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { OneTimeSharingApiStack } from "../lib/onetimesharing-api-stack";
import { OneTimeSharingStorageStack } from "../lib/onetimesharing-storage-stack";
import { OneTimeSharingCiCdStack } from "../lib/onetimesharing-cicd-stack";
import { OneTimeSharingFrontendStack } from "../lib/onetimesharing-frontend-stack";

const app = new cdk.App();

const ProdStorageStack = new OneTimeSharingStorageStack(app, "OneTimeSharingProdStorageStack", {
	environmentName: "prod",
});
const ProdCiCdStack = new OneTimeSharingCiCdStack(app, "OneTimeSharingProdCiCdStack", {
	environmentName: "prod",
});
const ProdApiStack = new OneTimeSharingApiStack(app, "OneTimeSharingProdApiStack", {
	DynamoDBStorage: ProdStorageStack.DynamoDBStorage,
	environmentName: "prod",
	S3Storage: ProdStorageStack.S3Storage,
});
const ProdFrontendStack = new OneTimeSharingFrontendStack(app, "OneTimeSharingProdFrontendStack", {
	environmentName: "prod",
	apiGateway: ProdApiStack.ApiGateway,
});
