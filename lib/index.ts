import { CliBuilder } from "./CliBuilder";
import { Command } from "./Command";
import { Option } from "./Option";

const cli = new CliBuilder({ name: "mycli", description: "My CLI tool" });

const command = Command.create({
  name: "command1",
  description: "Command 1 description",
});
command.addOption(
  Option.create({
    flag: "-f, --flag",
    description: "A flag option",
  })
);

command.addOption(
  Option.create({
    flag: "-r, --required <required>",
    description: "A required option",
    defaultValue: 42,
  })
);

command.addOption(
  Option.create({
    flag: "-o, --optional [optional]",
    description: "An optional option",
    defaultValue: 42,
  })
);

command.addOption(
  Option.create({
    flag: "-a, --array-test <array>",
    description: "An array option",
    defaultValue: [1, 2, 3],
  })
);

command.registerAction((argv) => {
  console.log("Running command1");
  console.log(argv);
});

const defaultCommand = Command.create({
  name: "default",
  description: "Default command",
});

defaultCommand.registerAction((argv) => {
  console.log("Running default command");
  console.log(argv);
});

cli.setDefaultCommand(defaultCommand);
cli.addCommand(command);

cli.parse();
