import React, { useEffect, useState, useCallback } from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalTitle } from '../bootstrap/Modal';
import { Button, Form, InputGroup, Table, Badge, Spinner } from 'react-bootstrap';
import Icon from '../common/Icon';
import type { PaginationInfo } from '../../interfaces';

// Replicating logic from GenericListModal instructions
export interface SearchParams {
    search?: string;
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    [key: string]: any;
}

export interface ColumnConfig<T> {
    key: keyof T;
    label: string;
    width?: string;
    render?: (value: any, item: T) => React.ReactNode;
}

export interface GenericListModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    columns: ColumnConfig<T>[];
    data: T[];
    isLoading: boolean;
    searchPlaceholder?: string;
    searchMinLength?: number;
    onSearch: (params: SearchParams) => Promise<void>;
    onItemSelect: (item: T) => void;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
    emptyMessage?: string;
    searchEmptyMessage?: string;
}

function GenericListModal<T extends { id?: number | string }>({
    isOpen,
    onClose,
    title,
    columns,
    data,
    isLoading,
    searchPlaceholder = 'Pesquise...',
    searchMinLength = 3,
    onSearch,
    onItemSelect,
    pagination,
    onPageChange,
    emptyMessage = 'Nenhum registro encontrado',
    searchEmptyMessage = 'Nenhum resultado encontrado'
}: GenericListModalProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            onSearch({ page: 1, limit: 10, search: '' });
        }
    }, [isOpen]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);

        // Debounce logic could be here, but for simplicity call immediately or on Enter
        // Docs say debounce 500ms.
    };

    // Simple debounce effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isOpen) {
                onSearch({ page: 1, limit: pagination?.pageSize || 10, search: searchTerm });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]); // Warning: this might trigger on mount (isOpen changes -> setSearchTerm('') -> effect)

    return (
        <Modal isOpen={isOpen} setIsOpen={onClose} size="xl">
            <ModalHeader setIsOpen={onClose} closeButton>
                <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Button variant="outline-secondary">
                        <Icon icon="Search" />
                    </Button>
                </InputGroup>

                {isLoading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <>
                        <Table hover size="sm" responsive>
                            <thead>
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx} style={{ width: col.width }}>{col.label}</th>
                                    ))}
                                    <th style={{ width: '10%' }}>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="text-center py-4">
                                            {searchTerm ? searchEmptyMessage : emptyMessage}
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item, idx) => (
                                        <tr key={idx}>
                                            {columns.map((col, colIdx) => (
                                                <td key={colIdx}>
                                                    {col.render ? col.render(item[col.key], item) : String(item[col.key] || '')}
                                                </td>
                                            ))}
                                            <td>
                                                <Button size="sm" onClick={() => onItemSelect(item)}>
                                                    Selecionar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>

                        {/* Pagination would go here */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="d-flex justify-content-between align-items-center">
                                <div>Total: {pagination.totalItems}</div>
                                <div>
                                    <Button
                                        size="sm"
                                        disabled={pagination.page <= 1}
                                        onClick={() => onPageChange?.(pagination.page - 1)}
                                    >
                                        Anterior
                                    </Button>
                                    <span className="mx-2">Página {pagination.page} de {pagination.totalPages}</span>
                                    <Button
                                        size="sm"
                                        disabled={pagination.page >= pagination.totalPages}
                                        onClick={() => onPageChange?.(pagination.page + 1)}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </ModalBody>
            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>Fechar</Button>
            </ModalFooter>
        </Modal>
    );
}

export default GenericListModal;
