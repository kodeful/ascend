import { Exclude, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import {
  ROICalculator,
  ROICalculatorFields,
} from 'api/models/roi-calculator.model';
import { User } from 'api/models/user.model';
import { ROICalculatorService } from 'api/services/roi-calculator.service';
import { roiCalculations } from 'utils/roi';

// ?|> findROI
class findROIResponse {
  @ValidateNested()
  @Type(() => ROICalculator)
  data: ROICalculator;
}

// ?|> calculateROI
class calculateROIBody extends ROICalculatorFields {
  @Exclude()
  @IsOptional()
  protected _: null;
}

// Controller
@Authorized()
@JsonController('/roi-calculator')
@OpenAPI({})
export class ROICalculatorController {
  constructor(private roiCalculatorService: ROICalculatorService) {}

  @Get()
  @ResponseSchema(findROIResponse)
  public async findROI(@CurrentUser() user: User) {
    const data = await this.roiCalculatorService.findOne({
      filter: { organisation: user.organisation },
    });

    return { data };
  }

  @Post('/calculate')
  @ResponseSchema(undefined)
  public async calculateROI(
    @CurrentUser() user: User,
    @Body()
    { ...roiFields }: calculateROIBody,
  ) {
    const caluclationExists = await this.roiCalculatorService.exists({
      filter: { organisation: user.organisation },
    });

    const roiCalculator = {
      fields: roiFields,
      result: roiCalculations(roiFields),
    };

    if (caluclationExists) {
      await this.roiCalculatorService.updateOneById(caluclationExists._id, {
        ...roiCalculator,
      });
    } else {
      await this.roiCalculatorService.create({
        organisation: user.organisation,
        ...roiCalculator,
      });
    }

    return {};
  }
}
