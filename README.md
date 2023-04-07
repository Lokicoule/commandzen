# CommandZen

The CommandZen Library is a TypeScript library designed to help to create command-line interface (CLI) applications with ease. With a clean and intuitive API, you can register commands, options and execute actions based on user input.

[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/commandzen/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/Lokicoule/commandzen?branch=main)

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [CliBuilder](#clibuilder)
  - [Command](#command)
  - [Option](#option)
- [Contribution](#contribution)
- [License](#license)

## Features

- Simple and intuitive API for registering commands/subcommands and options
- Automatic help generation for commands and subcommands
- Supports command aliases

## Requirements

To use **_CommandZen_** library, ensure you have the following requirements in your environment:

- Node.js: _CommandZen_ is a Node.js library. It's recommended to use the latest LTS version of Node.js, which can be downloaded from the [official Node.js website](https://nodejs.org/).

- Module support: _CommandZen_ provides both **_CommonJS_** and **_ECMAScript module (ESM)_** builds. Make sure your project is set up to work with either the _"dist/cjs/index.js"_ (**_CommonJS_**) or _"dist/esm/index.js"_ (**_ESM_**) files, depending on your preferred module system.

- TypeScript: _CommandZen_ includes TypeScript type definitions in the _"dist/types/index.d.ts"_ file. If you are using TypeScript in your project, make sure you have the necessary tooling and configuration to work with the provided type definitions.

To install and use **_CommandZen_**, follow the installation and usage instructions provided in the [Installation](#installation) and [Usage](#usage) sections of this README.

## Installation

You can install the CLI Library using NPM:

```sh
npm install commandzen
```

## Usage

To use CommandZen, you need to define commands and options for your CLI. You can do this using the Command and Option classes provided by the library.

```ts
import { CliBuilder, Command, Option } from "commandzen";

// Create a new CLI instance
const cli = CliBuilder.create({
  name: "mycli",
  description: "My CLI tool",
});

// Add 'greet' command with options and action
cli
  .addCommand(
    Command.create({
      name: "greet",
      description: "Greet the user",
      aliases: ["hello"],
    })
      .addOption(
        {
          flag: "-f, --first-name <name>",
          description: "Provide a name to greet",
        },
        {
          flag: "-l, --last-name <lastname>",
          description: "Provide a lastname to greet",
        }
      )
      .registerAction<{ firstName: string; lastName: string }>(
        ({ firstName, lastName }) => {
          console.log(`Hello, ${firstName} ${lastName}!`);
        }
      )
  )
  // Add a global option to the root command
  .addOption({
    flag: "-v, --version <version>",
    description: "Provide a version to the root command",
  })
  // Register action for the global option
  .registerAction<{ version: string }>(({ version }) => {
    console.log(`Version: ${version}`);
  });

// Parse the CLI input
cli.parse();
```

## API

The CommandZen API consists of three classes that you can use to build your CLI:

### CliBuilder

The CliBuilder class is used to build a CLI (Command Line Interface) application. It provides methods to create, manage, and execute commands and options.

#### Public Methods

- `create(props: CommandProps): CliBuilder`

This static method creates a new CliBuilder instance with the specified [command properties](#commandprops-type).

```ts
const cli = CliBuilder.create({
  name: "my-cli",
  description: "A command line application",
});
```

- `addCommand(command: Command): CliBuilder`

This method adds a [command](#command) to the CLI, with an automatically added help option.

```ts
const myCommand = Command.create({
  name: "my-command",
  description: "Performs a specific task",
});

cli.addCommand(myCommand);
```

- `addOption(props: OptionProps): CliBuilder`

This method adds an option to the default command.

```ts
cli.addOption({
  flag: "-v, --verbose",
  description: "Enable verbose output",
});
```

- `setDefaultCommand(command: Command): CliBuilder`

This method overrides the default [command](#command) with a specified command.

```ts
const customDefaultCommand = Command.create({
  name: "custom-default",
  description: "Custom default command",
});

cli.setDefaultCommand(customDefaultCommand);
```

- `addGlobalOption(props: OptionProps): CliBuilder`
  This method recursively adds an option to all commands

```ts
cli.addGlobalOption({
  {
    flag: "-v, --verbose",
    description: "Verbosity",
  }
})
```

- `parse(): void`

This method parses the arguments and executes the appropriate command.

```ts
cli.parse();
```

### Command

The Command class represents a single command or subcommand in a CLI application. It contains options and an action to be executed when the command is called.

#### 1. Public Methods

- `create(props: CommandProps): Command`

This static method creates a new Command instance with the specified [properties](#commandprops-type).

```ts
const myCommand = Command.create({
  name: "my-command",
  description: "Performs a specific task",
  // Optional
  aliases: ["mc", "m-c"],
  // Optional
  options: [
    Option.create({
      // Option 1
    }),
    Option.create({
      // Option 2
    }),
  ],
  // Optional
  subcommands: [
    Command.create({
      // Subcommand 1
    }),
    Command.create({
      // Subcommand 2
    }),
  ],
});
```

- `addSubcommand(command: Command): Command`

This method adds a subcommand to the current command.

```ts
const parentCommand = Command.create({
  name: "parent",
  description: "Parent command",
});

const childCommand = Command.create({
  name: "child",
  description: "Child command",
});

parentCommand.addSubcommand(childCommand);
```

- `addOption(...option: OptionProps[]): Command`

This method adds one or more [options](#optionprops-type) to the command.

```ts
const myCommand = Command.create({
  name: "my-command",
  description: "Performs a specific task",
}).addOption(
  {
    flag: "-p, --project <path>",
    description: "Specify the path to the tsconfig.json file",
  },
  {
    flag: "-i, --install",
    description: "Install something",
  }
);
```

- `addAlias(...aliases: string[]): Command`

This method adds one or more aliases to the command.

```ts
const myCommand = Command.create({
  name: "my-command",
  description: "Performs a specific task",
});

myCommand.addAlias("mc", "m-c");
```

- `registerAction<T>(callback: (props: T) => void): Command`

This method registers an action for the command by attaching a callback function to the command's event.

```ts
const myCommand = Command.create({
  name: "my-command",
  description: "Performs a specific task",
})
  .addOption({
    flag: "-p, --project <name>",
    description: "Specify the name of the project",
  })
  .registerAction<{ project: string }>(({ project }) => {
    console.log(`Project: ${project}`);
  });
```

- `findOption(flag: string): Option | undefined`

This method finds an option by its flag (short or long name).

- `findSubcommand(name: string): Command | undefined`

This method finds a subcommand by its name.

#### 2. CommandProps Type

The `CommandProps` type is used to define the properties of a `Command` object.

- `name` (string): The name of the command. This is the keyword that users will type to invoke the command in the CLI.
- `description`: A brief description of the command, which will be displayed in the help output.
- `aliases` (string[] | optional): An array of alternative names for the command. Users can use any of these aliases to invoke the command.
- `options` (Option[] | optional): An array of `Option` objects that define the options available for the command. Options can be flags or arguments that modify the behavior of the command.
- `subcommands` (Map<string, Command> | optional): A map of subcommands, with the subcommand name as the key and the `Command` object as the value. Subcommands are additional commands that can be invoked as a part of the parent command.

### Option

The `Option` class represents a command line option and is used to define options for commands in a CLI application. It provides methods to create and manage options, including parsing their flags and setting default values.

#### 1. Public Method

- `create(props: OptionProps): Option`

This static method creates a new Option instance with the specified [properties](#optionprops-type).

```ts
const verboseOption = Option.create({
  flag: "-v, --verbose",
  description: "Enable verbose output",
});
```

#### 2. OptionProps Type

The `OptionProps` type represents the properties of an option and includes the following properties:

- `flag` (string): A string representing the option's flag, such as -v, --verbose.
- `description` (string): A string describing the option's purpose.
- `defaultValue` (unknown | undefined): An optional default value for the option.

## Contribution

We welcome contributions from the community to help improve the CommandZen library! To contribute, please follow these steps:

1. Fork the repository: Click the "Fork" button at the top-right corner of the repository page on GitHub to create a copy of the repository under your GitHub account.

2. Clone the forked repository: Clone your forked repository to your local machine using the following command (replace your_username with your GitHub username):

```sh
git clone https://github.com/your_username/commandzen.git
```

3. Create a new branch: Navigate to the cloned repository directory and create a new branch for your changes:

```sh
cd commandzen
git checkout -b my-feature-branch
```

4. Install dependencies: Install the required dependencies for the project:

```sh
npm install
```

5. Make your changes: Make the desired changes to the code, add new features or fix bugs. Ensure that your changes follow the existing coding style and conventions.

6. Test your changes: Make sure to test your changes and ensure that all tests pass and code coverage is still at 100%:

```sh
npm test
```

## License

This project is licensed under the MIT License.
