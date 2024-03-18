const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");

class Logger {
  /**
   * @type {LogConfig}
   */
  #config;

  /**
   * @returns {Logger} A new instance of Logger with default config.
   */
  static with_defaults() {
    return new Logger();
  }

  /**
   *
   * @param {LogConfig} log_config
   * @returns {Logger} A new instance of Logger with the given config.
   */
  static with_config(log_config) {
    return new Logger(log_config);
  }

  /**
   * @param {LogLevel} log_level
   */
  constructor(log_config) {
    log_config = log_config || LogConfig.with_defaults();
    LogConfig.assert(log_config);
    this.#config = log_config;
  }

  /**
   * @returns {LogLevel} The current log level.
   */
  get level() {
    return this.#config.level;
  }

  get file_prefix() {
    return this.#config.file_prefix;
  }

  get time_threshold() {
    return this.#config.rolling_config.time_threshold;
  }

  get size_threshold() {
    return this.#config.rolling_config.size_threshold;
  }

  debug(message) {
    console.log("Debug: %s", message);
  }

  info(message) {
    console.log("Info: %s", message);
  }

  warn(message) {
    console.log("Warn: %s", message);
  }

  error(message) {
    console.log("Error: %s", message);
  }

  critical(message) {
    console.log("Critical: %s", message);
  }
}

module.exports = { Logger };
