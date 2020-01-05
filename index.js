const {execSync} = require("child_process");
const path = require("path");
const fs = require("fs");

const YARN_WORKSPACES = "yarn-workspaces";

// TODO
const LERNA = "lerna";
const FIND = "find";
//

const SUPPORT = {
  [YARN_WORKSPACES]: {
    packagesLocations: target => {
      const infoStr = execSync("yarn workspaces --silent info", {
        cwd: target,
        stdio: ["ignore", "pipe", "ignore"]
      }).toString();
      const rawInfo = JSON.parse(infoStr);

      return [
        target,
        ...Object.keys(rawInfo).map(pkgName => {
          const relativePath = rawInfo[pkgName].location;
          return path.join(target, relativePath);
        })
      ];
    }
  }
};

const DEFAULT_TYPE = YARN_WORKSPACES;

const DEPENDENCIES_KEYS = [
  "dependencies",
  "devDependencies",
  "peerDependencies"
];

module.exports = (target, {type = DEFAULT_TYPE, printAll = true} = {}) => {
  if (!(type in SUPPORT)) throw new Error(`Unsupported type ${type}`);
  const packagesLocations = SUPPORT[type]
    .packagesLocations(target)
    .sort(String.localeCompare);

  const infos = packagesLocations.map(
    pkgPath =>
      JSON.parse(fs.readFileSync(path.join(pkgPath, "package.json"), "utf-8")),
    {}
  );

  // [name]: version
  const deps = {};
  let error = false;
  const onErr = printAll
    ? errStr => console.error(errStr)
    : errStr => {
        throw new Error(errStr);
      };
  infos.forEach(json => {
    DEPENDENCIES_KEYS.forEach(depType => {
      if (depType in json) {
        const someDeps = json[depType];
        Object.keys(someDeps).forEach(depName => {
          const depVersion = someDeps[depName];
          if (!(depName in deps)) {
            deps[depName] = depVersion;
          } else if (deps[depName] !== depVersion) {
            error = true;
            const errStr = `Dependency mismatch for ${depName}, expected ${
              deps[depName]
            } from previous packages but got ${depVersion} in ${
              json.name
            } ${depType}`;
            onErr(errStr);
          }
        });
      }
    });
  });
  throw new Error("Dependencies mismatch");
};
