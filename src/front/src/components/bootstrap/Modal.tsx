import React from 'react';
import { Modal as BsModal, type ModalProps as BsModalProps } from 'react-bootstrap';

interface CustomModalProps extends BsModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isStaticBackdrop?: boolean;
    isCentered?: boolean;
    children: React.ReactNode;
}

const Modal: React.FC<CustomModalProps> & {
    Header: typeof BsModal.Header;
    Body: typeof BsModal.Body;
    Footer: typeof BsModal.Footer;
    Title: typeof BsModal.Title;
} = ({ isOpen, setIsOpen, isStaticBackdrop, isCentered, children, ...props }) => {
    return (
        <BsModal
            show={isOpen}
            onHide={() => setIsOpen(false)}
            backdrop={isStaticBackdrop ? 'static' : true}
            keyboard={!isStaticBackdrop}
            centered={isCentered}
            {...props}
        >
            {children}
        </BsModal>
    );
};

Modal.Header = BsModal.Header;
Modal.Body = BsModal.Body;
Modal.Footer = BsModal.Footer;
Modal.Title = BsModal.Title;

export default Modal;
export const ModalHeader = BsModal.Header;
export const ModalBody = BsModal.Body;
export const ModalFooter = BsModal.Footer;
export const ModalTitle = BsModal.Title;
