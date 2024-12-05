import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { Document } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Organisation } from './organisation.model';

export enum UserRole {
  LEARNER = 'Learner',
  FACILITATOR = 'Facilitator',
}

export class User extends Document {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({ type: SchemaTypes.ObjectId, ref: Organisation, required: true })
  public organisation: Ref<Organisation>;

  @Expose()
  @IsString()
  @prop({ type: String, required: true, unique: true })
  public username: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public firstName: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public lastName: string;

  @Expose()
  @IsEmail()
  @prop({ type: String, required: true, unique: true })
  public email: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public password: string;

  @Expose()
  @IsOptional()
  @IsString()
  @prop({ type: String })
  public phone?: string;
}

export const UserModel = getModelForClass(User);
Container.set(User.name, UserModel);
