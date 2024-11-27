const path = require("path");

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    "@utils": path.resolve(__dirname, "src/utils"),
    "@components": path.resolve(__dirname, "src/components"),
    "@api": path.resolve(__dirname, "src/api"),
    "@auth": path.resolve(__dirname, "src/auth"),
  };
  return config;
};
