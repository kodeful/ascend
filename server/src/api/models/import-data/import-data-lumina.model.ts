import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsMongoId, IsObject } from 'class-validator';
import { IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { Document } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Import } from '../import/import.model';

export class ImportDataLumina extends Document {
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
  @IsObject()
  @prop({ type: Object, required: true })
  @Type(() => Object)
  public skills: Record<string, number>;
}

export const ImportDataLuminaModel = getModelForClass(ImportDataLumina, {
  schemaOptions: {},
});
Container.set(ImportDataLumina.name, ImportDataLuminaModel);
