import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class ApiStackService extends Construct {
    constructor(scope: Construct, id: string, DynamoDBStorage: dynamodb.TableV2) {
        super(scope, id);

        const getSecretHandler = new lambda.Function(this, "GetSecretHandler", {
            functionName: "bolleje-dev-getsecretlambda",
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources"),
            handler: "getsecrets.handler"
        });

        const postSecretHandler = new lambda.Function(this, "PostSecretHandler", {
            functionName: "bolleje-dev-postsecretlambda",
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources"),
            handler: "postsecrets.handler"
        });

        DynamoDBStorage.grantReadWriteData(getSecretHandler);
        DynamoDBStorage.grantReadWriteData(postSecretHandler);

        const api = new apigateway.RestApi(this, "secrets-api", {
            restApiName: "bolleje-dev-api-gateway",
            description: "This service serves the secrets for the Temporary Secrets API.",
        });

        const getSecretsIntegration = new apigateway.LambdaIntegration(getSecretHandler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' },
        });

        const postSecretsIntegration = new apigateway.LambdaIntegration(postSecretHandler, {
            requestTemplates: { "application/json": '{ "body" : $input.json("$") }' },
            passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
        });

        const getSecrets = api.root.addResource("getsecret").addResource("{uuid}"); // GET /
        getSecrets.addMethod("GET", getSecretsIntegration);

        const addSecrets = api.root.addResource("addsecret");
        addSecrets.addMethod("POST", postSecretsIntegration); // POST /
    }
}