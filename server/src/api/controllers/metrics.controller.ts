import dayjs from 'dayjs';
import { filter, forEach, meanBy, sum } from 'lodash';
import { Authorized, Get, JsonController, Req } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ImportMetric } from 'api/models/import/import.model';
import { ImportDataService } from 'api/services/import-data.service';

// Response Types
// Controller
@Authorized()
@JsonController('/metrics')
@OpenAPI({})
export class MetricsController {
  constructor(private importDataService: ImportDataService) {}

  @Get('/skills/options')
  @OpenAPI({
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  public async getMetricsSkillsOptions(@Req() req) {
    const skills = await this.importDataService.distinct(
      {
        filter: {
          organisation: req.organisation._id,
        },
      },
      'skill',
    );

    return skills;
  }

  @Get('/statistics/by-metric')
  @ResponseSchema(undefined)
  public async getMetricsStatisticsByMetric(@Req() req) {
    const importData = await this.importDataService.find({
      filter: {
        organisation: req.organisation._id,
      },
      select: ['timestamp', 'metric', 'score', 'email'],
      sort: { timestamp: -1 },
    });

    const previousMonthImportData = filter(importData, (item) => {
      return dayjs(item.timestamp).isBefore(dayjs().startOf('month'));
    });

    const calculateMetrics = (importData) => {
      const metrics = {
        [ImportMetric.KNOWLEDGE]: [],
        [ImportMetric.CONFIDENCE]: [],
        [ImportMetric.APPLICATION]: [],
      };
      const usedCombinations = [];
      forEach(importData, (item) => {
        const combination = [
          item.email,
          item.metric,
          item.skill,
          item.assessment,
        ].join(':');
        if (usedCombinations.includes(combination)) {
          return;
        }

        metrics[item.metric].push(item.score);
        usedCombinations.push(combination);
      });

      return [
        meanBy(metrics[ImportMetric.KNOWLEDGE]) || 0,
        meanBy(metrics[ImportMetric.CONFIDENCE]) || 0,
        meanBy(metrics[ImportMetric.APPLICATION]) || 0,
      ];
    };

    const before = calculateMetrics(previousMonthImportData);
    const after = calculateMetrics(importData);

    const increasePercentage =
      (sum(before) > 0 ? sum(after) / sum(before) : 1) - 1;

    return {
      before, // [Knowledge, Confidence, Application]
      after, // [Knowledge, Confidence, Application]
      increasePercentage,
    };
  }
}
