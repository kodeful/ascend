import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { Chat } from 'api/models/chat.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ChatService extends CRUD<Chat> {
  constructor(
    @Inject(Chat.name)
    readonly chatModel: Model<Chat>,
  ) {
    super(Chat, chatModel);
  }
}
