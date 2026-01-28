import type { ModalEntityConfig } from '../../hooks/useGenericListModal';
import { getAllProdutos, type IProduto } from '../../services/produto/produtoService';

export const produtoConfig: ModalEntityConfig<IProduto> = {
    key: 'produto',
    title: 'Produto',
    columns: [
        { key: 'id', label: 'ID', width: '10%' },
        { key: 'nome', label: 'Nome', width: '60%' },
        { key: 'categoria', label: 'Categoria', width: '30%' }
    ],
    fetchService: async (params) => {
        const response = await getAllProdutos({
            search: params.search,
            page: params.page,
            limit: params.limit,
            sortField: 'nome',
            sortOrder: 'ASC'
        });
        return { data: response.data ?? [], pagination: response.pagination };
    },
    mapToFormValues: (item) => ({
        // This is generic, handled by the caller usually, or we define specific key
        // For generic usage, we might not use this map but handle 'onSelect' in the page manually 
        // OR the hook handles it.
        // The hook calls 'handleSelect' which calls 'setValues'.
        // But for ListaComprasPage, we are adding to a list, not setting a single form value.
        // So we might need to handle onSelect manually in the page or use a dummy map.
        selectedProduto: item
    }),
    clearFormValues: () => ({
        selectedProduto: null
    }),
    messages: {
        empty: 'Nenhum produto encontrado',
        searchEmpty: 'Nenhum produto encontrado para sua pesquisa'
    }
};

export const produtoModalConfigs = {
    produto: produtoConfig
};
