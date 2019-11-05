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
}
