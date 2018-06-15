#!/usr/bin/env node
const commander = require("commander");
const Path = require("path");
const fs = require("fs");
const cp = require("child_process");
const copy = require("recursive-copy");
var CLI_MODULE_PATH = function() {
  return Path.resolve(process.cwd(), "node_modules", "react-native", "cli.js");
};
var cliPath = CLI_MODULE_PATH();
if (fs.existsSync(cliPath)) {
  const cli = require(cliPath);
  if (cli) {
    cli.run();
  }
} else {
  commander
    .command("init <projectname>")
    .description("Start a new react-reality application")
    .option(
      "-t --template <template>",
      "Additional React Reality Template to apply (core templates include compass, holokit)"
    )
    .action(async (projectname, opts) => {
      const originalPath = process.cwd();

      //Look for react-native in this subdirectory
      const REACT_NATIVE_PACKAGE_JSON_PATH = Path.resolve(
        process.cwd(),
        "node_modules",
        "react-native",
        "package.json"
      );
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
      //Initialize the react-reality base project in the directory in question
      const args = [
        "init",
        projectname,
        "--template",
        "https://github.com/rhdeck/react-native-template-react-reality"
      ];
      cp.spawnSync(command, args, { stdio: "inherit" });
      const projectPath = Path.join(originalPath, projectname);

      if (opts.template) {
        var templateName;
        //See if a template is spcified
        const template = opts.template;
        //See if template has a path
        var fullTemplate = "";
        if (template.indexOf("//") > -1) {
          //This is a url, let it through
          fullTemplate = template;
          templateName = template.substr(template.lastIndexOf("/") + 1);
        } else if (template.indexOf("/") === 0) {
          //This is a filepath
          fullTemplate = "file://" + template;
          templateName = template.substr(template.lastIndexOf("/") + 1);
        } else if (template.indexOf("/") > 0) {
          if (template.indexOf("@") === 0) {
            //This is a namespaced package - let it through
            templateName = template;
          } else {
            //This is a qualified github name
            fullTemplate = "https://github.com/" + template;
            templateName = template.substr(template.lastIndexOf("/") + 1);
          }
        } else {
          templateName = "react-reality-template-" + template;
          // fullTemplate = "file:///Users/ray/Documents/" + templateName;
          "https://github.com/rhdeck/" + templateName;
          // templateName
        }
        if (fullTemplate.length && templateName.length) {
          process.chdir(projectPath);
          cp.spawnSync("yarn", ["add", fullTemplate, "--ignore-scripts"], {
            stdio: "inherit"
          });
          var doLink = false;
          const templateDir = Path.join(
            projectPath,
            "node_modules",
            templateName
          );
          if (fs.existsSync(templateDir)) {
            console.log("I will copy from", templateDir, "to ", projectPath);
            await copy(templateDir, projectPath, {
              filter: ["**/*", "!package.json", "!dependencies.json"],
              dot: false,
              overwrite: true
            });
            var dpath = Path.join(templateDir, "dependencies.json");

            if (fs.existsSync(dpath)) {
              const deps = require(dpath);
              Object.keys(deps).forEach(key => {
                const v = deps[key];
                const arg = key + "@" + v;
                cp.spawnSync("yarn", ["add", arg], { stdio: "inherit" });
                doLink = true;
              });
            }
            if (doLink) {
              cp.spawnSync(command, ["linknopod"], { stdio: "inherit" });
            }
            cp.spawnSync("yarn", ["remove", templateName]);
          } else {
            console.log(
              "Was not able to install template",
              template,
              " from url ",
              fullTemplate,
              "to node_modules/" + templateName
            );
            console.log(
              "Continuing with installing",
              projectname,
              "as a base template"
            );
          }
        }
      }
      process.chdir(projectPath);
      cp.spawnSync(command, ["setdevteam"], { stdio: "inherit" });
      console.log("\n\n\n");
      console.log("React-reality project " + projectname + " created");
      console.log("To get coding:");
      console.log("cd " + projectname);
      console.log("react-reality run-ios --device");
      console.log("code .");
    });
  commander.parse(process.argv);
  if (!process.argv[2]) console.log('Try "react-reality --help" for help');
}
