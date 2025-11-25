import { Ref } from '@typegoose/typegoose';
import { Type, plainToInstance } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import csvtojson from 'csvtojson';
import dayjs from 'dayjs';
import { google } from 'googleapis';
import { find, first, isNumber, last, map } from 'lodash';
import {
  Authorized,
  BadRequestError,
  Body,
  Get,
  JsonController,
  Param,
  Post,
  QueryParams,
  Req,
  UploadedFile,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import Container from 'typedi';

import { ImportGoogleSheetCron } from 'api/crons/import-google-sheet.cron';
import { Import, ImportAssessment } from 'api/models/import/import.model';
import { ImportDataEvaluationService } from 'api/services/import-data/import-data-evaluation.service';
import { ImportDataLuminaService } from 'api/services/import-data/import-data-lumina.service';
import { ImportDataMindslinesService } from 'api/services/import-data/import-data-mindslines.service';
import { ImportDataThreeEyeViewService } from 'api/services/import-data/import-data-three-eye-view.service';
import { ImportService } from 'api/services/import.service';
import { FilterMeta, FilterQueryParams } from 'api/types/filter.types';
import { env } from 'env';

// Response Types
// ?|> filterImports
class filterImportsResponse {
  @ValidateNested({ each: true })
  @Type(() => Import)
  data: Import[];

  @ValidateNested()
  @Type(() => FilterMeta)
  meta: FilterMeta;
}

// Controller
@Authorized()
@JsonController('/import')
@OpenAPI({})
export class ImportController {
  constructor(
    private importService: ImportService,
    private importDataEvaluationService: ImportDataEvaluationService,
    private importDataThreeEyeViewService: ImportDataThreeEyeViewService,
    private importDataMindslinesService: ImportDataMindslinesService,
    private importDataLuminaService: ImportDataLuminaService,
  ) {}

  public async processImportDataEvaluation({
    importId,
    skill,
    rows,
  }: {
    importId: Ref<Import>;
    skill: string;
    rows: {
      timestamp: Date;
      email: string;
      knowledge: number;
      confidence: number;
      application: number;
    }[];
  }) {
    const importDataBulk = map(rows, (row) => ({
      updateOne: {
        filter: {
          import: importId,
          timestamp: row.timestamp,
          email: row.email,
        },
        update: {
          skill,
          knowledge: row.knowledge,
          confidence: row.confidence,
          application: row.application,
        },
        upsert: true,
      },
    }));

    // CLEAN
    await this.importDataEvaluationService.model.deleteMany({
      import: importId,
    });

    // IMPORT
    await this.importDataEvaluationService.model.bulkWrite(importDataBulk);
    return;
  }

  public async processImportDataThreeEyeView({
    importId,
    skill,
    assessment,
    rows,
  }: {
    importId: Ref<Import>;
    skill: string;
    assessment: ImportAssessment;
    rows: {
      timestamp: Date;
      email: string;
      score: number;
    }[];
  }) {
    const importDataBulk = map(rows, (row) => ({
      updateOne: {
        filter: {
          import: importId,
          timestamp: row.timestamp,
          email: row.email,
        },
        update: {
          score: row.score,
          assessment,
          skill,
        },
        upsert: true,
      },
    }));

    // CLEAN
    await this.importDataThreeEyeViewService.model.deleteMany({
      import: importId,
    });

    // IMPORT
    await this.importDataThreeEyeViewService.model.bulkWrite(importDataBulk);
    return;
  }

  public async processImportDataMindslines({
    importId,
    rows,
  }: {
    importId: Ref<Import>;
    rows: {
      email: string;
      completedCount: number;
      inProgressCount: number;
      notStartedCount: number;
    }[];
  }) {
    const importDataBulk = map(rows, (row) => ({
      updateOne: {
        filter: {
          import: importId,
          email: row.email,
        },
        update: {
          completedCount: row.completedCount,
          inProgressCount: row.inProgressCount,
          notStartedCount: row.notStartedCount,
        },
        upsert: true,
      },
    }));

    // CLEAN
    await this.importDataMindslinesService.model.deleteMany({
      import: importId,
    });

    // IMPORT
    await this.importDataMindslinesService.model.bulkWrite(importDataBulk);
    return;
  }

  public async processImportDataLumina({
    importId,
    rows,
  }: {
    importId: Ref<Import>;
    rows: {
      email: string;
      skills: Record<string, number>;
    }[];
  }) {
    const importDataBulk = map(rows, (row) => ({
      updateOne: {
        filter: {
          import: importId,
          email: row.email,
        },
        update: {
          skills: row.skills,
        },
        upsert: true,
      },
    }));

    // CLEAN
    await this.importDataLuminaService.model.deleteMany({
      import: importId,
    });

    // IMPORT
    await this.importDataLuminaService.model.bulkWrite(importDataBulk);
    return;
  }

  @Get()
  @ResponseSchema(filterImportsResponse)
  public async filterImports(
    @Req() req: any,
    // @CurrentUser() user: User,
    @QueryParams() queryParams: FilterQueryParams<Import>,
  ) {
    const { limit, page, sort, filter } = plainToInstance(
      FilterQueryParams,
      queryParams,
    );

    return this.importService.filter({
      limit,
      page,
      sort,
      filter,
      defaultFilter: {},
      preFilter: {},
      Model: Import,
    });
  }

  @Post('/file')
  @ResponseSchema(undefined)
  public async importFile(
    @Req() req: any,
    // @Body() { metric, assessment, skill }: any,
    @UploadedFile('file') file?: any,
  ) {
    if (!file) {
      throw new BadRequestError('File is required');
    }

    // const fileType = file.mimetype;
    // const stringFile = file.buffer.toString('utf-8');
    // let extractedData = [];

    // switch (fileType) {
    //   case 'text/csv':
    //     extractedData = await csvtojson().fromString(stringFile);
    //     break;
    //   case 'application/json':
    //     extractedData = JSON.parse(stringFile);
    //     break;
    //   default:
    //     throw new BadRequestError('Invalid file type');
    // }

    // const normalizedRows = map(extractedData, (row) => {
    //   if (!row.email || !row.score || !row.timestamp) {
    //     return null;
    //   }

    //   return {
    //     timestamp: row.timestamp,
    //     email: row.email,
    //     score: row.score,
    //   };
    // }).filter(Boolean);
    // if (!normalizedRows.length) {
    //   throw new BadRequestError('No valid data found');
    // }

    // // CREATE IMPORT
    // const { _id: importId } = await this.importService.importFileService.create(
    //   {
    //     fileName: file.originalname,
    //     fileType,
    //     metric,
    //     skill,
    //     assessment,
    //   },
    // );

    // // CREATE IMPORT DATA
    // await this.processImportDataEvaluation({
    //   importId,
    //   metric,
    //   skill,
    //   rows: normalizedRows,
    // });

    return {};
  }

  @Post('/google-sheet')
  @ResponseSchema(undefined)
  public async importGoogleSheet(
    @Req() req: any,
    @Body()
    { spreadsheetLink, refetchInterval }: any,
  ) {
    const spreadsheetId = spreadsheetLink.match(/\/d\/(.*?)\//)[1];

    const importExists =
      await this.importService.importGoogleSheetService.findOne({
        filter: {
          sheetId: spreadsheetId,
        },
      });
    if (importExists) {
      throw new BadRequestError('Google Sheet import already exists');
    }

    const sheets = google.sheets({
      version: 'v4',
      auth: env.googleSheets.apiKey,
    });
    const range = 'A2:ZZ'; // Get all columns and rows from row 2 onwards

    const [spreadsheetMetaResponse] = await Promise.all([
      sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'properties/title',
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      }),
    ]).catch((err) => {
      console.error('Error fetching data from Google Sheets:', err);
      const messages = map(err.errors, 'message').join(', ');

      if (messages === 'The caller does not have permission') {
        throw new BadRequestError(
          'You do not have permission to access this Google Sheet, please share access with "Anyone with the link".',
        );
      }

      throw new Error(messages || 'Error fetching data');
    });

    const spreadsheetName = spreadsheetMetaResponse.data.properties?.title;

    let importType: 'evaluation' | 'three-eye-view';
    if (spreadsheetName.toLowerCase().startsWith('evaluation')) {
      importType = 'evaluation';
    } else {
      importType = 'three-eye-view';
    }

    let skill;
    if (importType === 'evaluation') {
      skill = last(spreadsheetName.split(' - '))
        .replace('(Responses)', '')
        .trim();
    } else {
      skill = first(spreadsheetName.split(' - ')).trim();
    }

    // CREATE IMPORT
    const { _id: importId } =
      await this.importService.importGoogleSheetService.create({
        sheetId: spreadsheetId,
        sheetName: spreadsheetName,
        refetchInterval,
        lastRefetchTimestamp: dayjs().toDate(),
        skill,
      });

    const importGoogleSheetCron = Container.get(ImportGoogleSheetCron);
    await importGoogleSheetCron.processImportData(importId);

    return {};
  }

  @Post('/mindslines')
  @ResponseSchema(undefined)
  public async importMindslines(
    @Req() req: any,
    @UploadedFile('file') file?: any,
  ) {
    if (!file) {
      throw new BadRequestError('File is required');
    }

    const stringFile = file.buffer.toString('utf-8');
    const extractedData = await csvtojson().fromString(stringFile);

    const keys = Object.keys(first(extractedData));
    if (!keys.length) {
      throw new BadRequestError('No valid data found');
    }
    const emailKey = find(keys, (key) => key.toLowerCase().includes('email'));
    const completedCount = find(keys, (key) =>
      key.toLowerCase().includes('completed count'),
    );
    const inProgressCount = find(keys, (key) =>
      key.toLowerCase().includes('in-progress count'),
    );
    const notStartedCount = find(keys, (key) =>
      key.toLowerCase().includes('not attempted count'),
    );

    const normalizedRows = map(extractedData, (row) => {
      row.email = row[emailKey];
      row.completedCount = +(row?.[completedCount] || 0);
      row.inProgressCount = +(row?.[inProgressCount] || 0);
      row.notStartedCount = +(row?.[notStartedCount] || 0);

      if (
        !row.email ||
        !isNumber(row.completedCount) ||
        !isNumber(row.inProgressCount) ||
        !isNumber(row.notStartedCount)
      ) {
        return null;
      }

      return {
        email: row.email,
        completedCount: row.completedCount,
        inProgressCount: row.inProgressCount,
        notStartedCount: row.notStartedCount,
      };
    }).filter(Boolean);
    if (!normalizedRows.length) {
      throw new BadRequestError('No valid data found');
    }

    // CREATE IMPORT
    const { _id: importId } =
      await this.importService.importMindslinesService.create({
        fileName: file.originalname,
      });

    // CREATE IMPORT DATA
    await this.processImportDataMindslines({
      importId,
      rows: normalizedRows,
    });

    return {};
  }

  @Post('/lumina')
  @ResponseSchema(undefined)
  public async importLumina(@Req() req: any, @UploadedFile('file') file?: any) {
    if (!file) {
      throw new BadRequestError('File is required');
    }

    const stringFile = file.buffer.toString('utf-8');
    const extractedData = await csvtojson().fromString(stringFile);

    const keys = Object.keys(first(extractedData));
    if (!keys.length) {
      throw new BadRequestError('No valid data found');
    }
    const emailKey = find(keys, (key) => key.toLowerCase().includes('email'));

    const normalizedRows = map(extractedData, (row) => {
      row.email = row[emailKey];
      row.skills = {};

      Object.keys(row).forEach((key) => {
        if (!key.toLowerCase().includes(`(percentile)`)) return;

        const skill = last(key.split(' - ')).replace('(percentile)', '').trim();
        const value = +row[key];
        row.skills[skill] = isNumber(value) ? value : undefined;
      });

      if (!row.email) {
        return null;
      }

      return {
        email: row.email,
        skills: row.skills,
      };
    }).filter(Boolean);
    if (!normalizedRows.length) {
      throw new BadRequestError('No valid data found');
    }

    // CREATE IMPORT
    const { _id: importId } =
      await this.importService.importLuminaService.create({
        fileName: file.originalname,
      });

    // CREATE IMPORT DATA
    await this.processImportDataLumina({
      importId,
      rows: normalizedRows,
    });

    return {};
  }

  @Post('/disconnect/:importId')
  @ResponseSchema(undefined)
  public async disconnectImport(@Param('importId') importId: Ref<Import>) {
    await this.importService.delete(importId);

    await Promise.all([
      this.importDataEvaluationService.deleteMany({
        import: importId,
      }),
      this.importDataThreeEyeViewService.deleteMany({
        import: importId,
      }),
      this.importDataMindslinesService.deleteMany({
        import: importId,
      }),
      this.importDataLuminaService.deleteMany({
        import: importId,
      }),
    ]);

    return {};
  }
}
