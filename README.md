# check-deps-sync

## Description

Tool for monorepos, fails if packages use different versions of dependencies

## Usage

```sh
yarn global add check-deps-sync
check-deps-sync path/to/your/packages/root
```

## Programmatic usage
```js
const checkDepsSync = require("check-deps-sync");

// These are the defaults
const options = {
  printAll: true, // if falsy, will throw on the first mismatch
  type: "yarn-workspaces"
};

checkDepsSync("path/to/your/packages/root", options);
```

`options` and it's members are optional

## Notes

Currently it checks for strict string equality on versions, I'll probably add semver ranges support in the future

Only supports `yarn workspaces` for now but support for `lerna` and a recursive find strategy are planned
