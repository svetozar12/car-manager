import app, { bootstrap } from './app';
import { Envs } from './utils/env';
import { logger } from './utils/logger';

const PORT = Envs.PORT;

(async () => {
  try {
    await bootstrap();
    app.listen(PORT, () => {
      logger.info(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
})();
