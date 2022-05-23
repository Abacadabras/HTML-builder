'use strict';

const path = require('path');
const fs = require('fs/promises');

const copyDir = async (src, dist) => {
  const srcPath = path.join(__dirname, src);
  const distPath = path.join(__dirname, dist);

  await fs.rm(distPath, {recursive: true, force: true});
  await fs.mkdir(distPath, {recursive: true});

  const files = await fs.readdir(srcPath, {withFileTypes: true});
  files.forEach((file) => {
    if (file.isFile()) {
      fs.copyFile(path.join(srcPath, file.name), path.join(distPath, file.name));
    } else if (file.isDirectory()) {
      copyDir(path.join(src, file.name), path.join(dist, file.name));
    }
  });
  console.log('completed!');
};

copyDir('files', 'files-copy');
