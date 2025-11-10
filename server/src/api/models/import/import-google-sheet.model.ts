import { getDiscriminatorModelForClass, prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import Container from 'typedi';

import { Import, ImportModel, ImportType } from './import.model';

export enum ImportGoogleSheetRefetchInterval {
  EVERY_DAY = 'Every Day',
  EVERY_HOUR = 'Every Hour',
  EVERY_15_MINUTES = 'Every 15 Minutes',
}

export class ImportGoogleSheet extends Import {
  @Expose()
  @IsString()
  @prop({ type: String, required: true })
  public sheetId: string;

  @Expose()
  @IsEnum(ImportGoogleSheetRefetchInterval)
  @prop({
    type: String,
    enum: ImportGoogleSheetRefetchInterval,
    required: true,
  })
  public refetchInterval: ImportGoogleSheetRefetchInterval;
}

export const ImportGoogleSheetModel = ImportModel.discriminator(
  ImportType.GOOGLE_SHEET,
  getDiscriminatorModelForClass(ImportModel, ImportGoogleSheet).schema,
);
Container.set(ImportGoogleSheet.name, ImportGoogleSheetModel);
