import { CliBuilder, Command, Option } from "commandzen";

interface TscOptions {
  project?: string;
}

// Initialize the CLI
const cli = new CliBuilder({
  name: "tsc",
  description: "TypeScript Compiler",
});

// Add 'init' command
const initCommand = new Command({
  name: "init",
  description:
    "Initializes a TypeScript project and creates a tsconfig.json file",
}).registerAction(({ args, options }) => {
  console.log("Initializing TypeScript project...");
  // Your implementation here
});

cli.addCommand(initCommand);

// Add 'build' command
const buildCommand = new Command({
  name: "build",
  description: "Compiles TypeScript files according to the tsconfig.json",
})
  .addOption(
    new Option({
      flag: "-p, --project <path>",
      description: "Specify the path to the tsconfig.json file",
    })
  )
  .registerAction<TscOptions>(({ args, options }) => {
    console.log("Building TypeScript project...");
    console.log("Options:", options.project);
    // Your implementation here
  });

cli.addCommand(buildCommand);

// Add 'watch' command
const watchCommand = new Command({
  name: "watch",
  description: "Watches for file changes and recompiles",
})
  .addOption(
    new Option({
      flag: "-p, --project <path>",
      description: "Specify the path to the tsconfig.json file",
    })
  )
  .registerAction<TscOptions>(({ args, options }) => {
    console.log("Watching TypeScript project...");
    console.log("Options:", options.project);
    // Your implementation here
  });

cli.addCommand(watchCommand);

// Parse and run the CLI
cli.parse();
