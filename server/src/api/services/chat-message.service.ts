import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { ChatMessage } from 'api/models/chat-message.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ChatMessageService extends CRUD<ChatMessage> {
  constructor(
    @Inject(ChatMessage.name)
    readonly chatMessageModel: Model<ChatMessage>,
  ) {
    super(ChatMessage, chatMessageModel);
  }
}
