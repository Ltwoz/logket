const path = require("node:path");
const { Logger, LogConfig } = require("./index");

async function main() {
  const logger = Logger.with_config(
    LogConfig.from_file(path.join(__dirname, "config.json"))
  );
  await logger.init();
  console.log("End of the file");
}

main();
