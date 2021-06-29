import handler from './libs/handler-lib';
import dynamoDb from './libs/dynamodb-lib';

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.listingTable,
    // 'FilterExpression' defines the condition for the query
    // - 'listingId = :listingId': only return items with matching 'listingId'
    FilterExpression: 'listingId = :listingId',
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':listingId': defines 'listingAuthorId' to be the id of the author
    ExpressionAttributeValues: {
      ':listingId': event.pathParameters.id, // The id of the author,
    },
  };

  const result = await dynamoDb.scan(params);

  // Return the matching list of items in response body
  return result.Items.length === 0 ? {} : result.Items[0];
});

export const approvedReservations = handler(async (event, context) => {
  const params = {
    TableName: process.env.requestTable,
    // 'FilterExpression' defines the condition for the query
    // - 'listingId = :listingId': only return items with matching 'listingId'
    FilterExpression: 'listingId = :listingId AND requestStatus = :requestStatus',
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':listingId': defines 'listingAuthorId' to be the id of the author
    ExpressionAttributeValues: {
      ':listingId': event.pathParameters.id, // The id of the author,
      ':requestStatus': 1,
    },
  };

  const result = await dynamoDb.scan(params);

  // Return the matching list of items in response body
  return result.Items;
});
