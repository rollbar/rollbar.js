const path = require("path");

module.exports = {
  webpack(config, { isServer }) {
    config.devtool = "source-map";
    config.optimization.minimize = false;
    return config;
  },
};
