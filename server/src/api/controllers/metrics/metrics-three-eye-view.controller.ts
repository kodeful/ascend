import { filter, forEach, map, mean, uniq } from 'lodash';
import {
  Authorized,
  Get,
  JsonController,
  QueryParam,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ImportAssessment } from 'api/models/import/import.model';
import { ImportDataThreeEyeViewService } from 'api/services/import-data/import-data-three-eye-view.service';
import { MetricsService } from 'api/services/metrics.service';

// Response Types
@Authorized()
@JsonController('/metrics-three-eye-view')
@OpenAPI({})
export class MetricsThreeEyeViewController {
  constructor(
    private importDataThreeEyeViewService: ImportDataThreeEyeViewService,
    private metricsService: MetricsService,
  ) {}

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
  public async getMetricsSkillsOptions(
    @Req() req,
    @QueryParam('email') email?: string,
  ) {
    const skills = await this.importDataThreeEyeViewService.distinct(
      {
        filter: {
          email: {
            $in: await this.metricsService.metricsEmails({
              organisationId: req.organisation._id,
              email,
            }),
          },
        },
      },
      'skill',
    );

    return skills;
  }

  @Get('/statistics/by-skill')
  @ResponseSchema(undefined)
  public async getMetricsStatisticsBySkill(
    @Req() req,
    @QueryParam('skill') skill: string,
    @QueryParam('email') email?: string,
  ) {
    const importData = await this.importDataThreeEyeViewService.find({
      filter: {
        email: {
          $in: await this.metricsService.metricsEmails({
            organisationId: req.organisation._id,
            email,
          }),
        },
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
