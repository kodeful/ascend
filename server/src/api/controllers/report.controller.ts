import { Type, plainToInstance } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import dayjs from 'dayjs';
import { round } from 'lodash';
import {
  Authorized,
  Body,
  Get,
  JsonController,
  Post,
  QueryParam,
  QueryParams,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Report } from 'api/models/report.model';
import { UserRole } from 'api/models/user.model';
import { ImportDataService } from 'api/services/import-data.service';
import { ReportService } from 'api/services/report.service';
import { UserService } from 'api/services/user.service';
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
  constructor(
    private reportService: ReportService,
    private userService: UserService,
    private importDataService: ImportDataService,
  ) {}

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

  private getRangeData(rangeData: string) {
    let from, to;
    switch (rangeData) {
      case 'Last Week':
        from = dayjs().subtract(1, 'week');
        to = dayjs().endOf('week');
        break;
      case 'Last Month':
        from = dayjs().subtract(1, 'month');
        to = dayjs().endOf('month');
        break;
      case 'Last 3 Months':
        from = dayjs().subtract(3, 'months').startOf('month');
        to = dayjs().endOf('month');
        break;
      case 'Last 6 Months':
        from = dayjs().subtract(6, 'months').startOf('month');
        to = dayjs().endOf('month');
        break;
      case 'Last Year':
        from = dayjs().subtract(1, 'year').startOf('year');
        to = dayjs().endOf('year');
        break;
    }

    return { from, to };
  }

  @Get('/data/group')
  @ResponseSchema(undefined)
  public async getGroupData(
    @Req() req: any,
    @QueryParam('rangeData') rangeData: string,
  ) {
    const organisation = req.organisation;
    const { from, to } = this.getRangeData(rangeData);

    const learnersIncluded = await this.userService.count({
      workspaces: {
        $elemMatch: {
          organisation: organisation._id,
          role: UserRole.LEARNER,
        },
      },
    });

    const SKILLS = [
      'Self-Awareness',
      'Critical Thinking',
      'Strategic Thinking',
      'Communication',
      'Decision-Making',
      'Adaptability',
    ];

    return {
      cohortName: 'Emerging Leaders – Spring',
      company: organisation.name,
      periodFrom: from.toISOString(),
      periodTo: to.toISOString(),
      assessmentsIncluded: learnersIncluded,
      skills: SKILLS.map((s, i) => {
        const before = 7 + (i % 3); // 7..9
        const latest = before + (i % 2 === 0 ? 2.1 : 0.6); // some improve strongly, some lightly
        const delta = latest - before;
        const improvedShare = i % 2 === 0 ? 0.78 : 0.56;
        return { skill: s, before, latest, delta, improvedShare };
      }),
      // 3-Eye global (all skills combined)
      threeEye: { self: 11.1, peer: 10.6, facilitator: 10.9 },
      insights: [
        '📈 The cohort showed a 23% surge in Communication scores, suggesting rapid adoption of collaborative habits.',
        '🤝 Peer evaluations rose faster than self-evaluations, hinting at growing external recognition of applied skills.',
        '🧠 Critical Thinking improvements clustered after mid-program simulations — immersive scenarios appear highly effective.',
        '⚡ Momentum peaked in month 3, with slight plateauing thereafter — consider introducing stretch challenges to sustain growth.',
        '🌱 Adaptability gains were consistent but modest — targeted role-rotation could accelerate development.',
      ],
    };
  }

  @Get('/data/individual')
  @ResponseSchema(undefined)
  public async getIndividualData(
    @Req() req: any,
    @QueryParam('learner') learner: string,
    @QueryParam('rangeData') rangeData: string,
  ) {
    const organisation = req.organisation;
    const { from, to } = this.getRangeData(rangeData);

    const dates = [];
    let curr = from.clone();
    while (curr.isBefore(to, 'day')) {
      dates.push(curr.format('YYYY-MM-DD'));
      curr = curr.add(1, 'day');
    }

    const skills = await this.importDataService.distinct(
      {
        filter: {
          organisation: organisation._id,
          date: { $in: dates },
        },
      },
      'skill',
    );

    return {
      company: organisation.name,
      dates,
      // globalTimeline: [
      //   { label: 'A1', date: '2025-02-01', global: 8.7, confidence: 8.1 },
      //   { label: 'A2', date: '2025-04-15', global: 10.2, confidence: 9.3 },
      //   { label: 'A3', date: '2025-07-25', global: 11.4, confidence: 10.6 },
      // ],
      globalTimeline: dates.map((d, i) => {
        // Add some modest random variation while keeping a smooth trend.
        // Simulate more realistic progress with small growing global/confidence values.
        const baseGlobal = 8.5 + i * 0.5 + Math.random() * 0.4 - 0.2;
        const baseConfidence = 8.0 + i * 0.45 + Math.random() * 0.4 - 0.2;

        return {
          label: d,
          global: round(baseGlobal, 1),
          confidence: round(baseConfidence, 1),
        };
      }),
      skills: skills.map((s, i) => {
        const kb = 2.9 + (i % 3) * 0.3; // before knowledge
        const ka = kb + (i % 2 === 0 ? 0.9 : 0.4); // after knowledge
        const ab = 2.7 + ((i + 1) % 3) * 0.3; // before application
        const aa = ab + (i % 2 === 0 ? 0.9 : 0.3);
        const cb = 2.6 + ((i + 2) % 3) * 0.3; // before confidence
        const ca = cb + (i % 2 === 0 ? 1.2 : 0.5);

        return {
          skill: s,
          aspects: {
            Knowledge: { begin: round(kb), end: round(ka) },
            Application: { begin: round(ab), end: round(aa) },
            Confidence: { begin: round(cb), end: round(ca) },
          },
        };
      }),
      threeEye: { self: 11.5, peer: 10.8, facilitator: 11.1 },
      insights: [
        '🚀 Significant jump in Global Score (+2.7) between A1 and A3 — strong upward momentum maintained.',
        '💡 Confidence gains outpaced skill application, suggesting readiness to take on higher-stakes projects.',
        '📚 Application scores improved steadily, especially in Strategic Thinking (+1.1) — evidence of better decision structuring.',
        '🔄 Slight dip in Adaptability mid-cycle recovered by final assessment — potential resilience growth.',
        '🤝 Peer feedback alignment with self-assessment increased, indicating greater self-awareness.',
      ],
    };
  }
}
