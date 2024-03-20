const { LogConfig } = require("./config/log-config");
const { check_and_create_dir, get_caller_info } = require("./utils/helpers");
const { LogLevel } = require("./utils/log-level");
const fs = require("node:fs/promises");
const path = require("node:path");

class Logger {
  /**
   * @type {LogConfig}
   */
  #config;

  /**
   * @type {fs.FileHandle}
   */
  #log_file_handle;

  async init() {
    const log_dir_path = check_and_create_dir("logs");

    const file_name =
      this.#config.file_prefix +
      new Date().toISOString().replace(/[\.:]+/g, "-") +
      ".log";

    this.#log_file_handle = await fs.open(path.join(log_dir_path, file_name), "a+");
  }

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

  /**
   * Checks if the current log file needs to be rolled over.
   */
  async #rolling_check() {
    const { size_threshold, time_threshold } = this.#config.rolling_config;

    const { size, birthtimeMs } = await this.#log_file_handle.stat();
    const currentTime = new Date().getTime();

    if (size >= size_threshold || (currentTime - birthtimeMs >= time_threshold * 1000)) {
      await this.#log_file_handle.close();
      await this.init();
    }
  }

  async #write_to_handle(message, log_level) {
    const date_iso = new Date().toISOString();
    const log_level_string = LogLevel.to_string(log_level);

    const log_message = `[${date_iso}] [${log_level_string}]: ${get_caller_info()} ${message}\n`;
    await this.#log_file_handle.write(log_message);
  }

  async #log(message, log_level) {
    if (log_level < this.#config.level || !this.#log_file_handle.fd) {
      return;
    }

    await this.#write_to_handle(message, log_level);
    
    await this.#rolling_check();
  }

  debug(message) {
    this.#log(message, LogLevel.Debug);
  }

  info(message) {
    this.#log(message, LogLevel.Info);
  }

  warn(message) {
    this.#log(message, LogLevel.Warn);
  }

  error(message) {
    this.#log(message, LogLevel.Error);
  }

  critical(message) {
    this.#log(message, LogLevel.Critical);
  }
}

module.exports = { Logger };
