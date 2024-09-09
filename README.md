# Greetings App - AWS CDK Web Application

This project is a web application built using AWS CDK in TypeScript. It integrates Lambda, API Gateway, SNS, and SQS services to generate and process gibberish text through an API and message queues.

## Architecture Overview

- **Lambda Function (Gibberish Generator)**: Generates gibberish text using the `lorem-ipsum` npm package.
- **API Gateway**: Exposes the `/hello` API endpoint to trigger the Lambda function.
- **SNS Topic (Greetings)**: Receives the gibberish text from the Lambda function.
- **SQS Queue**: Subscribed to the SNS topic to receive messages.
- **Lambda Function (Greetings Printer)**: Consumes messages from the SQS queue and logs them in CloudWatch.

## Prerequisites

- AWS CLI configured with proper credentials.
- AWS CDK installed globally: `npm install -g aws-cdk`
- Node.js installed (version 14.x or higher).

## Steps to Deploy and Test

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/cloudops-toolkit/greetings-app.git
cd greetings-app
```

### 2. Install Dependencies

Navigate to the Lambda function directory and install the required npm packages:

```bash
cd lambda/gibberish
npm install
```

### 3. Deploy the Stack

Go back to the root project directory and deploy the CDK stack:

```bash
cd ../..
cdk deploy
```

### 4. Test the Application

After deployment, the output will provide the API Gateway URL. Use `curl` or a browser to trigger the `/hello` endpoint:

```bash
curl https://<api-id>.execute-api.<region>.amazonaws.com/prod/hello
```

