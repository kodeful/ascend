// import basicAuth from 'express-basic-auth';
import monitor from 'express-status-monitor';
import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';

import { env } from '../env';

export const monitorLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined,
) => {
  if (settings && env.monitor.enabled) {
    const expressApp = settings.getData('express_app');

    expressApp.use(monitor());
    expressApp.get(env.monitor.route, monitor().pageRoute);
  }
};
