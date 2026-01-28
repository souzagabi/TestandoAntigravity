import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface ModalConfig {
    id: string;
    title: string;
    component: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    onClose?: () => void;
}

interface ModalStackContextData {
    openModal: (config: ModalConfig) => void;
    closeModal: (id?: string) => void;
    closeAllModals: () => void;
    getCurrentModal: () => ModalConfig | null;
    getModalCount: () => number;
}

const ModalStackContext = createContext<ModalStackContextData>({} as ModalStackContextData);

export const ModalStackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stack, setStack] = useState<ModalConfig[]>([]);

    const openModal = (config: ModalConfig) => {
        setStack((prev) => [...prev, config]);
    };

    const closeModal = (id?: string) => {
        if (id) {
            // Find index of modal with id and remove it and all above it
            const index = stack.findIndex(m => m.id === id);
            if (index !== -1) {
                setStack(prev => prev.slice(0, index));
            }
        } else {
            // Remove top
            setStack((prev) => prev.slice(0, -1));
        }
    };

    const closeAllModals = () => {
        setStack([]);
    };

    const getCurrentModal = () => {
        return stack.length > 0 ? stack[stack.length - 1] : null;
    };

    const getModalCount = () => {
        return stack.length;
    };

    return (
        <ModalStackContext.Provider value={{ openModal, closeModal, closeAllModals, getCurrentModal, getModalCount }}>
            {children}
            {/* Render Stack */}
            {stack.map((modal, index) => {
                const isTop = index === stack.length - 1;
                // Here we would ideally duplicate the Modal component structure or use the 'component' provided directly.
                // The instruction says "The Provider renderiza todos os modais...".
                // But in the example usage: `component: <PacienteSearchModal.../>`.
                // So the component IS the modal content AND the modal wrapper usually? 
                // Or does the provider wrap it?
                // In the example usage: `component: <PacienteSearchModal isOpen.../>`.
                // So the passed component is fully self-contained including the 'isOpen' prop.
                // But wait, if I render it here, how do I pass props?
                // The component is already a ReactNode (instantiated).

                // Actually, the example shows:
                // component: (<PacienteSearchModal isOpen ... />)
                // So it is already an element. We just render it.
                return <React.Fragment key={modal.id}>{modal.component}</React.Fragment>;
            })}
        </ModalStackContext.Provider>
    );
};

export const useModalStack = () => useContext(ModalStackContext);
