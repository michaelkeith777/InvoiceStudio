import React from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { formatCurrency } from '../utils/calculations';

const CalculationSummary: React.FC = () => {
  const { currentInvoice } = useInvoiceStore();

  if (!currentInvoice) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 w-64">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Invoice Summary</h4>
        <div className="text-sm text-gray-500">No invoice selected</div>
      </div>
    );
  }

  const { totals, currency, locale } = currentInvoice;

  return (
    <div className="bg-gray-50 rounded-lg p-4 w-64">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">Invoice Summary</h4>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">{formatCurrency(totals.subtotal, currency, locale)}</span>
        </div>
        
        {totals.itemDiscounts > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Item Discounts:</span>
            <span>-{formatCurrency(totals.itemDiscounts, currency, locale)}</span>
          </div>
        )}
        
        {totals.invoiceDiscounts > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Invoice Discounts:</span>
            <span>-{formatCurrency(totals.invoiceDiscounts, currency, locale)}</span>
          </div>
        )}
        
        {totals.fees > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Fees:</span>
            <span className="font-medium">{formatCurrency(totals.fees, currency, locale)}</span>
          </div>
        )}
        
        {totals.tax > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span className="font-medium">{formatCurrency(totals.tax, currency, locale)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-300 pt-2">
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{formatCurrency(totals.grandTotal, currency, locale)}</span>
          </div>
        </div>
        
        {totals.paid > 0 && (
          <>
            <div className="flex justify-between text-blue-600">
              <span>Paid:</span>
              <span>-{formatCurrency(totals.paid, currency, locale)}</span>
            </div>
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Balance Due:</span>
              <span className={totals.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}>
                {formatCurrency(totals.balanceDue, currency, locale)}
              </span>
            </div>
          </>
        )}
        
        {currentInvoice.items.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{currentInvoice.items.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Qty:</span>
              <span>{currentInvoice.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculationSummary;
