import * as prefix from "loglevel-plugin-prefix";
import { Logger } from "loglevel";

export const addPrefix = (logger: Logger) => {
  prefix.reg(logger);
  logger.enableAll();
  prefix.apply(logger, {
    format(level, name, timestamp) {
      return `[${name}]: `;
    }
  });
};
