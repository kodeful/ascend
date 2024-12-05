import { Ref, getModelForClass, pre, prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { Document } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Organisation } from './organisation.model';

export enum UserRole {
  LEARNER = 'Learner',
  FACILITATOR = 'Facilitator',
}

@pre<User>('save', async function () {
  this.fullName = [this.firstName, this.lastName].join(' ');
})
@pre<User>('findOneAndUpdate', async function () {
  //@ts-expect-error
  let user = await this.model.findOne(this.getQuery()).lean();
  if (!user) return;
  //@ts-expect-error
  user = { ...user, ...this._update };

  //@ts-expect-error
  this._update.fullName = [user.firstName, user.lastName].join(' ');
})
export class User extends Document {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({ type: SchemaTypes.ObjectId, ref: Organisation, required: true })
  public organisation: Ref<Organisation>;

  @Expose()
  @IsEnum(UserRole)
  @prop({ type: String, required: true, enum: UserRole })
  public role: UserRole;

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
  @IsOptional()
  @IsString()
  @prop({ type: String })
  public fullName: string;

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
