import app from './app';
import { Envs } from './utils/env';
import { logger } from './utils/logger';

const PORT = Envs.PORT;
app.listen(PORT, () => {
  logger.info(`Server is running on port http://localhost:${PORT}`);
});
