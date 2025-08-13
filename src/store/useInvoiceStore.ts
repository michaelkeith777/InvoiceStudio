import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Invoice, Template, BusinessProfile, AppSettings, InvoiceListItem } from '../types';
import { calculateInvoiceTotals } from '../utils/calculations';
import { saveFile, loadFile, listFiles, deleteFile } from '../utils/storage';
import { defaultTemplates } from '../data/defaultTemplates';
import { defaultBusinessProfile } from '../data/defaultBusinessProfile';

interface InvoiceStore {
  // Current state
  currentInvoice: Invoice | null;
  templates: Template[];
  businessProfiles: BusinessProfile[];
  settings: AppSettings;
  invoiceList: InvoiceListItem[];
  isLoading: boolean;
  error: string | null;
  lastSaved: string | null;
  hasUnsavedChanges: boolean;

  // Actions
  initializeApp: () => Promise<void>;
  createNewInvoice: (templateId?: string) => void;
  updateInvoice: (updates: Partial<Invoice>) => void;
  saveInvoice: () => Promise<boolean>;
  loadInvoice: (invoiceId: string) => Promise<boolean>;
  deleteInvoice: (invoiceId: string) => Promise<boolean>;
  duplicateInvoice: () => void;
  loadInvoiceList: () => Promise<void>;
  
  // Template actions
  saveAsTemplate: (name: string) => Promise<boolean>;
  loadTemplates: () => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<boolean>;
  
  // Business profile actions
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void;
  saveBusinessProfile: () => Promise<boolean>;
  loadBusinessProfiles: () => Promise<void>;
  
  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  saveSettings: () => Promise<boolean>;
  loadSettings: () => Promise<void>;
  
  // Utility actions
  recalculateInvoice: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const createEmptyInvoice = (templateId: string = 'simple-test'): Invoice => ({
  version: '1.0',
  id: uuidv4(),
  templateId,
  businessProfileId: 'default',
  invoiceNumber: `INV-${format(new Date(), 'yyyy')}-${String(Date.now()).slice(-5)}`,
  poNumber: '',
  issueDate: format(new Date(), 'yyyy-MM-dd'),
  dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
  paymentTerms: 'NET_14',
  currency: 'USD',
  locale: 'en-US',
  client: {
    name: '',
    company: '',
    contact: '',
    email: '',
    phone: '',
    billingAddress: '',
    shippingAddress: ''
  },
  items: [],
  discounts: [],
  fees: [],
  taxes: [],
  payments: [],
  workDetails: '',
  notes: '',
  terms: 'Payment due within 14 days.',
  paymentLinks: {
    stripeUrl: '',
    paypalUrl: '',
    instructions: ''
  },
  totals: {
    subtotal: 0,
    itemDiscounts: 0,
    invoiceDiscounts: 0,
    fees: 0,
    tax: 0,
    grandTotal: 0,
    paid: 0,
    balanceDue: 0
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const defaultSettings: AppSettings = {
  currency: 'USD',
  locale: 'en-US',
  dateFormat: 'yyyy-MM-dd',
  invoiceNumberPattern: 'INV-{YYYY}-{#####}',
  defaultTaxes: [],
  defaultFees: [],
  defaultTemplateId: 'clean-professional',
  defaultBusinessProfileId: 'default',
  autosaveInterval: 10000
};

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  currentInvoice: null,
  templates: [],
  businessProfiles: [],
  settings: defaultSettings,
  invoiceList: [],
  isLoading: false,
  error: null,
  lastSaved: null,
  hasUnsavedChanges: false,

  initializeApp: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Load data from browser storage with fallbacks
      try {
        await Promise.all([
          get().loadSettings(),
          get().loadTemplates(),
          get().loadBusinessProfiles(),
          get().loadInvoiceList()
        ]);
      } catch (loadError) {
        console.warn('Failed to load saved data, using defaults:', loadError);
        // Initialize with defaults
        set({
          templates: defaultTemplates,
          businessProfiles: [defaultBusinessProfile],
          settings: defaultSettings,
          invoiceList: []
        });
      }

      // Create a new invoice
      get().createNewInvoice();

      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to initialize app:', error);
      // Even if initialization fails, provide basic functionality
      set({
        templates: defaultTemplates,
        businessProfiles: [defaultBusinessProfile],
        settings: defaultSettings,
        invoiceList: [],
        isLoading: false,
        error: null
      });
      get().createNewInvoice();
    }
  },

  createNewInvoice: (templateId?: string) => {
    const { settings } = get();
    const newInvoice = createEmptyInvoice(templateId || settings.defaultTemplateId);
    set({ 
      currentInvoice: newInvoice, 
      hasUnsavedChanges: false,
      lastSaved: null,
      error: null 
    });
  },

  updateInvoice: (updates) => {
    const { currentInvoice } = get();
    if (!currentInvoice) return;

    const updatedInvoice = {
      ...currentInvoice,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Recalculate totals
    updatedInvoice.totals = calculateInvoiceTotals(updatedInvoice);

    set({ 
      currentInvoice: updatedInvoice,
      hasUnsavedChanges: true,
      error: null
    });
  },

  saveInvoice: async () => {
    const { currentInvoice } = get();
    if (!currentInvoice) return false;

    set({ isLoading: true, error: null });

    try {
      const filename = `${currentInvoice.invoiceNumber}.json`;
      const result = await saveFile(`invoices/${filename}`, currentInvoice);
      
      if (result.success) {
        set({ 
          hasUnsavedChanges: false,
          lastSaved: new Date().toISOString(),
          isLoading: false
        });
        
        // Refresh invoice list
        await get().loadInvoiceList();
        return true;
      } else {
        set({ error: result.error || 'Failed to save invoice', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      set({ error: 'Failed to save invoice', isLoading: false });
      return false;
    }
  },

  loadInvoice: async (invoiceId: string) => {
    set({ isLoading: true, error: null });

    try {
      const result = await loadFile(`invoices/${invoiceId}`);
      
      if (result.success) {
        const invoice = result.data as Invoice;
        // Recalculate totals to ensure consistency
        invoice.totals = calculateInvoiceTotals(invoice);
        
        set({ 
          currentInvoice: invoice,
          hasUnsavedChanges: false,
          lastSaved: invoice.updatedAt,
          isLoading: false
        });
        return true;
      } else {
        set({ error: result.error || 'Failed to load invoice', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error loading invoice:', error);
      set({ error: 'Failed to load invoice', isLoading: false });
      return false;
    }
  },

  deleteInvoice: async (invoiceId: string) => {
    set({ isLoading: true, error: null });

    try {
      const result = await deleteFile(`invoices/${invoiceId}`);
      
      if (result.success) {
        await get().loadInvoiceList();
        set({ isLoading: false });
        return true;
      } else {
        set({ error: result.error || 'Failed to delete invoice', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      set({ error: 'Failed to delete invoice', isLoading: false });
      return false;
    }
  },

  duplicateInvoice: () => {
    const { currentInvoice } = get();
    if (!currentInvoice) return;

    const duplicatedInvoice = {
      ...currentInvoice,
      id: uuidv4(),
      invoiceNumber: `${currentInvoice.invoiceNumber}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    set({ 
      currentInvoice: duplicatedInvoice,
      hasUnsavedChanges: true,
      lastSaved: null
    });
  },

  loadInvoiceList: async () => {
    try {
      const result = await listFiles('invoices');
      
      if (result.success) {
        const fileList = result.files || [];
        const invoiceList: InvoiceListItem[] = [];
        
        for (const filename of fileList) {
          const invoiceResult = await loadFile(`invoices/${filename}`);
          if (invoiceResult.success && invoiceResult.data) {
            invoiceList.push({
              filename,
              path: `invoices/${filename}`,
              data: invoiceResult.data as Invoice,
              modifiedAt: new Date()
            });
          }
        }
        
        set({ invoiceList });
      } else {
        console.error('Failed to load invoice list:', result.error);
      }
    } catch (error) {
      console.error('Error loading invoice list:', error);
    }
  },

  saveAsTemplate: async (name: string) => {
    const { currentInvoice } = get();
    if (!currentInvoice) return false;

    set({ isLoading: true, error: null });

    try {
      const template: Template = {
        id: uuidv4(),
        name,
        brand: {
          primaryColor: '#0F172A',
          accentColor: '#2563EB',
          fontFamilyHeader: 'Inter',
          fontFamilyBody: 'Inter',
          logoPath: ''
        },
        layout: {
          headerStyle: 'left-logo-right-details',
          footerText: 'Thank you for your business!',
          showSignature: false,
          margins: { top: 48, right: 48, bottom: 64, left: 48 }
        },
        defaults: {
          taxRules: ['standard'],
          terms: currentInvoice.terms
        },
        html: '', // Will be populated by template system
        css: ''   // Will be populated by template system
      };

      const filename = `${template.id}.json`;
      const result = await saveFile(`templates/${filename}`, template);
      
      if (result.success) {
        await get().loadTemplates();
        set({ isLoading: false });
        return true;
      } else {
        set({ error: result.error || 'Failed to save template', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error saving template:', error);
      set({ error: 'Failed to save template', isLoading: false });
      return false;
    }
  },

  loadTemplates: async () => {
    try {
      const result = await listFiles('templates');
      
      if (result.success) {
        const userTemplates: Template[] = [];
        if (result.files) {
          for (const filename of result.files) {
            const templateResult = await loadFile(`templates/${filename}`);
            if (templateResult.success && templateResult.data) {
              userTemplates.push(templateResult.data as Template);
            }
          }
        }
        set({ templates: [...defaultTemplates, ...userTemplates] });
      } else {
        // If templates directory doesn't exist or is empty, use defaults
        set({ templates: defaultTemplates });
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      set({ templates: defaultTemplates });
    }
  },

  deleteTemplate: async (templateId: string) => {
    set({ isLoading: true, error: null });

    try {
      const result = await deleteFile(`templates/${templateId}.json`);
      
      if (result.success) {
        await get().loadTemplates();
        set({ isLoading: false });
        return true;
      } else {
        set({ error: result.error || 'Failed to delete template', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      set({ error: 'Failed to delete template', isLoading: false });
      return false;
    }
  },

  updateBusinessProfile: (profileUpdates) => {
    const { businessProfiles } = get();
    const updatedProfiles = businessProfiles.map(profile =>
      profile.id === profileUpdates.id ? { ...profile, ...profileUpdates } : profile
    );
    set({ businessProfiles: updatedProfiles, hasUnsavedChanges: true });
  },

  saveBusinessProfile: async () => {
    const { businessProfiles } = get();
    const defaultProfile = businessProfiles.find(p => p.id === 'default');
    
    if (!defaultProfile) return false;

    set({ isLoading: true, error: null });

    try {
      const result = await saveFile('profiles/default.json', defaultProfile);
      
      if (result.success) {
        set({ isLoading: false });
        return true;
      } else {
        set({ error: result.error || 'Failed to save business profile', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error saving business profile:', error);
      set({ error: 'Failed to save business profile', isLoading: false });
      return false;
    }
  },

  loadBusinessProfiles: async () => {
    try {
      const result = await loadFile('profiles/default.json');
      
      if (result.success) {
        set({ businessProfiles: [result.data as BusinessProfile] });
      } else {
        // Use default profile if none exists
        set({ businessProfiles: [defaultBusinessProfile] });
      }
    } catch (error) {
      console.error('Error loading business profiles:', error);
      set({ businessProfiles: [defaultBusinessProfile] });
    }
  },

  updateSettings: (settingsUpdates) => {
    const { settings } = get();
    set({ settings: { ...settings, ...settingsUpdates }, hasUnsavedChanges: true });
  },

  saveSettings: async () => {
    const { settings } = get();
    
    set({ isLoading: true, error: null });

    try {
      const result = await saveFile('settings.json', settings);
      
      if (result.success) {
        set({ isLoading: false });
        return true;
      } else {
        set({ error: result.error || 'Failed to save settings', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      set({ error: 'Failed to save settings', isLoading: false });
      return false;
    }
  },

  loadSettings: async () => {
    try {
      const result = await loadFile('settings.json');
      
      if (result.success) {
        set({ settings: { ...defaultSettings, ...result.data } });
      } else {
        // Use default settings if none exist
        set({ settings: defaultSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ settings: defaultSettings });
    }
  },

  recalculateInvoice: () => {
    const { currentInvoice } = get();
    if (!currentInvoice) return;

    const updatedInvoice = {
      ...currentInvoice,
      totals: calculateInvoiceTotals(currentInvoice),
      updatedAt: new Date().toISOString()
    };

    set({ currentInvoice: updatedInvoice });
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));
