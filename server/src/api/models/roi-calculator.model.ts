import { Ref, getModelForClass, index, prop } from '@typegoose/typegoose';
import { Expose, Transform, Type } from 'class-transformer';
import { IsMongoId, IsNumber, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Container } from 'typedi';

import { Document } from 'api/types/document.types';
import { transformMongoId } from 'utils/class-transformers/transformMongoId';

import { Organisation } from './organisation.model';

export class ROICalculatorFields {
  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public numFirstLineManagers: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public numEmployeesManaged: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public costPerManagerProgram: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public avgAttritionRateFirstLine: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public avgAttritionRateNonManager: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public minRehireCostFirstLinePercent: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public maxRehireCostFirstLinePercent: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public minRehireCostNonManagerPercent: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public maxRehireCostNonManagerPercent: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public avgSalaryFirstLineManager: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public avgSalaryNonManager: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public investmentDurationYears: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public targetAttritionReductionPercent: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public minRoiThresholdPercent: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public compoundRatePercent: number;
}

export class ROICalculatorResult {
  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public minTotalSavings: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public maxTotalSavings: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public minExpectedROI: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public maxExpectedROI: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public minCompoundedROI: number;

  @Expose()
  @IsNumber()
  @prop({ type: Number, required: true })
  public maxCompoundedROI: number;
}

@index({ organisation: 1 }, { unique: true })
export class ROICalculator extends Document {
  @Expose()
  @IsMongoId()
  @Transform(transformMongoId)
  @prop({
    type: SchemaTypes.ObjectId,
    ref: Organisation,
    required: true,
    unique: true,
  })
  public organisation: Ref<Organisation>;

  @Expose()
  @ValidateNested()
  @Type(() => ROICalculatorFields)
  @prop({ _id: false, type: ROICalculatorFields })
  public fields: ROICalculatorFields;

  @Expose()
  @ValidateNested()
  @Type(() => ROICalculatorResult)
  @prop({ _id: false, type: ROICalculatorResult })
  public result: ROICalculatorResult;
}

export const ROICalculatorModel = getModelForClass(ROICalculator);
Container.set(ROICalculator.name, ROICalculatorModel);
