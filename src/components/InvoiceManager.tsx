import React, { useState, useEffect } from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { format } from 'date-fns';

interface InvoiceManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceManager: React.FC<InvoiceManagerProps> = ({ isOpen, onClose }) => {
  const { 
    invoiceList, 
    loadInvoiceList, 
    loadInvoice, 
    deleteInvoice, 
    currentInvoice,
    isLoading 
  } = useInvoiceStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadInvoiceList();
    }
  }, [isOpen, loadInvoiceList]);

  if (!isOpen) return null;

  const filteredInvoices = invoiceList.filter(invoice => 
    invoice.data.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.data.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadInvoice = async (filename: string) => {
    const success = await loadInvoice(filename);
    if (success) {
      onClose();
    }
  };

  const handleDeleteInvoice = async (filename: string) => {
    if (deleteConfirm === filename) {
      const success = await deleteInvoice(filename);
      if (success) {
        setDeleteConfirm(null);
        await loadInvoiceList();
      }
    } else {
      setDeleteConfirm(filename);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const calculateTotal = (invoice: any) => {
    return invoice.totals?.grandTotal || 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Current Invoices</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-light"
            >
              ×
            </button>
          </div>
          
          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search invoices by number or client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-140px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading invoices...</div>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">📄</div>
                <div className="text-gray-500 text-lg">No invoices found</div>
                <div className="text-gray-400 text-sm mt-2">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start by saving your first invoice'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.filename}
                  className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                    currentInvoice?.id === invoice.data.id ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="font-medium text-gray-900">
                          Invoice #{invoice.data.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.data.client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(invoice.data.createdAt)}
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Total: ${calculateTotal(invoice.data).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {currentInvoice?.id === invoice.data.id && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          Current
                        </span>
                      )}
                      
                      <button
                        onClick={() => handleLoadInvoice(invoice.filename)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        Load
                      </button>
                      
                      <button
                        onClick={() => handleDeleteInvoice(invoice.filename)}
                        className={`px-3 py-1 text-sm rounded ${
                          deleteConfirm === invoice.filename
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={isLoading}
                      >
                        {deleteConfirm === invoice.filename ? 'Confirm Delete' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManager;