import dayjs from 'dayjs';
import { filter, forEach, map, mean, meanBy, sum, uniq } from 'lodash';
import {
  Authorized,
  Get,
  JsonController,
  QueryParam,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ImportAssessment, ImportMetric } from 'api/models/import/import.model';
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

  @Get('/statistics/by-skill')
  @ResponseSchema(undefined)
  public async getMetricsStatisticsBySkill(
    @Req() req,
    @QueryParam('skill') skill: string,
  ) {
    const importData = await this.importDataService.find({
      filter: {
        organisation: req.organisation._id,
        ...(skill && { skill }),
      },
      select: ['timestamp', 'metric', 'score', 'email', 'skill', 'assessment'],
      sort: { timestamp: -1 },
    });

    const calculateMetrics = (importData) => {
      const metrics = {
        [ImportAssessment.SELF_EVALUATION]: [],
        [ImportAssessment.PEER_EVALUATION]: [],
        [ImportAssessment.FACILITATOR_EVALUATION]: [],
      };
      const usedCombinations = [];
      forEach(importData, (item) => {
        const combination = [item.email, item.assessment].join(':');
        if (usedCombinations.includes(combination)) {
          return;
        }

        metrics[item.assessment].push(item.score);
        usedCombinations.push(combination);
      });

      return {
        [ImportAssessment.PEER_EVALUATION]:
          mean(metrics[ImportAssessment.PEER_EVALUATION]) || 0,
        [ImportAssessment.SELF_EVALUATION]:
          mean(metrics[ImportAssessment.SELF_EVALUATION]) || 0,
        [ImportAssessment.FACILITATOR_EVALUATION]:
          mean(metrics[ImportAssessment.FACILITATOR_EVALUATION]) || 0,
      };
    };

    const skills = uniq(map(importData, 'skill'));
    const peerEvaluations = [];
    const selfEvaluations = [];
    const facilitatorEvaluations = [];
    forEach(skills, (skill) => {
      const skillData = filter(importData, (item) => item.skill === skill);
      const metrics = calculateMetrics(skillData);
      peerEvaluations.push(metrics[ImportAssessment.PEER_EVALUATION]);
      selfEvaluations.push(metrics[ImportAssessment.SELF_EVALUATION]);
      facilitatorEvaluations.push(
        metrics[ImportAssessment.FACILITATOR_EVALUATION],
      );
    });

    return {
      skills,
      peerEvaluations,
      selfEvaluations,
      facilitatorEvaluations,
    };
  }
}
