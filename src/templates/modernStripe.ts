import { Template } from '../types';

export const modernStripeTemplate: Template = {
  id: 'modern-stripe',
  name: 'Modern Stripe',
  brand: {
    primaryColor: '#1E293B',
    accentColor: '#3B82F6',
    fontFamilyHeader: 'Inter',
    fontFamilyBody: 'Inter',
    logoPath: ''
  },
  layout: {
    headerStyle: 'stripe-header-style',
    footerText: 'Thank you for your business!',
    showSignature: false,
    margins: { top: 32, right: 48, bottom: 64, left: 48 }
  },
  defaults: {
    taxRules: ['standard'],
    terms: 'Payment due within 30 days.'
  },
  html: `
<div class="invoice">
  <!-- Color Stripe Header -->
  <div class="stripe-header" style="background: linear-gradient(135deg, {{brand.accentColor}} 0%, #8B5CF6 100%); height: 80px; margin: -32px -48px 2rem -48px; position: relative;">
    <div class="stripe-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.1);"></div>
    <div style="position: relative; z-index: 1; padding: 24px 48px; display: flex; align-items: center; justify-content: space-between;">
      <div class="flex items-center gap-4">
        {{#if business.logoPath}}
        <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
          <img src="{{business.logoPath}}" alt="{{business.name}} Logo" style="height: 32px; max-width: 40px; object-fit: contain;" />
        </div>
        {{else}}
        <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
          <div style="font-size: 18px; font-weight: 700; color: #000000;">{{business.name.0}}</div>
        </div>
        {{/if}}
        <div>
          <h1 style="font-family: {{brand.fontFamilyHeader}}; font-size: 20px; color: #000000; margin: 0; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">{{business.name}}</h1>
          <div style="font-size: 12px; color: rgba(255,255,255,0.9); margin-top: 2px;">Professional Invoice</div>
        </div>
      </div>
      <div class="text-right">
        <div style="font-size: 32px; color: #000000; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">INVOICE</div>
        <div style="font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 500;"># {{invoice.invoiceNumber}}</div>
      </div>
    </div>
  </div>

  <div style="padding: 0 48px;">
    <!-- Business and Invoice Info -->
    <section class="grid grid-cols-2 gap-8 mb-8">
      <div>
        <div style="background: #F8FAFC; border-radius: 12px; padding: 1.5rem; border-left: 4px solid {{brand.accentColor}};">
          <h3 style="font-weight: 600; margin-bottom: 12px; color: {{brand.primaryColor}}; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">From</h3>
          <div style="line-height: 1.6; color: #475569;">
            <div style="font-weight: 600; color: {{brand.primaryColor}}; margin-bottom: 4px;">{{business.name}}</div>
            <div style="font-size: 13px;">{{business.address}}</div>
            <div style="font-size: 13px; margin-top: 8px;">
              {{business.email}}<br>
              {{business.phone}}
            </div>
            {{#if business.taxId}}<div style="font-size: 12px; color: #64748B; margin-top: 8px;">Tax ID: {{business.taxId}}</div>{{/if}}
          </div>
        </div>
      </div>
      
      <div>
        <div style="background: #F1F5F9; border-radius: 12px; padding: 1.5rem; border-left: 4px solid #64748B;">
          <h3 style="font-weight: 600; margin-bottom: 12px; color: {{brand.primaryColor}}; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Invoice Details</h3>
          <div style="line-height: 1.6; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #64748B;">Issue Date:</span>
              <span style="font-weight: 500; color: {{brand.primaryColor}};">{{invoice.formattedIssueDate}}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #64748B;">Due Date:</span>
              <span style="font-weight: 500; color: #DC2626;">{{invoice.formattedDueDate}}</span>
            </div>
            {{#if invoice.poNumber}}
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #64748B;">PO Number:</span>
              <span style="font-weight: 500; color: {{brand.primaryColor}};">{{invoice.poNumber}}</span>
            </div>
            {{/if}}
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #64748B;">Terms:</span>
              <span style="font-weight: 500; color: {{brand.primaryColor}};">{{invoice.paymentTermsDisplay}}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748B;">Currency:</span>
              <span style="font-weight: 500; color: {{brand.primaryColor}};">{{invoice.currency}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Client Information -->
    <section class="mb-8">
      <div style="background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%); border-radius: 12px; padding: 1.5rem; border: 1px solid #E2E8F0;">
        <h3 style="font-weight: 600; margin-bottom: 12px; color: {{brand.primaryColor}}; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Bill To</h3>
        <div class="grid grid-cols-2 gap-8">
          <div style="line-height: 1.6;">
            {{#if client.name}}<div style="font-weight: 600; color: {{brand.primaryColor}}; font-size: 16px; margin-bottom: 4px;">{{client.name}}</div>{{/if}}
            {{#if client.company}}<div style="font-weight: 500; color: #475569; margin-bottom: 8px;">{{client.company}}</div>{{/if}}
            {{#if client.billingAddress}}<div style="font-size: 13px; color: #64748B;">{{client.billingAddress}}</div>{{/if}}
            {{#if client.email}}<div style="font-size: 13px; color: #64748B; margin-top: 8px;">{{client.email}}{{#if client.phone}} • {{client.phone}}{{/if}}</div>{{/if}}
          </div>
          {{#if client.shippingAddress}}
          <div style="line-height: 1.6;">
            <div style="font-weight: 500; color: #64748B; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Ship To</div>
            <div style="font-size: 13px; color: #64748B;">{{client.shippingAddress}}</div>
          </div>
          {{/if}}
        </div>
      </div>
    </section>

    <!-- Items Table -->
    <section class="mb-8">
      <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: linear-gradient(135deg, {{brand.accentColor}} 0%, #8B5CF6 100%);">
              <th style="text-align: left; padding: 16px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 0.5px; font-size: 12px;">Item</th>
              <th style="text-align: left; padding: 16px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 0.5px; font-size: 12px;">Description</th>
              <th style="text-align: center; padding: 16px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 0.5px; font-size: 12px;">Qty</th>
              <th style="text-align: right; padding: 16px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 0.5px; font-size: 12px;">Rate</th>
              {{#if items.0.discount}}
              <th style="text-align: right; padding: 16px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 0.5px; font-size: 12px;">Discount</th>
              {{/if}}
              <th style="text-align: right; padding: 16px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 0.5px; font-size: 12px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            {{#each items}}
            <tr style="border-bottom: 1px solid #E2E8F0; {{#unless @last}}{{else}}border-bottom: none;{{/unless}}">
              <td style="padding: 16px; vertical-align: top;">
                <div style="font-weight: 600; color: {{../brand.primaryColor}};">{{name}}</div>
                {{#if sku}}<div style="font-size: 11px; color: #94A3B8; margin-top: 4px; background: #F1F5F9; padding: 2px 6px; border-radius: 4px; display: inline-block;">{{sku}}</div>{{/if}}
              </td>
              <td style="padding: 16px; vertical-align: top;">
                <div style="font-size: 13px; color: #64748B; line-height: 1.5;">{{description}}</div>
                {{#if notes}}<div style="font-size: 11px; color: #94A3B8; margin-top: 8px; font-style: italic; background: #F8FAFC; padding: 6px; border-radius: 4px; border-left: 3px solid {{../brand.accentColor}};">{{notes}}</div>{{/if}}
              </td>
              <td style="padding: 16px; text-align: center; vertical-align: top;">
                <div style="background: #F1F5F9; border-radius: 6px; padding: 4px 8px; display: inline-block; font-weight: 500; font-size: 13px;">{{formattedQuantity}}</div>
              </td>
              <td style="padding: 16px; text-align: right; vertical-align: top; font-weight: 500; font-size: 13px;">{{formattedUnitPrice}}</td>
              {{#if discount}}
              <td style="padding: 16px; text-align: right; vertical-align: top;">
                <div style="color: #059669; font-weight: 500; background: #ECFDF5; padding: 4px 8px; border-radius: 6px; display: inline-block; font-size: 12px;">{{discountDisplay}}</div>
              </td>
              {{else}}
              {{#if ../items.0.discount}}<td style="padding: 16px; text-align: right; vertical-align: top; color: #94A3B8;">-</td>{{/if}}
              {{/if}}
              <td style="padding: 16px; text-align: right; vertical-align: top; font-weight: 600; color: {{../brand.primaryColor}}; font-size: 14px;">{{calculatedLineTotal}}</td>
            </tr>
            {{/each}}
          </tbody>
        </table>
      </div>
    </section>

    {{#if workDetails}}
    <!-- Work Details Section -->
    <section class="mb-8">
      <div style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); border-radius: 12px; padding: 1.5rem; border-left: 4px solid {{brand.primaryColor}};">
        <h3 style="font-weight: 600; margin-bottom: 12px; color: {{brand.primaryColor}}; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Details of Work</h3>
        <div style="font-size: 14px; line-height: 1.6; color: #000000;" class="work-details-content">{{{workDetails}}}</div>
      </div>
    </section>
    {{/if}}

    <!-- Summary Section -->
    <section class="grid grid-cols-2 gap-8">
      <div>
        {{#if notes}}
        <div style="background: #FEF3C7; border-radius: 12px; padding: 1.5rem; border-left: 4px solid #F59E0B; margin-bottom: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 12px; color: #000000; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Notes</h3>
          <div style="font-size: 14px; line-height: 1.6; color: #000000;">{{notes}}</div>
        </div>
        {{/if}}

        {{#if paymentLinks}}
        <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border-radius: 12px; padding: 1.5rem; border-left: 4px solid #16A34A; margin-bottom: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 12px; color: #000000; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Options</h3>
          {{#if paymentLinks.stripeUrl}}
          <div style="margin-bottom: 8px; font-size: 14px;">
            <strong style="color: #000000;">Credit Card Payment:</strong> 
            <a href="{{paymentLinks.stripeUrl}}" style="color: #2563EB; text-decoration: underline; font-weight: 500;">Pay with Stripe</a>
          </div>
          {{/if}}
          {{#if paymentLinks.paypalUrl}}
          <div style="margin-bottom: 8px; font-size: 14px;">
            <strong style="color: #000000;">PayPal Payment:</strong> 
            <a href="{{paymentLinks.paypalUrl}}" style="color: #2563EB; text-decoration: underline; font-weight: 500;">Pay with PayPal</a>
          </div>
          {{/if}}
          {{#if paymentLinks.instructions}}
          <div style="margin-top: 12px; font-size: 13px; line-height: 1.6; color: #000000;">{{paymentLinks.instructions}}</div>
          {{/if}}
        </div>
        {{/if}}
        
        {{#if terms}}
        <div style="background: #DBEAFE; border-radius: 12px; padding: 1.5rem; border-left: 4px solid {{brand.accentColor}};">
          <h3 style="font-weight: 600; margin-bottom: 12px; color: #1D4ED8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Terms & Conditions</h3>
          <div style="font-size: 13px; line-height: 1.5; color: #1E40AF;">{{terms}}</div>
        </div>
        {{/if}}

        {{#if payments.length}}
        <div style="background: #F0FDF4; border-radius: 12px; padding: 1.5rem; border-left: 4px solid #22C55E; margin-top: 1.5rem;">
          <h3 style="font-weight: 600; margin-bottom: 12px; color: #166534; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Payments Received</h3>
          {{#each payments}}
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
            <span style="color: #166534;">{{formattedDate}} - {{method}}</span>
            <span style="font-weight: 600; color: #22C55E;">{{formattedAmount}}</span>
          </div>
          {{/each}}
        </div>
        {{/if}}
      </div>

      <div>
        <div style="background: linear-gradient(135deg, {{brand.primaryColor}} 0%, #475569 100%); border-radius: 16px; padding: 2rem; color: white; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          
          <div style="position: relative; z-index: 1;">
            <h3 style="font-weight: 600; margin-bottom: 1rem; color: rgba(255,255,255,0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Invoice Summary</h3>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: rgba(255,255,255,0.8);">
              <span>Subtotal</span><span style="font-weight: 500;">{{totals.subtotal}}</span>
            </div>
            
            {{#if totals.itemDiscounts}}
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #34D399;">
              <span>Item Discounts</span><span style="font-weight: 500;">-{{totals.itemDiscounts}}</span>
            </div>
            {{/if}}
            
            {{#if totals.invoiceDiscounts}}
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #34D399;">
              <span>Invoice Discounts</span><span style="font-weight: 500;">-{{totals.invoiceDiscounts}}</span>
            </div>
            {{/if}}
            
            {{#if totals.fees}}
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: rgba(255,255,255,0.8);">
              <span>Fees</span><span style="font-weight: 500;">{{totals.fees}}</span>
            </div>
            {{/if}}
            
            {{#if totals.tax}}
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 14px; color: rgba(255,255,255,0.8);">
              <span>Tax</span><span style="font-weight: 500;">{{totals.tax}}</span>
            </div>
            {{/if}}
            
            <div style="border-top: 2px solid rgba(255,255,255,0.2); padding-top: 16px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700;">
                <span>Total</span><span style="color: #FDE047;">{{totals.grandTotal}}</span>
              </div>
            </div>
            
            {{#if totals.paid}}
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #34D399;">
              <span>Paid</span><span style="font-weight: 500;">-{{totals.paid}}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 18px; font-weight: 700;">
              <span>Balance Due</span><span style="color: #FCA5A5;">{{totals.balanceDue}}</span>
            </div>
            {{/if}}
          </div>
        </div>
        
        {{#if layout.showSignature}}
        <div style="margin-top: 2rem; background: white; border-radius: 12px; padding: 1.5rem; border: 1px solid #E2E8F0;">
          <div style="font-size: 13px; color: #64748B; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">Authorized Signature:</div>
          <div style="border-bottom: 2px solid #E2E8F0; height: 3rem; margin-bottom: 0.5rem;"></div>
          <div style="font-size: 11px; color: #94A3B8;">Date</div>
        </div>
        {{/if}}
      </div>
    </section>

    {{#if layout.footerText}}
    <footer style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #E2E8F0; text-align: center;">
      <div style="background: linear-gradient(135deg, {{brand.accentColor}} 0%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 600; font-size: 14px;">
        {{layout.footerText}}
      </div>
    </footer>
    {{/if}}
  </div>
</div>
  `,
  css: `
    .invoice {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1E293B;
      line-height: 1.5;
    }
    
    .grid {
      display: grid;
    }
    
    .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
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
      
      .stripe-header {
        margin: 0 !important;
        -webkit-print-color-adjust: exact;
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
