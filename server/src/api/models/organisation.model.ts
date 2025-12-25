import { getModelForClass, prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Container } from 'typedi';

import { Document } from 'api/types/document.types';

export class Organisation extends Document {
  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public name: string;

  @Expose()
  @IsString()
  @prop({ type: String })
  public industry?: string;
}

export const OrganisationModel = getModelForClass(Organisation);
Container.set(Organisation.name, OrganisationModel);
