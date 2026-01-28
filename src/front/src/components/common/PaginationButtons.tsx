import React from 'react';
import { Pagination } from 'react-bootstrap';
import type { PaginationInfo } from '../../interfaces';

interface PaginationButtonsProps {
    pagination?: PaginationInfo;
    onPageChange: (page: number) => void;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { page, totalPages } = pagination;
    const items = [];

    // Simple pagination logic
    items.push(
        <Pagination.First key="first" onClick={() => onPageChange(1)} disabled={page === 1} />
    );
    items.push(
        <Pagination.Prev key="prev" onClick={() => onPageChange(page - 1)} disabled={page === 1} />
    );

    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <Pagination.Item key={number} active={number === page} onClick={() => onPageChange(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    items.push(
        <Pagination.Next key="next" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} />
    );
    items.push(
        <Pagination.Last key="last" onClick={() => onPageChange(totalPages)} disabled={page === totalPages} />
    );

    return (
        <div className="d-flex justify-content-center mt-3">
            <Pagination>{items}</Pagination>
        </div>
    );
};

export default PaginationButtons;
