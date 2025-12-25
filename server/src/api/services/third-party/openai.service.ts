// openai.service.ts
import { Ref } from '@typegoose/typegoose';
import OpenAI from 'openai';
import type { ResponseInputItem } from 'openai/resources/responses/responses';

import { Organisation } from 'api/models/organisation.model';
import { env } from 'env';
import { safeJson } from 'utils/safeJson';

import { executeAscendToolCall } from './openai.tools-executor';

const ASCEND_PROMPT_ID =
  'pmpt_694d775b28ac81969173e1e82c4ea066010eeaa25b1f3ecc';

export const openAIReply = async ({
  receivedMessage,
  model = 'gpt-5.2',
}: {
  receivedMessage: string;
  model?: string;
}): Promise<string> => {
  const client = new OpenAI({ apiKey: env.openai.apiKey });

  const input: ResponseInputItem[] = [
    {
      role: 'user',
      content: receivedMessage,
    },
  ];

  let continueRequesting = true;

  while (continueRequesting) {
    continueRequesting = false;

    const response = await client.responses.create({
      model,
      prompt: {
        id: ASCEND_PROMPT_ID,
      },
      input,
    });

    for (const item of response.output) {
      // Tool / function call
      if (item.type === 'function_call') {
        continueRequesting = true;

        const toolResult = await executeAscendToolCall(
          item.call_id,
          item.name,
          item.arguments,
        );

        input.push({
          type: 'function_call_output',
          call_id: item.call_id,
          output: JSON.stringify(toolResult),
        });
      }

      // // Reasoning continuation
      // if (item.type === 'reasoning') {
      //   continueRequesting = true;
      //   input.push(item);
      // }
    }
  }

  // Final response (no tools)
  const finalResponse = await client.responses.create({
    model,
    prompt: {
      id: ASCEND_PROMPT_ID,
    },
    input,
    tool_choice: 'none',
  });

  for (const item of finalResponse.output) {
    if (item.type === 'message') {
      const text =
        // @ts-expect-error
        item.content?.find((c: any) => c.type === 'output_text')?.text ?? '';

      const parsed = safeJson<{ message?: string }>(text, {});
      if (parsed.message) return parsed.message;

      return text || '<p>Sorry, I could not generate a response.</p>';
    }
  }

  return '<p>Sorry, I could not complete a response.</p>';
};

// Optional DI wrapper
export class OpenAIService {
  client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: env.openai.apiKey });
  }

  async reply(params: {
    organisationId: Ref<Organisation>;
    receivedMessage: string;
    model?: string;
  }) {
    return openAIReply(params);
  }
}
