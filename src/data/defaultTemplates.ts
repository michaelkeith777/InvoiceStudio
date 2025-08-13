import { Template } from '../types';
import { cleanProfessionalTemplate } from '../templates/cleanProfessional';
import { modernStripeTemplate } from '../templates/modernStripe';
import { compactLedgerTemplate } from '../templates/compactLedger';

export const defaultTemplates: Template[] = [
  cleanProfessionalTemplate,
  modernStripeTemplate,
  compactLedgerTemplate
];
