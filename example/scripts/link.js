/* eslint-disable import/no-commonjs, @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs-extra');
const links = require('wml/src/links');

const addLink = (source, destination) => {
  if (links && Array.isArray(links.data)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const i of links.data) {
      if (links.data[i].src === source && links.data[i].dest === destination) {
        return;
      }
    }
  }

  const watchmanConfigPath = path.join(source, '.watchmanconfig');

  const watchmanConfig = fs.readJsonSync(watchmanConfigPath);
  fs.outputJsonSync(watchmanConfigPath, watchmanConfig);

  let i = 0;
  while (links.data[i]) i += 1;

  links.data[i] = {
    src: source,
    dest: destination,
    enabled: true,
    createdTime: new Date(),
  };

  links.save();
  // eslint-disable-next-line no-console
  console.log(`Added link: (${i}) ${source} -> ${destination}`);
};

const projectFolder = path.join(__dirname, '../');
const nodeModulesFolder = path.join(projectFolder, 'node_modules');
// get all depencies pointing to file locations
const packageConfig = fs.readJsonSync(path.join(projectFolder, 'package.json'));

const selectedDependencies = new Map();
const toBeAddedLinks = Object.keys(packageConfig.dependencies).reduce(
  (accumulator, dependencyName) => {
    const dependencySource = packageConfig.dependencies[dependencyName];
    if (dependencySource && dependencySource.startsWith('file:')) {
      const source = path.join(projectFolder, dependencySource.replace('file:', ''));
      const destination = path.join(nodeModulesFolder, dependencyName);
      if (fs.existsSync(source) && fs.existsSync(destination)) {
        selectedDependencies.set(dependencyName, source);
        accumulator.push({
          src: source,
          dest: destination,
        });
      }
    }
    return accumulator;
  },
  []
);

// add any nested dependency
[...toBeAddedLinks].forEach(l => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [dependencyName, source] of selectedDependencies) {
    const nestedDependency = path.join(l.dest, 'node_modules', dependencyName);
    if (fs.existsSync(nestedDependency)) {
      toBeAddedLinks.push({ src: source, dest: nestedDependency });
    }
  }
});

links.load();

toBeAddedLinks.forEach(l => addLink(l.src, l.dest));
/* eslint-enable import/no-commonjs, @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
