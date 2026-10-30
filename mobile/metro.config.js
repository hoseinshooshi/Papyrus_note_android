const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
// The web app's typed models, starter data, templates and avatar catalog are shared
// intentionally so the mobile client preserves the same data contract.
config.watchFolders = [path.resolve(__dirname, "..")];
module.exports = config;
