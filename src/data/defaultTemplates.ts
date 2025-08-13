import { Template } from '../types';
import { simpleTemplate } from '../templates/simpleTemplate';
import { fixedCleanProfessionalTemplate } from '../templates/fixedCleanProfessional';
// import { modernStripeTemplate } from '../templates/modernStripe';
// import { compactLedgerTemplate } from '../templates/compactLedger';

export const defaultTemplates: Template[] = [
  simpleTemplate,
  fixedCleanProfessionalTemplate,
  // modernStripeTemplate,
  // compactLedgerTemplate
];
