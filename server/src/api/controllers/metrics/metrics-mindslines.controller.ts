import { IsNumber } from 'class-validator';
import { sumBy } from 'lodash';
import {
  Authorized,
  Get,
  JsonController,
  QueryParam,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ImportDataMindslinesService } from 'api/services/import-data/import-data-mindslines.service';

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
}
