import { Template } from '../types';

export const simpleTemplate: Template = {
  id: 'simple-test',
  name: 'Simple Test',
  brand: {
    primaryColor: '#1F2937',
    accentColor: '#3B82F6',
    fontFamilyHeader: 'Inter',
    fontFamilyBody: 'Inter',
    logoPath: ''
  },
  layout: {
    headerStyle: 'simple',
    footerText: 'Thank you for your business!',
    showSignature: false,
    margins: { top: 20, right: 20, bottom: 20, left: 20 }
  },
  defaults: {
    taxRules: [],
    terms: 'Payment due within 30 days.'
  },
  html: `
<div style="padding: 20px; font-family: 'Inter', sans-serif;">
  <h1 style="color: #1F2937; margin-bottom: 20px;">INVOICE</h1>
  
  <div style="margin-bottom: 20px;">
    <strong>Business:</strong> {{business.name}}<br>
    <strong>Client:</strong> {{client.name}}<br>
    <strong>Invoice #:</strong> {{invoice.invoiceNumber}}
  </div>
  
  <div style="margin-bottom: 20px;">
    <strong>Items:</strong>
    <ul>
      {{#items}}
      <li>{{name}} - {{formattedUnitPrice}} x {{quantity}} = {{calculatedLineTotal}}</li>
      {{/items}}
    </ul>
  </div>
  
  <div style="text-align: right; font-weight: bold;">
    Total: {{totals.grandTotal}}
  </div>
</div>
  `,
  css: `
    .invoice {
      font-family: 'Inter', sans-serif;
      color: #1F2937;
    }
  `
};