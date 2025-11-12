import { IsNumber } from 'class-validator';
import { first, groupBy, map, meanBy, sumBy } from 'lodash';
import {
  Authorized,
  Get,
  JsonController,
  QueryParam,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ImportDataMindslinesService } from 'api/services/import-data-mindslines.service';

// Response Types
// ?|> getCompletition
class getCompletitionResponse {
  @IsNumber()
  completed: number;

  @IsNumber()
  in_progress: number;

  @IsNumber()
  not_started: number;
}

// Controller
@Authorized()
@JsonController('/metrics-mindslines')
@OpenAPI({})
export class MetricsMindslinesController {
  constructor(
    private importDataMindslinesService: ImportDataMindslinesService,
  ) {}

  @Get('/completition')
  @ResponseSchema(getCompletitionResponse)
  public async getCompletition(
    @Req() req,
    @QueryParam('email') email?: string,
  ) {
    const skills = await this.importDataMindslinesService.find({
      filter: {
        organisation: req.organisation._id,
        ...(email && { email }),
      },
      select: ['completedCount', 'inProgressCount', 'notStartedCount'],
    });

    return {
      completed: sumBy(skills, 'completedCount'),
      in_progress: sumBy(skills, 'inProgressCount'),
      not_started: sumBy(skills, 'notStartedCount'),
    };
  }

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
    const skills = await this.importDataMindslinesService.distinct(
      {
        filter: {
          organisation: req.organisation._id,
        },
      },
      'skill',
    );

    return skills;
  }

  @Get('/skills')
  @ResponseSchema(undefined)
  public async getSkills(@Req() req, @QueryParam('email') email?: string) {
    const skills = await this.importDataMindslinesService.find({
      filter: {
        organisation: req.organisation._id,
        ...(email && { email }),
      },
      select: ['skill', 'completedPercentage'],
    });

    const groupedSkills = groupBy(skills, 'skill');
    const skillsWithCompletedPercentage = map(groupedSkills, (skill) => ({
      skill: first(skill)?.skill,
      completedPercentage: meanBy(skill, 'completedPercentage'),
    }));

    return skillsWithCompletedPercentage;
  }
}
