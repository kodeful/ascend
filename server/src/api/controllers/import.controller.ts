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
  Post,
  QueryParams,
  Req,
  UploadedFile,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Import, ImportAssessment } from 'api/models/import/import.model';
import { Organisation } from 'api/models/organisation.model';
import { ImportDataEvaluationService } from 'api/services/import-data/import-data-evaluation.service';
import { ImportDataLuminaService } from 'api/services/import-data/import-data-lumina.service';
import { ImportDataMindslinesService } from 'api/services/import-data/import-data-mindslines.service';
import { ImportDataThreeEyeViewService } from 'api/services/import-data/import-data-three-eye-view.service';
import { ImportService } from 'api/services/import.service';
import { FilterMeta, FilterQueryParams } from 'api/types/filter.types';
import { env } from 'env';
import { mongoId } from 'utils/mongoId';
import { isValidEmail } from 'utils/validators';

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
    organisationId,
    importId,
    metric,
    skill,
    rows,
  }: {
    organisationId: Ref<Organisation>;
    importId: Ref<Import>;
    metric: string;
    skill: string;
    rows: {
      timestamp: Date;
      email: string;
      score: number;
    }[];
  }) {
    const importDataBulk = map(rows, (row) => ({
      updateOne: {
        filter: {
          organisation: organisationId,
          import: importId,
          timestamp: row.timestamp,
          email: row.email,
        },
        update: {
          score: row.score,
          metric,
          skill,
        },
        upsert: true,
      },
    }));

    // CLEAN
    await this.importDataEvaluationService.model.deleteMany({
      organisation: organisationId,
      import: importId,
    });

    // IMPORT
    await this.importDataEvaluationService.model.bulkWrite(importDataBulk);
    return;
  }

  public async processImportDataThreeEyeView({
    organisationId,
    importId,
    metric,
    skill,
    assessment,
    rows,
  }: {
    organisationId: Ref<Organisation>;
    importId: Ref<Import>;
    metric: string;
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
          organisation: organisationId,
          import: importId,
          timestamp: row.timestamp,
          email: row.email,
        },
        update: {
          score: row.score,
          assessment,
          metric,
          skill,
        },
        upsert: true,
      },
    }));

    // CLEAN
    await this.importDataThreeEyeViewService.model.deleteMany({
      organisation: organisationId,
      import: importId,
    });

    // IMPORT
    await this.importDataThreeEyeViewService.model.bulkWrite(importDataBulk);
    return;
  }

  public async processImportDataMindslines({
    organisationId,
    importId,
    rows,
  }: {
    organisationId: Ref<Organisation>;
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
          organisation: organisationId,
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
      organisation: organisationId,
      import: importId,
    });

    // IMPORT
    await this.importDataMindslinesService.model.bulkWrite(importDataBulk);
    return;
  }

  public async processImportDataLumina({
    organisationId,
    importId,
    rows,
  }: {
    organisationId: Ref<Organisation>;
    importId: Ref<Import>;
    rows: {
      email: string;
      skills: Record<string, number>;
    }[];
  }) {
    const importDataBulk = map(rows, (row) => ({
      updateOne: {
        filter: {
          organisation: organisationId,
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
      organisation: organisationId,
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
      preFilter: {
        organisation: mongoId(req.organisation._id),
      },
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
    //     organisation: req.organisation._id,
    //     fileName: file.originalname,
    //     fileType,
    //     metric,
    //     skill,
    //     assessment,
    //   },
    // );

    // // CREATE IMPORT DATA
    // await this.processImportDataEvaluation({
    //   organisationId: req.organisation._id,
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
    { spreadsheetLink, refetchInterval, metric, skill }: any,
  ) {
    const sheets = google.sheets({
      version: 'v4',
      auth: env.googleSheets.apiKey,
    });

    const spreadsheetId = spreadsheetLink.match(/\/d\/(.*?)\//)[1];
    const range = 'A2:ZZ'; // Get all columns and rows from row 2 onwards

    const importExists =
      await this.importService.importGoogleSheetService.findOne({
        filter: {
          organisation: req.organisation._id,
          sheetId: spreadsheetId,
        },
      });
    if (importExists) {
      throw new BadRequestError('Google Sheet import already exists');
    }

    const [spreadsheetMetaResponse, spreadsheetValuesResponse] =
      await Promise.all([
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
    const rows = spreadsheetValuesResponse.data.values;

    let importType: 'evaluation' | 'three-eye-view';
    if (spreadsheetName.toLowerCase().startsWith('evaluation')) {
      importType = 'evaluation';
    } else {
      importType = 'three-eye-view';
    }

    // CREATE IMPORT
    const { _id: importId } =
      await this.importService.importGoogleSheetService.create({
        organisation: req.organisation._id,
        sheetId: spreadsheetId,
        sheetName: spreadsheetName,
        refetchInterval,
        lastRefetchTimestamp: dayjs().toDate(),
        metric,
        skill,
      });

    if (importType === 'evaluation') {
      const extractedData = map(rows, (row) => {
        let email = '';
        let score = 0;
        row.slice(1).map((row) => {
          if (isValidEmail(row)) {
            email = row;
            return;
          }

          let value = 0;
          if (row.startsWith('a)')) {
            value = 1;
          } else if (row.startsWith('b')) {
            value = 2;
          } else if (row.startsWith('c')) {
            value = 3;
          }

          score += value;
        });

        return {
          timestamp: dayjs(first(row)).toDate(),
          email,
          score,
        };
      });

      // CREATE IMPORT DATA
      await this.processImportDataEvaluation({
        organisationId: req.organisation._id,
        importId,
        metric,
        skill,
        rows: extractedData,
      });

      return {};
    }

    if (importType === 'three-eye-view') {
      let assessment;
      if (
        spreadsheetName.includes('Facilitator Evaluation') ||
        spreadsheetName.includes('Evaluación del Facilitador')
      ) {
        assessment = ImportAssessment.FACILITATOR_EVALUATION;
      } else if (
        spreadsheetName.includes('Self-Assessment') ||
        spreadsheetName.includes('Autoevaluación')
      ) {
        assessment = ImportAssessment.SELF_EVALUATION;
      } else if (
        spreadsheetName.includes('Peer') ||
        spreadsheetName.includes('Evaluación por compañeros')
      ) {
        assessment = ImportAssessment.PEER_EVALUATION;
      }

      const extractedData = map(rows, (row) => {
        let email = '';
        let score = 0;

        row.forEach((cell) => {
          if (isValidEmail(cell)) {
            email = cell;
            return;
          }

          const value = +cell;
          if (!isNumber(value) || isNaN(value)) return;
          score += value;
        });

        return {
          timestamp: dayjs(first(row)).toDate(),
          email,
          score,
        };
      });

      // CREATE IMPORT DATA
      await this.processImportDataThreeEyeView({
        organisationId: req.organisation._id,
        importId,
        metric,
        skill,
        assessment,
        rows: extractedData,
      });

      return {};
    }

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
        organisation: req.organisation._id,
        fileName: file.originalname,
      });

    // CREATE IMPORT DATA
    await this.processImportDataMindslines({
      organisationId: req.organisation._id,
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
        organisation: req.organisation._id,
        fileName: file.originalname,
      });

    // CREATE IMPORT DATA
    await this.processImportDataLumina({
      organisationId: req.organisation._id,
      importId,
      rows: normalizedRows,
    });

    return {};
  }
}
