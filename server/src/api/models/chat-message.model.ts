import { Ref, getModelForClass, index, post, prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { DocumentWithTimestamps } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Chat } from './chat.model';
import { User } from './user.model';

@post<ChatMessage>('save', async function () {
  if (!this.user) return;

  setTimeout(async () => {
    const message = 'Hello, how can I help you?';
    await ChatMessageModel.create({
      chat: this.chat,
      message,
    });

    global.io.of(`/socket/chat/${this.chat}`).emit('message', {
      message,
    });
  }, 3000);
})
@index({ chat: 1 })
export class ChatMessage extends DocumentWithTimestamps {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({
    type: SchemaTypes.ObjectId,
    ref: Chat,
    required: true,
  })
  public chat: Ref<Chat>;

  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({
    type: SchemaTypes.ObjectId,
    ref: User,
  })
  public user: Ref<User>;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public message: string;
}

export const ChatMessageModel = getModelForClass(ChatMessage, {
  schemaOptions: { timestamps: true },
});
Container.set(ChatMessage.name, ChatMessageModel);
