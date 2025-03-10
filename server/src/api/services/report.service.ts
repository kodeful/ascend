import { Model } from 'mongoose';
import { Inject, Service } from 'typedi';

import { Report } from 'api/models/report.model';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class ReportService extends CRUD<Report> {
  constructor(
    @Inject(Report.name)
    readonly reportModel: Model<Report>,
  ) {
    super(Report, reportModel);
  }
}
