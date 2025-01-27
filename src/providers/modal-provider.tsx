import Modal from '@/ui/common/modal';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  openModal: (content: ReactNode, className?: string) => void;
  closeModal: () => void;
  toggleModal: (content: ReactNode, title?: string, className?: string) => void;
}

interface ModalProviderProps {
  children: ReactNode;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalClassName, setModalClassName] = useState<string | undefined>(undefined);

  const openModal = (content: ReactNode, title?: string, className?: string): void => {
    setModalContent(content);
    setModalClassName(className);
    setModalTitle(title);
    setIsOpen(true);
  };

  const closeModal = (): void => {
    setIsOpen(false);
    setTimeout(() => {
      setModalContent(null);
      setModalClassName(undefined);
    }, 300);
  };

  const toggleModal = (content: ReactNode, title?: string, className?: string): void => {
    if (isOpen) {
      closeModal();
    } else {
      openModal(content, title, className);
    }
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, toggleModal }}>
      {children}
      <Modal isOpen={isOpen} title={modalTitle} className={modalClassName} onClose={closeModal}>
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
