import { Ref } from '@typegoose/typegoose';
import { Type, plainToInstance } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import csvtojson from 'csvtojson';
import dayjs from 'dayjs';
import { google } from 'googleapis';
import { map, sum } from 'lodash';
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

import { Import } from 'api/models/import/import.model';
import { Organisation } from 'api/models/organisation.model';
import { ImportDataService } from 'api/services/import-data.service';
import { ImportService } from 'api/services/import.service';
import { FilterMeta, FilterQueryParams } from 'api/types/filter.types';
import { env } from 'env';
import { mongoId } from 'utils/mongoId';

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
    private importDataService: ImportDataService,
  ) {}

  public async processImportData({
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
    assessment: string;
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
          assessment,
        },
        upsert: true,
      },
    }));

    // CLEAN
    await this.importDataService.model.deleteMany({
      organisation: organisationId,
      import: importId,
    });

    // IMPORT
    await this.importDataService.model.bulkWrite(importDataBulk);
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

  @Post('/google-sheet')
  @ResponseSchema(undefined)
  public async importGoogleSheet(
    @Req() req: any,
    @Body()
    { spreadsheetLink, refetchInterval, metric, skill, assessment }: any,
  ) {
    const sheets = google.sheets({
      version: 'v4',
      auth: env.googleSheets.apiKey,
    });

    const spreadsheetId = spreadsheetLink.match(/\/d\/(.*?)\//)[1];
    const range = 'A2:ZZ'; // Get all columns and rows from row 2 onwards

    const {
      data: { values: rows },
    } = await sheets.spreadsheets.values
      .get({
        spreadsheetId,
        range,
      })
      .catch((err) => {
        console.error('Error fetching data from Google Sheets:', err);
        throw new BadRequestError(
          map(err.errors, 'message').join(', ') || 'Error fetching data',
        );
      });

    const extractedData = map(rows, (row) => {
      const score = sum(map(row.slice(2), Number));

      return {
        timestamp: dayjs(row[0]).toDate(),
        email: row[1],
        score,
      };
    });

    // CREATE IMPORT
    const { _id: importId } =
      await this.importService.importGoogleSheetService.create({
        organisation: req.organisation._id,
        sheetId: spreadsheetId,
        refetchInterval,
        lastRefetchTimestamp: dayjs().toDate(),
        metric,
        skill,
        assessment,
      });

    // CREATE IMPORT DATA
    await this.processImportData({
      organisationId: req.organisation._id,
      importId,
      metric,
      skill,
      assessment,
      rows: extractedData,
    });

    return {};
  }

  @Post('/file')
  @ResponseSchema(undefined)
  public async importFile(
    @Req() req: any,
    @Body() { metric, assessment, skill }: any,
    @UploadedFile('file') file?: any,
  ) {
    if (!file) {
      throw new BadRequestError('File is required');
    }

    const fileType = file.mimetype;
    const stringFile = file.buffer.toString('utf-8');
    let extractedData = [];

    switch (fileType) {
      case 'text/csv':
        extractedData = await csvtojson().fromString(stringFile);
        break;
      case 'application/json':
        extractedData = JSON.parse(stringFile);
        break;
      default:
        throw new BadRequestError('Invalid file type');
    }

    const normalizedRows = map(extractedData, (row) => {
      if (!row.email || !row.score || !row.timestamp) {
        return null;
      }

      return {
        timestamp: row.timestamp,
        email: row.email,
        score: row.score,
      };
    }).filter(Boolean);
    if (!normalizedRows.length) {
      throw new BadRequestError('No valid data found');
    }

    // CREATE IMPORT
    const { _id: importId } = await this.importService.importFileService.create(
      {
        organisation: req.organisation._id,
        fileName: file.originalname,
        fileType,
        metric,
        skill,
        assessment,
      },
    );

    // CREATE IMPORT DATA
    await this.processImportData({
      organisationId: req.organisation._id,
      importId,
      metric,
      skill,
      assessment,
      rows: normalizedRows,
    });

    return {};
  }
}
