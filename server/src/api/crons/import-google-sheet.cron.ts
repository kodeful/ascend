import { Ref } from '@typegoose/typegoose';
import { Cron, CronController } from 'cron-typedi-decorators';
import dayjs from 'dayjs';
import { google } from 'googleapis';
import { first, isNumber, map } from 'lodash';
import Container from 'typedi';

import { ImportController } from 'api/controllers/import.controller';
import {
  ImportGoogleSheet,
  ImportGoogleSheetRefetchInterval,
} from 'api/models/import/import-google-sheet.model';
import { ImportAssessment, ImportType } from 'api/models/import/import.model';
import { ImportService } from 'api/services/import.service';
import { env } from 'env';
import { isValidEmail } from 'utils/validators';

const METRIC_PER_INDEX = {
  [0]: 'knowledge',
  [1]: 'knowledge',
  [2]: 'knowledge',
  [3]: 'knowledge',
  [4]: 'knowledge',
  [5]: 'confidence',
  [6]: 'confidence',
  [7]: 'confidence',
  [8]: 'confidence',
  [9]: 'confidence',
  [10]: 'application',
  [11]: 'application',
  [12]: 'application',
  [13]: 'application',
  [14]: 'application',
};
@CronController('import-google-sheet')
export class ImportGoogleSheetCron {
  constructor(private importService: ImportService) {}

  public async processImportData(importId: Ref<ImportGoogleSheet>) {
    const sheetImport =
      await this.importService.importGoogleSheetService.findOneById(importId);
    if (!sheetImport) {
      throw new Error('Import not found');
    }

    const sheets = google.sheets({
      version: 'v4',
      auth: env.googleSheets.apiKey,
    });

    const range = 'A2:ZZ';
    // Fetch spreadsheet metadata to get spreadsheet name and sheet data to get rows
    const [spreadsheetMetaResponse, spreadsheetValuesResponse] =
      await Promise.all([
        sheets.spreadsheets.get({
          spreadsheetId: sheetImport.sheetId,
          fields: 'properties/title',
        }),
        sheets.spreadsheets.values.get({
          spreadsheetId: sheetImport.sheetId,
          range,
        }),
      ]).catch((err) => {
        console.error('Error fetching data from Google Sheets:', err);
        throw new Error(
          map(err.errors, 'message').join(', ') || 'Error fetching data',
        );
      });

    const spreadsheetName = spreadsheetMetaResponse.data.properties?.title;
    const rows = spreadsheetValuesResponse.data.values;

    let importType: 'evaluation' | 'three-eye-view';
    if (spreadsheetName.toLowerCase().startsWith('evaluation')) {
      importType = 'evaluation';
    } else {
      importType = 'three-eye-view';
    }

    if (importType === 'evaluation') {
      const extractedData = map(rows, (row) => {
        let email = '';
        const scores = {
          knowledge: 0,
          confidence: 0,
          application: 0,
        };
        let metricIndex = 0;
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

          scores[METRIC_PER_INDEX[metricIndex]] += value;
          metricIndex++;
        });

        return {
          timestamp: dayjs(first(row)).toDate(),
          email,
          ...scores,
        };
      });

      // CREATE IMPORT DATA
      const importController = Container.get(ImportController);
      await importController.processImportDataEvaluation({
        importId: sheetImport._id,
        skill: sheetImport.skill,
        rows: extractedData,
      });
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
      const importController = Container.get(ImportController);
      await importController.processImportDataThreeEyeView({
        importId: sheetImport._id,
        skill: sheetImport.skill,
        assessment,
        rows: extractedData,
      });
    }

    await this.importService.importGoogleSheetService.updateOneById(importId, {
      lastRefetchTimestamp: dayjs().toDate(),
    });
  }

  private async importGoogleSheet(
    refetchInterval: ImportGoogleSheetRefetchInterval,
  ) {
    const imports = await this.importService.importGoogleSheetService.find({
      filter: {
        type: ImportType.GOOGLE_SHEET,
        refetchInterval,
      },
      select: ['_id'],
    });

    await Promise.all(
      imports.map(async (sheetImport) => {
        await this.processImportData(sheetImport._id);
      }),
    );
  }

  // Import Google Sheet - Every 15 minutes
  @Cron('import-google-sheet-15-minutes', '*/15 * * * *', {
    timeZone: 'America/New_York',
    runOnInit: true,
  })
  public async importGoogleSheet15Minutes() {
    console.log('import-google-sheet-15-minutes');
    return this.importGoogleSheet(
      ImportGoogleSheetRefetchInterval.EVERY_15_MINUTES,
    );
  }

  // Import Google Sheet - Every hour
  @Cron('import-google-sheet-every-hour', '0 * * * *', {
    timeZone: 'America/New_York',
    runOnInit: true,
  })
  public async importGoogleSheetEveryHour() {
    console.log('import-google-sheet-every-hour');
    return this.importGoogleSheet(ImportGoogleSheetRefetchInterval.EVERY_HOUR);
  }

  // Import Google Sheet - Every day
  @Cron('import-google-sheet-every-day', '0 0 * * *', {
    timeZone: 'America/New_York',
    runOnInit: true,
  })
  public async importGoogleSheetEveryDay() {
    console.log('import-google-sheet-every-day');
    return this.importGoogleSheet(ImportGoogleSheetRefetchInterval.EVERY_DAY);
  }
}
