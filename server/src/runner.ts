import Container from 'typedi';

import { OpenAIService } from 'api/services/third-party/openai.service';

export const runner = async () => {
  // Run your functions here while in development

  const openaiService = Container.get(OpenAIService);

  const response = await openaiService.client.responses.create({
    model: '',
  });

  console.log(response);
};
