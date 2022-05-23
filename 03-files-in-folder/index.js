'use strict';

const fs = require('fs/promises');
const path = require('path');

(async () => {
  const pathFiles = path.join(__dirname, 'secret-folder');
  const files = await fs.readdir(pathFiles, {withFileTypes: true});

  files.forEach(file => {
    if (file.isFile()) {
      const pathFile = path.join(pathFiles, file.name);
      const nameFile = path.parse(pathFile);
      const statFile = fs.stat(pathFile);
      statFile.then((data) => console.log(`${nameFile.name} - ${nameFile.ext.slice(1)} - ${data.size}b`));
    }
  });
})();
