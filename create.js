import * as uuid from 'uuid';
import handler from './libs/handler-lib';
import dynamoDb from './libs/dynamodb-lib';

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.listingTable,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
      listingId: uuid.v1(), // A unique uuid
      title: data.title, // Parsed from request body
      description: data.description, // Parsed from request body
      category: data.category,
      rules: data.rules,
      imageUrls: data.imageUrls,
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
