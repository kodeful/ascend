import { registerController } from 'cron-typedi-decorators';
import { MicroframeworkLoader } from 'microframework-w3tec';

import { env } from 'env';

export const cronLoader: MicroframeworkLoader = () => {
  registerController(env.app.dirs.crons);
};
