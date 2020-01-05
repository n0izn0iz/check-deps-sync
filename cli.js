#!/usr/bin/env node

const path = require("path");

const checkDepsSync = require(".");

const main = argv => {
  const target = path.resolve(argv[argv.length - 1]);
  try {
    checkDepsSync(target);
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    process.exitCode = 1;
  }
};

main(process.argv);
