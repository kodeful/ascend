import 'reflect-metadata';
import { bootstrapMicroframework } from 'microframework-w3tec';

import { env } from 'env';
import { cronLoader } from 'loaders/cron.loader';
import { eventDispatchLoader } from 'loaders/event-dispatch.loader';
import { expressLoader } from 'loaders/express.loader';
import { homeLoader } from 'loaders/home.loader';
import { iocLoader } from 'loaders/ioc.loader';
import { mongooseLoader } from 'loaders/mongoose.loader';
import { monitorLoader } from 'loaders/monitor.loader';
import { publicLoader } from 'loaders/public.loader';
import { serverLoader, serverStartLoader } from 'loaders/server.loader';
import { socketLoader } from 'loaders/socket.loader';
import { swaggerLoader } from 'loaders/swagger.loader';
import { winstonLoader } from 'loaders/winston.loader';
import { banner } from 'utils/banner';
import { Logger } from 'utils/logger';

const log = new Logger(__filename);
bootstrapMicroframework({
  /**
   * Loader is a place where you can configure all your modules during microframework
   * bootstrap process. All loaders are executed one by one in a sequential order.
   */
  loaders: [
    serverLoader,
    winstonLoader,
    iocLoader,
    eventDispatchLoader,
    mongooseLoader,
    expressLoader,
    socketLoader,
    cronLoader,
    swaggerLoader,
    monitorLoader,
    homeLoader,
    publicLoader,
    serverStartLoader,
  ],
})
  .then(async (framework) => {
    banner(log);
    process.on('SIGINT', async () => {
      try {
        await framework.shutdown();
        process.exit(0);
      } catch (err) {
        process.exit(1);
      }
    });

    // Runner Commands
    switch (env.node) {
      case 'local':
        // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-var-requires
        const { runner } = require('runner');
        runner();
        break;
      case 'development':
      case 'production':
        // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-var-requires
        const { start } = require('./utils/start');
        await start();
        break;
    }
  })
  .catch((error) => log.error('Application crashed: ' + error));
