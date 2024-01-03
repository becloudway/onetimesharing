import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { RemovalPolicy } from "aws-cdk-lib";

export class CiCdStackService extends Construct {
	constructor(scope: Construct, id: string, environmentName: string) {
		super(scope, id);

		const bucket = new s3.Bucket(this, `bolleje-dev-s3-codestorage`, {
			bucketName: `bolleje-${environmentName}-s3-codestorage`,
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
		});

		new s3deploy.BucketDeployment(this, "DeployFiles", {
			sources: [s3deploy.Source.asset(`resources/dist.zip`)],
			destinationBucket: bucket,
		});
	}
}
