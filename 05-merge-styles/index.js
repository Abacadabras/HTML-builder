'use strict';

const path = require('path');
const fs = require('fs/promises');

const pathSource = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

const createBundle = async (src, dist) => {
  await fs.rm(dist, {force: true});
  const files = await fs.readdir(src, {withFileTypes: true});
  const pathStyleFiles = files.filter(file => {
    if (file.isFile() && path.extname(path.join(src, file.name)) === '.css') return true;
  });

  pathStyleFiles.forEach((pathStyleFile) => {
    const pathFileStyle = path.join(src, pathStyleFile.name);
    const dataStyleFile = fs.readFile(pathFileStyle, 'utf-8');
    dataStyleFile.then(data => fs.appendFile(dist, data));
  });
  console.log('completed!');
};

createBundle(pathSource, pathBundle);
