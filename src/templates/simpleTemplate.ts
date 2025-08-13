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
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
    <div style="flex: 1;">
      {{#business.logoPath}}
      <div style="margin-bottom: 15px;">
        <img src="{{business.logoPath}}" alt="Company Logo" style="max-height: 80px; max-width: 200px; object-fit: contain;">
      </div>
      {{/business.logoPath}}
      <div style="color: #374151; font-size: 14px; line-height: 1.5;">
        <div style="font-weight: 600; font-size: 18px; margin-bottom: 8px; color: {{business.color}};">{{business.name}}</div>
        <div style="white-space: pre-line;">{{business.address}}</div>
        <div>{{business.email}}</div>
        <div>{{business.phone}}</div>
      </div>
    </div>
    <div style="text-align: right;">
      <h1 style="color: {{business.color}}; margin: 0; font-size: 36px; font-weight: 700;">INVOICE</h1>
      <div style="margin-top: 20px; color: #6B7280; font-size: 14px;">
        <div><strong>Invoice #:</strong> {{invoice.invoiceNumber}}</div>
        <div><strong>Date:</strong> {{invoice.issueDate}}</div>
        <div><strong>Due:</strong> {{invoice.dueDate}}</div>
      </div>
    </div>
  </div>
  
  <div style="margin-bottom: 30px; padding: 20px; background: #F9FAFB; border-radius: 8px;">
    <div style="font-weight: 600; margin-bottom: 10px; color: #374151;">Bill To:</div>
    <div style="color: #6B7280; line-height: 1.5;">
      <div style="font-weight: 600;">{{client.name}}</div>
      {{#client.company}}<div>{{client.company}}</div>{{/client.company}}
      {{#client.billingAddress}}<div style="white-space: pre-line;">{{client.billingAddress}}</div>{{/client.billingAddress}}
      {{#client.email}}<div>{{client.email}}</div>{{/client.email}}
      {{#client.phone}}<div>{{client.phone}}</div>{{/client.phone}}
    </div>
  </div>
  
  <div style="margin-bottom: 30px;">
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: {{business.color}}; color: white;">
          <th style="padding: 12px; text-align: left; border: none;">Description</th>
          <th style="padding: 12px; text-align: right; border: none; width: 80px;">Qty</th>
          <th style="padding: 12px; text-align: right; border: none; width: 100px;">Rate</th>
          <th style="padding: 12px; text-align: right; border: none; width: 100px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        {{#items}}
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 12px; color: #374151;">
            <div style="font-weight: 600;">{{name}}</div>
            {{#description}}<div style="color: #6B7280; font-size: 14px; margin-top: 4px;">{{description}}</div>{{/description}}
          </td>
          <td style="padding: 12px; text-align: right; color: #6B7280;">{{quantity}}</td>
          <td style="padding: 12px; text-align: right; color: #6B7280;">{{formattedUnitPrice}}</td>
          <td style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">{{calculatedLineTotal}}</td>
        </tr>
        {{/items}}
      </tbody>
    </table>
  </div>
  
  <div style="display: flex; justify-content: flex-end;">
    <div style="min-width: 300px;">
      <div style="border-top: 2px solid {{business.color}}; padding-top: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Subtotal:</span>
          <span>{{totals.subtotal}}</span>
        </div>
        {{#totals.totalTax}}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #6B7280;">
          <span>Tax:</span>
          <span>{{totals.totalTax}}</span>
        </div>
        {{/totals.totalTax}}
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: {{business.color}}; border-top: 1px solid #E5E7EB; padding-top: 12px; margin-top: 12px;">
          <span>Total:</span>
          <span>{{totals.grandTotal}}</span>
        </div>
      </div>
    </div>
  </div>
  
  {{#invoice.notes}}
  <div style="margin-top: 40px; padding: 20px; background: #F9FAFB; border-radius: 8px;">
    <div style="font-weight: 600; margin-bottom: 10px; color: #374151;">Notes:</div>
    <div style="color: #6B7280; white-space: pre-line;">{{invoice.notes}}</div>
  </div>
  {{/invoice.notes}}
</div>
  `,
  css: `
    .invoice {
      font-family: 'Inter', sans-serif;
      color: #1F2937;
    }
  `
};