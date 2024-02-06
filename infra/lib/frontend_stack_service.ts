import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import {
	OriginAccessIdentity,
	Distribution,
	ViewerProtocolPolicy,
	AllowedMethods,
	CachePolicy,
	OriginRequestPolicy,
	ResponseHeadersPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { RestApiOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";

export class FrontendStackService extends Construct {
	constructor(scope: Construct, id: string, environmentName: string, apiGateway: any) {
		super(scope, id);

		const stack = cdk.Stack.of(this);

		const bucket = new s3.Bucket(this, `${stack.account}-onetimesharing-${environmentName}-frontend`, {
			bucketName: `${stack.account}-onetimesharing-${environmentName}-frontend`,
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

		const cloudfrontDistribution = new Distribution(this, `onetimesharing-${environmentName}-cloudfront`, {
			defaultRootObject: "index.html",
			defaultBehavior: {
				origin: new S3Origin(bucket, { originAccessIdentity }),
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
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

		cloudfrontDistribution.addBehavior("/api/*", new RestApiOrigin(apiGateway), {
			viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
			allowedMethods: AllowedMethods.ALLOW_ALL,
			cachePolicy: CachePolicy.CACHING_DISABLED,
			compress: true,
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
