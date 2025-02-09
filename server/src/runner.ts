// import dayjs from 'dayjs';
// import { google } from 'googleapis';
// import { map, sum } from 'lodash';

// import { env } from 'env';

export const runner = async () => {
  // Run your functions here while in development
  return;
  // const spreadsheetLink =
  //   'https://docs.google.com/spreadsheets/d/1_A5AOIuTTncV3BWm6c0QEUH3h-40u-Fr4l-qD3K4-1A/edit?gid=298518906#gid=298518906';
  // const skill = 'Time Management';
  // const variant:
  //   | 'Peer Evaluation'
  //   | 'Self-evaluation'
  //   | 'Facilitator Evaluation' = 'Peer Evaluation';

  // const sheets = google.sheets({
  //   version: 'v4',
  //   auth: env.googleSheets.apiKey,
  // });

  // const spreadsheetId = spreadsheetLink.match(/\/d\/(.*?)\//)[1];
  // const range = 'A2:ZZ'; // Get all columns and rows from row 2 onwards

  // const {
  //   data: { values: rows },
  // } = await sheets.spreadsheets.values
  //   .get({
  //     spreadsheetId,
  //     range,
  //   })
  //   .catch((err) => {
  //     console.error('Error fetching data from Google Sheets:', err);
  //     throw new Error('Error fetching data from Google Sheets');
  //   });

  // const extractedData = map(rows, (row) => {
  //   const score = sum(map(row.slice(2), Number));

  //   return {
  //     timestamp: dayjs(row[0]).toDate(),
  //     email: row[1],
  //     score,
  //   };
  // });

  // console.log(extractedData);
};
