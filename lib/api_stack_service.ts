import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { eMethods } from "../types/enums";

export class ApiStackService extends Construct {
    constructor(scope: Construct, id: string, DynamoDBStorage: dynamodb.TableV2) {
        super(scope, id);

        /*
            API Gateway
        */

        const api = new apigateway.RestApi(this, "secrets-api", {
            restApiName: "bolleje-dev-api-gateway",
            description: "This service serves the secrets for the Temporary Secrets API.",
        });

        /*
            Lambda functions
        */

        const getSHESecretHandler = new lambda.Function(this, "GetSecretHandler", {
            functionName: "bolleje-dev-getSHEsecretlambda",
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources/dist/getSHEsecret.zip"),
            handler: "getSHEsecret.handler"
        });

        const postSHESecretHandler = new lambda.Function(this, "PostSecretHandler", {
            functionName: "bolleje-dev-postSHEsecretlambda",
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources/dist/postSHEsecret.zip"),
            handler: "postSHEsecret.handler"
        });

        const getE2ESecretHandler = new lambda.Function(this, "GetE2ESecretHandler", {
            functionName: "bolleje-dev-getE2Esecretlambda",
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources/dist/getE2Esecret.zip"),
            handler: "getE2Esecret.handler"
        });

        const postE2ESecretHandler = new lambda.Function(this, "PostE2ESecretHandler", {
            functionName: "bolleje-dev-postE2Esecretlambda",
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources/dist/postE2Esecret.zip"),
            handler: "postE2Esecret.handler"
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
        })

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