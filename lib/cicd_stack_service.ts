import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { RemovalPolicy } from "aws-cdk-lib";

export class CiCdStackService extends Construct {
	constructor(scope: Construct, id: string) {
		super(scope, id);

		const bucket = new s3.Bucket(this, "bolleje-dev-s3-codestorage", {
			bucketName: "bolleje-dev-s3-codestorage",
			removalPolicy: RemovalPolicy.DESTROY,
		});

		new s3deploy.BucketDeployment(this, "DeployWebsite", {
			sources: [s3deploy.Source.asset("../resources/dist")],
			destinationBucket: bucket,
		});
	}
}
