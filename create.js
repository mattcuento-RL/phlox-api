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
      address: data.address,
      phoneNumber: data.phoneNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      category: data.category,
      policy: data.policy,
      imageUrl: data.imageUrl,
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});

export const request = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.requestTable,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
      listingId: data.listingId, // A unique uuid
      requestId: uuid.v1(),
      rate: data.rate,
      archived: data.archived,
      startDate: data.startDate,
      endDate: data.endDate,
      phoneNumber: data.phoneNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      requestStatus: 0,
      listingAuthorId: data.listingAuthorId,
      comment: data.comment,
      timeCreated: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
