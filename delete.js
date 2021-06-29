import handler from './libs/handler-lib';
import dynamoDb from './libs/dynamodb-lib';

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.listingTable,
    // 'Key' defines the partition key and sort key of the item to be removed
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
      listingId: event.pathParameters.id, // The id of the note from the path
    },
  };

  await dynamoDb.delete(params);

  const params2 = {
    TableName: process.env.requestTable,
    // 'FilterExpression' defines the condition for the query
    // - 'listingId = :listingId': only return items with matching 'listingId'
    FilterExpression: 'listingId = :listingId',
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':listingId': defines 'listingAuthorId' to be the id of the author
    ExpressionAttributeValues: {
      ':listingId': event.pathParameters.id, // The id of the author,
    },
  };

  const result = await dynamoDb.scan(params2);

  if (result.Items.length > 0) {
    result.Items.forEach((request) => {
      const params3 = {
        TableName: process.env.requestTable,
        Key: {
          userId: request.userId, // The id of the author
          requestId: request.requestId, // The id of the note from the path
        },
        UpdateExpression: 'SET requestStatus = :requestStatus, archived = :archived',
        ExpressionAttributeValues: {
          ':requestStatus': 3,
          ':archived': true,
        },
        ReturnValues: 'ALL_NEW',
      };
      dynamoDb.update(params3);
    });
  }

  return { status: true };
});
