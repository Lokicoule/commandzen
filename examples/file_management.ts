import { CliBuilder, Command } from "commandzen";

const cli = CliBuilder.create({
  name: "fops",
  description: "File operations CLI tool",
});

cli
  .addCommand(
    Command.create({
      name: "copy",
      description: "Copy a file",
      aliases: ["cp"],
    })
      .addOption({
        flag: "-s, --source <source>",
        description: "Source file path",
      })
      .addOption({
        flag: "-d, --destination <destination>",
        description: "Destination file path",
      })
      .registerAction<{ source: string; destination: string }>(
        async ({ source, destination }) => {
          // Implement the file copy operation here.
        }
      )
  )
  .addCommand(
    Command.create({
      name: "move",
      description: "Move a file",
      aliases: ["mv"],
    })
      .addOption({
        flag: "-s, --source <source>",
        description: "Source file path",
      })
      .addOption({
        flag: "-d, --destination <destination>",
        description: "Destination file path",
      })
      .registerAction<{ source: string; destination: string }>(
        async ({ source, destination }) => {
          // Implement the file move operation here.
        }
      )
  )
  .addCommand(
    Command.create({
      name: "remove",
      description: "Remove a file",
      aliases: ["rm"],
    })
      .addOption({
        flag: "-f, --file <file>",
        description: "File path to remove",
      })
      .registerAction<{ file: string }>(async ({ file }) => {
        // Implement the file remove operation here.
      })
  );

cli.parse();
