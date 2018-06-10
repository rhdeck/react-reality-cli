#!/usr/bin/env node
const commander = require("commander");
const Path = require("path");
const fs = require("fs");
const cp = require("child_process");
var CLI_MODULE_PATH = function() {
  return Path.resolve(process.cwd(), "node_modules", "react-native", "cli.js");
};
var cliPath = CLI_MODULE_PATH();
if (fs.existsSync(cliPath)) {
  const cli = require(cliPath);
  if (cli) {
    var options = require("minimist")(process.argv.slice(2));
    var commands = options._;
    cli.run();
    process.exit();
  }
}

commander
  .command("init <projectname>")
  .description("Start a new react-reality application")
  .option(
    "-t --template",
    "Template to apply (core templates include base, holokit)"
  )
  .action((projectname, opts) => {
    //Look for react-native in this subdirectory
    var REACT_NATIVE_PACKAGE_JSON_PATH = function() {
      return Path.resolve(
        process.cwd(),
        "node_modules",
        "react-native",
        "package.json"
      );
    };
    const template = opts.template || "base";
    //See if template has a path
    var fullTemplate = "";
    if (template.indexOf("//") > -1) {
      //This is a url, let it through
      fullTemplate = template;
    } else if (template.indexOf("/") === 0) {
      //This is a filepath
      fullTemplate = "file://" + template;
    } else if (template.indexOf("/") > 0) {
      if (template.indexOf("@") === 0) {
        //This is a namespaced package - let it through
      } else {
        //This is a qualified github name
        fullTemplate = "https://github.com/" + template;
      }
    } else {
      fullTemplate =
        "file:///Users/ray/Documents/react-reality-template-" + template;
      //        "https://github.com/rhdeck/react-reality-template-" + template;
    }
    if (fs.existsSync(REACT_NATIVE_PACKAGE_JSON_PATH)) {
      console.log(
        "Init cannot be run from inside a valid react-reality or react-native project"
      );
      return;
    }
    if (!projectname || !projectname.length) {
      console.log("Not a valid project name to create");
      return;
    }
    const command = Path.join(
      __dirname,
      "node_modules",
      ".bin",
      "react-native"
    );
    const args = ["init", projectname, "--template", fullTemplate];
    cp.spawnSync(command, args, { stdio: "inherit" });
    const originalPath = process.cwd();
    const projectPath = Path.join(originalPath, projectname);
    process.chdir(projectPath);
    cp.spawnSync(command, ["setdevteam"], { stdio: "inherit" });
    console.log("\n\n\n");
    console.log(
      "React-reality project " +
        projectname +
        " created from template" +
        template
    );
    console.log("To get coding:");
    console.log("cd " + projectname);
    console.log("react-reality run-ios --device");
    console.log("code .");
    process.exit();
  });
commander.parse(process.argv);
console.log('Try "react-reality --help" for help');
