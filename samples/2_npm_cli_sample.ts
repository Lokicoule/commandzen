import { CliBuilder, Command, Option } from "commandzen";

interface InstallOptions {
  saveDev: boolean;
  global: boolean;
}

interface UninstallOptions {
  global: boolean;
}

// Initialize the CLI
const cli = new CliBuilder({
  name: "npm-cli",
  description: "A simplified NPM-like tool",
});

// Add 'install' command
const installCommand = new Command({
  name: "install",
  description: "Install a package",
})
  .addOption(
    new Option({
      flag: "-D, --save-dev",
      description: "Install as a development dependency",
      defaultValue: false,
    })
  )
  .addOption(
    new Option({
      flag: "-g, --global",
      description: "Install the package globally",
      defaultValue: false,
    })
  )
  .registerAction<InstallOptions>(({ args, options }) => {
    console.log("Installing package...");
    console.log("Options:", options);
    // Your implementation here
  });

cli.addCommand(installCommand);

// Add 'uninstall' command
const uninstallCommand = new Command({
  name: "uninstall",
  description: "Uninstall a package",
})
  .addOption(
    new Option({
      flag: "-g, --global",
      description: "Uninstall the package globally",
      defaultValue: false,
    })
  )
  .registerAction<UninstallOptions>(({ args, options }) => {
    console.log("Uninstalling package...");
    console.log("Options:", options);
    // Your implementation here
  });

cli.addCommand(uninstallCommand);

// Parse and run the CLI
cli.parse(process.argv);
