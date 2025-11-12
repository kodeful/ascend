import { getDiscriminatorModelForClass, prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsString } from 'class-validator';
import Container from 'typedi';

import {
  Import,
  ImportAssessment,
  ImportMetric,
  ImportModel,
  ImportType,
} from './import.model';

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

  @Expose()
  @IsEnum(ImportGoogleSheetRefetchInterval)
  @prop({
    type: String,
    enum: ImportGoogleSheetRefetchInterval,
    required: true,
  })
  public refetchInterval: ImportGoogleSheetRefetchInterval;

  @Expose()
  @IsDateString()
  @prop({ type: Date })
  public lastRefetchTimestamp: Date;
}

export const ImportGoogleSheetModel = ImportModel.discriminator(
  ImportType.GOOGLE_SHEET,
  getDiscriminatorModelForClass(ImportModel, ImportGoogleSheet).schema,
);
Container.set(ImportGoogleSheet.name, ImportGoogleSheetModel);
