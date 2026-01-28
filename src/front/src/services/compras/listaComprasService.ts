import { get, post, put, del } from '../api';
import type { IProduto } from '../produto/produtoService';
import type { PaginationInfo, ApiResponse } from '../../interfaces';

export interface IItemListaCompras {
    id?: number;
    listaId?: number;
    produtoId: number;
    quantidade: number;
    valorUnitario: number;
    produto?: IProduto;
}

export interface IListaCompras {
    id: number;
    dataCriacao: string;
    nome?: string;
    stConcluida: boolean;
    itens?: IItemListaCompras[];
}

export interface GenericListParams {
    search?: string;
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export const getAllListas = (params: GenericListParams) => {
    return get<IListaCompras[]>('/lista-compras', params);
};

export const getListaById = (id: number) => {
    return get<IListaCompras>(`/lista-compras/${id}`);
};

export const createLista = (data: Partial<IListaCompras>) => {
    return post<IListaCompras>('/lista-compras', data);
};

export const updateLista = (id: number, data: Partial<IListaCompras>) => {
    return put<IListaCompras>(`/lista-compras/${id}`, data);
};

export const deleteLista = (id: number) => {
    return del<void>(`/lista-compras/${id}`);
};
