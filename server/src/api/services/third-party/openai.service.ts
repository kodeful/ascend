// openai.service.ts
import { Ref } from '@typegoose/typegoose';
import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionToolMessageParam,
} from 'openai/resources/chat/completions';

import { Organisation } from 'api/models/organisation.model';
import { env } from 'env';
import { safeJson } from 'utils/safeJson';

import { ascendTools } from './openai.tools';
import { executeAscendToolCall } from './openai.tools-executor';

// ---------- System prompt ----------
/**
 * This prompt mirrors your earlier contract:
 * - Model must prefer tool calls to fetch data
 * - Reply must be short, in HTML
 * - Output must be JSON with a "message" property containing the HTML
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


NOTES
- If specific learner is not mentioned, use the tools to fetch data for all learners.
- If specific learner is mentioned, use the tools to fetch data for that learner by email.

MESSAGE INSTRUCTIONS
- Message must be in HTML, not markdown or plain text.
- Keep the message short and concise.
- Respond using tools to fetch data rather than assuming you already have it.
- The output should be a JSON object with a property "message", like: {"message":"<p>Your reply message goes here</p>"}
`;

// ---------- Public API ----------
export const openAIReply = async ({
  receivedMessage,
  model = 'gpt-4o-mini',
}: {
  receivedMessage: string;
  model?: string;
}): Promise<string> => {
  const client = new OpenAI({ apiKey: env.openai.apiKey });

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: receivedMessage },
  ];

  // Allow the model a few back-and-forths with tools.
  for (let step = 0; step < 4; step++) {
    const completion = await client.chat.completions.create({
      model,
      messages,
      tools: ascendTools, // <-- only the new tools
      tool_choice: 'auto',
      response_format: { type: 'json_object' },
    });

    const choice = completion.choices[0];
    const msg = choice.message;

    // Tool calls?
    if (msg.tool_calls && msg.tool_calls.length) {
      for (const tc of msg.tool_calls) {
        // Execute our tool (function) and append the tool result
        const toolResponse: ChatCompletionToolMessageParam =
          await executeAscendToolCall(
            tc.id,
            // @ts-expect-error: SDK typing nests the function call here
            tc.function.name,
            // @ts-expect-error
            tc.function.arguments,
          );

        // Append assistant "I am calling a tool" message + the tool's response
        messages.push({
          role: 'assistant',
          content: null,
          tool_calls: [tc],
        } as any);
        messages.push(toolResponse);
      }
      // Let the loop continue so the model can see tool outputs
      continue;
    }

    // Final content expected to be JSON with { message: "<html/>" }
    const content = msg.content ?? '';
    const parsed = safeJson<{ message?: string }>(content, {});
    if (parsed.message) return parsed.message;

    // Fallback if model didn't return proper JSON
    const fallback =
      typeof content === 'string' && content.trim().length
        ? content.trim()
        : '<p>Sorry, I could not generate a response.</p>';
    return fallback;
  }

  // Safety fallback if tool loop exhausted
  return '<p>Sorry, I could not complete a response.</p>';
};

// ---------- Optional DI-friendly wrapper ----------
export class OpenAIService {
  client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: env.openai.apiKey });
  }

  /**
   * Thin wrapper if you prefer to call via a service instance.
   */
  async reply(params: {
    organisationId: Ref<Organisation>;
    receivedMessage: string;
    model?: string;
  }) {
    return openAIReply(params);
  }
}
