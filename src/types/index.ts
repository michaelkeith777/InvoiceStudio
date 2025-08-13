export interface Invoice {
  version: string;
  id: string;
  templateId: string;
  businessProfileId: string;
  invoiceNumber: string;
  poNumber: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  currency: string;
  locale: string;
  client: Client;
  items: InvoiceItem[];
  discounts: Discount[];
  fees: Fee[];
  taxes: Tax[];
  payments: Payment[];
  workDetails: string;
  notes: string;
  terms: string;
  totals: InvoiceTotals;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  billingAddress: string;
  shippingAddress: string;
}

export interface InvoiceItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: ItemDiscount | null;
  taxCategory: string;
  notes: string;
  calculatedLineTotal?: number;
}

export interface ItemDiscount {
  type: 'percent' | 'fixed';
  value: number;
}

export interface Discount {
  id: string;
  label: string;
  type: 'percent' | 'fixed';
  value: number;
}

export interface Fee {
  id: string;
  label: string;
  type: 'percent' | 'fixed';
  value: number;
  applyBase: 'subtotal' | 'subtotal_after_item_discounts' | 'subtotal_after_invoice_discounts' | 'grand_total_pre_tax';
}

export interface Tax {
  id: string;
  label: string;
  rate: number;
  category: string;
  priority: number;
  applyAfterDiscounts: boolean;
}

export interface Payment {
  id: string;
  date: string;
  method: string;
  amount: number;
}

export interface InvoiceTotals {
  subtotal: number;
  itemDiscounts: number;
  invoiceDiscounts: number;
  fees: number;
  tax: number;
  grandTotal: number;
  paid: number;
  balanceDue: number;
}

export interface Template {
  id: string;
  name: string;
  brand: TemplateBrand;
  layout: TemplateLayout;
  defaults: TemplateDefaults;
  html: string;
  css: string;
}

export interface TemplateBrand {
  primaryColor: string;
  accentColor: string;
  fontFamilyHeader: string;
  fontFamilyBody: string;
  logoPath: string;
}

export interface TemplateLayout {
  headerStyle: string;
  footerText: string;
  showSignature: boolean;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface TemplateDefaults {
  taxRules: string[];
  terms: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  taxId: string;
  bankDetails: string;
  logoPath: string;
  color: string;
}

export interface AppSettings {
  currency: string;
  locale: string;
  dateFormat: string;
  invoiceNumberPattern: string;
  defaultTaxes: Tax[];
  defaultFees: Fee[];
  defaultTemplateId: string;
  defaultBusinessProfileId: string;
  autosaveInterval: number;
}

export interface FileOperationResult {
  success: boolean;
  error?: string;
  data?: any;
  path?: string;
  files?: string[];
}

export interface InvoiceListItem {
  filename: string;
  path: string;
  data: Invoice;
  modifiedAt: Date;
}
