import csvtojson from 'csvtojson';
import dayjs from 'dayjs';
import { google } from 'googleapis';
import { map, sum } from 'lodash';
import {
  Authorized,
  BadRequestError,
  Body,
  JsonController,
  Post,
  UploadedFile,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { env } from 'env';

// Response Types

// Controller
@Authorized()
@JsonController('/import')
@OpenAPI({})
export class ImportController {
  //   constructor() {}

  private async processImportData({
    source,
    metric,
    assessment,
    rows,
  }: {
    source: 'google-sheet' | 'file';
    metric: string;
    assessment: string;
    rows: {
      timestamp: Date;
      email: string;
      score: number;
    }[];
  }) {
    console.log(source, metric, assessment, rows);
    return;
  }

  @Post('/google-sheet')
  @ResponseSchema(undefined)
  public async importGoogleSheet(
    @Body() { spreadsheetLink, metric, assessment }: any,
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

    await this.processImportData({
      source: 'google-sheet',
      metric,
      assessment,
      rows: extractedData,
    });

    return {};
  }

  @Post('/file')
  @ResponseSchema(undefined)
  public async importFile(
    @Body() { metric, assessment }: any,
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

    console.log(extractedData);
    await this.processImportData({
      source: 'file',
      metric,
      assessment,
      rows: extractedData,
    });

    return {};
  }
}
