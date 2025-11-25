import type { ChatCompletionTool } from 'openai/resources/chat/completions';

/**
 * Four dedicated tools:
 * - getImportDataEvaluation
 * - getImportDataLumina
 * - getImportDataMindslines
 * - getImportDataThreeEyeView
 *
 * Keep this file focused on the JSON schemas only.
 */
export const ascendTools: ChatCompletionTool[] = [
  // import-data-evaluation
  {
    type: 'function',
    function: {
      name: 'getImportDataEvaluation',
      description:
        'Fetch per-skill evaluation with knowledge/confidence/application for a user or cohort.',
      parameters: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'Regex match by email.' },
          skill: { type: 'string', description: 'Regex match by skill.' },
          fromTs: {
            type: 'string',
            description: 'ISO lower bound (inclusive) for timestamp.',
          },
          toTs: {
            type: 'string',
            description: 'ISO upper bound (exclusive) for timestamp.',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 500,
            description: 'Default 100.',
          },
          sort: {
            type: 'string',
            enum: ['asc', 'desc'],
            description: 'Default desc by timestamp.',
          },
          fields: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'email',
                'skill',
                'timestamp',
                'knowledge',
                'confidence',
                'application',
              ],
            },
            description: 'Projection fields.',
          },
        },
        additionalProperties: false,
      },
    },
  },

  // import-data-lumina
  {
    type: 'function',
    function: {
      name: 'getImportDataLumina',
      description:
        'Fetch Lumina skill percentages. Can optionally flatten skills into rows.',
      parameters: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'Regex match by email.' },
          fromTs: {
            type: 'string',
            description: 'ISO lower bound (inclusive) for timestamp.',
          },
          toTs: {
            type: 'string',
            description: 'ISO upper bound (exclusive) for timestamp.',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 500,
            description: 'Default 100.',
          },
          sort: {
            type: 'string',
            enum: ['asc', 'desc'],
            description: 'Default desc by timestamp.',
          },
          skillFilter: {
            type: 'string',
            description: 'Regex to filter skill keys inside `skills`.',
          },
          flatten: {
            type: 'boolean',
            description:
              'If true, return one row per (email,timestamp,skill,percent).',
          },
          fields: {
            type: 'array',
            items: { type: 'string', enum: ['email', 'timestamp', 'skills'] },
            description: 'Projection fields (ignored if flatten=true).',
          },
        },
        additionalProperties: false,
      },
    },
  },

  // import-data-mindslines
  {
    type: 'function',
    function: {
      name: 'getImportDataMindslines',
      description:
        'Fetch Mindslines quiz progress counts (completed/inProgress/notStarted).',
      parameters: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'Regex match by email.' },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 500,
            description: 'Default 100.',
          },
          sort: {
            type: 'string',
            enum: ['asc', 'desc'],
            description: 'Sort by email asc/desc (fallback).',
          },
          fields: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'email',
                'completedCount',
                'inProgressCount',
                'notStartedCount',
              ],
            },
            description: 'Projection fields.',
          },
        },
        additionalProperties: false,
      },
    },
  },

  // import-data-three-eye-view
  {
    type: 'function',
    function: {
      name: 'getImportDataThreeEyeView',
      description:
        'Fetch Three-Eye View scores (Peer/Self/Facilitator) by skill & metric.',
      parameters: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'Regex match by email.' },
          skill: { type: 'string', description: 'Regex match by skill.' },
          metric: {
            type: 'string',
            enum: ['Knowledge', 'Confidence', 'Application'],
            description: 'Metric filter (exact).',
          },
          assessment: {
            type: 'string',
            enum: [
              'Peer Evaluation',
              'Self-evaluation',
              'Facilitator Evaluation',
            ],
            description: 'Assessment type (exact).',
          },
          fromTs: {
            type: 'string',
            description: 'ISO lower bound (inclusive) for timestamp.',
          },
          toTs: {
            type: 'string',
            description: 'ISO upper bound (exclusive) for timestamp.',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 500,
            description: 'Default 100.',
          },
          sort: {
            type: 'string',
            enum: ['asc', 'desc'],
            description: 'Default desc by timestamp.',
          },
          fields: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'email',
                'skill',
                'metric',
                'assessment',
                'score',
                'timestamp',
              ],
            },
            description: 'Projection fields.',
          },
        },
        additionalProperties: false,
      },
    },
  },
];
