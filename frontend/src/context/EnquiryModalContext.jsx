import { createContext, useContext, useState } from 'react';

const EnquiryModalContext = createContext();

/**
 * EnquiryModalProvider Component
 * Exposes modal visibility and product context context to trigger quote requests globally.
 */
export function EnquiryModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productContext, setProductContext] = useState(null); // { id, name }

  const openModal = (product = null) => {
    setProductContext(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setProductContext(null);
  };

  return (
    <EnquiryModalContext.Provider value={{ isOpen, openModal, closeModal, productContext }}>
      {children}
    </EnquiryModalContext.Provider>
  );
}

/**
 * Custom hook to consume EnquiryModalContext
 */
export function useEnquiryModal() {
  const context = useContext(EnquiryModalContext);
  if (!context) {
    throw new Error('useEnquiryModal must be used within an EnquiryModalProvider');
  }
  return context;
}
