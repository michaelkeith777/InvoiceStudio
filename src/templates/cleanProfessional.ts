import { Template } from '../types';

export const cleanProfessionalTemplate: Template = {
  id: 'clean-professional',
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
<div class="invoice p-8">
  <header class="flex items-start justify-between mb-8">
    <div class="flex items-center gap-4">
      {{#business.logoPath}}
      <img src="{{business.logoPath}}" alt="{{business.name}} Logo" style="height:64px; max-width: 120px; object-fit: contain;" />
      {{/business.logoPath}}
      <div>
        <h1 style="font-family: {{brand.fontFamilyHeader}}; font-size: 24px; color: {{brand.primaryColor}}; margin: 0; font-weight: 700;">{{business.name}}</h1>
        <div style="font-family: {{brand.fontFamilyBody}}; font-size: 12px; color:#6B7280; margin-top: 4px;">
          {{business.address}}<br>
          {{business.email}} • {{business.phone}}
        </div>
      </div>
    </div>
    <div class="text-right">
      <div style="font-size:28px; color: {{brand.accentColor}}; font-weight:700; margin-bottom: 8px;">INVOICE</div>
      <div style="font-size: 14px; margin-bottom: 4px;"><strong># {{invoice.invoiceNumber}}</strong></div>
      <div style="font-size: 12px; color: #6B7280;">Issue: {{invoice.formattedIssueDate}}</div>
      <div style="font-size: 12px; color: #6B7280;">Due: {{invoice.formattedDueDate}}</div>
    </div>
  </header>

  <section class="grid grid-cols-2 gap-6 mb-8">
    <div>
      <h3 style="font-weight: 600; margin-bottom: 8px; color: #374151;">Bill To</h3>
      <div style="line-height: 1.5;">
        {{#client.name}}<div style="font-weight: 500;">{{client.name}}</div>{{/client.name}}
        {{#client.company}}<div>{{client.company}}</div>{{/client.company}}
        {{#client.billingAddress}}<div style="margin-top: 4px;">{{client.billingAddress}}</div>{{/client.billingAddress}}
        {{#client.email}}<div style="margin-top: 4px; color: #6B7280;">{{client.email}}{{#client.phone}} • {{client.phone}}{{/client.phone}}</div>{{/client.email}}
      </div>
    </div>
    <div>
      <h3 style="font-weight: 600; margin-bottom: 8px; color: #374151;">Invoice Details</h3>
      <div style="line-height: 1.5;">
        {{#client.shippingAddress}}<div><strong>Ship To:</strong><br>{{client.shippingAddress}}</div>{{/client.shippingAddress}}
        {{#invoice.poNumber}}<div style="margin-top: 4px;"><strong>PO:</strong> {{invoice.poNumber}}</div>{{/invoice.poNumber}}
        <div style="margin-top: 4px;"><strong>Terms:</strong> {{invoice.paymentTermsDisplay}}</div>
        <div style="margin-top: 4px;"><strong>Currency:</strong> {{invoice.currency}}</div>
      </div>
    </div>
  </section>

  <table class="w-full border-collapse mb-8" style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
    <thead>
      <tr style="background:#F9FAFB;">
        <th style="text-align: left; padding: 12px; font-weight: 600; border-bottom: 2px solid #E5E7EB;">Item</th>
        <th style="text-align: left; padding: 12px; font-weight: 600; border-bottom: 2px solid #E5E7EB;">Description</th>
        <th style="text-align: right; padding: 12px; font-weight: 600; border-bottom: 2px solid #E5E7EB;">Qty</th>
        <th style="text-align: right; padding: 12px; font-weight: 600; border-bottom: 2px solid #E5E7EB;">Rate</th>
        {{#items.0.discount}}
        <th style="text-align: right; padding: 12px; font-weight: 600; border-bottom: 2px solid #E5E7EB;">Discount</th>
        {{/items.0.discount}}
        <th style="text-align: right; padding: 12px; font-weight: 600; border-bottom: 2px solid #E5E7EB;">Amount</th>
      </tr>
    </thead>
    <tbody>
      {{#each items}}
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px; vertical-align: top;">
          <div style="font-weight: 500; color: #000000;">{{name}}</div>
          {{#sku}}<div style="font-size: 11px; color: #4B5563; margin-top: 2px;">SKU: {{sku}}</div>{{/sku}}
        </td>
        <td style="padding: 12px; vertical-align: top;">
          <div style="font-size: 13px; color: #000000;">{{description}}</div>
          {{#if notes}}<div style="font-size: 11px; color: #4B5563; margin-top: 4px; font-style: italic;">{{notes}}</div>{{/if}}
        </td>
        <td style="padding: 12px; text-align: right; vertical-align: top; color: #000000;">{{formattedQuantity}}</td>
        <td style="padding: 12px; text-align: right; vertical-align: top; color: #000000;">{{formattedUnitPrice}}</td>
        {{#if discount}}
        <td style="padding: 12px; text-align: right; vertical-align: top; color: #059669;">{{discountDisplay}}</td>
        {{else}}
        {{#if ../items.0.discount}}<td style="padding: 12px; text-align: right; vertical-align: top;">-</td>{{/if}}
        {{/if}}
        <td style="padding: 12px; text-align: right; vertical-align: top; font-weight: 500; color: #000000;">{{calculatedLineTotal}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  {{#if workDetails}}
  <section style="margin-bottom: 2rem;">
    <h3 style="font-weight: 600; margin-bottom: 12px; color: #000000; font-size: 16px;">Details of Work</h3>
    <div style="background: #F9FAFB; padding: 1.5rem; border-radius: 8px; border-left: 4px solid {{brand.primaryColor}};">
      <div style="font-size: 14px; line-height: 1.6; color: #000000;" class="work-details-content">{{{workDetails}}}</div>
    </div>
  </section>
  {{/if}}
  
  <!-- TESTING: Always show work details section -->
  <section style="margin-bottom: 2rem; background: #FEF3C7; padding: 1rem; border-radius: 6px; border: 1px solid #F59E0B;">
    <h3 style="font-weight: 600; margin-bottom: 8px; color: #92400E;">Work Details Debug</h3>
    <div style="font-size: 12px; color: #92400E;">
      Data: "{{workDetails}}" | Has Data: {{#if workDetails}}YES{{else}}NO{{/if}}
    </div>
  </section>

  <section class="grid grid-cols-2 gap-8" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
    <div>
      {{#if notes}}
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #000000;">Notes</h3>
        <div style="font-size: 14px; line-height: 1.5; color: #000000;">{{notes}}</div>
      </div>
      {{/if}}
      
      {{#if terms}}
      <div>
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #000000;">Terms & Conditions</h3>
        <div style="font-size: 13px; line-height: 1.4; color: #000000;">{{terms}}</div>
      </div>
      {{/if}}

      {{#if paymentLinks}}
      <div style="margin-top: 1.5rem; background: #F0FDF4; border-radius: 8px; padding: 1rem; border-left: 4px solid #16A34A;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #15803D; font-size: 14px;">Payment Options</h3>
        {{#if paymentLinks.stripeUrl}}
        <div style="margin-bottom: 6px; font-size: 13px;">
          <strong style="color: #15803D;">Credit Card:</strong> 
          <a href="{{paymentLinks.stripeUrl}}" style="color: #2563EB; text-decoration: underline;">Pay with Stripe</a>
        </div>
        {{/if}}
        {{#if paymentLinks.paypalUrl}}
        <div style="margin-bottom: 6px; font-size: 13px;">
          <strong style="color: #15803D;">PayPal:</strong> 
          <a href="{{paymentLinks.paypalUrl}}" style="color: #2563EB; text-decoration: underline;">Pay with PayPal</a>
        </div>
        {{/if}}
        {{#if paymentLinks.instructions}}
        <div style="margin-top: 8px; font-size: 12px; line-height: 1.4; color: #166534;">{{paymentLinks.instructions}}</div>
        {{/if}}
      </div>
      {{/if}}

      {{#if payments.length}}
      <div style="margin-top: 1.5rem;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #374151;">Payments Received</h3>
        {{#each payments}}
        <div style="font-size: 13px; display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>{{formattedDate}} - {{method}}</span>
          <span style="font-weight: 500;">{{formattedAmount}}</span>
        </div>
        {{/each}}
      </div>
      {{/if}}
    </div>

    <div>
      <div style="background: #F9FAFB; padding: 1.5rem; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #000000;">
          <span>Subtotal</span><span>{{totals.subtotal}}</span>
        </div>
        
        {{#if totals.itemDiscounts}}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #059669;">
          <span>Item Discounts</span><span>-{{totals.itemDiscounts}}</span>
        </div>
        {{/if}}
        
        {{#if totals.invoiceDiscounts}}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #059669;">
          <span>Invoice Discounts</span><span>-{{totals.invoiceDiscounts}}</span>
        </div>
        {{/if}}
        
        {{#if totals.fees}}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #000000;">
          <span>Fees</span><span>{{totals.fees}}</span>
        </div>
        {{/if}}
        
        {{#if totals.tax}}
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #000000;">
          <span>Tax</span><span>{{totals.tax}}</span>
        </div>
        {{/if}}
        
        <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid #E5E7EB; font-size: 18px; font-weight: 700; color: #000000;">
          <span>Total</span><span style="color: {{brand.primaryColor}};">{{totals.grandTotal}}</span>
        </div>
        
        {{#if totals.paid}}
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 14px; color: #2563EB;">
          <span>Paid</span><span>-{{totals.paid}}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB; font-size: 16px; font-weight: 600; color: #DC2626;">
          <span>Balance Due</span><span>{{totals.balanceDue}}</span>
        </div>
        {{/if}}
      </div>
      
      {{#if layout.showSignature}}
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #E5E7EB;">
        <div style="font-size: 13px; color: #6B7280; margin-bottom: 1rem;">Authorized Signature:</div>
        <div style="border-bottom: 1px solid #E5E7EB; height: 2rem;"></div>
        <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">Date</div>
      </div>
      {{/if}}
    </div>
  </section>

  {{#if layout.footerText}}
  <footer style="margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #E5E7EB; text-align: center; font-size: 12px; color: #9CA3AF;">
    {{layout.footerText}}
  </footer>
  {{/if}}
</div>
  `,
  css: `
    .invoice {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1F2937;
      line-height: 1.5;
    }
    
    .grid {
      display: grid;
    }
    
    .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    
    .gap-6 {
      gap: 1.5rem;
    }
    
    .gap-8 {
      gap: 2rem;
    }
    
    .flex {
      display: flex;
    }
    
    .items-start {
      align-items: flex-start;
    }
    
    .items-center {
      align-items: center;
    }
    
    .justify-between {
      justify-content: space-between;
    }
    
    .text-right {
      text-align: right;
    }
    
    .mb-8 {
      margin-bottom: 2rem;
    }
    
    @media print {
      .invoice {
        padding: 0;
      }
      
      table {
        page-break-inside: avoid;
      }
      
      tr {
        page-break-inside: avoid;
      }
    }
  `
};
