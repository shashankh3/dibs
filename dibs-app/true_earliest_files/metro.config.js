const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Firebase v10+ requires cjs support
config.resolver.sourceExts.push('cjs');

module.exports = config;