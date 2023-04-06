import { CliBuilder, Command, Option } from "commandzen";

const typescriptCli = new CliBuilder({
  name: "typescript",
  description: "TypeScript CLI",
});

const initCommand = new Command({
  name: "init",
  description: "Initialize a TypeScript project",
  action: () => {
    console.log("Initializing TypeScript project...");
  },
});

typescriptCli.addCommand(initCommand);

const buildCommand = new Command({
  name: "build",
  description: "Build a TypeScript project",
  action: () => {
    console.log("Building TypeScript project...");
  },
});

typescriptCli.addCommand(buildCommand);

const testCommand = new Command({
  name: "test",
  description: "Run tests for a TypeScript project",
});

const testUnitCommand = new Command({
  name: "unit",
  description: "Run unit tests",
  action: () => {
    console.log("Running unit tests...");
  },
});

testCommand.addSubcommand(testUnitCommand);

const testIntegrationCommand = new Command({
  name: "integration",
  description: "Run integration tests",
  action: () => {
    console.log("Running integration tests...");
  },
});

testCommand.addSubcommand(testIntegrationCommand);

typescriptCli.addCommand(testCommand);

typescriptCli.parse();
