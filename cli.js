#!/usr/bin/env node

const commandLineUsage = require("command-line-usage");
const commandLineArgs = require("command-line-args");
const optionDefinitions = [
    {
      name: "help",
      alias: "h",
      type: Boolean,
      description: "Display this usage guide."
    },
    {
      name: "server",
      alias: "s",
      type: Boolean,
      description: "Run sample REST server"
    },
    {
      name: "report",
      alias: "r",
      type: String,
      description: "Desired Report to generate"
    }
  ];
const cmdLineOptions = commandLineArgs(optionDefinitions);
const usage = commandLineUsage([
  {
    header: "Standard Options",
    optionList: optionDefinitions,
  },
]);

if (cmdLineOptions.help) {
  console.log(usage);
} else if(cmdLineOptions.server) {
  const server = require('./server/server');
} else if(typeof cmdLineOptions.report !== "undefined") {
  try{
    const report = require(`./examples/${cmdLineOptions.report}`);
  } catch (e) {
    console.error(`Invalid Report Type: ${cmdLineOptions.report}`);
  }
} else {
  console.log(usage);
}
