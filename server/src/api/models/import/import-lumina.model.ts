import { getDiscriminatorModelForClass, prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import Container from 'typedi';

import { Import, ImportModel, ImportType } from './import.model';

export class ImportLumina extends Import {
  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public fileName: string;
}

export const ImportLuminaModel = ImportModel.discriminator(
  ImportType.LUMINA,
  getDiscriminatorModelForClass(ImportModel, ImportLumina).schema,
);
Container.set(ImportLumina.name, ImportLuminaModel);
