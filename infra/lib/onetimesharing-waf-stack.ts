import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

export class OneTimeSharingWAFStack extends cdk.Stack {
  public readonly webAclArn: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
      env: { region: 'us-east-1' }, // 👈 Force WAF in us-east-1
    });

    const webACL = new wafv2.CfnWebACL(this, 'GlobalWebACL', {
      defaultAction: { allow: {} },
      scope: 'CLOUDFRONT',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'GlobalWAFMetric',
        sampledRequestsEnabled: true,
      },
      name: 'GlobalWebACL',
      rules: [
        {
          name: 'CommonRuleSet',
          priority: 0,
          statement: {
            managedRuleGroupStatement: {
              name: 'AWSManagedRulesCommonRuleSet',
              vendorName: 'AWS',
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'CommonRuleSetMetric',
            sampledRequestsEnabled: true,
          },
          overrideAction: { none: {} },
        },
        {
          name: 'BruteForceProtection',
          priority: 1,
          statement: {
            rateBasedStatement: {
              limit: 100,
              aggregateKeyType: 'IP',
            },
          },
          action: { block: {} },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'BruteForceMetric',
            sampledRequestsEnabled: true,
          },
        },
      ],
    });

    this.webAclArn = webACL.attrArn; // Export to use in CloudFront stack
  }
}
