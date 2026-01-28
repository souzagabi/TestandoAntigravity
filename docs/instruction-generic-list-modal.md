# GenericListModal - Documentação e Guia de Uso

## Visão Geral

O `GenericListModal` é um componente reutilizável para exibir listas de dados em um modal com funcionalidades de busca, paginação e seleção de itens. É utilizado em diversas telas do sistema para seleção de entidades relacionadas (NCM, CEST, Família, Classificação, Fornecedor, etc.).

## Localização

```
front/src/components/modals/GenericListModal.tsx
```

## Interfaces Principais

### ColumnConfig<T>
Define a configuração de cada coluna da tabela.

```typescript
interface ColumnConfig<T> {
    key: keyof T;           // Chave do objeto para exibir
    label: string;          // Rótulo do cabeçalho
    width?: string;         // Largura da coluna (ex: "20%")
    render?: (value: any, item: T) => React.ReactNode; // Renderização customizada
}
```

### SearchParams
Parâmetros enviados na busca.

```typescript
interface SearchParams {
    search?: string;
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    [key: string]: any;     // Parâmetros adicionais
}
```

### GenericListModalProps<T>
Props do componente.

```typescript
interface GenericListModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    modalId?: string;
    columns: ColumnConfig<T>[];
    data: T[];
    isLoading: boolean;
    searchPlaceholder?: string;
    searchMinLength?: number;
    onSearch: (params: SearchParams) => Promise<void>;
    onItemSelect: (item: T) => void;
    selectButtonText?: string;
    selectButtonIcon?: string;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
    emptyMessage?: string;
    searchEmptyMessage?: string;
    additionalButtons?: React.ReactNode;
    size?: 'sm' | 'lg' | 'xl' | null;
    /* ---- Novidades ---- */
    multiSelect?: boolean;                        // Habilita seleção múltipla
    multiSelectConfirmText?: string;              // Texto exibido no botão de confirmação
    onMultiSelectConfirm?: (items: T[]) => void;  // Callback ao confirmar seleção múltipla
    multiSelectInitialSelected?: T[];             // Itens inicialmente selecionados
    onMultiSelectChange?: (items: T[]) => void;   // Notifica mudanças na seleção
    highlightItems?: T[];                         // Itens para destacar (já selecionados)
    highlightBadgeText?: string;                  // Texto do badge de destaque
    selectedBadgeText?: string;                   // Texto do badge para itens selecionados agora
    disableHighlightSelection?: boolean;          // Impede editar itens destacados
    getItemId?: (item: T) => string | number;     // Função para resolver o ID único
    closeOnMultiSelectConfirm?: boolean;          // Fecha o modal ao confirmar multi (default true)
    multiSelectToggleText?: {                     // Textos (tooltips) dos botões add/remove
        add?: string;
        remove?: string;
    };
}
```

## Funcionalidades

1. **Busca com Debounce**: Aguarda 500ms após digitação antes de disparar nova consulta.
2. **Busca Manual**: Disponível por tecla Enter ou botão dedicado.
3. **Paginação**: Suporte completo com componente `Pagination`.
4. **Renderização Customizada**: Cada coluna pode definir `render`.
5. **Estados de Loading**: Spinner centralizado durante carregamento.
6. **Mensagens Customizáveis**: Mensagens distintas para lista vazia e busca sem hits.
7. **Seleção Múltipla**: Controle interno com contador, callback de confirmação e badges informativos.
8. **Destaque de Itens Pré-Selecionados**: Itens passados em `highlightItems` permanecem visíveis e destacados, permitindo ou não novas ações conforme `disableHighlightSelection`.
9. **Badges Informativos**: Texto configurável para diferenciar itens já associados dos selecionados na sessão atual.

## Problema Atual: Acoplamento

Atualmente, cada página que usa o `GenericListModal` precisa implementar:

1. **Estados**: `isModalOpen`, `currentListType`, listas de dados, `pagination`
2. **Funções de abertura**: `openXxxModal()` para cada tipo
3. **Funções de seleção**: `handleXxxSelect()` para cada tipo
4. **Funções de limpeza**: `handleClearXxx()` para cada tipo
5. **Configuração de colunas**: Arrays de `ColumnConfig` para cada tipo
6. **Funções auxiliares**: `getCurrentData()`, `getCurrentColumns()`, `getCurrentOnSelect()`, `getCurrentMessages()`
7. **Função de busca**: `fetchData()` com switch/case para cada tipo

Isso resulta em **~300-400 linhas de código repetido** em cada página.

---

## Proposta de Desacoplamento

### Arquitetura Sugerida

```
front/src/
├── components/
│   └── modals/
│       └── GenericListModal.tsx          # Componente base (já existe)
├── hooks/
│   └── useGenericListModal.ts            # Hook customizado
├── config/
│   └── modalConfigs/
│       ├── index.ts                      # Exporta todas as configs
│       ├── produtoModalConfigs.ts        # Configs do módulo Produto
│       ├── pessoaModalConfigs.ts         # Configs do módulo Pessoa
│       └── academicaModalConfigs.ts      # Configs do módulo Acadêmica
```

### 1. Hook Customizado: `useGenericListModal`

```typescript
// front/src/hooks/useGenericListModal.ts

import { useState, useCallback } from 'react';
import { SearchParams, ColumnConfig } from './GenericListModal';
import { PaginationInfo } from '../extras/pagination';

export interface ModalEntityConfig<T, TFormValues = any> {
    // Identificação
    key: string;
    title: string;
    
    // Colunas da tabela
    columns: ColumnConfig<T>[];
    
    // Serviço de busca
    fetchService: (params: SearchParams) => Promise<{
        data: T[];
        pagination?: PaginationInfo;
    }>;
    
    // Parâmetros padrão de busca
    defaultSearchParams?: Partial<SearchParams>;
    
    // Mapeamento: como o item selecionado atualiza o formulário
    mapToFormValues: (item: T, currentValues: TFormValues) => Partial<TFormValues>;
    
    // Mapeamento: como limpar os campos do formulário
    clearFormValues: (currentValues: TFormValues) => Partial<TFormValues>;
    
    // Mensagens
    messages?: {
        empty?: string;
        searchEmpty?: string;
    };
    
    // Configurações de busca
    searchPlaceholder?: string;
    searchMinLength?: number;       // 0 = sem limite de caracteres
    
    // Configurações de comportamento
    autoLoad?: boolean;             // Se false, não carrega dados ao abrir (padrão: true)
    size?: 'sm' | 'lg' | 'xl' | null; // Tamanho do modal (padrão: 'xl')
}

export interface UseGenericListModalReturn<T> {
    // Estados
    isOpen: boolean;
    isLoading: boolean;
    data: T[];
    pagination: PaginationInfo;
    currentConfig: ModalEntityConfig<T> | null;
    
    // Ações
    openModal: (configKey: string) => Promise<void>;
    closeModal: () => void;
    handleSearch: (params: SearchParams) => Promise<void>;
    handlePageChange: (page: number) => void;
    handleSelect: (item: T) => void;
    handleClear: () => void;
    
    // Helpers para o componente
    getModalProps: () => GenericListModalProps<T>;
}

export function useGenericListModal<T, TFormValues>(
    configs: Record<string, ModalEntityConfig<T, TFormValues>>,
    formik: { values: TFormValues; setValues: (fn: (prev: TFormValues) => TFormValues) => void },
    showNotification?: (title: string, message: string, type: string) => void
): UseGenericListModalReturn<T> {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<T[]>([]);
    const [currentConfigKey, setCurrentConfigKey] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0
    });

    const currentConfig = currentConfigKey ? configs[currentConfigKey] : null;

    const fetchData = useCallback(async (params: SearchParams, config: ModalEntityConfig<T, TFormValues>) => {
        setIsLoading(true);
        try {
            const mergedParams = { ...config.defaultSearchParams, ...params };
            const response = await config.fetchService(mergedParams);
            setData(response.data ?? []);
            if (response.pagination) {
                setPagination(response.pagination);
            }
        } catch (error: any) {
            showNotification?.('Erro', error.message || `Erro ao carregar ${config.title}`, 'danger');
        } finally {
            setIsLoading(false);
        }
    }, [showNotification]);

    const openModal = useCallback(async (configKey: string) => {
        const config = configs[configKey];
        if (!config) {
            console.error(`Config não encontrada: ${configKey}`);
            return;
        }
        setCurrentConfigKey(configKey);
        setIsOpen(true);
        await fetchData({ page: 1, limit: 10 }, config);
    }, [configs, fetchData]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setCurrentConfigKey(null);
        setData([]);
    }, []);

    const handleSearch = useCallback(async (params: SearchParams) => {
        if (!currentConfig) return;
        await fetchData(params, currentConfig);
    }, [currentConfig, fetchData]);

    const handlePageChange = useCallback((page: number) => {
        if (!currentConfig) return;
        fetchData({ page, limit: pagination.pageSize }, currentConfig);
    }, [currentConfig, fetchData, pagination.pageSize]);

    const handleSelect = useCallback((item: T) => {
        if (!currentConfig) return;
        formik.setValues((prev) => ({
            ...prev,
            ...currentConfig.mapToFormValues(item, prev)
        }));
        closeModal();
    }, [currentConfig, formik, closeModal]);

    const handleClear = useCallback(() => {
        if (!currentConfig) return;
        formik.setValues((prev) => ({
            ...prev,
            ...currentConfig.clearFormValues(prev)
        }));
    }, [currentConfig, formik]);

    const getModalProps = useCallback(() => ({
        isOpen,
        onClose: closeModal,
        title: currentConfig?.title ? `Selecionar ${currentConfig.title}` : 'Selecionar',
        columns: currentConfig?.columns ?? [],
        data,
        isLoading,
        searchPlaceholder: currentConfig?.searchPlaceholder ?? 'Pesquise (mín. 3 caracteres)',
        searchMinLength: currentConfig?.searchMinLength ?? 3,
        onSearch: handleSearch,
        onItemSelect: handleSelect,
        pagination,
        onPageChange: handlePageChange,
        emptyMessage: currentConfig?.messages?.empty ?? 'Nenhum registro encontrado',
        searchEmptyMessage: currentConfig?.messages?.searchEmpty ?? 'Nenhum resultado encontrado'
    }), [isOpen, closeModal, currentConfig, data, isLoading, handleSearch, handleSelect, pagination, handlePageChange]);

    return {
        isOpen,
        isLoading,
        data,
        pagination,
        currentConfig,
        openModal,
        closeModal,
        handleSearch,
        handlePageChange,
        handleSelect,
        handleClear,
        getModalProps
    };
}
```

### 2. Arquivo de Configuração: `produtoModalConfigs.ts`

```typescript
// front/src/config/modalConfigs/produtoModalConfigs.ts

import { ModalEntityConfig } from '../../components/modals/useGenericListModal';
import { IProdutoFamilia, IProdutoClassificacao, IProdutoNcm, IProdutoCest } from '@shared/interfaces/produto';
import { IPessoa } from '@shared/interfaces';
import { 
    getAllProdutoFamilia, 
    getAllProdutoClassificacao, 
    getAllProdutoNcm, 
    getAllProdutoCest 
} from '../../services/produto/produtoService';
import { getPessoas } from '../../services/pessoa/pessoaService';

// Tipo union para todos os dados possíveis do modal
export type ProdutoModalData = IProdutoFamilia | IProdutoClassificacao | IProdutoNcm | IProdutoCest | IPessoa;

// Configuração para Família
export const familiaConfig: ModalEntityConfig<IProdutoFamilia> = {
    key: 'familia',
    title: 'Família',
    columns: [
        { key: 'familiaId', label: 'Código', width: '20%' },
        { key: 'descricao', label: 'Descrição', width: '65%' }
    ],
    fetchService: async (params) => {
        const response = await getAllProdutoFamilia({
            search: params.search,
            page: params.page,
            limit: params.limit,
            stAtivo: true,
            sortField: 'descricao',
            sortOrder: 'ASC'
        });
        return { data: response.data ?? [], pagination: response.pagination };
    },
    mapToFormValues: (item) => ({
        familiaId: item.familiaId,
        familiaProduto: item
    }),
    clearFormValues: () => ({
        familiaId: null,
        familiaProduto: null
    }),
    messages: {
        empty: 'Nenhuma Família encontrada',
        searchEmpty: 'Nenhum resultado encontrado para sua pesquisa'
    }
};

// Configuração para Classificação
export const classificacaoConfig: ModalEntityConfig<IProdutoClassificacao> = {
    key: 'classificacao',
    title: 'Classificação',
    columns: [
        { key: 'classificacaoId', label: 'Código', width: '20%' },
        { key: 'descricao', label: 'Descrição', width: '65%' }
    ],
    fetchService: async (params) => {
        const response = await getAllProdutoClassificacao({
            search: params.search,
            page: params.page,
            limit: params.limit,
            stAtivo: true,
            sortField: 'descricao',
            sortOrder: 'ASC'
        });
        return { data: response.data ?? [], pagination: response.pagination };
    },
    mapToFormValues: (item) => ({
        classificacaoId: item.classificacaoId,
        classificacaoProduto: item
    }),
    clearFormValues: () => ({
        classificacaoId: null,
        classificacaoProduto: null
    }),
    messages: {
        empty: 'Nenhuma Classificação encontrada',
        searchEmpty: 'Nenhum resultado encontrado para sua pesquisa'
    }
};

// Configuração para NCM
export const ncmConfig: ModalEntityConfig<IProdutoNcm> = {
    key: 'ncm',
    title: 'NCM',
    columns: [
        { key: 'ncmId', label: 'Código', width: '15%' },
        { key: 'cdNcm', label: 'NCM', width: '20%' },
        { key: 'descricao', label: 'Descrição', width: '50%' }
    ],
    fetchService: async (params) => {
        const response = await getAllProdutoNcm({
            search: params.search,
            page: params.page,
            limit: params.limit,
            stAtivo: true,
            sortField: 'descricao',
            sortOrder: 'ASC'
        });
        return { data: response.data ?? [], pagination: response.pagination };
    },
    mapToFormValues: (item) => ({
        ncmId: item.ncmId,
        codigoNcm: item.cdNcm,
        ncmProduto: item
    }),
    clearFormValues: () => ({
        ncmId: null,
        codigoNcm: null,
        ncmProduto: null
    }),
    messages: {
        empty: 'Nenhum NCM encontrado',
        searchEmpty: 'Nenhum resultado encontrado para sua pesquisa'
    }
};

// Configuração para CEST
export const cestConfig: ModalEntityConfig<IProdutoCest> = {
    key: 'cest',
    title: 'CEST',
    columns: [
        { key: 'cestId', label: 'Código', width: '15%' },
        { key: 'cdCest', label: 'CEST', width: '20%' },
        { key: 'descricao', label: 'Descrição', width: '50%' }
    ],
    fetchService: async (params) => {
        const response = await getAllProdutoCest({
            search: params.search,
            page: params.page,
            limit: params.limit,
            stAtivo: true,
            sortField: 'descricao',
            sortOrder: 'ASC'
        });
        return { data: response.data ?? [], pagination: response.pagination };
    },
    mapToFormValues: (item) => ({
        cestId: item.cestId,
        codigoCest: item.cdCest,
        cestProduto: item
    }),
    clearFormValues: () => ({
        cestId: null,
        codigoCest: null,
        cestProduto: null
    }),
    messages: {
        empty: 'Nenhum CEST encontrado',
        searchEmpty: 'Nenhum resultado encontrado para sua pesquisa'
    }
};

// Configuração para Fornecedor (Pessoa)
export const fornecedorConfig: ModalEntityConfig<IPessoa> = {
    key: 'fornecedor',
    title: 'Fornecedor',
    columns: [
        { key: 'pessoaId', label: 'Código', width: '20%' },
        { key: 'nomeRazao', label: 'Nome', width: '65%' }
    ],
    fetchService: async (params) => {
        const response = await getPessoas({
            search: params.search,
            page: params.page,
            limit: params.limit,
            stAtivo: true,
            sortField: 'nomeRazao',
            sortOrder: 'ASC'
        });
        return { data: response.data?.data ?? [], pagination: response.pagination };
    },
    mapToFormValues: (item) => ({
        fornecedorId: item.pessoaId,
        fornecedorProduto: item
    }),
    clearFormValues: () => ({
        fornecedorId: null,
        fornecedorProduto: null
    }),
    messages: {
        empty: 'Nenhum Fornecedor encontrado',
        searchEmpty: 'Nenhum resultado encontrado para sua pesquisa'
    }
};

// Exporta todas as configs do módulo Produto
export const produtoModalConfigs = {
    familia: familiaConfig,
    classificacao: classificacaoConfig,
    ncm: ncmConfig,
    cest: cestConfig,
    fornecedor: fornecedorConfig
};
```

### 3. Uso Simplificado na Página

```typescript
// ProdutoEditPage.tsx - ANTES: ~400 linhas de código do modal
// ProdutoEditPage.tsx - DEPOIS: ~20 linhas

import { useGenericListModal } from '../../../components/modals/useGenericListModal';
import { produtoModalConfigs, ProdutoModalData } from '../../../config/modalConfigs/produtoModalConfigs';
import GenericListModal from '../../../components/modals/GenericListModal';

const ProdutoEditPage = () => {
    // ... outros estados e formik ...

    // Hook do modal - substitui ~300 linhas de código
    const modal = useGenericListModal<ProdutoModalData, IProduto>(
        produtoModalConfigs,
        formik,
        showNotification
    );

    // No JSX - botões de abertura
    <Button onClick={() => modal.openModal('familia')}>Buscar Família</Button>
    <Button onClick={() => modal.openModal('ncm')}>Buscar NCM</Button>
    <Button onClick={() => modal.openModal('cest')}>Buscar CEST</Button>
    <Button onClick={() => modal.openModal('classificacao')}>Buscar Classificação</Button>
    <Button onClick={() => modal.openModal('fornecedor')}>Buscar Fornecedor</Button>

    // Botões de limpar
    <Button onClick={() => modal.handleClear()}>Limpar</Button>

    // Modal - apenas uma instância
    <GenericListModal<ProdutoModalData> {...modal.getModalProps()} />
};
```

---

## Melhorias Sugeridas para o Componente

### 1. Suporte a Seleção Múltipla
```typescript
interface GenericListModalProps<T> {
    // ... props existentes ...
    selectionMode?: 'single' | 'multiple';
    selectedItems?: T[];
    onSelectionChange?: (items: T[]) => void;
}
```

### 2. Filtros Avançados
```typescript
interface FilterConfig {
    key: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'checkbox';
    options?: { value: any; label: string }[];
}

interface GenericListModalProps<T> {
    // ... props existentes ...
    filters?: FilterConfig[];
    onFilterChange?: (filters: Record<string, any>) => void;
}
```

### 3. Ordenação de Colunas
```typescript
interface ColumnConfig<T> {
    // ... props existentes ...
    sortable?: boolean;
}
```

### 4. Ações em Lote
```typescript
interface GenericListModalProps<T> {
    // ... props existentes ...
    batchActions?: {
        label: string;
        icon?: string;
        onClick: (selectedItems: T[]) => void;
    }[];
}
```

### 5. Exportação de Dados
```typescript
interface GenericListModalProps<T> {
    // ... props existentes ...
    exportable?: boolean;
    onExport?: (data: T[], format: 'csv' | 'xlsx') => void;
}
```

### 6. Virtualização para Grandes Listas
Usar `react-window` ou `react-virtualized` para listas com muitos itens.

### 7. Keyboard Navigation
- Setas para navegar entre linhas
- Enter para selecionar
- Escape para fechar

---

## Benefícios do Desacoplamento

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Linhas por página | ~400 | ~20 |
| Manutenção | Alterar em N páginas | Alterar em 1 arquivo |
| Consistência | Variável | Garantida |
| Testes | Difícil | Fácil (configs isoladas) |
| Reutilização | Copy/paste | Import config |
| Novos tipos | +50 linhas | +20 linhas (só config) |

---

## Exemplo Prático de Migração

### Antes (ProdutoEditPage.tsx) - ~400 linhas

```typescript
// Estados
const [isModalOpen, setIsModalOpen] = useState(false);
const [currentListType, setCurrentListType] = useState<ListType>(null);
const [produtoNcmList, setProdutoNcmList] = useState<IProdutoNcm[]>([]);
const [produtoCestList, setProdutoCestList] = useState<IProdutoCest[]>([]);
const [produtoFamiliaList, setProdutoFamiliaList] = useState<IProdutoFamilia[]>([]);
const [produtoClassificacaoList, setProdutoClassificacaoList] = useState<IProdutoClassificacao[]>([]);
const [produtoFornecedorList, setProdutoFornecedorList] = useState<IPessoa[]>([]);

// Colunas para cada tipo
const familiaColumns: ColumnConfig<IProdutoFamilia>[] = [...];
const classificacaoColumns: ColumnConfig<IProdutoClassificacao>[] = [...];
const ncmColumns: ColumnConfig<IProdutoNcm>[] = [...];
// ... mais colunas

// Funções de abertura
const openFamiliaModal = async () => { ... };
const openClassificacaoModal = async () => { ... };
const openNcmModal = async () => { ... };
// ... mais funções

// Funções de seleção
const handleFamiliaSelect = (item: ModalData) => { ... };
const handleClassificacaoSelect = (item: ModalData) => { ... };
// ... mais funções

// Funções de limpeza
const handleClearFamilia = () => { ... };
const handleClearClassificacao = () => { ... };
// ... mais funções

// Funções auxiliares
const getCurrentData = (): ModalData[] => { switch(currentListType) { ... } };
const getCurrentColumns = (): ColumnConfig<ModalData>[] => { switch(currentListType) { ... } };
const getCurrentOnSelect = () => { switch(currentListType) { ... } };
const getCurrentMessages = () => { switch(currentListType) { ... } };

// Função de busca
const fetchData = useCallback(async (params: SearchParams, listType: ListType) => {
    if (listType === 'Família') { ... }
    else if (listType === 'Classificação') { ... }
    // ... mais casos
}, []);
```

### Depois (ProdutoEditPage.tsx) - ~20 linhas

```typescript
import { useGenericListModal } from '../../../components/modals/useGenericListModal';
import { produtoModalConfigs, ProdutoModalData } from '../../../config/modalConfigs/produtoModalConfigs';
import GenericListModal from '../../../components/modals/GenericListModal';

const ProdutoEditPage = () => {
    // ... outros estados e formik ...

    // Hook do modal - substitui ~300 linhas de código
    const modal = useGenericListModal<ProdutoModalData, IProduto>(
        produtoModalConfigs,
        formik,
        showNotification
    );

    return (
        <>
            {/* Botões de abertura */}
            <Button onClick={() => modal.openModal('familia')}>
                <Icon icon="Search" />
            </Button>
            
            {/* Botões de limpar */}
            {formik.values.familiaId && (
                <Button onClick={() => modal.handleClear('familia')}>
                    <Icon icon="Close" />
                </Button>
            )}

            {/* Modal - apenas uma instância */}
            <GenericListModal<ProdutoModalData> {...modal.getModalProps()} />
        </>
    );
};
```

---

## Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `front/src/components/modals/useGenericListModal.ts` | Hook customizado |
| `front/src/config/modalConfigs/index.ts` | Índice de exportações |
| `front/src/config/modalConfigs/produtoModalConfigs.ts` | Configs do módulo Produto |

---

## Próximos Passos

1. [x] Criar o hook `useGenericListModal.ts`
2. [x] Criar estrutura de configs em `config/modalConfigs/`
3. [x] Migrar `ProdutoEditPage.tsx` como piloto
4. [ ] Validar funcionamento
5. [ ] Migrar demais páginas gradualmente
6. [ ] Implementar melhorias sugeridas conforme necessidade
