/* eslint-disable import/no-commonjs */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs-extra');
const links = require('wml/src/links');

const addLink = (src, dest) => {
  if (links && Array.isArray(links.data)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const i of links.data) {
      if (links.data[i].src === src && links.data[i].dest === dest) {
        return;
      }
    }
  }

  const watchmanConfigPath = path.join(src, '.watchmanconfig');

  const watchmanConfig = fs.readJsonSync(watchmanConfigPath);
  fs.outputJsonSync(watchmanConfigPath, watchmanConfig);

  let i = 0;
  while (links.data[i]) i += 1;

  links.data[i] = {
    src,
    dest,
    enabled: true,
    createdTime: new Date(),
  };

  links.save();
  // eslint-disable-next-line no-console
  console.log(`Added link: (${i}) ${src} -> ${dest}`);
};

const projectDir = path.join(__dirname, '../');
const nodeModulesDir = path.join(projectDir, 'node_modules');
// get all depencies pointing to file locations
const packageConfig = fs.readJsonSync(path.join(projectDir, 'package.json'));

const selectedDependencies = new Map();
const toBeAddedLinks = Object.keys(packageConfig.dependencies).reduce((acc, dependencyName) => {
  const dependencySource = packageConfig.dependencies[dependencyName];
  if (dependencySource && dependencySource.startsWith('file:')) {
    const src = path.join(projectDir, dependencySource.replace('file:', ''));
    const dest = path.join(nodeModulesDir, dependencyName);
    if (fs.existsSync(src) && fs.existsSync(dest)) {
      selectedDependencies.set(dependencyName, src);
      acc.push({
        src,
        dest,
      });
    }
  }
  return acc;
}, []);

// add any nested dependency
[...toBeAddedLinks].forEach(l => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [dependencyName, src] of selectedDependencies) {
    const nestedDependency = path.join(l.dest, 'node_modules', dependencyName);
    if (fs.existsSync(nestedDependency)) {
      toBeAddedLinks.push({ src, dest: nestedDependency });
    }
  }
});

links.load();

toBeAddedLinks.forEach(l => addLink(l.src, l.dest));
