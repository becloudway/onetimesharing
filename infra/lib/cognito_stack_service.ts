import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Duration, RemovalPolicy } from "aws-cdk-lib";

export class CognitoStackService extends Construct {
	constructor(scope: Construct, id: string, environmentName: string) {
		super(scope, id);

		const userPool = new cognito.UserPool(this, "secretuserpool", {
			userPoolName: `onetimesharing-${environmentName}-cognito`,
			signInCaseSensitive: false,
			selfSignUpEnabled: true,
			userVerification: {
				emailSubject: "OneTimeSharing - Verification code!",
				emailBody: "Thanks for signing up to the OneTimeSharing application! Your verification code is {####}",
				emailStyle: cognito.VerificationEmailStyle.CODE,
			},
			signInAliases: {
				email: true,
			},
			mfa: cognito.Mfa.OPTIONAL,
			mfaSecondFactor: {
				sms: false,
				otp: true,
			},
			passwordPolicy: {
				minLength: 8,
				requireLowercase: true,
				requireUppercase: true,
				requireDigits: true,
				requireSymbols: true,
				tempPasswordValidity: Duration.days(3),
			},
			accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
			removalPolicy: RemovalPolicy.DESTROY,
		});

		const client = userPool.addClient("test-client", {
			authFlows: {
				userSrp: true,
			},
			oAuth: {
				flows: {
					authorizationCodeGrant: true,
				},
				callbackUrls: ["http://localhost:9000/login"],
				logoutUrls: ["http://localhost:9000/"],
				scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
			},
			userPoolClientName: "OneTimeSharing-userpool",
		});

		const domain = userPool.addDomain("Domain", {
			cognitoDomain: {
				domainPrefix: "onetimesharing-authorize",
			},
		});
	}
}
