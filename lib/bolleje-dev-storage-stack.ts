import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as storage_stack_service from "./storage_stack_service";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BolleJeDevStorageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new storage_stack_service.StorageStackService(this, "Secrets");
  }
}
