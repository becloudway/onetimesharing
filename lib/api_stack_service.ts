import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

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
            functionName: "bolleje-dev-getshesecretlambda",
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources"),
            handler: "getSHEsecrets.handler"
        });

        const postSHESecretHandler = new lambda.Function(this, "PostSecretHandler", {
            functionName: "bolleje-dev-postshesecretlambda",
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources"),
            handler: "postSHEsecrets.handler"
        });

        const getPKISecretHandler = new lambda.Function(this, "GetPKISecretHandler", {
            functionName: "bolleje-dev-getpkisecretlambda",
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources"),
            handler: "getPKIsecrets.handler"
        });

        const postPKISecretHandler = new lambda.Function(this, "PostPKISecretHandler", {
            functionName: "bolleje-dev-postpkisecretlambda",
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources"),
            handler: "postPKIsecrets.handler"
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

        const getPKISecretsIntegration = new apigateway.LambdaIntegration(getPKISecretHandler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' },
        })

        const postPKISecretsIntegration = new apigateway.LambdaIntegration(postPKISecretHandler, {
            requestTemplates: { "application/json": '{ "body" : $input.json("$") }' },
            passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES, 
        });

        /*
            Defining of the routes from the Gateway to the Lambda functions
        */

        api.root.addResource("getSHE").addResource("{uuid}").addMethod("GET", getSHESecretsIntegration); // GET /
        api.root.addResource("addSHE").addMethod("POST", postSHESecretsIntegration); // POST /

        api.root.addResource("getPKI").addResource("{uuid}").addMethod("GET", getPKISecretsIntegration); // GET /
        api.root.addResource("addPKI").addMethod("POST", postPKISecretsIntegration); // POST /

        /*
            Give the Lambda functions permissions to access the database.
        */

        DynamoDBStorage.grantReadWriteData(getSHESecretHandler);
        DynamoDBStorage.grantReadWriteData(postSHESecretHandler);
        DynamoDBStorage.grantReadWriteData(getPKISecretHandler);
        DynamoDBStorage.grantReadWriteData(postPKISecretHandler);
    }
}