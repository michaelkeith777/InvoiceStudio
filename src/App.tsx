import React, { useEffect } from 'react';
import { useInvoiceStore } from './store/useInvoiceStore';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import ActionBar from './components/ActionBar';

const App: React.FC = () => {
  const { initializeApp, isLoading, error } = useInvoiceStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Invoice Studio Pro...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Action Bar */}
      <ActionBar />
      
      {/* Main Content - Three Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Input Form */}
        <div className="w-1/3 min-w-[400px] max-w-[600px] bg-white border-r border-gray-200 overflow-y-auto shadow-lg">
          <InvoiceForm />
        </div>
        
        {/* Center Panel - Live Preview */}
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <InvoicePreview />
        </div>
      </div>
    </div>
  );
};

export default App;
