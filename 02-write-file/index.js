'use strict';

const fs = require('fs');
const path = require('path');

const fileName = path.join(__dirname, 'text.txt');

const { stdin, stdout } = process;
const stopText = 'exit';
const enterText = 'Enter text: \n';
const byeText = 'Exit script!!!';

stdout.write(enterText);

stdin.on('data', text => {
  const textString = text.toString().trim();
  if (textString === stopText) process.exit();
  fs.appendFile(fileName, text, err => {if (err) throw err;});
});

process.on('exit', () => stdout.write(byeText));
process.on('SIGINT', () => process.exit());
