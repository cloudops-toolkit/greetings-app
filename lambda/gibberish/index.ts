import { LoremIpsum } from 'lorem-ipsum';
const AWS = require('aws-sdk');
const sns = new AWS.SNS();

const lorem = new LoremIpsum();

exports.handler = async function(event: any) {
  const text = lorem.generateParagraphs(1);

  // Publish gibberish to SNS
  const topicArn = process.env.SNS_TOPIC_ARN;
  await sns.publish({
    Message: text,
    TopicArn: topicArn,
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: text }),
  };
};
