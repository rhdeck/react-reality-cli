# react-reality-cli

Command line interface for [react-reality](https://github.com/rhdeck/react-reality) projects

# Installation

```bash
yarn global add rhdeck/react-reality-cli
```

**or**

```bash
npm i g rhdeck/react-reality-cli
```

# Usage

## init

Create a new react-reality project

```bash
react-reality init myproject
```

or use the short alias:

```bash
rr init myproject
```

**Fun Fact** You can use `rr` as an alias for any of your `react-native` commands. `rr run-ios` helps, and is shorter!

## Templates

Specify the react-reality template you want to use for faster initialization:

```bash
react-reality init myproject --template <mytemplate>
```

or try the short version

```bash
rr init myproject -t <mytemplate>
```

### Pre-Built Templates

To help with learning react-reality, some basic apps are available as templates

#### holokit

Deploys a package designed for use with [HoloKit](https://holokit.io) heads-up stereoscopic display.

```bash
rr init myproject -t holokit
```

### URL

Any url specified with a file://, http:// or https:// scheme will reference a react-reality template a that location.

```bash
rr init myproject -t https://github.com/rhdeck/react-reality-template-holokit
```

#### npm scoped project

Any argument prefixed with a @ and containing a slash is assumed to be a scoped npm project, in the form @scope/project. Passes through to npm

```bash
rr init myproject -t @myscope/mytemplate
```

#### GitHub repository

Any argument containing a slash (that does not start with the @) is assumed to refer to a github repository, and builds a https url to access it.

```bash
rr init myproject -t rhdeck/react-reality-template-holokit
```

#### NPM projects

Any other string tries to build a URL from NPM with the prefix "react-reality-template-", like a react-native template would.

```bash
rr init myproject -t holokit
```

#### Note on building templates of your own

Templates parallel the build system from react-native. They must contain:

1.  `package.json` used for identification only. Should include a name and version.
2.  `dependencies.json` indicating dependencies that should be added to the project. (should include the react-reality package and react-native-swift at a minimum)
3.  Any other files you want copied into your package that would override the core react-native files. Usually `App.js` is defined here, since it is the center of the app experience.

**Note** Templates are installed by first adding then removing from your dependencies. So you will not find them in your project post-install.
