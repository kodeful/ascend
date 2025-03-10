import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, IsNumber } from 'class-validator';
import { IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { Document } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Import, ImportAssessment, ImportMetric } from './import.model';
import { Organisation } from '../organisation.model';

export class ImportData extends Document {
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
  @IsNumber()
  @prop({ type: Number, required: true })
  public score: number;

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

export const ImportDataModel = getModelForClass(ImportData, {
  schemaOptions: {},
});
Container.set(ImportData.name, ImportDataModel);
