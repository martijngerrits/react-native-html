const { defaults } = require('jest-config');

module.exports = {
  ...defaults,
  setupFilesAfterEnv: ['./jest.setup.js'],
  roots: ['./', '../parser'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  testPathIgnorePatterns: ['/node_modules/', 'defaultHtmlParseOptions'],
};
