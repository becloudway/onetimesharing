import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Duration, RemovalPolicy } from "aws-cdk-lib";

export class CognitoStackService extends Construct {
	public readonly cognitoClientID: string;
	public readonly hostedURL: string;
	public readonly secret: secretsmanager.Secret;

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
				callbackUrls: [
					"http://localhost:9000/callback",
					"https://onetimesharing.sandbox.dev.cloudway.be/callback",
					"https://onetimesharing.com/callback",
				],
				logoutUrls: ["http://localhost:9000/", "https://onetimesharing.sandbox.dev.clouwday.be/", "https://onetimesharing.com/"],
				scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
			},
			userPoolClientName: "OneTimeSharing-userpool",
			generateSecret: true,
		});

		const domain = userPool.addDomain("Domain", {
			cognitoDomain: {
				domainPrefix: "onetimesharing-authorize",
			},
		});

		const secret = new secretsmanager.Secret(this, "CognitoClientSecret", {
			secretName: "CognitoClientSecret",
			generateSecretString: {
				secretStringTemplate: JSON.stringify({ client_secret: client.userPoolClientSecret }),
				generateStringKey: "clientSecret",
			},
		});

		this.secret = secret;
		this.cognitoClientID = client.userPoolClientId;
		this.hostedURL = domain.baseUrl();
	}
}
