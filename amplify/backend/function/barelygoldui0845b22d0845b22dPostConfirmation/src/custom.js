/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_BGDYNAMODBUSERS_ARN
	STORAGE_BGDYNAMODBUSERS_NAME
	STORAGE_BGDYNAMODBUSERS_STREAMARN
Amplify Params - DO NOT EDIT */const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = 'BGDynamoDBUsers';
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
exports.handler = async (event) => {
  const timestamp = Date.now();
  
  const userAttributes = event.request.userAttributes;
  
  const userItem = {
    id: userAttributes.sub,
    email: userAttributes.email,
    first_name: userAttributes.given_name || '',
    last_name: userAttributes.family_name || '',
    shipping_address: '',
    cart: [],
    created_at: timestamp,
    updated_at: timestamp
  };

  const params = {
    TableName: tableName,
    Item: userItem
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    console.log('User successfully created in DynamoDB:', userItem.id);
  } catch (error) {
    console.error('Error creating user in DynamoDB:', error);
    throw error;
  }

  return event;
};