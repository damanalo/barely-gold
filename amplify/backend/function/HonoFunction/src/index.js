const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

// ARN of the external function (can be passed as an environment variable or hardcoded here)
const EXTERNAL_FUNCTION_NAME = 'barely-gold-honoFunction-wtJ6nf2COmSz';

exports.handler = async (event) => {
  // Data to pass to the external Lambda (e.g., the payload received by the proxy)
  const payload = event; 

  const params = {
    FunctionName: EXTERNAL_FUNCTION_NAME,
    InvocationType: 'RequestResponse', // For synchronous call
    Payload: JSON.stringify(payload),
  };

  try {
    const result = await lambda.invoke(params).promise();

    // Return the payload from the external function
    return JSON.parse(result.Payload); 
  } catch (error) {
    console.error('Error invoking external Lambda:', error);
    throw new Error('Failed to execute external function.');
  }
};