import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
