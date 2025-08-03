const path = require("path");

module.exports = {
  webpack(config, { isServer }) {
    config.devtool = "source-map";
    config.optimization.minimize = false;

    config.resolve.alias.rollbar = path.resolve(
      __dirname,
      "../../rollbar/rollbar-js"
    );

    return config;
  },
};
