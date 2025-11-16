import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { Document } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Import } from '../import/import.model';

export class ImportDataMindslines extends Document {
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
  @IsString()
  @prop({ type: String, required: true })
  public email: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  @prop({ type: Number })
  public completedCount?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @prop({ type: Number })
  public inProgressCount?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @prop({ type: Number })
  public notStartedCount?: number;
}

export const ImportDataMindslinesModel = getModelForClass(
  ImportDataMindslines,
  {
    schemaOptions: {},
  },
);
Container.set(ImportDataMindslines.name, ImportDataMindslinesModel);
