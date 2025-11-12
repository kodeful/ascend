import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { ImportDataMindslines } from 'api/models/import/import-data-mindslines.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ImportDataMindslinesService extends CRUD<ImportDataMindslines> {
  constructor(
    @Inject(ImportDataMindslines.name)
    readonly importDataMindslinesModel: Model<ImportDataMindslines>,
  ) {
    super(ImportDataMindslines, importDataMindslinesModel);
  }
}
