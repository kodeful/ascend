import { IsNumber, IsString } from 'class-validator';
import { find, forEach, map, mean } from 'lodash';
import {
  Authorized,
  Get,
  JsonController,
  QueryParam,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ImportDataLuminaService } from 'api/services/import-data/import-data-lumina.service';

// Response Types
// ?|> getSkills
class getSkillsData {
  @IsString()
  skill: string;

  @IsNumber()
  percentile: number;
}

// Controller
@Authorized()
@JsonController('/metrics-lumina')
@OpenAPI({})
export class MetricsLuminaController {
  constructor(private importDataLuminaService: ImportDataLuminaService) {}

  @Get('/skills')
  @ResponseSchema(getSkillsData, { isArray: true })
  public async getSkills(@Req() req, @QueryParam('email') email?: string) {
    const importData = await this.importDataLuminaService.find({
      filter: {
        ...(email && { email }),
      },
      select: ['skills'],
    });

    let skills = [];
    forEach(importData, (item) => {
      Object.keys(item.skills).forEach((skill) => {
        const value = item.skills[skill];
        if (!value) return;

        const skillData = find(skills, (skill) => skill.skill === skill);
        if (!skillData) {
          skills.push({
            skill,
            values: [value],
          });

          return;
        }

        skillData.values.push(value);
      });
    });
    skills = map(skills, (skill) => {
      return {
        skill: skill.skill,
        percentile: mean(skill.values),
      };
    });

    return skills;
  }
}
