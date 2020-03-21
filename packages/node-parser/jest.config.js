/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-commonjs */
const { defaults } = require('jest-config');

module.exports = {
  ...defaults,
  setupFilesAfterEnv: ['./jest.setup.js'],
  roots: ['./', '../parser'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
};
