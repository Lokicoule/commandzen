export * from "./CliBuilder";
export * from "./command/Command";
export * from "./option/Option";

import { Argument } from "./argument";
import { CliBuilder } from "./CliBuilder";
import { Command } from "./command/Command";
import { Option } from "./option/Option";

interface TscOptions {
  project?: string;
}

interface LogOptions {
  message?: string;
}

// Initialize the CLI
const cli = CliBuilder.create({
  name: "tsc",
  description: "TypeScript Compiler",
});
// Add 'init' command
const initCommand = Command.create({
  name: "init",
  description:
    "Initializes a TypeScript project and creates a tsconfig.json file",
}).registerAction(({ args, options }) => {
  console.log("Initializing TypeScript project...");
  // Your implementation here
});

cli.addCommand(initCommand);

// Add 'build' command
const buildCommand = Command.create({
  name: "build",
  description: "Compiles TypeScript files according to the tsconfig.json",
})
  .addOption(
    Option.create({
      flag: "-p, --project <path>",
      description: "Specify the path to the tsconfig.json file",
    })
  )
  .addArgument(
    Argument.create({ flag: "<test>", description: "test argument" })
  )
  .addArgument(
    Argument.create({
      flag: "<test2>",
      description: "test argument 2",
      defaultValue: "test",
    })
  )
  .registerAction<TscOptions>(({ args, options }) => {
    console.log("Building TypeScript project...");
    console.log("Options:", options.project);
    console.log("Args:", args);
    // Your implementation here
  });

cli.addCommand(buildCommand);

// Add 'watch' command
const watchCommand = Command.create({
  name: "watch",
  description: "Watches for file changes and recompiles",
})
  .addOption(
    Option.create({
      flag: "-p, --project <path>",
      description: "Specify the path to the tsconfig.json file",
    })
  )
  .registerAction<TscOptions>(({ args, options }) => {
    console.log("Watching TypeScript project...");
    console.log("Options:", options.project);
    // Your implementation here
  });

const logCommand = Command.create({
  name: "log",
  description: "Logs a message",
})
  .addOption(
    Option.create({
      flag: "-m, --message <message>",
      description: "The message to log",
    })
  )
  .registerAction<LogOptions>(({ args, options }) => {
    console.log("Logging message...");
    console.log("Options:", options.message);
    // Your implementation here
  });

watchCommand.addSubcommand(logCommand);

cli.addCommand(watchCommand);

// Parse and run the CLI
cli.parse();
