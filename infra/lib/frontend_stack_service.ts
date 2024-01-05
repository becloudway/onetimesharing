import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { OriginAccessIdentity, Distribution } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Duration, RemovalPolicy } from "aws-cdk-lib";

export class FrontendStackService extends Construct {
	constructor(scope: Construct, id: string, environmentName: string) {
		super(scope, id);

		const bucket = new s3.Bucket(this, `bolleje-${environmentName}-frontend-s3`, {
			bucketName: `bolleje-${environmentName}-frontend-s3`,
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
			accessControl: s3.BucketAccessControl.PRIVATE,
		});

		new s3deploy.BucketDeployment(this, "DeployWebsite", {
			sources: [s3deploy.Source.asset(`../app/dist`)],
			destinationBucket: bucket,
		});

		const originAccessIdentity = new OriginAccessIdentity(this, `OriginAccessIdentity`);
		bucket.grantRead(originAccessIdentity);

		new Distribution(this, `bolleje-${environmentName}-frontend-cloudfront`, {
			defaultRootObject: "index.html",
			defaultBehavior: {
				origin: new S3Origin(bucket, { originAccessIdentity }),
			},
			errorResponses: [
				{
					httpStatus: 404,
					responseHttpStatus: 200,
					responsePagePath: "/index.html",
					ttl: Duration.seconds(0),
				},
			],
		});
	}
}

// const webDistribution = new Distribution(this, `bolleje-${environmentName}-cloudfront`, {
// 	defaultBehavior: {
// 		origin: new S3Origin(bucket, {
// 			originAccessIdentity,
// 		}),
// 		allowedMethods: AllowedMethods.ALLOW_ALL,
// 		viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
// 	},
// 	additionalBehaviors: {
// 		"v1/*": {
// 			origin: new RestApiOrigin(apiGateway, {
// 				originPath: "/prod",
// 			}),
// 			viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
// 			allowedMethods: AllowedMethods.ALLOW_ALL,
// 			cachePolicy: CachePolicy.CACHING_DISABLED,
// 			originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
// 			compress: true,
// 		},
// 	},
// });