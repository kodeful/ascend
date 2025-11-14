import dayjs from 'dayjs';
import { filter, forEach, meanBy, sum } from 'lodash';
import {
  Authorized,
  Get,
  JsonController,
  QueryParam,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ImportMetric } from 'api/models/import/import.model';
import { ImportDataEvaluationService } from 'api/services/import-data/import-data-evaluation.service';

// Response Types
// Controller
@Authorized()
@JsonController('/metrics-evaluation')
@OpenAPI({})
export class MetricsEvaluationController {
  constructor(
    private importDataEvaluationService: ImportDataEvaluationService,
  ) {}

  @Get('/statistics/by-metric')
  @ResponseSchema(undefined)
  public async getByMetric(@Req() req, @QueryParam('email') email?: string) {
    const importDataEvaluation = await this.importDataEvaluationService.find({
      filter: {
        organisation: req.organisation._id,
        ...(email && { email }),
      },
      select: ['timestamp', 'metric', 'score', 'email'],
      sort: { timestamp: -1 },
    });

    const previousMonthImportData = filter(importDataEvaluation, (item) => {
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
        const combination = [item.email, item.metric, item.skill].join(':');
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
    const after = calculateMetrics(importDataEvaluation);

    const increasePercentage =
      (sum(before) > 0 ? sum(after) / sum(before) : 1) - 1;

    return {
      before, // [Knowledge, Confidence, Application]
      after, // [Knowledge, Confidence, Application]
      increasePercentage,
    };
  }
}
