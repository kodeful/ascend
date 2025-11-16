import { getModelForClass, modelOptions } from '@typegoose/typegoose';
import { Container } from 'typedi';

import { DocumentWithTimestamps } from 'api/types/document.types';

export enum ImportType {
  FILE = 'File',
  GOOGLE_SHEET = 'Google Sheet',
  MINDSLINES = 'Mindslines',
  LUMINA = 'Lumina',
}

export enum ImportMetric {
  KNOWLEDGE = 'Knowledge',
  CONFIDENCE = 'Confidence',
  APPLICATION = 'Application',
}

export enum ImportAssessment {
  PEER_EVALUATION = 'Peer Evaluation',
  SELF_EVALUATION = 'Self-evaluation',
  FACILITATOR_EVALUATION = 'Facilitator Evaluation',
}

@modelOptions({
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
export class Import extends DocumentWithTimestamps {
  public type: ImportType;
}

export const ImportModel = getModelForClass(Import, {
  schemaOptions: {
    timestamps: true,
  },
});
Container.set(Import.name, ImportModel);
