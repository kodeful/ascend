import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { ImportDataEvaluation } from 'api/models/import-data/import-data-evaluation.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ImportDataEvaluationService extends CRUD<ImportDataEvaluation> {
  constructor(
    @Inject(ImportDataEvaluation.name)
    readonly importDataEvaluationModel: Model<ImportDataEvaluation>,
  ) {
    super(ImportDataEvaluation, importDataEvaluationModel);
  }
}
