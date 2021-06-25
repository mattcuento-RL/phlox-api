import { main } from '../delete';

test('create listing', async () => {
  const event = 'event';
  const context = 'context';
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('string');
  };

  await main(event, context, callback);
});
