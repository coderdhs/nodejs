#!/usr/bin/env node
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.clear();

const answerCallback = answer => {
  if (answer === "y") {
    console.log("ok");
    rl.close();
  } else if (answer === "n") {
    console.log("why?");
    rl.close();
  } else {
    console.clear();
    console.log("y or n");
    rl.question("are you ok? (y/n)", answerCallback);
  }
};

rl.question("are you ok? (y/n)", answerCallback);
