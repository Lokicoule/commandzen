# CommandZen

[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/commandzen/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/Lokicoule/commandzen?branch=main)

The CommandZen Library is a TypeScript library designed to help you create command-line interface (CLI) applications with ease. With a clean and intuitive API, you can register commands, options, and arguments, handle input validation, and execute actions based on user input.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Importing the Library](#importing-the-library)
  - [Creating a CLI Application](#creating-a-cli-application)
- [API](#api)
  - [CLI](#cli)
  - [Command](#command)
  - [Option](#option)
  - [Argument](#argument)
- [Example](#example)
- [Advanced Usage](#advanced-usage)
  - [Default Options](#default-options)
  - [Default Command](#default-command)
  - [Subcommands](#subcommands)
  - [Customizing Help Messages](#customizing-help-messages)
- [Contribution](#contribution)
- [License](#license)

## Features

- Simple and intuitive API for registering commands and options
- Easy handling of arguments and input validation
- Support for command aliases
- Help messages generation for commands and options

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

### Importing the library

```ts
import { CLI, Command, Option, Argument } from "commandzen";
```

### Creating a CLI application

1. Create a new CLI instance:

```ts
const cli = new CLI();
```

2. Register commands and options:

```ts
const myCommand = Command.create({
  name: "my-command",
  description: "A sample command",
  aliases: ["mc"],
  options: [
    Option.create({
      shortName: "-f",
      longName: "--file",
      description: "Path to the input file",
      argument: Argument.create({
        type: "string",
        required: true,
      }),
    }),
  ],
  action: (options) => {
    console.log("Executing my-command with options:", options);
  },
});

cli.registerCommand(myCommand);
```

3. Parse the command-line arguments:

```ts
cli.parse(process.argv.slice(2));
```

4. If you want to display help for the commands:

```ts
cli.displayHelp();
```

## API

### CLI

- `registerDefaultOptions(options: Option[])`: Register default options for the CLI.
- `registerCommand(command: Command)`: Register a command.
- `registerDefaultCommand(command: Command)`: Register a default command to be executed when no command is provided.
- `parse(args: string[])`: Parse command-line arguments and execute the appropriate command.
- `displayHelp()`: Display help messages for all registered commands.
- `getHelp()`: Get help messages for all registered commands as a string.

### Command

- `create(properties: CommandProperties)`: Create a new command.
- `addOption(option: Option)`: Add an option to the command.
- `execute(options: ParsedOptions)`: Execute the command's action with the provided options.
- `getHelp()`: Get the help message for the command as a string.

### Option

- `create(properties: OptionProperties)`: Create a new option.
- `getKey()`: Get the key for the option, which is the long name without the -- prefix, or the short name without the - prefix if no long name is provided.

### Argument

- `create(properties: ArgumentProperties)`: Create a new argument.

## Example

```ts
import { CLI, Command, Option, Argument } from "commandzen";

const cli = new CLI();

// Default command
const defaultCommand = Command.create({
  name: "default",
  description:
    "This is the default command that runs when no command is provided",
  options: [
    Option.create({
      shortName: "-n",
      longName: "--name",
      description: "Your name",
      argument: Argument.create({
        type: "string",
        required: true,
      }),
    }),
  ],
  action: (options) => {
    console.log(`Hello, ${options.name}! This is the default command.`);
  },
});

// Register default command
cli.registerDefaultCommand(defaultCommand);

// Custom command
const customCommand = Command.create({
  name: "custom",
  description: "This is a custom command",
  options: [
    Option.create({
      shortName: "-t",
      longName: "--text",
      description: "Custom text",
      argument: Argument.create({
        type: "string",
        required: true,
      }),
    }),
  ],
  action: (options) => {
    console.log(`Custom command with text: ${options.text}`);
  },
});

// Register custom command
cli.registerCommand(customCommand);

// Parse command-line arguments
cli.parse(process.argv.slice(2));
```

## Advanced Usage

This section provides examples and guidance on more advanced use cases of the CommandZen library.

### Default options

1. Configuring Default Options through the CLI Constructor

When creating a new instance of the CLI class, you can provide an optional configuration object that allows you to set default options. This approach is useful when you have a set of default options that you know will be applied to all commands in your application. Here's an example:

```ts
import { CLI, Option, Argument } from "commandzen";

const defaultOptions = [
  Option.create({
    shortName: "-v",
    longName: "--verbose",
    description: "Enable verbose output",
    argument: Argument.create({
      type: "boolean",
      required: false,
      defaultValue: false,
    }),
  }),
];

const cli = new CLI({ defaultOptions });
```

2. Configuring Default Options Using the `registerDefaultOptions` Method
   Alternatively, you can use the `registerDefaultOptions` method to set default options after creating the CLI instance. This approach is helpful when the default options depend on external factors or need to be determined dynamically.

```ts
import { CLI, Option, Argument } from "commandzen";

const cli = new CLI();

const defaultOptions = [
  Option.create({
    shortName: "-v",
    longName: "--verbose",
    description: "Enable verbose output",
    argument: Argument.create({
      type: "boolean",
      required: false,
      defaultValue: false,
    }),
  }),
];

cli.registerDefaultOptions(defaultOptions);
```

3. When to Use Each Approach

You might prefer to use the CLI constructor to set default options when you have a predefined set of options that apply to all commands in your application. This approach keeps the configuration in one place and makes the code more readable.

On the other hand, using the registerDefaultOptions method can be beneficial when you need to set default options based on external factors, such as user input, environment variables, or configuration files. This approach allows you to modify the default options at runtime and provides greater flexibility.

### Default command

The registerDefaultCommand(command: Command) method allows you to replace the built-in default command with a custom one. The default command is executed when no specific command is provided by the user. This is useful when you want to provide a default behavior for your CLI application without requiring the user to specify a command.

```ts
const defaultCommand = Command.create({
  name: "default",
  description: "This is the custom default command",
  options: [
    Option.create({
      shortName: "-n",
      longName: "--name",
      description: "Your name",
      argument: Argument.create({
        type: "string",
        required: true,
      }),
    }),
  ],
  action: (options) => {
    console.log(`Hello, ${options.name}! This is the custom default command.`);
  },
});

cli.registerDefaultCommand(defaultCommand);
```

### Subcommands

CommandZen allows you to create hierarchical commands or subcommands. To achieve this, create a command and register subcommands within the parent command's action.

```ts
import { CLI, Command, Option, Argument } from "commandzen";

const cli = new CLI();

const parentCommand = Command.create({
  name: "parent",
  description: "This is a parent command with subcommands",
  action: (options) => {
    console.log("Executing parent command with options:", options);
  },
});

const subCommandA = Command.create({
  name: "subA",
  description: "This is a subcommand A",
  action: (options) => {
    console.log("Executing subcommand A with options:", options);
  },
});

const subCommandB = Command.create({
  name: "subB",
  description: "This is a subcommand B",
  action: (options) => {
    console.log("Executing subcommand B with options:", options);
  },
});

parentCommand.addOption(
  Option.create({ shortName: "-s", longName: "--subcommand" })
);
cli.registerCommand(parentCommand);

cli.parse(process.argv.slice(2));

const subcommand = process.argv[3];
if (subcommand === "subA") {
  subCommandA.execute(cli.options);
} else if (subcommand === "subB") {
  subCommandB.execute(cli.options);
}
```

### Customizing Help Messages

You can customize the help messages by extending the Command class and overriding the getHelp() method.

```ts
class CustomCommand extends Command {
  getHelp(): string {
    // Customize the help message as needed.
    return `Custom help message for ${this.name}\n`;
  }
}

const customCommand = CustomCommand.create({
  name: "custom",
  description: "This is a custom command with a custom help message",
  action: (options) => {
    console.log("Executing custom command with options:", options);
  },
});

cli.registerCommand(customCommand);
```

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
