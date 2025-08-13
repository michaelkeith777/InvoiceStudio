import React, { useState } from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { InvoiceItem, Discount, Fee, Tax, Payment } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import RichTextEditor from './RichTextEditor';

const InvoiceForm: React.FC = () => {
  const { 
    currentInvoice, 
    updateInvoice, 
    businessProfiles,
    updateBusinessProfile,
    saveBusinessProfile 
  } = useInvoiceStore();
  
  const [activeSection, setActiveSection] = useState<string>('business');

  if (!currentInvoice) return null;

  const businessProfile = businessProfiles[0] || null;

  // Helper function to update invoice fields
  const updateField = (field: string, value: any) => {
    updateInvoice({ [field]: value });
  };

  // Helper function to update nested fields
  const updateNestedField = (parentField: string, field: string, value: any) => {
    const currentValue = currentInvoice[parentField as keyof typeof currentInvoice];
    if (typeof currentValue === 'object' && currentValue !== null) {
      updateInvoice({
        [parentField]: {
          ...currentValue,
          [field]: value
        }
      });
    }
  };

  // Item management functions
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      sku: '',
      name: '',
      description: '',
      quantity: 1,
      unitPrice: '' as any,
      discount: null,
      taxCategory: 'standard',
      notes: ''
    };
    
    updateField('items', [...currentInvoice.items, newItem]);
  };

  const updateItem = (itemId: string, field: string, value: any) => {
    const updatedItems = currentInvoice.items.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateField('items', updatedItems);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = currentInvoice.items.filter(item => item.id !== itemId);
    updateField('items', updatedItems);
  };

  const duplicateItem = (itemId: string) => {
    const itemToDuplicate = currentInvoice.items.find(item => item.id === itemId);
    if (itemToDuplicate) {
      const duplicatedItem = { ...itemToDuplicate, id: uuidv4() };
      updateField('items', [...currentInvoice.items, duplicatedItem]);
    }
  };

  // Discount management
  const addDiscount = () => {
    const newDiscount: Discount = {
      id: uuidv4(),
      label: 'Discount',
      type: 'percent',
      value: 0
    };
    updateField('discounts', [...currentInvoice.discounts, newDiscount]);
  };

  const updateDiscount = (discountId: string, field: string, value: any) => {
    const updatedDiscounts = currentInvoice.discounts.map(discount =>
      discount.id === discountId ? { ...discount, [field]: value } : discount
    );
    updateField('discounts', updatedDiscounts);
  };

  const removeDiscount = (discountId: string) => {
    const updatedDiscounts = currentInvoice.discounts.filter(discount => discount.id !== discountId);
    updateField('discounts', updatedDiscounts);
  };

  // Fee management
  const addFee = () => {
    const newFee: Fee = {
      id: uuidv4(),
      label: 'Fee',
      type: 'percent',
      value: '' as any,
      applyBase: 'subtotal_after_item_discounts'
    };
    updateField('fees', [...currentInvoice.fees, newFee]);
  };

  const updateFee = (feeId: string, field: string, value: any) => {
    const updatedFees = currentInvoice.fees.map(fee =>
      fee.id === feeId ? { ...fee, [field]: value } : fee
    );
    updateField('fees', updatedFees);
  };

  const removeFee = (feeId: string) => {
    const updatedFees = currentInvoice.fees.filter(fee => fee.id !== feeId);
    updateField('fees', updatedFees);
  };

  // Tax management
  const addTax = () => {
    const newTax: Tax = {
      id: uuidv4(),
      label: 'Tax',
      rate: '' as any,
      category: 'standard',
      priority: currentInvoice.taxes.length + 1,
      applyAfterDiscounts: true
    };
    updateField('taxes', [...currentInvoice.taxes, newTax]);
  };

  const updateTax = (taxId: string, field: string, value: any) => {
    const updatedTaxes = currentInvoice.taxes.map(tax =>
      tax.id === taxId ? { ...tax, [field]: value } : tax
    );
    updateField('taxes', updatedTaxes);
  };

  const removeTax = (taxId: string) => {
    const updatedTaxes = currentInvoice.taxes.filter(tax => tax.id !== taxId);
    updateField('taxes', updatedTaxes);
  };

  // Payment management
  const addPayment = () => {
    const newPayment: Payment = {
      id: uuidv4(),
      date: format(new Date(), 'yyyy-MM-dd'),
      method: 'Cash',
      amount: '' as any
    };
    updateField('payments', [...currentInvoice.payments, newPayment]);
  };

  const updatePayment = (paymentId: string, field: string, value: any) => {
    const updatedPayments = currentInvoice.payments.map(payment =>
      payment.id === paymentId ? { ...payment, [field]: value } : payment
    );
    updateField('payments', updatedPayments);
  };

  const removePayment = (paymentId: string) => {
    const updatedPayments = currentInvoice.payments.filter(payment => payment.id !== paymentId);
    updateField('payments', updatedPayments);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4">
          {[
            { id: 'business', label: 'Business' },
            { id: 'client', label: 'Client' },
            { id: 'meta', label: 'Invoice' },
            { id: 'items', label: 'Items' },
            { id: 'work', label: 'Work Details' },
            { id: 'taxes', label: 'Taxes & Fees' },
            { id: 'payments', label: 'Payments' },
            { id: 'paymentlinks', label: 'Payment Links' },
            { id: 'notes', label: 'Notes' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm smooth-transition ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600 scale-in'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Business Profile Section */}
      {activeSection === 'business' && businessProfile && (
        <div className="space-y-4 fade-in">
          <h3 className="text-lg font-semibold text-gray-800">Business Profile</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={businessProfile.name}
                onChange={(e) => updateBusinessProfile({ id: 'default', name: e.target.value })}
                className="form-input"
                placeholder="Your Company LLC"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={businessProfile.address}
                onChange={(e) => updateBusinessProfile({ id: 'default', address: e.target.value })}
                className="form-textarea"
                rows={3}
                placeholder="100 Main St, City, ST 00000"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={businessProfile.email}
                  onChange={(e) => updateBusinessProfile({ id: 'default', email: e.target.value })}
                  className="form-input"
                  placeholder="billing@yourco.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={businessProfile.phone}
                  onChange={(e) => updateBusinessProfile({ id: 'default', phone: e.target.value })}
                  className="form-input"
                  placeholder="555-555-5555"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Color
              </label>
              <input
                type="color"
                value={businessProfile.color}
                onChange={(e) => updateBusinessProfile({ id: 'default', color: e.target.value })}
                className="form-input h-10"
              />
            </div>
            
            {/* Logo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const logoUrl = event.target?.result as string;
                          updateBusinessProfile({ id: 'default', logoPath: logoUrl });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded cursor-pointer border border-gray-300"
                  >
                    Choose Logo File
                  </label>
                  {businessProfile.logoPath && (
                    <button
                      onClick={() => updateBusinessProfile({ id: 'default', logoPath: '' })}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded border border-red-300"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
                
                {businessProfile.logoPath && (
                  <div className="mt-3">
                    <div className="w-32 h-20 border border-gray-200 rounded overflow-hidden bg-white">
                      <img
                        src={businessProfile.logoPath}
                        alt="Company Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Logo preview (will appear on top-left of invoice)</p>
                  </div>
                )}
              </div>
            </div>
            

            
            <button
              onClick={saveBusinessProfile}
              className="btn-primary"
            >
              Save Business Profile
            </button>
          </div>
        </div>
      )}

      {/* Client Section */}
      {activeSection === 'client' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Client Information</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={currentInvoice.client.name}
                  onChange={(e) => updateNestedField('client', 'name', e.target.value)}
                  className="form-input"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={currentInvoice.client.company}
                  onChange={(e) => updateNestedField('client', 'company', e.target.value)}
                  className="form-input"
                  placeholder="Acme Inc."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={currentInvoice.client.email}
                  onChange={(e) => updateNestedField('client', 'email', e.target.value)}
                  className="form-input"
                  placeholder="billing@acme.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={currentInvoice.client.phone}
                  onChange={(e) => updateNestedField('client', 'phone', e.target.value)}
                  className="form-input"
                  placeholder="555-555-5555"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Address
              </label>
              <textarea
                value={currentInvoice.client.billingAddress}
                onChange={(e) => updateNestedField('client', 'billingAddress', e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="123 Main St, City, ST 00000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address
              </label>
              <textarea
                value={currentInvoice.client.shippingAddress}
                onChange={(e) => updateNestedField('client', 'shippingAddress', e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="Same as billing address"
              />
            </div>
          </div>
        </div>
      )}

      {/* Invoice Meta Section */}
      {activeSection === 'meta' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Invoice Details</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={currentInvoice.invoiceNumber}
                  onChange={(e) => updateField('invoiceNumber', e.target.value)}
                  className="form-input"
                  placeholder="INV-2025-00001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PO Number
                </label>
                <input
                  type="text"
                  value={currentInvoice.poNumber}
                  onChange={(e) => updateField('poNumber', e.target.value)}
                  className="form-input"
                  placeholder="PO-7788"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={currentInvoice.issueDate}
                  onChange={(e) => updateField('issueDate', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={currentInvoice.dueDate}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={currentInvoice.paymentTerms}
                  onChange={(e) => updateField('paymentTerms', e.target.value)}
                  className="form-select"
                >
                  <option value="NET_0">Due on Receipt</option>
                  <option value="NET_7">Net 7 Days</option>
                  <option value="NET_14">Net 14 Days</option>
                  <option value="NET_15">Net 15 Days</option>
                  <option value="NET_30">Net 30 Days</option>
                  <option value="NET_45">Net 45 Days</option>
                  <option value="NET_60">Net 60 Days</option>
                  <option value="NET_90">Net 90 Days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={currentInvoice.currency}
                  onChange={(e) => updateField('currency', e.target.value)}
                  className="form-select"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items Section */}
      {activeSection === 'items' && (
        <div className="space-y-4 fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Line Items</h3>
            <button
              onClick={addItem}
              className="btn-primary text-sm"
            >
              + Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {currentInvoice.items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3 hover-scale smooth-transition">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Item #{index + 1}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => duplicateItem(item.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 smooth-transition button-press"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-600 hover:text-red-800 smooth-transition button-press"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="form-input text-sm"
                      placeholder="Design Service"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={item.sku}
                      onChange={(e) => updateItem(item.id, 'sku', e.target.value)}
                      className="form-input text-sm"
                      placeholder="SERV-001"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="form-textarea text-sm"
                    rows={2}
                    placeholder="Homepage + 3 inner pages"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="form-input text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      value={typeof item.unitPrice === 'string' && item.unitPrice === '' ? '' : item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                      className="form-input text-sm"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tax Category
                    </label>
                    <select
                      value={item.taxCategory}
                      onChange={(e) => updateItem(item.id, 'taxCategory', e.target.value)}
                      className="form-select text-sm"
                    >
                      <option value="standard">Standard</option>
                      <option value="reduced">Reduced</option>
                      <option value="exempt">Exempt</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Discount Type
                    </label>
                    <select
                      value={item.discount?.type || ''}
                      onChange={(e) => {
                        if (e.target.value === '') {
                          updateItem(item.id, 'discount', null);
                        } else {
                          updateItem(item.id, 'discount', {
                            type: e.target.value as 'percent' | 'fixed',
                            value: item.discount?.value || 0
                          });
                        }
                      }}
                      className="form-select text-sm"
                    >
                      <option value="">No Discount</option>
                      <option value="percent">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  
                  {item.discount && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        value={item.discount.value}
                        onChange={(e) => updateItem(item.id, 'discount', {
                          ...item.discount!,
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="form-input text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {currentInvoice.items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No items added yet.</p>
                <button
                  onClick={addItem}
                  className="btn-primary mt-2 bounce-in"
                >
                  Add Your First Item
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Work Details Section */}
      {activeSection === 'work' && (
        <div className="space-y-4 fade-in">
          <h3 className="text-lg font-semibold text-gray-800">Details of Work</h3>
          <p className="text-sm text-gray-600">Specify project requirements, scope, and technical specifications.</p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Specifications & Requirements
            </label>
            <RichTextEditor
              value={currentInvoice.workDetails}
              onChange={(content) => updateField('workDetails', content)}
              placeholder="Describe the work specifications, requirements, deliverables, scope, technical details, timeline, and any other project details here...

Examples:
• Website design and development
• 5-page responsive website with custom design
• Contact form integration with email notifications
• Mobile-optimized layout
• SEO-friendly structure
• 2 rounds of revisions included
• Delivery within 14 business days

Technical specifications:
• HTML5, CSS3, JavaScript
• Responsive design (mobile, tablet, desktop)
• Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
• Performance optimization
• Clean, semantic code structure"
            />
            
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => {
                  // Add some test content to force the data to show up
                  const testContent = currentInvoice.workDetails || '<p>Test work details content</p>';
                  console.log('Forcing work details to:', testContent);
                  updateInvoice({ 
                    workDetails: testContent,
                    updatedAt: new Date().toISOString() 
                  });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Test Work Details
              </button>
              
              <button
                onClick={() => {
                  // Clear work details
                  console.log('Clearing work details');
                  updateInvoice({ 
                    workDetails: '',
                    updatedAt: new Date().toISOString() 
                  });
                }}
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
              >
                Clear
              </button>
              
              {currentInvoice.workDetails && currentInvoice.workDetails.trim() && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-800">Ready for preview</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Taxes & Fees Section */}
      {activeSection === 'taxes' && (
        <div className="space-y-6">
          {/* Discounts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800">Invoice Discounts</h4>
              <button
                onClick={addDiscount}
                className="btn-secondary text-sm"
              >
                + Add Discount
              </button>
            </div>
            
            <div className="space-y-3">
              {currentInvoice.discounts.map((discount) => (
                <div key={discount.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded">
                  <input
                    type="text"
                    value={discount.label}
                    onChange={(e) => updateDiscount(discount.id, 'label', e.target.value)}
                    className="form-input text-sm flex-1"
                    placeholder="Discount name"
                  />
                  <select
                    value={discount.type}
                    onChange={(e) => updateDiscount(discount.id, 'type', e.target.value)}
                    className="form-select text-sm w-24"
                  >
                    <option value="percent">%</option>
                    <option value="fixed">$</option>
                  </select>
                  <input
                    type="number"
                    value={discount.value}
                    onChange={(e) => updateDiscount(discount.id, 'value', parseFloat(e.target.value) || 0)}
                    className="form-input text-sm w-20"
                    min="0"
                    step="0.01"
                  />
                  <button
                    onClick={() => removeDiscount(discount.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Fees */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800">Fees</h4>
              <button
                onClick={addFee}
                className="btn-secondary text-sm"
              >
                + Add Fee
              </button>
            </div>
            
            <div className="space-y-3">
              {currentInvoice.fees.map((fee) => (
                <div key={fee.id} className="space-y-3 p-3 border border-gray-200 rounded">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={fee.label}
                      onChange={(e) => updateFee(fee.id, 'label', e.target.value)}
                      className="form-input text-sm flex-1"
                      placeholder="Fee name"
                    />
                    <select
                      value={fee.type}
                      onChange={(e) => updateFee(fee.id, 'type', e.target.value)}
                      className="form-select text-sm w-24"
                    >
                      <option value="percent">%</option>
                      <option value="fixed">$</option>
                    </select>
                    <input
                      type="number"
                      value={typeof fee.value === 'string' && fee.value === '' ? '' : fee.value}
                      onChange={(e) => updateFee(fee.id, 'value', e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                      className="form-input text-sm w-20"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                    <button
                      onClick={() => removeFee(fee.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Apply To
                    </label>
                    <select
                      value={fee.applyBase}
                      onChange={(e) => updateFee(fee.id, 'applyBase', e.target.value)}
                      className="form-select text-sm"
                    >
                      <option value="subtotal">Subtotal</option>
                      <option value="subtotal_after_item_discounts">Subtotal After Item Discounts</option>
                      <option value="subtotal_after_invoice_discounts">Subtotal After All Discounts</option>
                      <option value="grand_total_pre_tax">Grand Total (Pre-Tax)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Taxes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800">Taxes</h4>
              <button
                onClick={addTax}
                className="btn-secondary text-sm"
              >
                + Add Tax
              </button>
            </div>
            
            <div className="space-y-3">
              {currentInvoice.taxes.map((tax) => (
                <div key={tax.id} className="space-y-3 p-3 border border-gray-200 rounded">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tax.label}
                      onChange={(e) => updateTax(tax.id, 'label', e.target.value)}
                      className="form-input text-sm flex-1"
                      placeholder="Tax name"
                    />
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        value={typeof tax.rate === 'string' && tax.rate === '' ? '' : tax.rate}
                        onChange={(e) => updateTax(tax.id, 'rate', e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                        className="form-input text-sm w-20"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                    <button
                      onClick={() => removeTax(tax.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={tax.category}
                        onChange={(e) => updateTax(tax.id, 'category', e.target.value)}
                        className="form-select text-sm"
                      >
                        <option value="standard">Standard</option>
                        <option value="reduced">Reduced</option>
                        <option value="all">All Items</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <input
                        type="number"
                        value={tax.priority}
                        onChange={(e) => updateTax(tax.id, 'priority', parseInt(e.target.value) || 1)}
                        className="form-input text-sm"
                        min="1"
                      />
                    </div>
                    
                    <div className="flex items-center pt-6">
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={tax.applyAfterDiscounts}
                          onChange={(e) => updateTax(tax.id, 'applyAfterDiscounts', e.target.checked)}
                          className="mr-2"
                        />
                        After Discounts
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payments Section */}
      {activeSection === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Payments</h3>
            <button
              onClick={addPayment}
              className="btn-secondary text-sm"
            >
              + Add Payment
            </button>
          </div>
          
          <div className="space-y-3">
            {currentInvoice.payments.map((payment) => (
              <div key={payment.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded">
                <input
                  type="date"
                  value={payment.date}
                  onChange={(e) => updatePayment(payment.id, 'date', e.target.value)}
                  className="form-input text-sm"
                />
                <select
                  value={payment.method}
                  onChange={(e) => updatePayment(payment.id, 'method', e.target.value)}
                  className="form-select text-sm"
                >
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  inputMode="decimal"
                  value={typeof payment.amount === 'string' && payment.amount === '' ? '' : payment.amount.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow digits, one decimal point, and up to 2 decimal places
                    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                      // Store as string if empty, otherwise as number
                      updatePayment(payment.id, 'amount', value === '' ? '' : value);
                    }
                  }}
                  onBlur={(e) => {
                    // Convert to number on blur if it's a valid decimal
                    const value = e.target.value;
                    if (value !== '' && !isNaN(parseFloat(value))) {
                      updatePayment(payment.id, 'amount', parseFloat(value));
                    }
                  }}
                  className="form-input text-sm w-32"
                  placeholder="0.00"
                />
                <button
                  onClick={() => removePayment(payment.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {activeSection === 'paymentlinks' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Payment Options</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stripe Payment Link
            </label>
            <input
              type="url"
              value={currentInvoice.paymentLinks.stripeUrl || ''}
              onChange={(e) => updateNestedField('paymentLinks', 'stripeUrl', e.target.value)}
              className="form-input"
              placeholder="https://buy.stripe.com/your-payment-link"
            />
            <p className="text-xs text-gray-500 mt-1">
              Create a payment link in your Stripe dashboard and paste it here
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PayPal Payment Link
            </label>
            <input
              type="url"
              value={currentInvoice.paymentLinks.paypalUrl || ''}
              onChange={(e) => updateNestedField('paymentLinks', 'paypalUrl', e.target.value)}
              className="form-input"
              placeholder="https://paypal.me/yourusername or custom PayPal invoice link"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use PayPal.me or create a custom invoice link in PayPal
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Instructions
            </label>
            <textarea
              value={currentInvoice.paymentLinks.instructions || ''}
              onChange={(e) => updateNestedField('paymentLinks', 'instructions', e.target.value)}
              className="form-textarea"
              rows={4}
              placeholder="Additional payment instructions (e.g., bank transfer details, check payable to, wire transfer info, or any other payment methods you accept)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include any other payment methods, bank details, or special instructions
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => {
                // Add test payment links
                console.log('Adding test payment links');
                updateInvoice({ 
                  paymentLinks: {
                    stripeUrl: 'https://buy.stripe.com/test-link',
                    paypalUrl: 'https://paypal.me/testuser',
                    instructions: 'Payment due within 30 days. Wire transfer details available upon request.'
                  },
                  updatedAt: new Date().toISOString() 
                });
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Add Test Payment Links
            </button>
            
            <button
              onClick={() => {
                // Clear payment links
                console.log('Clearing payment links');
                updateInvoice({ 
                  paymentLinks: {
                    stripeUrl: '',
                    paypalUrl: '',
                    instructions: ''
                  },
                  updatedAt: new Date().toISOString() 
                });
              }}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
            >
              Clear
            </button>
            
            {(currentInvoice.paymentLinks.stripeUrl || currentInvoice.paymentLinks.paypalUrl || currentInvoice.paymentLinks.instructions) && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-blue-800">Ready for preview</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'notes' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Notes & Terms</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes to Client
            </label>
            <textarea
              value={currentInvoice.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="form-textarea"
              rows={4}
              placeholder="Thank you for your business!"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions
            </label>
            <textarea
              value={currentInvoice.terms}
              onChange={(e) => updateField('terms', e.target.value)}
              className="form-textarea"
              rows={4}
              placeholder="Payment due within 14 days. Late payments may incur additional charges."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
