import {
  Ref,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { DocumentWithTimestamps } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Organisation } from '../organisation.model';

export enum ImportType {
  GOOGLE_SHEET = 'Google Sheet',
  FILE = 'File',
  MINDSLINES = 'Mindslines',
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
}

export const ImportModel = getModelForClass(Import, {
  schemaOptions: {
    timestamps: true,
  },
});
Container.set(Import.name, ImportModel);
