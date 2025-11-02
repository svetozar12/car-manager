import { createLogger, format, transports } from 'winston';
import { Envs } from './env';

// TODO Maybe make this a package
export const logger = createLogger({
  level: Envs.LOG_LEVEL,
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});
