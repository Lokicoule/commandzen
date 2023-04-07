import { CliBuilder, Command } from "commandzen";

const cli = CliBuilder.create({
  name: "hreq",
  description: "HTTP request CLI tool",
});

cli.addCommand(
  Command.create({
    name: "request",
    description: "Send an HTTP request",
    aliases: ["req"],
  })
    .addOption({
      flag: "-u, --url <url>",
      description: "The URL to send the request to",
    })
    .addOption({
      flag: "-m, --method <method>",
      description: "The HTTP method to use (GET, POST, PUT, DELETE, etc.)",
    })
    .addOption({
      flag: "-H, --header <header>",
      description: "Add an HTTP header (can be used multiple times)",
    })
    .addOption({
      flag: "-d, --data [data]",
      description: "The data to send in the request body",
    })
    .registerAction<{
      url: string;
      method: string;
      header: string[];
      data?: string;
    }>(async ({ url, method, header, data }) => {
      // Implement the HTTP request operation here.
    })
);

cli.parse();
