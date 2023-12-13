import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as api_stack_service from "./api_stack_service";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BolleJeDevApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new api_stack_service.ApiStackService(this, "Secrets");
  }
}
