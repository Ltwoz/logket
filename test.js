const { Logger, LogConfig } = require("./index");

const logger = Logger.with_config(LogConfig.from_file("./config.json"));

logger.debug("Hello debug");
logger.info("Hello info");
logger.warn("Hello warning");
logger.error("Hello error");
logger.critical("Hello critical");
