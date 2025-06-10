import * as Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: 'POST_SERVER_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true
});

// TypeScript example using strongly-typed parameters
interface User {
  id: number;
  name: string;
  email: string;
}

function processUser(user: User): void {
  rollbar.info(`Processing user: ${user.name}`, user);
}

// Create a user and process it
const user: User = {
  id: 123,
  name: 'Example User',
  email: 'user@example.com'
};

processUser(user);

// Log a message
rollbar.info('Hello from TypeScript!');