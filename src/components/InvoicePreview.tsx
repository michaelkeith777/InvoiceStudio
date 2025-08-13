import React, { useState, useEffect } from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { prepareTemplateData, renderTemplate } from '../utils/templateRenderer';

const InvoicePreview: React.FC = () => {
  const { currentInvoice, templates, businessProfiles } = useInvoiceStore();
  const [zoom, setZoom] = useState(100);
  const [renderedHTML, setRenderedHTML] = useState<string>('');

  useEffect(() => {
    if (currentInvoice && templates.length > 0 && businessProfiles.length > 0) {
      const template = templates.find(t => t.id === currentInvoice.templateId) || templates[0];
      const businessProfile = businessProfiles[0];
      
      try {
        const data = prepareTemplateData(currentInvoice, template, businessProfile);
        const rendered = renderTemplate(template, data);
        
        // Debug: Log the rendered HTML to see if our debug sections are there
        console.log('Rendered HTML length:', rendered.length);
        console.log('HTML contains ABSOLUTE TEST:', rendered.includes('ABSOLUTE TEST'));
        console.log('HTML contains workDetails:', rendered.includes('vcbvfbxvcxbvcbvcv'));
        console.log('First 1000 chars of rendered HTML:', rendered.substring(0, 1000));
        
        setRenderedHTML(rendered);
      } catch (error) {
        console.error('Error rendering template:', error);
        setRenderedHTML('<div class="error">Error rendering invoice preview</div>');
      }
    }
  }, [currentInvoice, templates, businessProfiles]);

  if (!currentInvoice) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-lg shadow">
        <div className="text-center text-gray-500">
          <p>No invoice selected</p>
        </div>
      </div>
    );
  }

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(50, Math.min(200, newZoom)));
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow">
      {/* Preview Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Zoom:</span>
            <button
              onClick={() => handleZoomChange(zoom - 10)}
              className="p-1 text-gray-600 hover:text-gray-800 smooth-transition button-press"
              disabled={zoom <= 50}
            >
              -
            </button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <button
              onClick={() => handleZoomChange(zoom + 10)}
              className="p-1 text-gray-600 hover:text-gray-800 smooth-transition button-press"
              disabled={zoom >= 200}
            >
              +
            </button>
            <button
              onClick={() => setZoom(100)}
              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded smooth-transition button-press"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Invoice #{currentInvoice.invoiceNumber}</span>
          <span>•</span>
          <span>{currentInvoice.currency}</span>
          <span>•</span>
          <span>Updated: {new Date(currentInvoice.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        <div 
          className="invoice-preview mx-auto bg-white shadow-lg hover-scale smooth-transition"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            width: '8.5in',
            minHeight: '11in',
            padding: '0.5in'
          }}
        >
          {renderedHTML ? (
            <div dangerouslySetInnerHTML={{ __html: renderedHTML }} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <div className="spinner mx-auto mb-4"></div>
                <p>Rendering invoice...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Template: {templates.find(t => t.id === currentInvoice.templateId)?.name || 'Unknown'}</span>
            <span>•</span>
            <span>Page: 1/1</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live updating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
