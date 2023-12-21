import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as api_stack_service from "./api_stack_service";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface ApiStackProps extends cdk.StackProps {
  DynamoDBStorage: dynamodb.TableV2;
}

export class BolleJeDevApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new api_stack_service.ApiStackService(this, "Secrets", props.DynamoDBStorage);
  }
}
