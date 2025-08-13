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
<!-- LIME GREEN DEBUG TEST -->
<div style="background: lime; color: red; padding: 30px; border: 10px solid blue; font-size: 30px; margin: 20px 0;">
  🚨 SIMPLE TEMPLATE DEBUG: workDetails = "{{workDetails}}" | Invoice = {{invoice.invoiceNumber}}
</div>

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
  
  <!-- Work Details Section -->
  {{#workDetails}}
  <div style="margin-top: 40px; padding: 20px; background: #F0F9FF; border-radius: 8px; border-left: 4px solid #3B82F6;">
    <div style="font-weight: 600; margin-bottom: 12px; color: #1E40AF; display: flex; align-items: center;">
      <svg style="width: 20px; height: 20px; margin-right: 8px;" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 11.5V5z" clip-rule="evenodd"/>
      </svg>
      Work Details
    </div>
    <div style="color: #374151; line-height: 1.6; white-space: pre-line; font-size: 14px;">{{workDetails}}</div>
  </div>
  {{/workDetails}}

  <!-- Payment Links Section -->
  {{#paymentLinks}}
  {{#paymentLinks.stripeUrl}}
  <div style="margin-top: 30px; padding: 20px; background: #F0FDF4; border-radius: 8px; border-left: 4px solid #10B981;">
    <div style="font-weight: 600; margin-bottom: 12px; color: #065F46; display: flex; align-items: center;">
      <svg style="width: 20px; height: 20px; margin-right: 8px;" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
        <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/>
      </svg>
      Payment Options
    </div>
    <div style="margin-bottom: 15px;">
      <div style="margin-bottom: 10px;">
        <a href="{{paymentLinks.stripeUrl}}" style="display: inline-block; padding: 12px 24px; background: #6366F1; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
          💳 Pay with Card
        </a>
      </div>
      {{#paymentLinks.paypalUrl}}
      <div style="margin-bottom: 10px;">
        <a href="{{paymentLinks.paypalUrl}}" style="display: inline-block; padding: 12px 24px; background: #0070BA; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
          🅿️ Pay with PayPal
        </a>
      </div>
      {{/paymentLinks.paypalUrl}}
    </div>
    {{#paymentLinks.instructions}}
    <div style="color: #374151; line-height: 1.5; font-size: 14px; background: white; padding: 15px; border-radius: 6px; border: 1px solid #D1FAE5;">
      <div style="font-weight: 600; margin-bottom: 8px; color: #065F46;">Payment Instructions:</div>
      <div style="white-space: pre-line;">{{paymentLinks.instructions}}</div>
    </div>
    {{/paymentLinks.instructions}}
  </div>
  {{/paymentLinks.stripeUrl}}
  {{/paymentLinks}}

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