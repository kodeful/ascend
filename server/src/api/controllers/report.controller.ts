// src/api/controllers/report.controller.ts

import { Ref } from '@typegoose/typegoose';
import { Type, plainToInstance } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import dayjs, { Dayjs } from 'dayjs';
import { round } from 'lodash';
import { FilterQuery } from 'mongoose';
import {
  Authorized,
  Body,
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
  QueryParams,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ImportAssessment, ImportMetric } from 'api/models/import/import.model';
import {
  ImportDataEvaluation,
  ImportDataEvaluationModel,
} from 'api/models/import-data/import-data-evaluation.model';
import { ImportDataLuminaModel } from 'api/models/import-data/import-data-lumina.model';
import { ImportDataMindslinesModel } from 'api/models/import-data/import-data-mindslines.model';
import {
  ImportDataThreeEyeView,
  ImportDataThreeEyeViewModel,
} from 'api/models/import-data/import-data-three-eye-view.model';
import { Report } from 'api/models/report.model';
import { UserRole } from 'api/models/user.model';
import { ReportService } from 'api/services/report.service';
import { openAIReply } from 'api/services/third-party/openai.service';
import { UserService } from 'api/services/user.service';
import { FilterMeta, FilterQueryParams } from 'api/types/filter.types';
import { mongoId } from 'utils/mongoId';

// -------------------- Response Types --------------------
class filterReportsResponse {
  @ValidateNested({ each: true })
  @Type(() => Report)
  data!: Report[];

  @ValidateNested()
  @Type(() => FilterMeta)
  meta!: FilterMeta;
}

// -------------------- Controller --------------------
@Authorized()
@JsonController('/report')
@OpenAPI({})
export class ReportController {
  constructor(
    private reportService: ReportService,
    private userService: UserService,
  ) {}

  // ---------- List / filter reports ----------
  @Get()
  @ResponseSchema(filterReportsResponse)
  public async filterReports(
    @Req() req: any,
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
    @Body() { title, subtitle, type, rangeDate, horizontal, learner }: any,
  ) {
    await this.reportService.create({
      organisation: req.organisation._id,
      title,
      subtitle,
      type,
      rangeDate,
      horizontal,
      learner,
    });

    return {};
  }

  @Get('/:reportId')
  @ResponseSchema(undefined)
  public async getReportById(@Param('reportId') reportId: Ref<Report>) {
    return this.reportService.findOneById(reportId);
  }

  // ---------- Group (cohort) data ----------
  @Get('/data/group')
  @ResponseSchema(undefined)
  public async getGroupData(
    @Req() req: any,
    @QueryParam('rangeData') rangeData: string,
  ) {
    const organisation = req.organisation;
    const { from, to } = this.getRangeData(rangeData);

    // Count learners in org
    const learnersIncluded = await this.userService.find({
      filter: {
        workspaces: {
          $elemMatch: {
            organisation: organisation._id,
            role: UserRole.LEARNER,
          },
        },
      },
      select: ['email'],
    });
    const emails = learnersIncluded.map((l) => l.email);

    // Pull evaluations within range
    const evalQuery: FilterQuery<ImportDataEvaluation> = {
      email: { $in: emails.map((e) => new RegExp(`^${e}$`, 'i')) },
      timestamp: { $gte: from.toDate(), $lt: to.toDate() },
    } as any;
    const evalDocs = await ImportDataEvaluationModel.find(evalQuery).lean();

    // Skills present
    const skillSet = new Set<string>();
    for (const r of evalDocs) if (r?.skill) skillSet.add(r.skill);
    const skills = Array.from(skillSet).sort((a, b) => a.localeCompare(b));

    // Per skill, compute per-learner earliest/latest, then average across learners
    type Trio = { knowledge: number; application: number; confidence: number };
    const bySkillLearner = new Map<
      string,
      Map<
        string,
        { first?: Trio; last?: Trio; firstTs?: number; lastTs?: number }
      >
    >();

    for (const r of evalDocs) {
      const s = r.skill;
      const e = r.email?.toLowerCase() ?? '';
      if (!s || !e) continue;
      if (!bySkillLearner.has(s)) bySkillLearner.set(s, new Map());
      const map = bySkillLearner.get(s);

      const ts = +new Date(r.timestamp);
      const trio: Trio = {
        knowledge: Number(r.knowledge ?? 0),
        application: Number(r.application ?? 0),
        confidence: Number(r.confidence ?? 0),
      };

      const slot = map.get(e) ?? {};
      if (slot.firstTs == null || ts < slot.firstTs) {
        slot.first = trio;
        slot.firstTs = ts;
      }
      if (slot.lastTs == null || ts > slot.lastTs) {
        slot.last = trio;
        slot.lastTs = ts;
      }
      map.set(e, slot);
    }

    const skillsOut = skills.map((s) => {
      const map = bySkillLearner.get(s) ?? new Map();
      let beforeSum = 0,
        latestSum = 0,
        nB = 0,
        nL = 0,
        improved = 0,
        totalPairs = 0;

      for (const [, v] of map) {
        if (v.first) {
          const avgB =
            (v.first.knowledge + v.first.application + v.first.confidence) / 3;
          beforeSum += avgB;
          nB++;
        }
        if (v.last) {
          const avgL =
            (v.last.knowledge + v.last.application + v.last.confidence) / 3;
          latestSum += avgL;
          nL++;
        }
        if (v.first && v.last) {
          // FIX: divide the whole difference by 3, not just the RHS
          const d =
            (v.last.knowledge +
              v.last.application +
              v.last.confidence -
              (v.first.knowledge + v.first.application + v.first.confidence)) /
            3;
          if (d > 0) improved++;
          totalPairs++;
        }
      }

      const beforeAvg = nB ? beforeSum / nB : 0;
      const latestAvg = nL ? latestSum / nL : beforeAvg;
      const delta = latestAvg - beforeAvg;
      const improvedShare = totalPairs ? improved / totalPairs : 0;

      return {
        skill: s,
        before: round(beforeAvg, 1),
        latest: round(latestAvg, 1),
        delta: round(delta, 1),
        improvedShare: round(improvedShare, 2), // fraction 0..1 (format as % in UI if needed)
      };
    });

    // Three-eye view cohort averages in window
    const threeQuery: FilterQuery<ImportDataThreeEyeView> = {
      email: { $in: emails.map((e) => new RegExp(`^${e}$`, 'i')) },
      timestamp: { $gte: from.toDate(), $lt: to.toDate() },
    } as any;
    const threeDocs = await ImportDataThreeEyeViewModel.find(threeQuery).lean();

    const threeAgg = {
      [ImportAssessment.SELF_EVALUATION]: { sum: 0, n: 0 },
      [ImportAssessment.PEER_EVALUATION]: { sum: 0, n: 0 },
      [ImportAssessment.FACILITATOR_EVALUATION]: { sum: 0, n: 0 },
    };
    for (const r of threeDocs) {
      const key = r.assessment as keyof typeof threeAgg;
      if (!threeAgg[key]) continue;
      threeAgg[key].sum += Number(r.score ?? 0);
      threeAgg[key].n += 1;
    }
    const threeEye = {
      self: threeAgg[ImportAssessment.SELF_EVALUATION].n
        ? round(
            threeAgg[ImportAssessment.SELF_EVALUATION].sum /
              threeAgg[ImportAssessment.SELF_EVALUATION].n,
            1,
          )
        : null,
      peer: threeAgg[ImportAssessment.PEER_EVALUATION].n
        ? round(
            threeAgg[ImportAssessment.PEER_EVALUATION].sum /
              threeAgg[ImportAssessment.PEER_EVALUATION].n,
            1,
          )
        : null,
      facilitator: threeAgg[ImportAssessment.FACILITATOR_EVALUATION].n
        ? round(
            threeAgg[ImportAssessment.FACILITATOR_EVALUATION].sum /
              threeAgg[ImportAssessment.FACILITATOR_EVALUATION].n,
            1,
          )
        : null,
    };

    const insights = await this.getCohortInsightsFromAI(skillsOut, threeEye);

    return {
      cohortName: 'Cohort',
      company: organisation.name,
      periodFrom: from?.format('YYYY-MM-DD'),
      periodTo: to?.format('YYYY-MM-DD'),
      assessmentsIncluded: learnersIncluded.length,
      skills: skillsOut,
      threeEye,
      insights,
    };
  }

  // ---------- Individual data ----------
  @Get('/data/individual')
  @ResponseSchema(undefined)
  public async getIndividualData(
    @Req() req: any,
    @QueryParam('learner') learner: string,
    @QueryParam('rangeData') rangeData: string,
  ) {
    const organisation = req.organisation;
    const { from, to } = this.getRangeData(rangeData);
    const learnerEmail = await this.resolveLearnerEmail(learner);

    // Dates array [from, to)
    const dates: string[] = [];
    let cursor = from.clone().startOf('day');
    const toStart = to.clone().startOf('day');
    while (cursor.isBefore(toStart, 'day')) {
      dates.push(cursor.format('YYYY-MM-DD'));
      cursor = cursor.add(1, 'day');
    }

    // Fetch all sources in parallel
    const [evalDocs, luminaDocs, mindDocs, threeDocs] = await Promise.all([
      ImportDataEvaluationModel.find({
        email: new RegExp(`^${this.escape(learnerEmail)}$`, 'i'),
        timestamp: { $gte: from.toDate(), $lt: to.toDate() },
      }).lean(),
      ImportDataLuminaModel.find({
        email: new RegExp(`^${this.escape(learnerEmail)}$`, 'i'),
        timestamp: { $gte: from.toDate(), $lt: to.toDate() },
      }).lean(),
      ImportDataMindslinesModel.find({
        email: new RegExp(`^${this.escape(learnerEmail)}$`, 'i'),
      }).lean(),
      ImportDataThreeEyeViewModel.find({
        email: new RegExp(`^${this.escape(learnerEmail)}$`, 'i'),
        timestamp: { $gte: from.toDate(), $lt: to.toDate() },
      }).lean(),
    ]);

    // Skills set from evaluations + lumina keys
    const skillSet = new Set<string>();
    for (const r of evalDocs) if (r?.skill) skillSet.add(r.skill);
    for (const l of luminaDocs)
      Object.keys(l.skills ?? {}).forEach((k) => skillSet.add(k));
    const skills = Array.from(skillSet).sort((a, b) => a.localeCompare(b));

    // Aggregate per-day K/C/A
    const byDay = new Map<
      string,
      { n: number; k: number; c: number; a: number }
    >();
    for (const r of evalDocs) {
      const d = dayjs(r.timestamp).format('YYYY-MM-DD');
      const cur = byDay.get(d) ?? { n: 0, k: 0, c: 0, a: 0 };
      cur.n += 1;
      cur.k += r.knowledge ?? 0;
      cur.c += r.confidence ?? 0;
      cur.a += r.application ?? 0;
      byDay.set(d, cur);
    }

    const globalTimelineRaw = dates.map((d) => {
      const agg = byDay.get(d);
      if (!agg || !agg.n)
        return {
          label: d,
          global: null as number | null,
          confidence: null as number | null,
        };
      const kAvg = agg.k / agg.n;
      const cAvg = agg.c / agg.n;
      const aAvg = agg.a / agg.n;
      const g = (kAvg + cAvg + aAvg) / 3;
      return { label: d, global: round(g, 1), confidence: round(cAvg, 1) };
    });

    // forward-fill for smoother charting
    let lastG: number | null = null,
      lastC: number | null = null;
    const globalTimeline = globalTimelineRaw.map((row) => {
      if (row.global == null && lastG != null) row.global = lastG;
      if (row.confidence == null && lastC != null) row.confidence = lastC;
      lastG = row.global;
      lastC = row.confidence;
      return row;
    });

    // Per-skill begin/end across window (earliest vs latest)
    evalDocs.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
    const firstLastBySkill = new Map<
      string,
      { first?: ImportDataEvaluation; last?: ImportDataEvaluation }
    >();
    for (const s of skills) {
      const rows = evalDocs.filter((r) => r.skill === s);
      if (rows.length) {
        firstLastBySkill.set(s, {
          first: rows[0],
          last: rows[rows.length - 1],
        });
      }
    }

    const skillsOutput = skills.map((s) => {
      const pair = firstLastBySkill.get(s) ?? {};
      const kb = pair.first?.knowledge ?? null;
      const ka = pair.last?.knowledge ?? kb ?? null;
      const ab = pair.first?.application ?? null;
      const aa = pair.last?.application ?? ab ?? null;
      const cb = pair.first?.confidence ?? null;
      const ca = pair.last?.confidence ?? cb ?? null;

      return {
        skill: s,
        aspects: {
          [ImportMetric.KNOWLEDGE]: {
            begin: kb == null ? null : round(kb),
            end: ka == null ? null : round(ka),
          },
          [ImportMetric.APPLICATION]: {
            begin: ab == null ? null : round(ab),
            end: aa == null ? null : round(aa),
          },
          [ImportMetric.CONFIDENCE]: {
            begin: cb == null ? null : round(cb),
            end: ca == null ? null : round(ca),
          },
        },
      };
    });

    // Three-eye view (individual)
    const threeAgg = {
      [ImportAssessment.SELF_EVALUATION]: { sum: 0, n: 0 },
      [ImportAssessment.PEER_EVALUATION]: { sum: 0, n: 0 },
      [ImportAssessment.FACILITATOR_EVALUATION]: { sum: 0, n: 0 },
    };
    for (const r of threeDocs) {
      const key = r.assessment as keyof typeof threeAgg;
      if (!threeAgg[key]) continue;
      threeAgg[key].sum += r.score ?? 0;
      threeAgg[key].n += 1;
    }
    const threeEye = {
      self: threeAgg[ImportAssessment.SELF_EVALUATION].n
        ? round(
            threeAgg[ImportAssessment.SELF_EVALUATION].sum /
              threeAgg[ImportAssessment.SELF_EVALUATION].n,
            1,
          )
        : null,
      peer: threeAgg[ImportAssessment.PEER_EVALUATION].n
        ? round(
            threeAgg[ImportAssessment.PEER_EVALUATION].sum /
              threeAgg[ImportAssessment.PEER_EVALUATION].n,
            1,
          )
        : null,
      facilitator: threeAgg[ImportAssessment.FACILITATOR_EVALUATION].n
        ? round(
            threeAgg[ImportAssessment.FACILITATOR_EVALUATION].sum /
              threeAgg[ImportAssessment.FACILITATOR_EVALUATION].n,
            1,
          )
        : null,
    };

    // Mindslines summary
    const mindslines = mindDocs.reduce(
      (acc, r) => {
        acc.completed += r.completedCount ?? 0;
        acc.inProgress += r.inProgressCount ?? 0;
        acc.notStarted += r.notStartedCount ?? 0;
        return acc;
      },
      { completed: 0, inProgress: 0, notStarted: 0 },
    );

    const insights = this.buildIndividualInsights(globalTimeline, skillsOutput);

    return {
      company: organisation.name,
      learner: learnerEmail,
      dates,
      globalTimeline,
      skills: skillsOutput,
      threeEye,
      mindslines,
      insights,
    };
  }

  // -------------------- Helpers --------------------
  private escape(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async resolveLearnerEmail(learner: string): Promise<string> {
    if (learner?.includes('@')) return learner.trim();
    try {
      const user = await this.userService.findOneById(mongoId(learner));
      if (user?.email) return user.email;
    } catch {
      // ignore
    }
    return learner;
  }

  private async getCohortInsightsFromAI(
    skills: Array<{
      skill: string;
      before: number;
      latest: number;
      delta: number;
      improvedShare: number;
    }>,
    threeEye: {
      self: number | null;
      peer: number | null;
      facilitator: number | null;
    },
  ): Promise<string[]> {
    const message = `Generate AI insights for this cohort. Return a JSON object with a property "message" containing HTML (1–3 <p>...</p> paragraphs, one insight per paragraph). Do not include scores or numbers in the insight text.

Cohort data:
${JSON.stringify({ skills, threeEye })}`;

    try {
      const raw = await openAIReply({
        receivedMessage: message,
        prompt: 'report',
      });
      // openAIReply returns the "message" value when AI responds with {"message":"<p>...</p><p>...</p>"}
      const insights = this.splitHtmlMessageIntoInsights(raw);
      if (insights.length > 0) return insights;
    } catch (error) {
      console.error('Error getting cohort insights from AI:', error);
      // fallback to rule-based insights
    }
    return this.buildCohortInsights(skills, threeEye);
  }

  /** Splits an HTML message (e.g. "<p>a</p><p>b</p>") into an array of insight strings. */
  private splitHtmlMessageIntoInsights(html: string): string[] {
    if (!html || typeof html !== 'string') return [];
    const parts = html.match(/<p>[\s\S]*?<\/p>/gi);
    if (!parts?.length) return [];
    return parts
      .map((block) => block.replace(/^<p>|<\/p>$/gi, '').trim())
      .filter(Boolean);
  }

  private buildCohortInsights(
    skills: Array<{
      skill: string;
      before: number;
      latest: number;
      delta: number;
      improvedShare: number;
    }>,
    threeEye: {
      self: number | null;
      peer: number | null;
      facilitator: number | null;
    },
  ): string[] {
    const insights: string[] = [];
    const top = [...skills].sort((a, b) => b.delta - a.delta)[0];
    if (top && top.delta >= 0.5) {
      insights.push(
        `📈 Largest skill gain in ${top.skill} (+${round(top.delta, 1)}).`,
      );
    }
    const align =
      threeEye.self != null && threeEye.peer != null
        ? Math.abs(threeEye.self - threeEye.peer)
        : null;
    if (align != null && align <= 0.6) {
      insights.push(
        '🤝 Peer and self-evaluations are closely aligned, suggesting shared perception of progress.',
      );
    }
    const avgImproved = skills.length
      ? round(
          skills.reduce((s, r) => s + r.improvedShare, 0) / skills.length,
          2,
        )
      : 0;
    if (avgImproved >= 0.6) {
      insights.push(
        `🌱 Majority of learners improved across skills (~${round(
          avgImproved * 100,
        )}%).`,
      );
    }
    if (!insights.length) {
      insights.push('ℹ️ Stable performance across the selected period.');
    }

    return insights;
  }

  private buildIndividualInsights(
    globalTimeline: Array<{
      label: string;
      global: number | null;
      confidence: number | null;
    }>,
    skillsOutput: Array<{
      skill: string;
      aspects: {
        Knowledge: { begin: number | null; end: number | null };
        Application: { begin: number | null; end: number | null };
        Confidence: { begin: number | null; end: number | null };
      };
    }>,
  ): string[] {
    const insights: string[] = [];

    const first = globalTimeline.find((r) => r.global != null)?.global ?? null;
    const last =
      [...globalTimeline].reverse().find((r) => r.global != null)?.global ??
      null;
    if (first != null && last != null) {
      const delta = round(last - first, 1);
      if (Math.abs(delta) >= 0.5) {
        insights.push(
          delta > 0
            ? `🚀 Global score improved by ${delta} over the selected period.`
            : `⚠️ Global score decreased by ${Math.abs(
                delta,
              )} over the selected period.`,
        );
      }
    }

    const movers: Array<{
      skill: string;
      m: keyof typeof ImportMetric;
      d: number;
    }> = [];
    for (const s of skillsOutput) {
      for (const key of ['Knowledge', 'Application', 'Confidence'] as const) {
        const begin = s.aspects[key].begin;
        const end = s.aspects[key].end;
        if (begin != null && end != null)
          movers.push({
            skill: s.skill,
            m: key as any,
            d: round(end - begin, 1),
          });
      }
    }
    movers.sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
    const top2 = movers.slice(0, 2).filter((x) => Math.abs(x.d) >= 0.5);
    for (const t of top2) {
      insights.push(
        t.d >= 0
          ? `📈 ${t.m} improved in ${t.skill} (+${t.d}).`
          : `📉 ${t.m} decreased in ${t.skill} (${t.d}).`,
      );
    }

    if (!insights.length) {
      insights.push('ℹ️ No strong changes detected in the selected period.');
    }

    return insights;
  }

  // Keep this version compatible with your original signature that returns Dayjs
  private getRangeData(rangeData: string): { from: Dayjs; to: Dayjs } {
    let from: Dayjs = dayjs().subtract(1, 'month').startOf('day');
    let to: Dayjs = dayjs().endOf('day');
    switch (rangeData) {
      case 'Last Week':
        from = dayjs().subtract(1, 'week').startOf('week');
        to = dayjs().endOf('week');
        break;
      case 'Last Month':
        from = dayjs().subtract(1, 'month').startOf('month');
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
}
