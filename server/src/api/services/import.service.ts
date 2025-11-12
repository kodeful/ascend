import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { ImportFile } from 'api/models/import/import-file.model';
import { ImportGoogleSheet } from 'api/models/import/import-google-sheet.model';
import { ImportMindslines } from 'api/models/import/import-mindslines.model';
import { Import, ImportType } from 'api/models/import/import.model';
import { CRUD } from 'utils/models/CRUD';

class ImportGoogleSheetService extends CRUD<ImportGoogleSheet> {
  constructor(
    @Inject(ImportGoogleSheet.name)
    readonly importGoogleSheetModel: Model<ImportGoogleSheet>,
  ) {
    super(ImportGoogleSheet, importGoogleSheetModel);
  }
}

class ImportFileService extends CRUD<ImportFile> {
  constructor(
    @Inject(ImportFile.name)
    readonly importFileModel: Model<ImportFile>,
  ) {
    super(ImportFile, importFileModel);
  }
}

class ImportMindslinesService extends CRUD<ImportMindslines> {
  constructor(
    @Inject(ImportMindslines.name)
    readonly importMindslinesModel: Model<ImportMindslines>,
  ) {
    super(ImportMindslines, importMindslinesModel);
  }
}

@Service()
export class ImportService extends CRUD<Import> {
  constructor(
    @Inject(Import.name)
    readonly importModel: Model<Import>,
    readonly importGoogleSheetService: ImportGoogleSheetService,
    readonly importFileService: ImportFileService,
    readonly importMindslinesService: ImportMindslinesService,
  ) {
    super(Import, importModel);
  }

  subtype = (type: ImportType) => {
    switch (type) {
      case ImportType.GOOGLE_SHEET:
        return this.importGoogleSheetService;
      case ImportType.FILE:
        return this.importFileService;
      case ImportType.MINDSLINES:
        return this.importMindslinesService;
      default:
        throw new Error(`Unsupported import type: ${type}`);
    }
  };
}
