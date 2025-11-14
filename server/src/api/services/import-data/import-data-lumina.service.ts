import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { ImportDataLumina } from 'api/models/import-data/import-data-lumina.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ImportDataLuminaService extends CRUD<ImportDataLumina> {
  constructor(
    @Inject(ImportDataLumina.name)
    readonly importDataLuminaModel: Model<ImportDataLumina>,
  ) {
    super(ImportDataLumina, importDataLuminaModel);
  }
}
