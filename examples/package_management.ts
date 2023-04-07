import { CliBuilder, Command } from "commandzen";

const cli = CliBuilder.create({
  name: "pkgman",
  description: "Package management CLI tool",
});

cli
  .addCommand(
    Command.create({
      name: "install",
      description: "Install a package",
      aliases: ["i"],
    })
      .addOption({
        flag: "-p, --package <package>",
        description: "The package to install",
      })
      .addOption({
        flag: "-v, --version [version]",
        description: "The version of the package to install",
      })
      .registerAction<{ package: string; version?: string }>(
        async ({ package, version }) => {
          // Implement the package installation operation here.
        }
      )
  )
  .addCommand(
    Command.create({
      name: "update",
      description: "Update a package",
      aliases: ["up"],
    })
      .addOption({
        flag: "-p, --package <package>",
        description: "The package to update",
      })
      .addOption({
        flag: "-v, --version [version]",
        description: "The version to update the package to",
      })
      .registerAction<{ package: string; version?: string }>(
        async ({ package, version }) => {
          // Implement the package update operation here.
        }
      )
  )
  .addCommand(
    Command.create({
      name: "remove",
      description: "Remove a package",
      aliases: ["rm"],
    })
      .addOption({
        flag: "-p, --package <package>",
        description: "The package to remove",
      })
      .registerAction<{ package: string }>(async ({ package }) => {
        // Implement the package removal operation here.
      })
  );

cli.parse();
