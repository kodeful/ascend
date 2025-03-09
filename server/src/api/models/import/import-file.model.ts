import { getDiscriminatorModelForClass, prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import Container from 'typedi';

import { Import, ImportModel, ImportType } from './import.model';

export enum ImportFileType {
  CSV = 'text/csv',
  JSON = 'application/json',
  // XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // XLS = 'application/vnd.ms-excel',
}

export class ImportFile extends Import {
  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public fileName: string;

  @Expose()
  @IsEnum(ImportFileType)
  @prop({ type: String, enum: ImportFileType, required: true })
  public fileType: ImportFileType;
}

export const ImportFileModel = ImportModel.discriminator(
  ImportType.FILE,
  getDiscriminatorModelForClass(ImportModel, ImportFile).schema,
);
Container.set(ImportFile.name, ImportFileModel);
