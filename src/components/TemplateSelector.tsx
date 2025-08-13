import React, { useState } from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';

interface TemplateSelectorProps {
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onClose, onSelect }) => {
  const { templates, currentInvoice, updateInvoice, deleteTemplate } = useInvoiceStore();
  const [selectedTemplate, setSelectedTemplate] = useState(currentInvoice?.templateId || '');

  const handleSelect = () => {
    if (selectedTemplate && currentInvoice) {
      updateInvoice({ templateId: selectedTemplate });
      onSelect(selectedTemplate);
    }
  };

  const handleDelete = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(templateId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4xl max-w-6xl max-h-5xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Choose Invoice Template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Template Grid */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                {/* Template Preview */}
                <div className="aspect-[8.5/11] bg-white border border-gray-200 rounded shadow-sm mb-3 overflow-hidden">
                  <div className="p-2 transform scale-50 origin-top-left w-[200%] h-[200%]">
                    {/* Mini preview based on template type */}
                    {template.id === 'clean-professional' && (
                      <div className="p-4 h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-300 rounded"></div>
                            <div>
                              <div className="h-3 bg-gray-800 w-20 mb-1"></div>
                              <div className="h-2 bg-gray-400 w-16"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 bg-blue-600 w-16 mb-1"></div>
                            <div className="h-2 bg-gray-400 w-12"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-300 w-full"></div>
                            <div className="h-2 bg-gray-300 w-3/4"></div>
                            <div className="h-2 bg-gray-300 w-1/2"></div>
                          </div>
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-300 w-full"></div>
                            <div className="h-2 bg-gray-300 w-2/3"></div>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-200 w-full"></div>
                            <div className="h-2 bg-gray-200 w-4/5"></div>
                            <div className="h-2 bg-gray-200 w-3/5"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {template.id === 'modern-stripe' && (
                      <div className="p-4 h-full">
                        <div className="h-8 bg-gradient-to-r from-blue-600 to-purple-600 mb-4 -mx-4 -mt-4"></div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-white border-2 border-blue-600 rounded"></div>
                            <div className="h-3 bg-gray-800 w-20"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-3 bg-white w-16 mb-1"></div>
                            <div className="h-2 bg-gray-300 w-12"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-300 w-full"></div>
                            <div className="h-2 bg-gray-300 w-3/4"></div>
                          </div>
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-300 w-full"></div>
                            <div className="h-2 bg-gray-300 w-2/3"></div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-2 -mx-4">
                          <div className="h-2 bg-gray-300 w-full mb-1"></div>
                          <div className="h-2 bg-gray-300 w-4/5"></div>
                        </div>
                      </div>
                    )}

                    {template.id === 'compact-ledger' && (
                      <div className="p-3 h-full text-xs">
                        <div className="flex justify-between mb-2">
                          <div className="h-2 bg-gray-800 w-16"></div>
                          <div className="h-2 bg-gray-600 w-12"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                          <div className="space-y-0.5">
                            <div className="h-1.5 bg-gray-300 w-full"></div>
                            <div className="h-1.5 bg-gray-300 w-3/4"></div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="h-1.5 bg-gray-300 w-full"></div>
                            <div className="h-1.5 bg-gray-300 w-2/3"></div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="h-1.5 bg-gray-300 w-full"></div>
                            <div className="h-1.5 bg-gray-300 w-1/2"></div>
                          </div>
                        </div>
                        <div className="border border-gray-200 mb-2">
                          <div className="bg-gray-100 p-1 grid grid-cols-4 gap-1">
                            <div className="h-1 bg-gray-400"></div>
                            <div className="h-1 bg-gray-400"></div>
                            <div className="h-1 bg-gray-400"></div>
                            <div className="h-1 bg-gray-400"></div>
                          </div>
                          <div className="p-1 space-y-0.5">
                            <div className="grid grid-cols-4 gap-1">
                              <div className="h-1 bg-gray-300"></div>
                              <div className="h-1 bg-gray-300"></div>
                              <div className="h-1 bg-gray-300"></div>
                              <div className="h-1 bg-gray-300"></div>
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                              <div className="h-1 bg-gray-300"></div>
                              <div className="h-1 bg-gray-300"></div>
                              <div className="h-1 bg-gray-300"></div>
                              <div className="h-1 bg-gray-300"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="space-y-0.5 w-1/3">
                            <div className="h-1 bg-gray-400 w-full"></div>
                            <div className="h-1 bg-gray-400 w-3/4"></div>
                            <div className="h-1.5 bg-gray-600 w-full"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Default preview for custom templates */}
                    {!['clean-professional', 'modern-stripe', 'compact-ledger'].includes(template.id) && (
                      <div className="p-4 h-full">
                        <div className="flex justify-between items-center mb-4">
                          <div className="h-3 bg-gray-800 w-24"></div>
                          <div className="h-3 bg-blue-600 w-16"></div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="h-2 bg-gray-300 w-full"></div>
                          <div className="h-2 bg-gray-300 w-3/4"></div>
                          <div className="h-2 bg-gray-300 w-1/2"></div>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-2 bg-gray-200"></div>
                            <div className="h-2 bg-gray-200"></div>
                            <div className="h-2 bg-gray-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Template Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 truncate">{template.name}</h3>
                    <p className="text-sm text-gray-500">
                      {template.layout?.headerStyle || 'Custom layout'}
                    </p>
                  </div>

                  {/* Delete button for custom templates */}
                  {!['clean-professional', 'modern-stripe', 'compact-ledger'].includes(template.id) && (
                    <button
                      onClick={(e) => handleDelete(template.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete template"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v1H4V5zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Selected indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {templates.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No templates available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {templates.length} template{templates.length !== 1 ? 's' : ''} available
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedTemplate}
              className="btn-primary"
            >
              Apply Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
