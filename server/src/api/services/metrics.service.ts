import { Ref } from '@typegoose/typegoose';
import Container, { Service } from 'typedi';

import { Organisation } from 'api/models/organisation.model';
import { UserRole } from 'api/models/user.model';

import { UserService } from './user.service';

@Service()
export class MetricsService {
  async metricsEmails({
    organisationId,
    email,
  }: {
    organisationId: Ref<Organisation>;
    email?: string;
  }) {
    if (email) return [email];

    const userService = Container.get(UserService);
    const learnersEmails = await userService.distinct(
      {
        filter: {
          'workspaces.organisation': organisationId,
          'workspaces.role': UserRole.LEARNER,
        },
      },
      'email',
    );
    return learnersEmails;
  }
}
