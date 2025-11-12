import { getDiscriminatorModelForClass, prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import Container from 'typedi';

import { Import, ImportModel, ImportType } from './import.model';

export class ImportMindslines extends Import {
  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public fileName: string;

  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public skill: string;
}

export const ImportMindslinesModel = ImportModel.discriminator(
  ImportType.MINDSLINES,
  getDiscriminatorModelForClass(ImportModel, ImportMindslines).schema,
);
Container.set(ImportMindslines.name, ImportMindslinesModel);
