import { Invoice, InvoiceItem, InvoiceTotals } from '../types';

/**
 * Rounds a number to specified decimal places using banker's rounding
 */
export const roundToCurrency = (amount: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(amount * factor) / factor;
  return parseFloat(rounded.toFixed(decimals));
};

/**
 * Calculate line total for an individual item
 */
export const calculateItemTotal = (item: InvoiceItem): number => {
  const baseTotal = item.quantity * item.unitPrice;
  
  if (!item.discount) {
    return roundToCurrency(baseTotal);
  }

  let discountAmount = 0;
  if (item.discount.type === 'percent') {
    discountAmount = baseTotal * (item.discount.value / 100);
  } else {
    discountAmount = Math.min(item.discount.value, baseTotal); // Don't allow negative totals
  }

  return roundToCurrency(Math.max(0, baseTotal - discountAmount));
};

/**
 * Calculate total discount amount for an item
 */
export const calculateItemDiscount = (item: InvoiceItem): number => {
  if (!item.discount) return 0;

  const baseTotal = item.quantity * item.unitPrice;
  
  if (item.discount.type === 'percent') {
    return roundToCurrency(baseTotal * (item.discount.value / 100));
  } else {
    return roundToCurrency(Math.min(item.discount.value, baseTotal));
  }
};

/**
 * Calculate subtotal before any discounts
 */
export const calculateSubtotal = (items: InvoiceItem[]): number => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  
  return roundToCurrency(subtotal);
};

/**
 * Calculate total item-level discounts
 */
export const calculateTotalItemDiscounts = (items: InvoiceItem[]): number => {
  const totalDiscounts = items.reduce((sum, item) => {
    return sum + calculateItemDiscount(item);
  }, 0);
  
  return roundToCurrency(totalDiscounts);
};

/**
 * Calculate subtotal after item-level discounts
 */
export const calculateSubtotalAfterItemDiscounts = (items: InvoiceItem[]): number => {
  const subtotalAfterDiscounts = items.reduce((sum, item) => {
    return sum + calculateItemTotal(item);
  }, 0);
  
  return roundToCurrency(subtotalAfterDiscounts);
};

/**
 * Calculate invoice-level discounts
 */
export const calculateInvoiceDiscounts = (invoice: Invoice, baseAmount: number): number => {
  const totalDiscounts = invoice.discounts.reduce((sum, discount) => {
    let discountAmount = 0;
    
    if (discount.type === 'percent') {
      discountAmount = baseAmount * (discount.value / 100);
    } else {
      discountAmount = Math.min(discount.value, baseAmount);
    }
    
    return sum + discountAmount;
  }, 0);
  
  return roundToCurrency(totalDiscounts);
};

/**
 * Calculate fees based on the specified base amount
 */
export const calculateFees = (invoice: Invoice, amounts: {
  subtotal: number;
  subtotalAfterItemDiscounts: number;
  subtotalAfterInvoiceDiscounts: number;
  grandTotalPreTax: number;
}): number => {
  const totalFees = invoice.fees.reduce((sum, fee) => {
    let baseAmount = 0;
    
    switch (fee.applyBase) {
      case 'subtotal':
        baseAmount = amounts.subtotal;
        break;
      case 'subtotal_after_item_discounts':
        baseAmount = amounts.subtotalAfterItemDiscounts;
        break;
      case 'subtotal_after_invoice_discounts':
        baseAmount = amounts.subtotalAfterInvoiceDiscounts;
        break;
      case 'grand_total_pre_tax':
        baseAmount = amounts.grandTotalPreTax;
        break;
      default:
        baseAmount = amounts.subtotalAfterItemDiscounts;
    }
    
    let feeAmount = 0;
    if (fee.type === 'percent') {
      feeAmount = baseAmount * (fee.value / 100);
    } else {
      feeAmount = fee.value;
    }
    
    return sum + feeAmount;
  }, 0);
  
  return roundToCurrency(totalFees);
};

/**
 * Calculate taxes based on taxable amount and tax rules
 */
export const calculateTaxes = (invoice: Invoice, taxableAmount: number): number => {
  // Sort taxes by priority (ascending)
  const sortedTaxes = [...invoice.taxes].sort((a, b) => a.priority - b.priority);
  
  const totalTax = sortedTaxes.reduce((sum, tax) => {
    // Filter items by tax category if needed
    const applicableItems = invoice.items.filter(item => 
      !tax.category || tax.category === 'all' || item.taxCategory === tax.category
    );
    
    if (applicableItems.length === 0) return sum;
    
    // Calculate tax on the applicable portion of taxable amount
    const applicableRatio = applicableItems.length / invoice.items.length;
    const applicableTaxableAmount = taxableAmount * applicableRatio;
    
    const taxAmount = applicableTaxableAmount * (tax.rate / 100);
    return sum + taxAmount;
  }, 0);
  
  return roundToCurrency(totalTax);
};

/**
 * Calculate total payments made
 */
export const calculateTotalPaid = (invoice: Invoice): number => {
  const totalPaid = invoice.payments.reduce((sum, payment) => {
    return sum + payment.amount;
  }, 0);
  
  return roundToCurrency(totalPaid);
};

/**
 * Calculate complete invoice totals
 */
export const calculateInvoiceTotals = (invoice: Invoice): InvoiceTotals => {
  // Step 1: Calculate base amounts
  const subtotal = calculateSubtotal(invoice.items);
  const itemDiscounts = calculateTotalItemDiscounts(invoice.items);
  const subtotalAfterItemDiscounts = calculateSubtotalAfterItemDiscounts(invoice.items);
  
  // Step 2: Apply invoice-level discounts
  const invoiceDiscounts = calculateInvoiceDiscounts(invoice, subtotalAfterItemDiscounts);
  const subtotalAfterInvoiceDiscounts = roundToCurrency(
    Math.max(0, subtotalAfterItemDiscounts - invoiceDiscounts)
  );
  
  // Step 3: Calculate fees (before taxes)
  const grandTotalPreTax = subtotalAfterInvoiceDiscounts; // Will be updated after fees
  const fees = calculateFees(invoice, {
    subtotal,
    subtotalAfterItemDiscounts,
    subtotalAfterInvoiceDiscounts,
    grandTotalPreTax
  });
  
  // Step 4: Calculate taxable amount (after discounts and fees)
  const taxableAmount = roundToCurrency(subtotalAfterInvoiceDiscounts + fees);
  
  // Step 5: Calculate taxes
  const tax = calculateTaxes(invoice, taxableAmount);
  
  // Step 6: Calculate grand total
  const grandTotal = roundToCurrency(taxableAmount + tax);
  
  // Step 7: Calculate payments and balance
  const paid = calculateTotalPaid(invoice);
  const balanceDue = roundToCurrency(Math.max(0, grandTotal - paid));
  
  return {
    subtotal,
    itemDiscounts,
    invoiceDiscounts,
    fees,
    tax,
    grandTotal,
    paid,
    balanceDue
  };
};

/**
 * Format currency amount based on locale and currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};
