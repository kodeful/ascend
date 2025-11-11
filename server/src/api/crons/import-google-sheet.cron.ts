import { Cron, CronController } from 'cron-typedi-decorators';
import dayjs from 'dayjs';
import { google } from 'googleapis';
import { map, sum } from 'lodash';
import Container from 'typedi';

import { ImportController } from 'api/controllers/import.controller';
import { ImportGoogleSheetRefetchInterval } from 'api/models/import/import-google-sheet.model';
import { ImportType } from 'api/models/import/import.model';
import { ImportService } from 'api/services/import.service';
import { env } from 'env';

@CronController('import-google-sheet')
export class ImportGoogleSheetCron {
  constructor(private importService: ImportService) {}

  public async importGoogleSheet(
    refetchInterval: ImportGoogleSheetRefetchInterval,
  ) {
    const imports = await this.importService.importGoogleSheetService.find({
      filter: {
        type: ImportType.GOOGLE_SHEET,
        refetchInterval,
        lastRefetchTimestamp: dayjs().toDate(),
      },
    });

    await Promise.all(
      imports.map(async (sheetImport) => {
        const sheets = google.sheets({
          version: 'v4',
          auth: env.googleSheets.apiKey,
        });

        const range = 'A2:ZZ'; // Get all columns and rows from row 2 onwards

        const {
          data: { values: rows },
        } = await sheets.spreadsheets.values
          .get({
            spreadsheetId: sheetImport.sheetId,
            range,
          })
          .catch((err) => {
            console.error('Error fetching data from Google Sheets:', err);
            throw new Error(
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
        console.log(extractedData);

        // CREATE IMPORT DATA
        const importController = Container.get(ImportController);
        await importController.processImportData({
          organisationId: sheetImport.organisation,
          importId: sheetImport._id,
          metric: sheetImport.metric,
          skill: sheetImport.skill,
          assessment: sheetImport.assessment,
          rows: extractedData,
        });
      }),
    );
  }

  // Import Google Sheet - Every 15 minutes
  @Cron('import-google-sheet-15-minutes', '*/15 * * * *')
  public async importGoogleSheet15Minutes() {
    return this.importGoogleSheet(
      ImportGoogleSheetRefetchInterval.EVERY_15_MINUTES,
    );
  }

  // Import Google Sheet - Every hour
  @Cron('import-google-sheet-every-hour', '0 * * * *')
  public async importGoogleSheetEveryHour() {
    return this.importGoogleSheet(ImportGoogleSheetRefetchInterval.EVERY_HOUR);
  }

  // Import Google Sheet - Every day
  @Cron('import-google-sheet-every-day', '0 0 * * *')
  public async importGoogleSheetEveryDay() {
    return this.importGoogleSheet(ImportGoogleSheetRefetchInterval.EVERY_DAY);
  }
}
