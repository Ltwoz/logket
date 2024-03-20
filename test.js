const { LogConfig } = require("./lib/config/log-config");
const { Logger } = require("./lib/logger");

async function init() {
    const logger = Logger.with_config(LogConfig.from_file("config.json"));
    await logger.init();
    return logger;
}

async function main() {
    const logger = await init();
    logger.error("Hello World!\n");
}

main();