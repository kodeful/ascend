import { Ref, getModelForClass, index, prop } from '@typegoose/typegoose';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsString } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { DocumentWithTimestamps } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Organisation } from './organisation.model';

export enum ReportType {
  GROUP_REPORT = 'Group Report',
  INDIVIDUAL_REPORT = 'Individual Report',
}

export enum ReportRangeDate {
  LAST_WEEK = 'Last Week',
}

@index({ user: 1 })
export class Report extends DocumentWithTimestamps {
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
  @IsString()
  @prop({ type: String, required: true })
  public title: string;

  @Expose()
  @IsString()
  @prop({ type: String })
  public subtitle: string;

  @Expose()
  @IsEnum(ReportType)
  @prop({ type: String, enum: ReportType, required: true })
  public type: ReportType;

  @Expose()
  @IsEnum(ReportRangeDate)
  @prop({ type: String, enum: ReportRangeDate, required: true })
  public rangeDate: ReportRangeDate;

  @Expose()
  @IsBoolean()
  @prop({ type: Boolean, default: false })
  public horizontal: boolean;
}

export const ReportModel = getModelForClass(Report, {
  schemaOptions: {
    timestamps: true,
  },
});
Container.set(Report.name, ReportModel);
