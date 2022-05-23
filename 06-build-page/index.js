'use strict';

const fsSt = require('fs');
const path = require('path');
const fs = require('fs/promises');
const pathComponents = path.join(__dirname, 'components');
const pathTemplate = path.join(__dirname, 'template.html');
const pathDist = path.join(__dirname, 'project-dist');
const pathStyles = path.join(__dirname, 'styles');

const createHTML = async () => {
  const data = await fs.readFile(pathTemplate, 'utf-8');
  replaceTags(data);
};

const replaceTags = async (data) => {
  if(data.indexOf('{{') !== -1) {
    const tagStart = data.indexOf('{{');
    const tagEnd = data.indexOf('}}');
    const pathFile = path.join(pathComponents, `${data.slice(tagStart+2, tagEnd)}.html`);
    fsSt.access(pathFile, fsSt.constants.F_OK, (err) => {
      if (err) {
        console.log(`Компонент ${data.slice(tagStart+2, tagEnd)}.html отсутствует!!! Сборка прервана!!!`);
        process.exit();
      }
    });
    const dataComponent = await fs.readFile(pathFile, 'utf-8');
    data = data.replace(data.slice(tagStart-4, tagEnd+2), dataComponent);
    replaceTags(data);
  } else {
    await fs.writeFile(path.join(pathDist, 'index.html'), data, 'utf-8');
  }
};

const createBundleCSS = async (src, dist) => {
  const files = await fs.readdir(src, {withFileTypes: true});
  const pathStyleFiles = files.filter(file => {
    if (file.isFile() && path.extname(path.join(src, file.name)) === '.css') return true;
  });

  pathStyleFiles.forEach((pathStyleFile) => {
    const pathFileStyle = path.join(src, pathStyleFile.name);
    const dataStyleFile = fs.readFile(pathFileStyle, 'utf-8');
    dataStyleFile.then(data => fs.appendFile(dist, data));
  });
};

const copyDir = async (src, dist) => {
  await fs.mkdir(dist, {recursive: true});
  const files = await fs.readdir(src, {withFileTypes: true});
  files.forEach((file) => {
    if (file.isFile()) {
      fs.copyFile(path.join(src, file.name), path.join(dist, file.name));
    } else if (file.isDirectory()) {
      copyDir(path.join(src, file.name), path.join(dist, file.name));
    }
  });
};

(async () => {
  await fs.rm(pathDist, {recursive: true, force: true});
  await fs.mkdir(pathDist, {recursive: true});
  await createHTML();
  await createBundleCSS(pathStyles, path.join(pathDist, 'style.css'));
  await copyDir(path.join(__dirname, 'assets'), path.join(pathDist, 'assets'));
  console.log('completed!');
})();
