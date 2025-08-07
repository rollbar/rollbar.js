const http = require('http');
const Rollbar = require('rollbar');
const PORT = process.env.PORT || 3000;

// Initialize Rollbar with your configuration
const rollbar = new Rollbar({
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('👋 Hello, Rollbar!\n');
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    rollbar.info('Server started!');
  });
}
