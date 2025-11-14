import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { ImportDataThreeEyeView } from 'api/models/import-data/import-data-three-eye-view.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ImportDataThreeEyeViewService extends CRUD<ImportDataThreeEyeView> {
  constructor(
    @Inject(ImportDataThreeEyeView.name)
    readonly importDataThreeEyeViewModel: Model<ImportDataThreeEyeView>,
  ) {
    super(ImportDataThreeEyeView, importDataThreeEyeViewModel);
  }
}
