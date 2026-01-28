import { get, post, put, del } from '../api';
import type { PaginationInfo, ApiResponse } from '../../interfaces';

export interface IProduto {
    id: number;
    nome: string;
    categoria?: string;
}

export interface GenericListParams {
    search?: string;
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export const getAllProdutos = (params: GenericListParams) => {
    return get<IProduto[]>('/produtos', params);
};

export const getProdutoById = (id: number) => {
    return get<IProduto>(`/produtos/${id}`);
};

export const createProduto = (data: Partial<IProduto>) => {
    return post<IProduto>('/produtos', data);
};

export const updateProduto = (id: number, data: Partial<IProduto>) => {
    return put<IProduto>(`/produtos/${id}`, data);
};

export const deleteProduto = (id: number) => {
    return del<void>(`/produtos/${id}`);
};
