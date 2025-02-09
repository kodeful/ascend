import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { Organisation } from 'api/models/organisation.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class OrganisationService extends CRUD<Organisation> {
  constructor(
    @Inject(Organisation.name)
    readonly organisationModel: Model<Organisation>,
  ) {
    super(Organisation, organisationModel);
  }
}
