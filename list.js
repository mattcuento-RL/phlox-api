import handler from './libs/handler-lib';
import dynamoDb from './libs/dynamodb-lib';

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.listingTable,
  };

  const scanResults = [];
  let items;

  do {
    items = await dynamoDb.scan(params);
    items.Items.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== 'undefined');
  return scanResults;
});

export const getLenderListings = handler(async (event, context) => {
  const params = {
    TableName: process.env.listingTable,
    // 'FilterExpression' defines the condition for the query
    // - 'listingAuthorId = :listingAuthorId': only return items with matching 'listingAuthorId'
    FilterExpression: 'userId = :userId',
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':listingAuthorId': defines 'listingAuthorId' to be the id of the author
    ExpressionAttributeValues: {
      ':userId': event.requestContext.identity.cognitoIdentityId, // The id of the author,
    },
  };

  const result = await dynamoDb.scan(params);

  // Return the matching list of items in response body
  return result.Items;
});

export const getLenderRequests = handler(async (event, context) => {
  const params = {
    TableName: process.env.requestTable,
    // 'FilterExpression' defines the condition for the query
    // - 'listingAuthorId = :listingAuthorId': only return items with matching 'listingAuthorId'
    FilterExpression: 'listingAuthorId = :listingAuthorId',
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':listingAuthorId': defines 'listingAuthorId' to be the id of the author
    ExpressionAttributeValues: {
      ':listingAuthorId': event.requestContext.identity.cognitoIdentityId, // The id of the author,
    },
  };

  const result = await dynamoDb.scan(params);

  // Return the matching list of items in response body
  return result.Items;
});

export const getRenterRequests = handler(async (event, context) => {
  const params = {
    TableName: process.env.requestTable,
    // 'FilterExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    FilterExpression: 'userId = :userId',
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'listingAuthorId' to be the id of the author
    ExpressionAttributeValues: {
      ':userId': event.requestContext.identity.cognitoIdentityId, // The id of the author,
    },
  };

  const result = await dynamoDb.scan(params);

  // Return the matching list of items in response body
  return result.Items;
});
