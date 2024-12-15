import { Ref, getModelForClass, index, prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { DocumentWithTimestamps } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { User } from './user.model';

@index({ user: 1 })
export class Chat extends DocumentWithTimestamps {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({
    type: SchemaTypes.ObjectId,
    ref: User,
    required: true,
  })
  public user: Ref<User>;
}

export const ChatModel = getModelForClass(Chat, {
  schemaOptions: {
    timestamps: true,
  },
});
Container.set(Chat.name, ChatModel);
