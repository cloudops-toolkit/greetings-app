import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as eventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';
import { join } from 'path';

export class GreetingAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create SNS Topic
    const greetingsTopic = new sns.Topic(this, 'GreetingsTopic');

    // Create SQS Queue
    const greetingsQueue = new sqs.Queue(this, 'GreetingsQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    // Subscribe SQS to SNS
    greetingsTopic.addSubscription(new subs.SqsSubscription(greetingsQueue));

    // Lambda function to generate gibberish
    const gibberishLambda = new lambda.Function(this, 'GibberishFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(join(__dirname, '../lambda/gibberish'), {
        // Exclude unnecessary files from the deployment package
        exclude: ['*.ts'],
      }),
      environment: {
        SNS_TOPIC_ARN: greetingsTopic.topicArn,
      },
    });

    // API Gateway to trigger gibberish lambda
    const api = new apigateway.RestApi(this, 'greetingsApi');
    const hello = api.root.addResource('hello');
    hello.addMethod('GET', new apigateway.LambdaIntegration(gibberishLambda));

    // Lambda function to consume SNS messages
    const greetingPrinter = new lambda.Function(this, 'GreetingPrinterFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(join(__dirname, '../lambda/greetingPrinter')), // No bundling
    });

    // Grant permission for gibberishLambda to publish to SNS
    greetingsTopic.grantPublish(gibberishLambda);

    // Add SQS as event source for greetingPrinter Lambda
    greetingPrinter.addEventSource(new eventSources.SqsEventSource(greetingsQueue));

    // Grant permission to read messages from SQS
    greetingsQueue.grantConsumeMessages(greetingPrinter);
  }
}
