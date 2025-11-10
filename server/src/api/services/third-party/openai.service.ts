import { Ref } from '@typegoose/typegoose';
import { first } from 'lodash';
import { attempt } from 'lodash';
import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
  ChatCompletionToolMessageParam,
} from 'openai/resources/chat/completions';
import { Service } from 'typedi';

import {
  ImportData,
  ImportDataModel,
} from 'api/models/import/import-data.model';
import { Organisation } from 'api/models/organisation.model';
import { env } from 'env';

/**
 * Utility: safe JSON parse
 * Replaced with _.attempt from lodash for error handling
 */
function safeJson<T = any>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  const result = attempt(() => JSON.parse(raw) as T);
  return result instanceof Error ? fallback : result;
}

/**
 * Define tool (function) schemas for OpenAI tool calls.
 * We keep them minimal and stable — no external deps required.
 */
const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getImportData',
      description:
        'Fetch import data rows for the organisation. Supports filtering and limiting.',
      parameters: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description:
              'Filter by user email (exact match). Example: "alice@example.com".',
          },
          skill: {
            type: 'string',
            description: 'Filter by skill name (exact match).',
          },
          metric: {
            type: 'string',
            description:
              'Filter by metric type (e.g., "knowledge", "confidence", "application").',
          },
          fromTs: {
            type: 'string',
            description:
              'ISO timestamp lower bound (inclusive) for createdAt/timestamp filtering.',
          },
          toTs: {
            type: 'string',
            description:
              'ISO timestamp upper bound (exclusive) for createdAt/timestamp filtering.',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 500,
            description: 'Maximum number of records to return. Default 100.',
          },
          sort: {
            type: 'string',
            enum: ['asc', 'desc'],
            description:
              'Sort by timestamp ascending or descending. Default "desc".',
          },
          fields: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Optional projection fields to include. Example: ["email","skill","metric","score","timestamp"].',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getAggregateMetrics',
      description:
        'Return aggregate analytics (avg/min/max/count) grouped by skill and/or metric for the organisation.',
      parameters: {
        type: 'object',
        properties: {
          groupBy: {
            type: 'array',
            items: { type: 'string', enum: ['skill', 'metric', 'email'] },
            description:
              'Which fields to group by. Example: ["skill","metric"]. Default ["skill","metric"].',
          },
          email: {
            type: 'string',
            description:
              'Optional filter by email before aggregation (exact match).',
          },
          skill: {
            type: 'string',
            description: 'Optional filter by skill before aggregation.',
          },
          metric: {
            type: 'string',
            description: 'Optional filter by metric before aggregation.',
          },
          fromTs: {
            type: 'string',
            description:
              'ISO timestamp lower bound (inclusive) for filtering prior to aggregation.',
          },
          toTs: {
            type: 'string',
            description:
              'ISO timestamp upper bound (exclusive) for filtering prior to aggregation.',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 1000,
            description: 'Max groups to return. Default 200.',
          },
        },
      },
    },
  },
];

/**
 * System prompt keeps the platform description and instructions,
 * but NO organisation data dump — the model must call tools to fetch.
 */
const SYSTEM_PROMPT = `
You're a helpful assistant that can answer questions and help with analytics for platform Ascend.

PLATFORM DESCRIPTION

Ascend is an impact measurement platform for leadership development programs, based on 'people intelligence'.

Ascend captures, evaluates and visualizes the learning path of people in a 
leadership program in 3 dimensions: knowledge, confidence and 
application, before, during and after the program, for each skill to be 
developed, in order to provide data on the performance of each person and 
extract information that allows inferring trends and forecasts and thus 
being able to give recommendations to people on what actions to take in 
order to grow and continue on their path of transformation. Additionally, 
Ascend provides 3 views for each skill: one's own, that of third parties and 
that of the facilitator. These views allow inferring additional information 
regarding the characteristics of each one and proposes strategies and 
aspects to reinforce, derived from the evaluations.

How Ascend metrics and measurements work.

Add the scores from the three sections to obtain a total score in a range of 
15 to 45 points. This overall sum allows the assessed area to be evaluated in
a comprehensive manner.

- 15-23 points (Low level): The person may be in an early stage of 
development in the assessed leadership area. It is recommended to 
work on basic knowledge and self-confidence, as well as to implement 
daily practices in the assessed area.

- 24-33 points (Medium level): The person has a foundation in the 
assessed area and shows certain levels of confidence and practice, but
lacks consistency. He or she may benefit from additional training and 
more structured application.

- 34-45 points (High level): The person has a solid foundation in the 
assessed area and confidence in his or her ability to apply these 
concepts in leadership.

DISCREPANCY ANALYSIS

When there are notable discrepancies between the three areas assessed (knowledge, confidence and application) in the test, the analysis can focus on identifying imbalances between these dimensions and providing specific recommendations to achieve greater consistency.
Below is a description of how to interpret and recommend in different cases of discrepancy:

1. High knowledge, low confidence, low application
• Interpretation: The person has solid knowledge about the area being assessed, but lacks confidence in putting it into practice. This may indicate that they understand the theoretical concepts, but do not feel confident enough to put this knowledge into practice or implement it.
• Recommendation: Encourage practical experiences in safe environments, such as pilot projects or simulations, where the person can apply their knowledge without fear of serious repercussions. Self-confidence exercises and mentoring with expert leaders in the area being assessed may also be useful to observe the practice in action and receive positive feedback.

2. Low knowledge, high confidence, low application
• Interpretation: The person is confident in their abilities in the area being assessed, but their theoretical understanding is limited and their actual application of the concepts is low. This profile may indicate confidence based on previous successful experiences or a positive attitude, but a lack of knowledge limits their effectiveness.
• Recommendation: Provide formal training in the assessed area (readings, courses, or workshops) to strengthen the knowledge base. This training will allow for a more structured and effective application. Also, suggest that the individual document and evaluate each process carried out in this area as it will help formalize their experience.

3. High knowledge, high confidence, low application
• Interpretation: The individual knows about the assessed area and is confident in their abilities, but there is a lack of application at work. This may reflect a disconnect between knowing and doing, or that external factors (such as a rigid environment or lack of opportunities) are limiting implementation.
• Recommendation: Suggest that the individual look for specific opportunities to implement their knowledge in this area. They may also be encouraged to discuss with their superiors how to apply these concepts in their current role. Making an action plan can help them gradually integrate these practices.

4. Low knowledge, low confidence, high application
• Interpretation: The person applies some strategies related to the assessed area, but lacks a solid theoretical understanding and confidence in their ability. This can lead to applying tactics without a clear vision, which can be ineffective or disorganized.
• Recommendation: Recommend that they strengthen their understanding of this area through basic training. This knowledge will give them a theoretical basis for understanding the why and how of practices in the area. In addition, a focus on small wins and constant feedback can increase their confidence.

5. High knowledge, low confidence, high application
• Interpretation: The person has good knowledge and applies some strategies, but lacks confidence. This situation could indicate that, although they act, they doubt their own abilities and fear failure or judgment.
• Recommendation: Recommend that the person reflect on their achievements and document their successes in situations related to this area. In addition, a mentor or coach can be useful to reinforce their self-confidence. Practicing visualization and positive self-talk can help build self-confidence.

6. Low knowledge, high confidence, high application
• Interpretation: The person displays confidence and an active disposition in the area, but lacks a solid theoretical foundation. This could lead to practical applicability that, while active, is possibly unstructured or based on assumptions.
• Recommendation: Suggest training in the area to consolidate knowledge and increase the effectiveness of its applications. This could include workshops. In addition, this person can be encouraged to document their experiences, so that they can review and improve their current practices with solid foundations.

7. High application with low knowledge and confidence
• Interpretation: The person is applying concepts in practice, but does not feel particularly confident or possess deep formal knowledge. This can lead to uncertainty or lack of consistency in implementation.
• Recommendation: Reinforce formal training and self-confidence. Suggest that they seek positive and constructive feedback from colleagues or superiors to strengthen their confidence in their abilities. Foster theoretical understanding so that their efforts are more structured and effective.

General recommendations for balancing the three areas
• Develop a personalized action plan with short/medium/long-term goals targeting the lowest-scoring area.
• Continuous evaluation and periodic self-assessment.
• Mentoring and practical learning.
• Apply theory in low-risk projects to build confidence and skills.

MESSAGE INSTRUCTIONS
- Message must be in HTML, not markdown or plain text.
- Keep the message short and concise.
- Respond using tools to fetch data rather than assuming you already have it.
- The output should be a JSON object with a property "message", like: {"message":"<p>Your reply message goes here</p>"}
`;

type ToolArgs = Record<string, unknown>;

/**
 * Executes a single tool call based on name + JSON arguments.
 * Returns a ChatCompletion "tool" message ready to be appended to the conversation.
 */
async function executeToolCall(
  organisationId: Ref<Organisation>,
  toolCallId: string,
  functionName: string,
  rawArgs: string | null | undefined,
): Promise<ChatCompletionToolMessageParam> {
  const args = safeJson<ToolArgs>(rawArgs, {});
  switch (functionName) {
    case 'getImportData': {
      const {
        email,
        skill,
        metric,
        fromTs,
        toTs,
        limit = 100,
        sort = 'desc',
        fields,
      } = args as {
        email?: string;
        skill?: string;
        metric?: string;
        fromTs?: string;
        toTs?: string;
        limit?: number;
        sort?: 'asc' | 'desc';
        fields?: string[];
      };

      const query: Record<string, any> = { organisation: organisationId };
      if (email) query.email = email;
      if (skill) query.skill = skill;
      if (metric) query.metric = metric;

      // Support either "timestamp" on the doc or "createdAt" if present.
      const timeField = 'timestamp' as const;
      if (fromTs || toTs) {
        query[timeField] = {};
        if (fromTs) query[timeField]['$gte'] = new Date(fromTs as string);
        if (toTs) query[timeField]['$lt'] = new Date(toTs as string);
      }

      const projection =
        Array.isArray(fields) && fields.length
          ? Object.fromEntries(fields.map((f) => [f, 1]))
          : undefined;

      const data = (await ImportDataModel.find(query, projection)
        .sort({ [timeField]: sort === 'asc' ? 1 : -1 })
        .limit(Math.min(Math.max(limit || 100, 1), 500))
        .lean()) as ImportData[];

      return {
        role: 'tool',
        tool_call_id: toolCallId,
        content: JSON.stringify(
          data.map((d) => ({
            email: (d as any).email,
            skill: (d as any).skill,
            metric: (d as any).metric,
            score: (d as any).score,
            timestamp: (d as any).timestamp ?? (d as any).createdAt,
            assessment: (d as any).assessment,
          })),
        ),
      };
    }

    case 'getAggregateMetrics': {
      const {
        groupBy = ['skill', 'metric'],
        email,
        skill,
        metric,
        fromTs,
        toTs,
        limit = 200,
      } = args as {
        groupBy?: ('skill' | 'metric' | 'email')[];
        email?: string;
        skill?: string;
        metric?: string;
        fromTs?: string;
        toTs?: string;
        limit?: number;
      };

      const match: Record<string, any> = { organisation: organisationId };
      if (email) match.email = email;
      if (skill) match.skill = skill;
      if (metric) match.metric = metric;

      if (fromTs || toTs) {
        match.timestamp = {};
        if (fromTs) match.timestamp['$gte'] = new Date(fromTs);
        if (toTs) match.timestamp['$lt'] = new Date(toTs);
      }

      const groupId: Record<string, `$${string}`> = {};
      for (const key of groupBy || []) {
        groupId[key] = `$${key}`;
      }

      const pipeline: any[] = [
        { $match: match },
        {
          $group: {
            _id: groupId,
            count: { $sum: 1 },
            avgScore: { $avg: '$score' },
            minScore: { $min: '$score' },
            maxScore: { $max: '$score' },
          },
        },
        {
          $project: {
            _id: 0,
            group: '$_id',
            count: 1,
            avgScore: { $round: ['$avgScore', 2] },
            minScore: 1,
            maxScore: 1,
          },
        },
        { $sort: { 'group.skill': 1, 'group.metric': 1, 'group.email': 1 } },
        { $limit: Math.min(Math.max(limit || 200, 1), 1000) },
      ];

      const results = await ImportDataModel.aggregate(pipeline);
      return {
        role: 'tool',
        tool_call_id: toolCallId,
        content: JSON.stringify(results),
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

/**
 * Main entry: chat with tool use.
 * Returns only the "message" string as before, complying with your JSON contract.
 */
export const openAIReply = async ({
  organisationId,
  receivedMessage,
}: {
  organisationId: Ref<Organisation>;
  receivedMessage: string;
}) => {
  const client = new OpenAI({ apiKey: env.openai.apiKey });

  // Build message history
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: receivedMessage },
  ];

  // Loop: allow the model to call tools multiple times if it needs to
  // (hard cap to prevent infinite loops).
  for (let step = 0; step < 4; step++) {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools,
      tool_choice: 'auto',
      response_format: { type: 'json_object' },
    });

    const choice = first(completion.choices);
    const msg = choice.message;

    // If the model asked to call tools, execute them and continue the loop.
    if (msg.tool_calls && msg.tool_calls.length) {
      for (const tc of msg.tool_calls) {
        const toolResponse = await executeToolCall(
          organisationId,
          tc.id,
          tc.function.name,
          tc.function.arguments,
        );
        // Append assistant tool-call "marker" and our tool response
        messages.push({
          role: 'assistant',
          content: null,
          tool_calls: [tc],
        } as any);
        messages.push(toolResponse);
      }
      // Continue the loop so the model can use the tool outputs.
      continue;
    }

    // No tool call: expect final JSON content with { "message": "..." }
    const content = msg.content ?? '';
    const parsed = safeJson<{ message?: string }>(content, {});
    if (parsed.message) return parsed.message;

    // If the model failed to return proper JSON, degrade gracefully.
    const fallback =
      typeof content === 'string' && content.trim().length
        ? content.trim()
        : 'Sorry, I could not generate a response.';
    return fallback;
  }

  // Safety fallback if too many steps
  return 'Sorry, I could not complete the request.';
};

@Service()
export class OpenAIService {
  client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: env.openai.apiKey,
    });
  }
}
