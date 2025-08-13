import { Template } from '../types';

export const fixedCleanProfessionalTemplate: Template = {
  id: 'clean-professional-fixed',
  name: 'Clean Professional',
  brand: {
    primaryColor: '#0F172A',
    accentColor: '#2563EB',
    fontFamilyHeader: 'Inter',
    fontFamilyBody: 'Inter',
    logoPath: ''
  },
  layout: {
    headerStyle: 'left-logo-right-details',
    footerText: 'Thank you for your business!',
    showSignature: false,
    margins: { top: 48, right: 48, bottom: 64, left: 48 }
  },
  defaults: {
    taxRules: ['standard'],
    terms: 'Payment due within 14 days.'
  },
  html: `
<div class="invoice p-8" style="padding: 15px; font-family: 'Inter', sans-serif;">
  <header class="flex items-start justify-between mb-8" style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.2rem;">
    <div class="flex items-center gap-4" style="display: flex; align-items: center; gap: 0.8rem;">
      {{#business.logoPath}}
      <img src="{{business.logoPath}}" alt="{{business.name}} Logo" style="height:48px; max-width: 100px; object-fit: contain;" />
      {{/business.logoPath}}
      <div>
        <h1 style="font-family: {{brand.fontFamilyHeader}}; font-size: 20px; color: {{brand.primaryColor}}; margin: 0; font-weight: 700;">{{business.name}}</h1>
        <div style="font-family: {{brand.fontFamilyBody}}; font-size: 11px; color:#6B7280; margin-top: 2px;">
          {{business.address}}<br>
          {{business.email}} • {{business.phone}}
        </div>
      </div>
    </div>
    <div style="text-align: right;">
      <div style="font-size:22px; color: {{brand.accentColor}}; font-weight:700; margin-bottom: 4px;">INVOICE</div>
      <div style="font-size: 12px; margin-bottom: 2px;"><strong># {{invoice.invoiceNumber}}</strong></div>
      <div style="font-size: 10px; color: #6B7280;">Issue: {{invoice.formattedIssueDate}}</div>
      <div style="font-size: 10px; color: #6B7280;">Due: {{invoice.formattedDueDate}}</div>
    </div>
  </header>

  <section style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;">
    <div>
      <h3 style="font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 13px;">Bill To</h3>
      <div style="line-height: 1.3; font-size: 12px;">
        <div style="font-weight: 500;">{{client.name}}</div>
        <div>{{client.company}}</div>
        <div style="margin-top: 2px;">{{client.billingAddress}}</div>
        <div style="margin-top: 2px; color: #6B7280;">{{client.email}} • {{client.phone}}</div>
      </div>
    </div>
    <div>
      <h3 style="font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 13px;">Invoice Details</h3>
      <div style="line-height: 1.3; font-size: 12px;">
        <div>{{client.shippingAddress}}</div>
        <div style="margin-top: 2px;"><strong>PO:</strong> {{invoice.poNumber}}</div>
        <div style="margin-top: 2px;"><strong>Terms:</strong> {{invoice.paymentTermsDisplay}}</div>
        <div style="margin-top: 2px;"><strong>Currency:</strong> {{invoice.currency}}</div>
      </div>
    </div>
  </section>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.2rem; font-size: 12px;">
    <thead>
      <tr style="background:#F9FAFB;">
        <th style="text-align: left; padding: 8px 10px; font-weight: 600; border-bottom: 2px solid #E5E7EB; font-size: 11px;">Item</th>
        <th style="text-align: left; padding: 8px 10px; font-weight: 600; border-bottom: 2px solid #E5E7EB; font-size: 11px;">Description</th>
        <th style="text-align: right; padding: 8px 10px; font-weight: 600; border-bottom: 2px solid #E5E7EB; font-size: 11px;">Qty</th>
        <th style="text-align: right; padding: 8px 10px; font-weight: 600; border-bottom: 2px solid #E5E7EB; font-size: 11px;">Rate</th>
        <th style="text-align: right; padding: 8px 10px; font-weight: 600; border-bottom: 2px solid #E5E7EB; font-size: 11px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      {{#items}}
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 8px 10px; vertical-align: top;">
          <div style="font-weight: 500; font-size: 11px;">{{name}}</div>
          <div style="font-size: 9px; color: #9CA3AF; margin-top: 1px;">SKU: {{sku}}</div>
        </td>
        <td style="padding: 8px 10px; vertical-align: top;">
          <div style="font-size: 11px; color: #6B7280;">{{description}}</div>
          <div style="font-size: 9px; color: #9CA3AF; margin-top: 2px; font-style: italic;">{{notes}}</div>
        </td>
        <td style="padding: 8px 10px; text-align: right; vertical-align: top; font-size: 11px;">{{formattedQuantity}}</td>
        <td style="padding: 8px 10px; text-align: right; vertical-align: top; font-size: 11px;">{{formattedUnitPrice}}</td>
        <td style="padding: 8px 10px; text-align: right; vertical-align: top; font-weight: 500; font-size: 11px;">{{calculatedLineTotal}}</td>
      </tr>
      {{/items}}
    </tbody>
  </table>

  <!-- Work Details Section -->
  {{#workDetails}}
  <div style="margin: 1rem 0; padding: 10px; background: #F0F9FF; border-radius: 6px; border-left: 3px solid #2563EB;">
    <div style="font-weight: 600; margin-bottom: 6px; color: #1E40AF; display: flex; align-items: center;">
      <svg style="width: 14px; height: 14px; margin-right: 6px;" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 11.5V5z" clip-rule="evenodd"/>
      </svg>
      <span style="font-size: 12px;">Work Details</span>
    </div>
    <div style="color: #374151; line-height: 1.4; white-space: pre-line; font-size: 11px;">{{workDetails}}</div>
  </div>
  {{/workDetails}}

  <section style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem;">
    <div>
      <div style="margin-bottom: 1rem;">
        <h3 style="font-weight: 600; margin-bottom: 4px; color: #374151; font-size: 12px;">Notes</h3>
        <div style="font-size: 11px; line-height: 1.3; color: #6B7280;">{{notes}}</div>
      </div>
      
      <div>
        <h3 style="font-weight: 600; margin-bottom: 4px; color: #374151; font-size: 12px;">Terms & Conditions</h3>
        <div style="font-size: 10px; line-height: 1.3; color: #6B7280;">{{terms}}</div>
      </div>
    </div>
    
    <div>
      <div style="background: #F9FAFB; padding: 12px; border-radius: 6px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
          <span style="color: #6B7280;">Subtotal:</span>
          <span>{{totals.subtotal}}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
          <span style="color: #6B7280;">Tax:</span>
          <span>{{totals.taxTotal}}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
          <span style="color: #6B7280;">Discount:</span>
          <span style="color: #059669;">{{totals.discountTotal}}</span>
        </div>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 8px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; color: {{brand.primaryColor}};">
          <span>Total:</span>
          <span>{{totals.grandTotal}}</span>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 1rem; color: #9CA3AF; font-size: 10px;">
        {{footerText}}
      </div>
    </div>
  </section>

  <!-- Payment Links Section -->
  {{#paymentLinks}}
  {{#paymentLinks.stripeUrl}}
  <div style="margin-top: 1rem; padding: 10px; background: #F0FDF4; border-radius: 6px; border-left: 3px solid #10B981;">
    <div style="font-weight: 600; margin-bottom: 8px; color: #065F46; display: flex; align-items: center;">
      <svg style="width: 14px; height: 14px; margin-right: 6px;" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
        <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/>
      </svg>
      <span style="font-size: 12px;">Payment Options</span>
    </div>
    <div style="margin-bottom: 8px;">
      <div style="margin-bottom: 6px;">
        <a href="{{paymentLinks.stripeUrl}}" style="display: inline-block; padding: 8px 16px; background: #2563EB; color: white; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 10px;">
          💳 Pay with Card
        </a>
      </div>
      {{#paymentLinks.paypalUrl}}
      <div style="margin-bottom: 6px;">
        <a href="{{paymentLinks.paypalUrl}}" style="display: inline-block; padding: 8px 16px; background: #0070BA; color: white; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 10px;">
          🅿️ Pay with PayPal
        </a>
      </div>
      {{/paymentLinks.paypalUrl}}
    </div>
    {{#paymentLinks.instructions}}
    <div style="color: #374151; line-height: 1.3; font-size: 10px; background: white; padding: 8px; border-radius: 4px; border: 1px solid #D1FAE5;">
      <div style="font-weight: 600; margin-bottom: 4px; color: #065F46; font-size: 10px;">Payment Instructions:</div>
      <div style="white-space: pre-line;">{{paymentLinks.instructions}}</div>
    </div>
    {{/paymentLinks.instructions}}
  </div>
  {{/paymentLinks.stripeUrl}}
  {{/paymentLinks}}
</div>
  `,
  css: `
    .invoice {
      font-family: 'Inter', sans-serif;
      color: #0F172A;
      max-width: 210mm;
      margin: 0 auto;
    }
    
    @media print {
      .invoice {
        width: 100%;
        max-width: none;
        margin: 0;
        padding: 0;
      }
    }
  `
};