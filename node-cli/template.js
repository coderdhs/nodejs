#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const readline = require("readline");

let rl;
let type = process.argv[2];
let name = process.argv[3];
let directory = process.argv[4] || ".";

const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta chart='utf-8' />
    <title>Template</title>
</head>
<body>
    <h1>hello</h1>
</body>
</html>`;

const routerTemplate = `const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) => {
    try {
        res.send('ok');
    }   catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;`;

const exist = dir => {
  try {
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (e) {
    return false;
  }
};

const mkdirp = dir => {
  const dirname = path
    .relative(".", path.normalize(dir))
    .split(path.sep)
    .filter(p => !!p);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};

const makeTemplate = () => {
  mkdirp(directory);
  if (type === "html") {
    const pathToFile = path.join(directory, `${name}.html`);
    if (exist(pathToFile)) {
      console.error("already exist");
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate); // 한번만 실행되는 경우에는 sync메서드 써도 됨.
      console.log(pathToFile, "complete");
    }
  } else if (type === "express-router") {
    const pathToFile = path.join(directory, `${name}.js`);
    if (exist(pathToFile)) {
      console.error("already exist");
    } else {
      fs.writeFileSync(pathToFile, routerTemplate); // 한번만 실행되는 경우에는 sync메서드 써도 됨.
      console.log(pathToFile, "complete");
    }
  } else {
    console.error("html or express-router");
  }
};

const dirAnswer = answer => {
    directory = (answer && answer.trim()) || '.';
    rl.close();
    makeTemplate();
}

const nameAnswer = answer => {
  if (!answer || !answer.trim()) {
    console.clear();
    console.log("input filename");
    return rl.question("what template?", nameAnswer);
  }
  name = answer;
  return rl.question("what directory?", dirAnswer);
};

const typeAnswer = answer => {
  if (answer !== "html" && answer !== "express-router") {
    console.clear();
    console.log("html or express-router");
    return rl.question("what template?", typeAnswer);
  }
  type = answer;
  return rl.question("file name?", nameAnswer);
};

const program = () => {
  if (!type || !name) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.clear();
    rl.question("what template?", typeAnswer);
  } else {
    makeTemplate();
  }
};
program();
