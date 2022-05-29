'use strict';

const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(pathToFile);

stream.pipe(process.stdout);
