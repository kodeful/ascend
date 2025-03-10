import { Type, plainToInstance } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  Authorized,
  Body,
  Get,
  JsonController,
  Post,
  QueryParams,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Report } from 'api/models/report.model';
import { ReportService } from 'api/services/report.service';
import { FilterMeta, FilterQueryParams } from 'api/types/filter.types';
import { mongoId } from 'utils/mongoId';

// Response Types
// ?|> filterReports
class filterReportsResponse {
  @ValidateNested({ each: true })
  @Type(() => Report)
  data: Report[];

  @ValidateNested()
  @Type(() => FilterMeta)
  meta: FilterMeta;
}

// Controller
@Authorized()
@JsonController('/report')
@OpenAPI({})
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get()
  @ResponseSchema(filterReportsResponse)
  public async filterReports(
    @Req() req: any,
    // @CurrentUser() user: User,
    @QueryParams() queryParams: FilterQueryParams<Report>,
  ) {
    const { limit, page, sort, filter } = plainToInstance(
      FilterQueryParams,
      queryParams,
    );

    return this.reportService.filter({
      limit,
      page,
      sort,
      filter,
      defaultFilter: {},
      preFilter: {
        organisation: mongoId(req.organisation._id),
      },
      Model: Report,
    });
  }

  @Post()
  @ResponseSchema(undefined)
  public async createReport(
    @Req() req: any,
    @Body() { title, subtitle, type, rangeDate, horizontal }: any,
  ) {
    await this.reportService.create({
      organisation: req.organisation._id,
      title,
      subtitle,
      type,
      rangeDate,
      horizontal,
    });

    return {};
  }
}
