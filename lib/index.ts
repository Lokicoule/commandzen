import { CliBuilder, Command, Option } from "./CliBuilder";

const cli = new CliBuilder();

const subcommand = new Command("subcommand", "A subcommand example")
  .addOption(new Option("-s, --sub-option", "A subcommand option", true))
  .addOption(
    new Option("-a, --optional-option [argument]", "Another subcommand option")
  )
  .addOption(
    new Option(
      "-r, --required-option <path>",
      "A required subcommand option",
      true
    )
  );
const command = cli
  .command("command", "A command example")
  .addOption(new Option("-o, --option", "An option example", true))
  .addCommand(subcommand);

cli.parse(process.argv.slice(2));
