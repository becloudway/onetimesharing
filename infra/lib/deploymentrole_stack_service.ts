import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";

export class DeploymentRoleStack extends Construct {
	public readonly DeploymentRole: iam.Role;

	constructor(scope: Construct, id: string) {
		super(scope, id);

		const stack = Stack.of(this);

		const role = new iam.Role(this, "FullDeploymentRole", {
			roleName: `onetimesharing-deployment-role`,
			assumedBy: new iam.AccountPrincipal("*"), // Allow any AWS account to assume
			description: "Role with full permissions to deploy onetimesharing stacks.",
			// Optional: MaxSessionDuration: Duration.hours(1)
		});

		// Use "*" for open assume role (IAM console compatible)
		role.assumeRolePolicy?.addStatements(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				principals: [new iam.AnyPrincipal()],
				actions: ["sts:AssumeRole"],
			})
		);

		role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"));

		// OR define inline least-privilege policy instead of AdministratorAccess:
		role.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: [
					// Lambda
					"lambda:*",

					// Step Functions
					"states:*",

					// S3
					"s3:*",

					// DynamoDB
					"dynamodb:*",

					// CloudFront
					"cloudfront:*",

					// IAM
					"iam:PassRole",
					"iam:CreateRole",
					"iam:AttachRolePolicy",
					"iam:PutRolePolicy",
					"iam:TagRole",

					// Secrets Manager
					"secretsmanager:GetSecretValue",
					"secretsmanager:PutResourcePolicy",

					// API Gateway
					"apigateway:*",

					// WAFv2
					"wafv2:*",

					// CloudFormation and CDK deployments
					"cloudformation:*",

					// Parameter Store
					"ssm:GetParameter",
					"ssm:GetParameters",
					"ssm:GetParametersByPath"
				],
				resources: ["*"], // Optional: scope this to specific ARNs later
			})
		);

		this.DeploymentRole = role;
	}
}
