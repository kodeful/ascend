import { Ref } from '@typegoose/typegoose';
import { first } from 'lodash';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { Service } from 'typedi';

import {
  ImportData,
  ImportDataModel,
} from 'api/models/import/import-data.model';
import { Organisation } from 'api/models/organisation.model';
import { env } from 'env';

export const openAIReply = async ({
  organisationId,
  receivedMessage,
}: {
  organisationId: Ref<Organisation>;
  receivedMessage: string;
}) => {
  const client = new OpenAI({
    apiKey: env.openai.apiKey,
  });

  const importData = (await ImportDataModel.find({
    organisation: organisationId,
  }).lean()) as ImportData[];

  console.log(importData);

  const gptMessages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `
      You're a helpful assistant that can answer questions and help with analytics for platform ascend.

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
•	Interpretation: The person has solid knowledge about the area being assessed, but lacks confidence in putting it into practice. This may indicate that they understand the theoretical concepts, but do not feel confident enough to put this knowledge into practice or implement it.
•	Recommendation: Encourage practical experiences in safe environments, such as pilot projects or simulations, where the person can apply their knowledge without fear of serious repercussions. Self-confidence exercises and mentoring with expert leaders in the area being assessed may also be useful to observe the practice in action and receive positive feedback.

2. Low knowledge, high confidence, low application
•	Interpretation: The person is confident in their abilities in the area being assessed, but their theoretical understanding is limited and their actual application of the concepts is low. This profile may indicate confidence based on previous successful experiences or a positive attitude, but a lack of knowledge limits their effectiveness.
•	Recommendation: Provide formal training in the assessed area (readings, courses, or workshops) to strengthen the knowledge base. This training will allow for a more structured and effective application. Also, suggest that the individual document and evaluate each process carried out in this area as it will help formalize their experience.

3. High knowledge, high confidence, low application
•	Interpretation: The individual knows about the assessed area and is confident in their abilities, but there is a lack of application at work. This may reflect a disconnect between knowing and doing, or that external factors (such as a rigid environment or lack of opportunities) are limiting implementation.
•	Recommendation: Suggest that the individual look for specific opportunities to implement their knowledge in this area. They may also be encouraged to discuss with their superiors how to apply these concepts in their current role. Making an action plan can help them gradually integrate these practices.

4. Low knowledge, low confidence, high application:
•	Interpretation: The person applies some strategies related to the assessed area, but lacks a solid theoretical understanding and confidence in their ability. This can lead to applying tactics without a clear vision, which can be ineffective or disorganized.
•	Recommendation: Recommend that they strengthen their understanding of this area through basic training. This knowledge will give them a theoretical basis for understanding the why and how of practices in the area. In addition, a focus on small wins and constant feedback can increase their confidence.

5. High knowledge, low confidence, high application
•	Interpretation: The person has good knowledge and applies some strategies, but lacks confidence. This situation could indicate that, although they act, they doubt their own abilities and fear failure or judgment.
•	Recommendation: Recommend that the person reflect on their achievements and document their successes in situations related to this area. In addition, a mentor or coach can be useful to reinforce their self-confidence. Practicing visualization and positive self-talk can help build self-confidence.

6. Low knowledge, high confidence, high application
•	Interpretation: The person displays confidence and an active disposition in the area, but lacks a solid theoretical foundation. This could lead to practical applicability that, while active, is possibly unstructured or based on assumptions.
•	Recommendation: Suggest training in the area to consolidate knowledge and increase the effectiveness of its applications. This could include workshops or. In addition, this person can be encouraged to document their experiences, so that they can review and improve their current practices with solid foundations.

7. High application with low knowledge and confidence
•	Interpretation: The person is applying concepts in practice, but does not feel particularly confident or possess deep formal knowledge. This can lead to uncertainty or lack of consistency in implementation.
•	Recommendation: Reinforce formal training and self-confidence. Suggest that they seek positive and constructive feedback from colleagues or superiors to strengthen their confidence in their abilities. Foster theoretical understanding so that their efforts are more structured and effective.

      General recommendations for balancing the three areas

•	Develop a personalized action plan: To achieve a balance between knowledge, confidence and application, the individual can be advised to develop a concrete action plan, setting short, medium and long-term goals to improve in the area with the lowest score.
•	Continuous evaluation: Encourage periodic self-evaluation of progress in the evaluated area, so that they can make adjustments based on their experiences and the feedback received.
•	Mentoring and practical learning: Mentoring with someone experienced can provide practical examples, ideas on how to increase confidence, and guidance on applying what they have learned.
•	Application of theory in low-risk projects: Allow the individual to experiment and put their knowledge into practice in low-risk projects or areas to gain experience without pressure. This will help them build confidence and practical skills that they can then apply in more relevant situations.

These recommendations will allow the individual to progress in a structured way in their development, achieving a balance between knowing, feeling and doing.

      ORGANIZATION DATA

      ${importData
        .map(
          (userImport) => `
        ${userImport.email}:
        - Score: ${userImport.score}
        - Timestamp: ${userImport.timestamp}
        - Skill: ${userImport.skill}
        - Metric: ${userImport.metric}
        - Assessment: ${userImport.assessment}
      `,
        )
        .join('\n')}

      
      MESSAGE INSTRUCTIONS

      Message must be in plain text, not markdown.
      Keep the message short and concise.
      The output should be a JSON object with a property "message", like this: {"message": "your reply message goes here"}
      `,
    },
    {
      role: 'user',
      content: receivedMessage,
    },
  ];

  console.log(gptMessages);

  const { choices: chatgptResponses } = await client.chat.completions.create(
    {
      model: 'gpt-4o-mini',
      messages: gptMessages,
      response_format: {
        type: 'json_object',
      },
    },
    {},
  );

  return JSON.parse(first(chatgptResponses)?.message?.content)?.message;
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
