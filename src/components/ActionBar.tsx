import React, { useState } from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { exportToPDF } from '../utils/storage';
import { generateInvoiceHTML } from '../utils/templateRenderer';
import CalculationSummary from './CalculationSummary';
import TemplateSelector from './TemplateSelector';

const ActionBar: React.FC = () => {
  const { 
    currentInvoice, 
    templates, 
    businessProfiles,
    saveInvoice, 
    createNewInvoice, 
    duplicateInvoice,
    saveAsTemplate,
    hasUnsavedChanges,
    lastSaved,
    isLoading,
    error
  } = useInvoiceStore();
  
  const [isExporting, setIsExporting] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleSave = async () => {
    const success = await saveInvoice();
    if (success) {
      // Show success feedback
      console.log('Invoice saved successfully');
    }
  };

  const handleExportPDF = async () => {
    if (!currentInvoice) return;

    setIsExporting(true);
    try {
      const template = templates.find(t => t.id === currentInvoice.templateId) || templates[0];
      const businessProfile = businessProfiles[0];
      
      if (!template || !businessProfile) {
        throw new Error('Missing template or business profile');
      }

      const htmlContent = generateInvoiceHTML(currentInvoice, template, businessProfile);
      const filename = `${currentInvoice.invoiceNumber}.pdf`;
      
      const result = await exportToPDF(htmlContent, filename);
      
      if (result.success) {
        console.log('PDF exported successfully:', result.path);
      } else {
        console.error('Failed to export PDF:', result.error);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!templateName.trim()) return;
    
    const success = await saveAsTemplate(templateName);
    if (success) {
      setShowSaveTemplateDialog(false);
      setTemplateName('');
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 10, 200);
    setZoomLevel(newZoom);
    document.documentElement.style.fontSize = `${newZoom}%`;
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 10, 50);
    setZoomLevel(newZoom);
    document.documentElement.style.fontSize = `${newZoom}%`;
  };

  const resetZoom = () => {
    setZoomLevel(100);
    document.documentElement.style.fontSize = '100%';
  };

  const formatLastSaved = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Main actions */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={createNewInvoice}
              className="btn-primary"
            >
              New Invoice
            </button>
            
            <button
              onClick={handleSave}
              disabled={isLoading || !hasUnsavedChanges}
              className="btn-secondary"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            
            <button
              onClick={duplicateInvoice}
              disabled={!currentInvoice}
              className="btn-secondary"
            >
              Duplicate
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="btn-secondary"
            >
              Templates
            </button>
            
            <button
              onClick={() => setShowSaveTemplateDialog(true)}
              disabled={!currentInvoice}
              className="btn-secondary"
            >
              Save as Template
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <button
            onClick={handleExportPDF}
            disabled={isExporting || !currentInvoice}
            className="btn-primary"
          >
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>

          <div className="h-6 w-px bg-gray-300"></div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <button
              onClick={resetZoom}
              className="px-2 py-1 text-xs font-mono text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded min-w-[3rem]"
              title="Reset Zoom"
            >
              {zoomLevel}%
            </button>
            
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Center - Status */}
        <div className="flex items-center space-x-4">
          {error && (
            <div className="flex items-center text-red-600 text-sm">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          {!error && (
            <div className="flex items-center text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full mr-2 ${hasUnsavedChanges ? 'bg-orange-500' : 'bg-green-500'}`}></div>
              <span>
                {hasUnsavedChanges ? 'Unsaved changes' : 'Saved'} • Last: {formatLastSaved(lastSaved)}
              </span>
            </div>
          )}
        </div>

        {/* Right side - Invoice summary */}
        <div className="flex items-center">
          <CalculationSummary />
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          onClose={() => setShowTemplateSelector(false)}
          onSelect={(templateId) => {
            if (currentInvoice) {
              // Update current invoice template
              // updateInvoice({ templateId });
            }
            setShowTemplateSelector(false);
          }}
        />
      )}

      {/* Save Template Dialog */}
      {showSaveTemplateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Save as Template</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="form-input"
                placeholder="My Custom Template"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveTemplateDialog(false);
                  setTemplateName('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAsTemplate}
                disabled={!templateName.trim() || isLoading}
                className="btn-primary"
              >
                {isLoading ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionBar;
