import {
  Ref,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsMongoId } from 'class-validator';
import { IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { DocumentWithTimestamps } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Organisation } from '../organisation.model';

export enum ImportType {
  GOOGLE_SHEET = 'Google Sheet',
  FILE = 'File',
}

export enum ImportMetric {
  KNOWLEDGE = 'Knowledge',
  CONFIDENCE = 'Confidence',
  APPLICATION = 'Application',
}

export enum ImportAssessment {
  PEER_EVALUATION = 'Peer Evaluation',
  SELF_EVALUATION = 'Self-evaluation',
  FACILITATOR_EVALUATION = 'Facilitator Evaluation',
}

@modelOptions({
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
export class Import extends DocumentWithTimestamps {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({
    type: SchemaTypes.ObjectId,
    ref: Organisation,
    required: true,
  })
  public organisation: Ref<Organisation>;

  public type: ImportType;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public skill: string;

  @Expose()
  @IsEnum(ImportMetric)
  @prop({ type: String, enum: ImportMetric, required: true })
  public metric: ImportMetric;

  @Expose()
  @IsEnum(ImportAssessment)
  @prop({ type: String, enum: ImportAssessment, required: true })
  public assessment: ImportAssessment;
}

export const ImportModel = getModelForClass(Import, {
  schemaOptions: {
    timestamps: true,
  },
});
Container.set(Import.name, ImportModel);
