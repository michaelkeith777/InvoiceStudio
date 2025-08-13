import Mustache from 'mustache';
import { Invoice, Template, BusinessProfile } from '../types';
import { formatCurrency, calculateItemTotal, calculateItemDiscount } from './calculations';

/**
 * Prepare data for template rendering
 */
export const prepareTemplateData = (
  invoice: Invoice,
  template: Template,
  businessProfile: BusinessProfile
) => {
  // Debug the conditions for workDetails and paymentLinks
  const hasWorkDetails = !!(invoice.workDetails && invoice.workDetails.trim());
  const hasPaymentLinks = !!(
    invoice.paymentLinks.stripeUrl || 
    invoice.paymentLinks.paypalUrl || 
    invoice.paymentLinks.instructions
  );
  
  console.log('Template conditions:', {
    workDetailsRaw: JSON.stringify(invoice.workDetails),
    workDetailsLength: invoice.workDetails?.length || 0,
    hasWorkDetails,
    paymentLinksRaw: JSON.stringify(invoice.paymentLinks),
    hasPaymentLinks
  });

  // Prepare items with calculated values
  const itemsWithCalculations = invoice.items.map(item => ({
    ...item,
    calculatedLineTotal: formatCurrency(calculateItemTotal(item), invoice.currency, invoice.locale),
    calculatedDiscount: item.discount ? formatCurrency(calculateItemDiscount(item), invoice.currency, invoice.locale) : '',
    formattedUnitPrice: formatCurrency(item.unitPrice, invoice.currency, invoice.locale),
    formattedQuantity: item.quantity.toString(),
    discountDisplay: item.discount 
      ? `${item.discount.type === 'percent' ? item.discount.value + '%' : formatCurrency(item.discount.value, invoice.currency, invoice.locale)}`
      : ''
  }));

  // Prepare totals with currency formatting
  const formattedTotals = {
    subtotal: formatCurrency(invoice.totals.subtotal, invoice.currency, invoice.locale),
    itemDiscounts: formatCurrency(invoice.totals.itemDiscounts, invoice.currency, invoice.locale),
    invoiceDiscounts: formatCurrency(invoice.totals.invoiceDiscounts, invoice.currency, invoice.locale),
    fees: formatCurrency(invoice.totals.fees, invoice.currency, invoice.locale),
    tax: formatCurrency(invoice.totals.tax, invoice.currency, invoice.locale),
    grandTotal: formatCurrency(invoice.totals.grandTotal, invoice.currency, invoice.locale),
    paid: formatCurrency(invoice.totals.paid, invoice.currency, invoice.locale),
    balanceDue: formatCurrency(invoice.totals.balanceDue, invoice.currency, invoice.locale)
  };

  // Prepare fees with formatting
  const formattedFees = invoice.fees.map(fee => ({
    ...fee,
    formattedValue: fee.type === 'percent' 
      ? `${fee.value}%` 
      : formatCurrency(fee.value, invoice.currency, invoice.locale)
  }));

  // Prepare taxes with formatting
  const formattedTaxes = invoice.taxes.map(tax => ({
    ...tax,
    formattedRate: `${tax.rate}%`
  }));

  // Prepare payments with formatting
  const formattedPayments = invoice.payments.map(payment => ({
    ...payment,
    formattedAmount: formatCurrency(payment.amount, invoice.currency, invoice.locale),
    formattedDate: new Date(payment.date).toLocaleDateString(invoice.locale)
  }));

  // Prepare discounts with formatting
  const formattedDiscounts = invoice.discounts.map(discount => ({
    ...discount,
    formattedValue: discount.type === 'percent' 
      ? `${discount.value}%` 
      : formatCurrency(discount.value, invoice.currency, invoice.locale)
  }));

  // Format dates
  const formattedIssueDate = new Date(invoice.issueDate).toLocaleDateString(invoice.locale);
  const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString(invoice.locale);

  return {
    invoice: {
      ...invoice,
      formattedIssueDate,
      formattedDueDate,
      paymentTermsDisplay: getPaymentTermsDisplay(invoice.paymentTerms)
    },
    business: businessProfile,
    client: invoice.client,
    brand: template.brand,
    layout: template.layout,
    items: itemsWithCalculations,
    fees: formattedFees,
    taxes: formattedTaxes,
    payments: formattedPayments,
    discounts: formattedDiscounts,
    totals: formattedTotals,
    workDetails: hasWorkDetails ? invoice.workDetails : false,
    paymentLinks: hasPaymentLinks ? invoice.paymentLinks : false,
    notes: invoice.notes,
    terms: invoice.terms,
    // Helper functions for templates
    helpers: {
      formatCurrency: (amount: number) => formatCurrency(amount, invoice.currency, invoice.locale),
      formatDate: (date: string) => new Date(date).toLocaleDateString(invoice.locale),
      formatPercentage: (value: number) => `${value}%`
    }
  };
};

/**
 * Render template with data
 */
export const renderTemplate = (
  template: Template,
  data: any
): string => {
  try {
    // Debug: Log the exact data being passed to Mustache
    console.log('Mustache render data:', {
      workDetails: data.workDetails,
      workDetailsType: typeof data.workDetails,
      workDetailsLength: data.workDetails?.length,
      paymentLinks: data.paymentLinks,
      dataKeys: Object.keys(data)
    });
    
    // Parse template to validate syntax before rendering
    Mustache.parse(template.html);
    
    // Disable HTML escaping for currency symbols and HTML content
    const rendered = Mustache.render(template.html, data, {}, {
      escape: (text) => text // Disable escaping
    });
    
    return rendered;
  } catch (error) {
    console.error('Error rendering template:', error);
    console.error('Template HTML length:', template.html.length);
    console.error('Error details:', (error as Error).message);
    return `<div class="error">Error rendering template: ${(error as Error).message}</div>`;
  }
};

/**
 * Generate complete HTML for PDF export
 */
export const generateInvoiceHTML = (
  invoice: Invoice,
  template: Template,
  businessProfile: BusinessProfile
): string => {
  const data = prepareTemplateData(invoice, template, businessProfile);
  const renderedContent = renderTemplate(template, data);

  // Wrap in complete HTML document with styles
  return `<!DOCTYPE html>
<html lang="${invoice.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Slab:wght@300;400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: '${template.brand.fontFamilyBody}', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1f2937;
      background: white;
      -webkit-print-color-adjust: exact;
    }
    
    .invoice {
      max-width: 8.5in;
      margin: 0 auto;
      padding: ${template.layout.margins.top}px ${template.layout.margins.right}px ${template.layout.margins.bottom}px ${template.layout.margins.left}px;
      background: white;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: '${template.brand.fontFamilyHeader}', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    
    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    
    th {
      background-color: #f9fafb;
      font-weight: 600;
      border-bottom: 2px solid #d1d5db;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .font-bold {
      font-weight: 700;
    }
    
    .font-semibold {
      font-weight: 600;
    }
    
    .text-lg {
      font-size: 1.125rem;
    }
    
    .text-xl {
      font-size: 1.25rem;
    }
    
    .text-2xl {
      font-size: 1.5rem;
    }
    
    .mb-2 {
      margin-bottom: 0.5rem;
    }
    
    .mb-4 {
      margin-bottom: 1rem;
    }
    
    .mb-6 {
      margin-bottom: 1.5rem;
    }
    
    .mb-8 {
      margin-bottom: 2rem;
    }
    
    .mt-4 {
      margin-top: 1rem;
    }
    
    .mt-8 {
      margin-top: 2rem;
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
    
    .gap-4 {
      gap: 1rem;
    }
    
    .gap-6 {
      gap: 1.5rem;
    }
    
    .grid {
      display: grid;
    }
    
    .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    
    .border-t {
      border-top: 1px solid #e5e7eb;
    }
    
    .border-b {
      border-bottom: 1px solid #e5e7eb;
    }
    
    .pt-4 {
      padding-top: 1rem;
    }
    
    .pb-4 {
      padding-bottom: 1rem;
    }
    
    @media print {
      .invoice {
        margin: 0;
        padding: 0.5in;
        box-shadow: none;
        border: none;
      }
      
      .page-break {
        page-break-before: always;
      }
      
      table {
        page-break-inside: avoid;
      }
      
      tr {
        page-break-inside: avoid;
      }
    }
    
    ${template.css}
  </style>
</head>
<body>
  ${renderedContent}
</body>
</html>`;
};

/**
 * Get display text for payment terms
 */
const getPaymentTermsDisplay = (paymentTerms: string): string => {
  const termsMap: { [key: string]: string } = {
    'NET_0': 'Payment due upon receipt',
    'NET_7': 'Payment due within 7 days',
    'NET_14': 'Payment due within 14 days',
    'NET_15': 'Payment due within 15 days',
    'NET_30': 'Payment due within 30 days',
    'NET_45': 'Payment due within 45 days',
    'NET_60': 'Payment due within 60 days',
    'NET_90': 'Payment due within 90 days'
  };
  
  return termsMap[paymentTerms] || paymentTerms;
};
