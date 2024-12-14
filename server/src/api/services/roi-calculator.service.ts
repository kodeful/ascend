import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { ROICalculator } from 'api/models/roi-calculator.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ROICalculatorService extends CRUD<ROICalculator> {
  constructor(
    @Inject(ROICalculator.name)
    readonly roiCalculatorModel: Model<ROICalculator>,
  ) {
    super(ROICalculator, roiCalculatorModel);
  }
}
