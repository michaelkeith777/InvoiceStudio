import { Template } from '../types';

export const compactLedgerTemplate: Template = {
  id: 'compact-ledger',
  name: 'Compact Ledger',
  brand: {
    primaryColor: '#1F2937',
    accentColor: '#374151',
    fontFamilyHeader: 'Roboto Slab',
    fontFamilyBody: 'Inter',
    logoPath: ''
  },
  layout: {
    headerStyle: 'compact-header',
    footerText: 'Thank you for your business!',
    showSignature: false,
    margins: { top: 32, right: 32, bottom: 48, left: 32 }
  },
  defaults: {
    taxRules: ['standard'],
    terms: 'Payment due within 30 days.'
  },
  html: `
<div class="invoice" style="font-size: 12px; line-height: 1.4;">
  <!-- Compact Header -->
  <header style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid {{brand.primaryColor}};">
    <div style="flex: 1;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
        {{#if business.logoPath}}
        <img src="{{business.logoPath}}" alt="{{business.name}} Logo" style="height: 32px; max-width: 64px; object-fit: contain;" />
        {{/if}}
        <div>
          <h1 style="font-family: {{brand.fontFamilyHeader}}; font-size: 18px; color: {{brand.primaryColor}}; margin: 0; font-weight: 700;">{{business.name}}</h1>
          <div style="font-size: 10px; color: #6B7280; margin-top: 2px;">{{business.email}} • {{business.phone}}</div>
        </div>
      </div>
      <div style="font-size: 11px; color: #6B7280; line-height: 1.3;">
        {{business.address}}
      </div>
      {{#if business.taxId}}<div style="font-size: 10px; color: #9CA3AF; margin-top: 4px;">Tax ID: {{business.taxId}}</div>{{/if}}
    </div>
    
    <div style="text-align: right; min-width: 200px;">
      <div style="background: {{brand.primaryColor}}; color: #000000; padding: 8px 16px; border-radius: 4px; margin-bottom: 8px;">
        <div style="font-size: 16px; font-weight: 700; margin-bottom: 2px;">INVOICE</div>
        <div style="font-size: 12px; opacity: 0.9;"># {{invoice.invoiceNumber}}</div>
      </div>
      <div style="font-size: 11px; color: #374151;">
        <div><strong>Issue:</strong> {{invoice.formattedIssueDate}}</div>
        <div><strong>Due:</strong> {{invoice.formattedDueDate}}</div>
        {{#if invoice.poNumber}}<div><strong>PO:</strong> {{invoice.poNumber}}</div>{{/if}}
      </div>
    </div>
  </header>

  <!-- Client and Invoice Details in 3 columns -->
  <section style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 11px;">
    <div>
      <h3 style="font-weight: 600; margin-bottom: 8px; color: {{brand.primaryColor}}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px;">Bill To</h3>
      <div style="line-height: 1.4;">
        {{#if client.name}}<div style="font-weight: 600; color: {{brand.primaryColor}}; margin-bottom: 3px;">{{client.name}}</div>{{/if}}
        {{#if client.company}}<div style="color: #4B5563; margin-bottom: 6px;">{{client.company}}</div>{{/if}}
        {{#if client.billingAddress}}<div style="color: #6B7280;">{{client.billingAddress}}</div>{{/if}}
        {{#if client.email}}<div style="color: #6B7280; margin-top: 4px;">{{client.email}}</div>{{/if}}
        {{#if client.phone}}<div style="color: #6B7280;">{{client.phone}}</div>{{/if}}
      </div>
    </div>
    
    {{#if client.shippingAddress}}
    <div>
      <h3 style="font-weight: 600; margin-bottom: 8px; color: {{brand.primaryColor}}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px;">Ship To</h3>
      <div style="line-height: 1.4; color: #6B7280;">
        {{client.shippingAddress}}
      </div>
    </div>
    {{/if}}
    
    <div>
      <h3 style="font-weight: 600; margin-bottom: 8px; color: {{brand.primaryColor}}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px;">Terms</h3>
      <div style="line-height: 1.4; font-size: 11px;">
        <div style="margin-bottom: 3px;"><span style="color: #6B7280;">Payment:</span> <span style="font-weight: 500; color: {{brand.primaryColor}};">{{invoice.paymentTermsDisplay}}</span></div>
        <div style="margin-bottom: 3px;"><span style="color: #6B7280;">Currency:</span> <span style="font-weight: 500; color: {{brand.primaryColor}};">{{invoice.currency}}</span></div>
        {{#if business.bankDetails}}<div style="margin-top: 6px; font-size: 10px; color: #9CA3AF;">{{business.bankDetails}}</div>{{/if}}
      </div>
    </div>
  </section>

  <!-- Compact Items Table -->
  <section class="mb-6">
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #D1D5DB;">
      <thead>
        <tr style="background: #F9FAFB; border-bottom: 1px solid #D1D5DB;">
          <th style="text-align: left; padding: 8px 6px; font-weight: 600; color: {{brand.primaryColor}}; width: 25%;">#</th>
          <th style="text-align: left; padding: 8px 6px; font-weight: 600; color: {{brand.primaryColor}}; width: 35%;">Item & Description</th>
          <th style="text-align: center; padding: 8px 6px; font-weight: 600; color: {{brand.primaryColor}}; width: 8%;">Qty</th>
          <th style="text-align: right; padding: 8px 6px; font-weight: 600; color: {{brand.primaryColor}}; width: 12%;">Rate</th>
          {{#if items.0.discount}}
          <th style="text-align: right; padding: 8px 6px; font-weight: 600; color: {{brand.primaryColor}}; width: 10%;">Disc.</th>
          {{/if}}
          <th style="text-align: right; padding: 8px 6px; font-weight: 600; color: {{brand.primaryColor}}; width: 12%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        {{#each items}}
        <tr style="border-bottom: 1px solid #E5E7EB; {{#if @last}}border-bottom: 2px solid #D1D5DB;{{/if}}">
          <td style="padding: 8px 6px; vertical-align: top;">
            <div style="font-weight: 500; color: {{../brand.primaryColor}};">{{@index1}}</div>
            {{#if sku}}<div style="font-size: 9px; color: #9CA3AF;">{{sku}}</div>{{/if}}
          </td>
          <td style="padding: 8px 6px; vertical-align: top;">
            <div style="font-weight: 500; color: {{../brand.primaryColor}}; margin-bottom: 2px;">{{name}}</div>
            {{#if description}}<div style="font-size: 10px; color: #6B7280; line-height: 1.3;">{{description}}</div>{{/if}}
            {{#if notes}}<div style="font-size: 9px; color: #9CA3AF; margin-top: 3px; font-style: italic;">{{notes}}</div>{{/if}}
          </td>
          <td style="padding: 8px 6px; text-align: center; vertical-align: top;">
            <span style="background: #F3F4F6; padding: 2px 6px; border-radius: 4px; font-weight: 500;">{{formattedQuantity}}</span>
          </td>
          <td style="padding: 8px 6px; text-align: right; vertical-align: top; font-weight: 500;">{{formattedUnitPrice}}</td>
          {{#if discount}}
          <td style="padding: 8px 6px; text-align: right; vertical-align: top; color: #059669; font-weight: 500; font-size: 10px;">{{discountDisplay}}</td>
          {{else}}
          {{#if ../items.0.discount}}<td style="padding: 8px 6px; text-align: right; vertical-align: top; color: #9CA3AF;">-</td>{{/if}}
          {{/if}}
          <td style="padding: 8px 6px; text-align: right; vertical-align: top; font-weight: 600; color: {{../brand.primaryColor}};">{{calculatedLineTotal}}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>
  </section>

  <!-- Summary and Notes Side by Side -->
  <section style="display: grid; grid-template-columns: 1fr 300px; gap: 32px; margin-top: 24px;">
    <div>
      {{#if notes}}
      <div style="margin-bottom: 20px;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: {{brand.primaryColor}}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Notes</h3>
        <div style="font-size: 11px; line-height: 1.4; color: #4B5563; background: #F9FAFB; padding: 12px; border-radius: 6px; border-left: 3px solid {{brand.accentColor}};">{{notes}}</div>
      </div>
      {{/if}}
      
      {{#if terms}}
      <div style="margin-bottom: 20px;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: {{brand.primaryColor}}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Terms & Conditions</h3>
        <div style="font-size: 10px; line-height: 1.3; color: #6B7280; background: #F9FAFB; padding: 12px; border-radius: 6px;">{{terms}}</div>
      </div>
      {{/if}}

      {{#if paymentLinks}}
      <div style="margin-bottom: 20px;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #15803D; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Options</h3>
        <div style="background: #F0FDF4; border-radius: 6px; padding: 12px; border-left: 3px solid #16A34A;">
          {{#if paymentLinks.stripeUrl}}
          <div style="margin-bottom: 6px; font-size: 10px;">
            <strong style="color: #000000;">Credit Card:</strong> 
            <a href="{{paymentLinks.stripeUrl}}" style="color: #2563EB; text-decoration: underline;">Pay with Stripe</a>
          </div>
          {{/if}}
          {{#if paymentLinks.paypalUrl}}
          <div style="margin-bottom: 6px; font-size: 10px;">
            <strong style="color: #000000;">PayPal:</strong> 
            <a href="{{paymentLinks.paypalUrl}}" style="color: #2563EB; text-decoration: underline;">Pay with PayPal</a>
          </div>
          {{/if}}
          {{#if paymentLinks.instructions}}
          <div style="margin-top: 8px; font-size: 9px; line-height: 1.3; color: #000000;">{{paymentLinks.instructions}}</div>
          {{/if}}
        </div>
      </div>
      {{/if}}

      {{#if payments.length}}
      <div>
        <h3 style="font-weight: 600; margin-bottom: 8px; color: {{brand.primaryColor}}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Payment History</h3>
        <div style="background: #ECFDF5; border-radius: 6px; padding: 12px; border-left: 3px solid #22C55E;">
          {{#each payments}}
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 10px; {{#if @last}}margin-bottom: 0;{{/if}}">
            <span style="color: #166534;">{{formattedDate}} - {{method}}</span>
            <span style="font-weight: 600; color: #22C55E;">{{formattedAmount}}</span>
          </div>
          {{/each}}
        </div>
      </div>
      {{/if}}
    </div>

    <!-- Compact Totals -->
    <div>
      <div style="background: {{brand.primaryColor}}; color: #000000; border-radius: 8px; padding: 16px; font-size: 11px;">
        <h3 style="font-weight: 600; margin-bottom: 12px; color: rgba(255,255,255,0.9); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Summary</h3>
        
        <div style="space-y: 6px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: rgba(255,255,255,0.8);">Subtotal</span>
            <span style="font-weight: 500;">{{totals.subtotal}}</span>
          </div>
          
          {{#if totals.itemDiscounts}}
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #34D399;">
            <span>Item Discounts</span>
            <span style="font-weight: 500;">-{{totals.itemDiscounts}}</span>
          </div>
          {{/if}}
          
          {{#if totals.invoiceDiscounts}}
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #34D399;">
            <span>Invoice Discounts</span>
            <span style="font-weight: 500;">-{{totals.invoiceDiscounts}}</span>
          </div>
          {{/if}}
          
          {{#if totals.fees}}
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: rgba(255,255,255,0.8);">Fees</span>
            <span style="font-weight: 500;">{{totals.fees}}</span>
          </div>
          {{/if}}
          
          {{#if totals.tax}}
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: rgba(255,255,255,0.8);">Tax</span>
            <span style="font-weight: 500;">{{totals.tax}}</span>
          </div>
          {{/if}}
          
          <div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700;">
              <span>Total</span>
              <span>{{totals.grandTotal}}</span>
            </div>
          </div>
          
          {{#if totals.paid}}
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #34D399;">
            <span>Paid</span>
            <span style="font-weight: 500;">-{{totals.paid}}</span>
          </div>
          
          <div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 6px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #FCA5A5;">
              <span>Balance Due</span>
              <span>{{totals.balanceDue}}</span>
            </div>
          </div>
          {{/if}}
        </div>
      </div>
      
      {{#if layout.showSignature}}
      <div style="margin-top: 20px; border: 1px solid #D1D5DB; border-radius: 6px; padding: 12px;">
        <div style="font-size: 10px; color: #6B7280; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Authorized Signature:</div>
        <div style="border-bottom: 1px solid #D1D5DB; height: 32px; margin-bottom: 4px;"></div>
        <div style="font-size: 9px; color: #9CA3AF;">Date</div>
      </div>
      {{/if}}
    </div>
  </section>

  {{#if layout.footerText}}
  <footer style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #D1D5DB; text-align: center;">
    <div style="font-size: 10px; color: #6B7280;">{{layout.footerText}}</div>
  </footer>
  {{/if}}
</div>
  `,
  css: `
    .invoice {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1F2937;
      line-height: 1.4;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Roboto Slab', serif;
    }
    
    .grid {
      display: grid;
    }
    
    .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    
    .grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    
    .gap-6 {
      gap: 1.5rem;
    }
    
    .mb-6 {
      margin-bottom: 1.5rem;
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
    
    @media print {
      .invoice {
        font-size: 11px;
      }
      
      table {
        page-break-inside: avoid;
      }
      
      tr {
        page-break-inside: avoid;
      }
      
      .grid {
        page-break-inside: avoid;
      }
    }
  `
};
