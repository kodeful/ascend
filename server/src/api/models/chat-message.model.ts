import { Ref, getModelForClass, index, post, prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { openAIReply } from 'api/services/third-party/openai.service';
import { DocumentWithTimestamps } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Chat, ChatModel } from './chat.model';
import { Organisation } from './organisation.model';
import { User } from './user.model';

@post<ChatMessage>('save', async function () {
  if (!this.user) return;

  await ChatModel.updateOne(
    { _id: this.chat },
    { $set: { lastMessage: this.message } },
  );

  const receivedMessage = this.message;
  openAIReply({
    organisationId: this.organisation,
    receivedMessage: receivedMessage,
  }).then(async (message) => {
    await ChatMessageModel.create({
      organisation: this.organisation,
      chat: this.chat,
      message,
    });

    global.io.of(`/socket/chat/${this.chat}`).emit('message', {
      message,
    });
  });
})
@index({ chat: 1 })
export class ChatMessage extends DocumentWithTimestamps {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({
    type: SchemaTypes.ObjectId,
    ref: 'Organisation',
    required: true,
  })
  public organisation: Ref<Organisation>;

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
