import type { ChatCompletionToolMessageParam } from 'openai/resources/chat/completions';

import { ImportDataEvaluationModel } from 'api/models/import-data/import-data-evaluation.model';
import { ImportDataLuminaModel } from 'api/models/import-data/import-data-lumina.model';
import { ImportDataMindslinesModel } from 'api/models/import-data/import-data-mindslines.model';
import { ImportDataThreeEyeViewModel } from 'api/models/import-data/import-data-three-eye-view.model';
import { safeJson } from 'utils/safeJson';

type ToolArgs = Record<string, unknown>;

const toDate = (s?: unknown) =>
  typeof s === 'string' ? new Date(s) : undefined;
const clamp = (n: number, lo: number, hi: number) =>
  Math.min(Math.max(n, lo), hi);

/**
 * Handle ONLY the four new tools.
 */
export async function executeAscendToolCall(
  toolCallId: string,
  functionName: string,
  rawArgs: string | null | undefined,
): Promise<ChatCompletionToolMessageParam> {
  const args = safeJson<ToolArgs>(rawArgs, {});

  switch (functionName) {
    // ----------------- import-data-evaluation -----------------
    case 'getImportDataEvaluation': {
      const {
        email,
        skill,
        fromTs,
        toTs,
        limit = 100,
        sort = 'desc',
        fields,
      } = args as {
        email?: string;
        skill?: string;
        fromTs?: string;
        toTs?: string;
        limit?: number;
        sort?: 'asc' | 'desc';
        fields?: Array<
          | 'email'
          | 'skill'
          | 'timestamp'
          | 'knowledge'
          | 'confidence'
          | 'application'
        >;
      };

      const query: Record<string, any> = {};
      if (email) query.email = { $regex: email, $options: 'i' };
      if (skill) query.skill = { $regex: skill, $options: 'i' };
      if (fromTs || toTs) {
        query.timestamp = {};
        if (fromTs) query.timestamp['$gte'] = toDate(fromTs);
        if (toTs) query.timestamp['$lt'] = toDate(toTs);
      }

      console.log('query', query);
      const projection =
        Array.isArray(fields) && fields.length
          ? Object.fromEntries(fields.map((f) => [f, 1]))
          : undefined;

      const rows = await ImportDataEvaluationModel.find(query, projection)
        .sort({ timestamp: sort === 'asc' ? 1 : -1 })
        .limit(clamp(limit ?? 100, 1, 500))
        .lean();

      return {
        role: 'tool',
        tool_call_id: toolCallId,
        content: JSON.stringify(
          rows.map((r) => ({
            email: r.email,
            skill: r.skill,
            timestamp: r.timestamp,
            knowledge: r.knowledge,
            confidence: r.confidence,
            application: r.application,
          })),
        ),
      };
    }

    // ----------------- import-data-lumina -----------------
    case 'getImportDataLumina': {
      const {
        email,
        fromTs,
        toTs,
        limit = 100,
        sort = 'desc',
        skillFilter,
        flatten = false,
        fields,
      } = args as {
        email?: string;
        fromTs?: string;
        toTs?: string;
        limit?: number;
        sort?: 'asc' | 'desc';
        skillFilter?: string;
        flatten?: boolean;
        fields?: Array<'email' | 'timestamp' | 'skills'>;
      };

      const query: Record<string, any> = {};
      if (email) query.email = { $regex: email, $options: 'i' };
      if (fromTs || toTs) {
        query.timestamp = {};
        if (fromTs) query.timestamp['$gte'] = toDate(fromTs);
        if (toTs) query.timestamp['$lt'] = toDate(toTs);
      }

      const projection =
        Array.isArray(fields) && fields.length && !flatten
          ? Object.fromEntries(fields.map((f) => [f, 1]))
          : undefined;

      const docs = await ImportDataLuminaModel.find(query, projection)
        .sort({ timestamp: sort === 'asc' ? 1 : -1 })
        .limit(clamp(limit ?? 100, 1, 500))
        .lean();

      if (!flatten) {
        const out = docs.map((d) => ({
          email: d.email,
          timestamp: d.timestamp,
          skills: d.skills as Record<string, number>,
        }));
        return {
          role: 'tool',
          tool_call_id: toolCallId,
          content: JSON.stringify(out),
        };
      }

      const regex = skillFilter ? new RegExp(skillFilter, 'i') : null;
      const flat: Array<{
        email: string;
        timestamp: string | Date;
        skill: string;
        percent: number;
      }> = [];
      for (const d of docs) {
        for (const [k, v] of Object.entries(d.skills ?? {})) {
          if (regex && !regex.test(k)) continue;
          flat.push({
            email: d.email,
            timestamp: d.timestamp,
            skill: k,
            percent: Number(v),
          });
        }
      }
      return {
        role: 'tool',
        tool_call_id: toolCallId,
        content: JSON.stringify(flat),
      };
    }

    // ----------------- import-data-mindslines -----------------
    case 'getImportDataMindslines': {
      const {
        email,
        limit = 100,
        sort = 'asc',
        fields,
      } = args as {
        email?: string;
        limit?: number;
        sort?: 'asc' | 'desc';
        fields?: Array<
          'email' | 'completedCount' | 'inProgressCount' | 'notStartedCount'
        >;
      };

      const query: Record<string, any> = {};
      if (email) query.email = { $regex: email, $options: 'i' };

      const projection =
        Array.isArray(fields) && fields.length
          ? Object.fromEntries(fields.map((f) => [f, 1]))
          : undefined;

      const rows = await ImportDataMindslinesModel.find(query, projection)
        .sort({ email: sort === 'asc' ? 1 : -1 })
        .limit(clamp(limit ?? 100, 1, 500))
        .lean();

      const out = rows.map((r) => ({
        email: r.email,
        completedCount: r.completedCount ?? 0,
        inProgressCount: r.inProgressCount ?? 0,
        notStartedCount: r.notStartedCount ?? 0,
      }));
      return {
        role: 'tool',
        tool_call_id: toolCallId,
        content: JSON.stringify(out),
      };
    }

    // ----------------- import-data-three-eye-view -----------------
    case 'getImportDataThreeEyeView': {
      const {
        email,
        skill,
        metric,
        assessment,
        fromTs,
        toTs,
        limit = 100,
        sort = 'desc',
        fields,
      } = args as {
        email?: string;
        skill?: string;
        metric?: 'Knowledge' | 'Confidence' | 'Application';
        assessment?:
          | 'Peer Evaluation'
          | 'Self-evaluation'
          | 'Facilitator Evaluation';
        fromTs?: string;
        toTs?: string;
        limit?: number;
        sort?: 'asc' | 'desc';
        fields?: Array<
          'email' | 'skill' | 'metric' | 'assessment' | 'score' | 'timestamp'
        >;
      };

      const query: Record<string, any> = {};
      if (email) query.email = { $regex: email, $options: 'i' };
      if (skill) query.skill = { $regex: skill, $options: 'i' };
      if (metric) query.metric = metric;
      if (assessment) query.assessment = assessment;
      if (fromTs || toTs) {
        query.timestamp = {};
        if (fromTs) query.timestamp['$gte'] = toDate(fromTs);
        if (toTs) query.timestamp['$lt'] = toDate(toTs);
      }

      const projection =
        Array.isArray(fields) && fields.length
          ? Object.fromEntries(fields.map((f) => [f, 1]))
          : undefined;

      const rows = await ImportDataThreeEyeViewModel.find(query, projection)
        .sort({ timestamp: sort === 'asc' ? 1 : -1 })
        .limit(clamp(limit ?? 100, 1, 500))
        .lean();

      const out = rows.map((r) => ({
        email: r.email,
        skill: r.skill,
        metric: r.metric, // Knowledge | Confidence | Application
        assessment: r.assessment, // Peer/Self/Facilitator
        score: r.score,
        timestamp: r.timestamp,
      }));
      return {
        role: 'tool',
        tool_call_id: toolCallId,
        content: JSON.stringify(out),
      };
    }

    default:
      return {
        role: 'tool',
        tool_call_id: toolCallId,
        content: JSON.stringify({ error: `Unknown tool: ${functionName}` }),
      };
  }
}
