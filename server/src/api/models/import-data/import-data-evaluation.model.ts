import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsMongoId, IsNumber } from 'class-validator';
import { IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { Document } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Import } from '../import/import.model';

export class ImportDataEvaluation extends Document {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({
    type: SchemaTypes.ObjectId,
    ref: 'Import',
    required: true,
  })
  public import: Ref<Import>;

  @Expose()
  @IsDate()
  @prop({ type: Date, required: true })
  public timestamp: Date;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public email: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public metric: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public skill: string;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public score: number;
}

export const ImportDataEvaluationModel = getModelForClass(
  ImportDataEvaluation,
  {
    schemaOptions: {},
  },
);
Container.set(ImportDataEvaluation.name, ImportDataEvaluationModel);
