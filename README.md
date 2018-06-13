# react-reality-cli

Command line interface for react-reality projects

# Installation

```bash
yarn global add react-reality-cli
```

or

```bash
npm i g react-reality-cli
```

# Usage

## init

Create a new react-reality project

```bash
react-reality init myproject
```

### Templates

Specify the react-reality template you want to use:

```bash
react-reality init myproject --template mytemplate
```

#### base

The core react-reality template, used unless a template is specified.

#### holokit

The react-reality template for a [HoloKit](https://holokit.io)-based stereoscopic application

#### URL

Any url specified with a file://, http:// or https:// scheme will reference a react-native template a that location.

#### npm scoped project

Any argument prefixed with a @ and containing a slash is assumed to be a scoped npm project, in the form @scope/project. Passes through to npm

#### GitHub repository

Any argument containing a slash (that does not start with the @) is assumed to refer to a github repository, and builds a https url to access it.

#### NPM projects

Any other string tries to build a URL from NPM with the prefix "react-reality-template-", like a react-native template would.

#### Note on building templates

Templates utilize the build system from react-native. They must contain:

1.  `package.json` used for identification only
2.  `dependencies.json` indicating dependencies that should be added to the project. (should include the react-reality package and react-native-swift at a minimum)
3.  Any other files you want copied into your package that would override the core react-native files. Usually `App.js` is defined here, since it is the center of the app experience.
