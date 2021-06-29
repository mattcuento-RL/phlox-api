import handler from './libs/handler-lib';
import dynamoDb from './libs/dynamodb-lib';

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.listingTable,
    // 'Key' defines the partition key and sort key of the item to be updated
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
      listingId: event.pathParameters.id, // The id of the note from the path
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: 'SET title = :title, description = :description, category = :category, policy = :policy, imageUrl = :imageUrl',
    ExpressionAttributeValues: {
      ':title': data.title || null,
      ':description': data.description || null,
      ':category': data.category || null,
      ':policy': data.policy || null,
      ':imageUrl': data.imageUrl || null,
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: 'ALL_NEW',
  };

  await dynamoDb.update(params);

  return { status: true };
});

export const request = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.requestTable,
    // 'Key' defines the partition key and sort key of the item to be updated
    Key: {
      userId: data.userId, // The id of the author
      requestId: event.pathParameters.id, // The id of the note from the path
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: 'SET requestStatus = :requestStatus, archived = :archived',
    ConditionExpression: 'listingAuthorId = :listingAuthorId',
    ExpressionAttributeValues: {
      ':listingAuthorId': event.requestContext.identity.cognitoIdentityId,
      ':requestStatus': data.requestStatus || null,
      ':archived': data.archived || false,
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: 'ALL_NEW',
  };

  await dynamoDb.update(params);

  return { status: true };
});
