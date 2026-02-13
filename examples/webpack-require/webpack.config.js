const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/index.js', // Your main application entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'), // Output directory
  },
  devServer: {
    static: path.resolve(__dirname, 'public'), // Serve static files from 'public'
    port: 8080,
    hot: true, // Enable Hot Module Replacement
    open: true, // Open the browser automatically
  },
  // Add loaders and plugins as needed for your project (e.g., Babel for React/Vue)
};
