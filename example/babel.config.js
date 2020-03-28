module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Adds syntax support for default value using ?? operator
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // Adds syntax support for optional chaining (.?)
    '@babel/plugin-proposal-optional-chaining',
  ],
};
