import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { ImportData } from 'api/models/import/import-data.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ImportDataService extends CRUD<ImportData> {
  constructor(
    @Inject(ImportData.name)
    readonly importDataModel: Model<ImportData>,
  ) {
    super(ImportData, importDataModel);
  }
}
