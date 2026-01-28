# GenericListModal - Parâmetros Contextuais

## Visão Geral

A partir de agora, o `GenericListModal` suporta **parâmetros contextuais dinâmicos**, permitindo filtrar consultas baseadas em valores previamente selecionados no formulário.

## Casos de Uso

### 1. Filtrar por Tipo de Movimento
Ao consultar Natureza de Operação, filtrar apenas as naturezas habilitadas para o Tipo de Movimento selecionado.

### 2. Filtrar por Condição de Pagamento
Ao consultar Forma de Pagamento, filtrar apenas as formas habilitadas para a Condição de Pagamento selecionada.

### 3. Filtrar por Categoria
Qualquer cenário onde uma consulta depende de valores previamente selecionados.

---

## Como Funciona

### 1. Usando `getContextParams` na Config

A função `getContextParams` recebe os valores atuais do formulário e retorna os parâmetros adicionais para a consulta:

```typescript
export const naturezaOperacaoConfig: ModalEntityConfig<INaturezaOperacao, MovimentoFormValues> = {
  key: 'naturezaOperacao',
  title: 'Natureza de Operação',
  columns: [
    { key: 'codigo', label: 'Código', width: '20%' },
    { key: 'descricao', label: 'Descrição', width: '70%' }
  ],
  fetchService: async (params) => {
    const response = await getNaturezasOperacao({
      search: params.search,
      page: params.page,
      limit: params.limit,
      tipoMovimentoId: params.tipoMovimentoId, // ✅ Parâmetro contextual
      stAtivo: true
    });
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },
  // ✅ Função que retorna parâmetros contextuais baseados no formulário
  getContextParams: (formValues) => ({
    tipoMovimentoId: formValues.tipoMovimentoId // Pega o tipo de movimento selecionado
  }),
  mapToFormValues: (item) => ({
    naturezaOperacaoId: item.naturezaOperacaoId,
    naturezaOperacaoInfo: item
  }),
  clearFormValues: () => ({
    naturezaOperacaoId: null,
    naturezaOperacaoInfo: null
  })
};
```

### 2. Usando Parâmetros Diretos no `openModal`

Você também pode passar parâmetros diretamente ao abrir o modal:

```typescript
// Abre modal com parâmetro contextual direto
<Button onClick={() => naturezaOperacaoModal.openModal('naturezaOperacao', {
  tipoMovimentoId: formik.values.tipoMovimentoId
})}>
  Buscar Natureza de Operação
</Button>
```

---

## Exemplo Completo: MovimentoEditPage

### Configurações dos Modais

```typescript
// config/modalConfigs/naturezaOperacaoModalConfigs.ts

import { ModalEntityConfig } from '../../hooks/useGenericListModal';
import { INaturezaOperacao } from '@shared/interfaces/movimento/naturezaOperacao';
import { getNaturezasOperacao } from '../../services/movimento/naturezaOperacaoService';

export interface NaturezaOperacaoModalFormValues {
  naturezaOperacaoId: number | null;
  naturezaOperacaoInfo: INaturezaOperacao | null;
}

export const createNaturezaOperacaoModalConfig = (): Record<string, ModalEntityConfig<INaturezaOperacao, any>> => {
  const naturezaOperacaoConfig: ModalEntityConfig<INaturezaOperacao, any> = {
    key: 'naturezaOperacao',
    title: 'Natureza de Operação',
    columns: [
      {
        key: 'codigo',
        label: 'Código',
        width: '20%',
        render: (_value, item) => item.codigo ?? '--'
      },
      {
        key: 'descricao',
        label: 'Descrição',
        width: '70%',
        render: (_value, item) => item.descricao ?? '--'
      }
    ],
    fetchService: async (params) => {
      const response = await getNaturezasOperacao({
        search: params.search,
        page: params.page,
        limit: params.limit,
        tipoMovimentoId: params.tipoMovimentoId, // ✅ Filtro contextual
        stAtivo: true
      });
      return {
        data: response.data ?? [],
        pagination: response.pagination
      };
    },
    defaultSearchParams: {
      page: 1,
      limit: 10
    },
    // ✅ Retorna parâmetros contextuais baseados no formulário
    getContextParams: (formValues) => ({
      tipoMovimentoId: formValues.tipoMovimentoId
    }),
    mapToFormValues: (item) => ({
      naturezaOperacaoId: item.naturezaOperacaoId,
      naturezaOperacaoInfo: item
    }),
    clearFormValues: () => ({
      naturezaOperacaoId: null,
      naturezaOperacaoInfo: null
    }),
    messages: {
      empty: 'Nenhuma natureza de operação encontrada',
      searchEmpty: 'Nenhuma natureza de operação encontrada para os critérios informados'
    },
    searchPlaceholder: 'Pesquise por código ou descrição',
    searchMinLength: 0,
    autoLoad: true,
    size: 'lg'
  };

  return {
    naturezaOperacao: naturezaOperacaoConfig
  };
};

export const naturezaOperacaoModalConfigs = createNaturezaOperacaoModalConfig();
```

### Uso na Página

```typescript
// pages/presentation/movimento/MovimentoEditPage.tsx

import { useGenericListModal } from '../../../hooks/useGenericListModal';
import { naturezaOperacaoModalConfigs } from '../../../config/modalConfigs/naturezaOperacaoModalConfigs';

const MovimentoEditPage = () => {
  const formik = useFormik({
    initialValues: {
      tipoMovimentoId: null,
      naturezaOperacaoId: null,
      // ... outros campos
    },
    // ...
  });

  // Hook do modal
  const naturezaOperacaoModal = useGenericListModal<INaturezaOperacao>(
    naturezaOperacaoModalConfigs,
    naturezaOperacaoFormAdapter,
    showNotification
  );

  return (
    <>
      {/* Botão para abrir modal */}
      <Button 
        onClick={() => naturezaOperacaoModal.openModal('naturezaOperacao')}
        disabled={!formik.values.tipoMovimentoId} // ✅ Desabilita se não selecionou tipo
      >
        <Icon icon='Search' />
      </Button>

      {/* Renderiza o modal */}
      <GenericListModal {...naturezaOperacaoModal.getModalProps()} />
    </>
  );
};
```

---

## Exemplo: Forma de Pagamento Filtrada por Condição

```typescript
// config/modalConfigs/formaPagamentoModalConfigs.ts

export const formaPagamentoConfig: ModalEntityConfig<IFormaPagamento, any> = {
  key: 'formaPagamento',
  title: 'Forma de Pagamento',
  columns: [
    { key: 'descricao', label: 'Descrição', width: '80%' }
  ],
  fetchService: async (params) => {
    const response = await getFormasPagamento({
      search: params.search,
      page: params.page,
      limit: params.limit,
      condicaoPagamentoId: params.condicaoPagamentoId, // ✅ Filtro contextual
      stAtivo: true
    });
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },
  // ✅ Retorna parâmetros contextuais
  getContextParams: (formValues) => ({
    condicaoPagamentoId: formValues.condicaoPagamentoId
  }),
  mapToFormValues: (item) => ({
    formaPagamentoId: item.formaPagamentoId,
    formaPagamentoInfo: item
  }),
  clearFormValues: () => ({
    formaPagamentoId: null,
    formaPagamentoInfo: null
  })
};
```

---

## Prioridade de Parâmetros

Os parâmetros são mesclados na seguinte ordem (do menor para o maior):

1. **defaultSearchParams** - Parâmetros padrão da config
2. **getContextParams()** - Parâmetros contextuais da config
3. **additionalContextParams** - Parâmetros passados no `openModal()`
4. **params** - Parâmetros da busca (search, page, limit)

```typescript
const mergedParams = { 
  ...config.defaultSearchParams,      // 1. Padrão
  ...configContextParams,             // 2. Da config
  ...additionalContextParams,         // 3. Do openModal
  ...params                           // 4. Da busca
};
```

---

## Validação no Backend

Certifique-se de que o backend aceita os parâmetros contextuais:

```typescript
// services/movimento/naturezaOperacaoService.ts

export interface NaturezaOperacaoParams {
  search?: string;
  page?: number;
  limit?: number;
  tipoMovimentoId?: number;  // ✅ Parâmetro contextual
  stAtivo?: boolean;
}

export const getNaturezasOperacao = async (params: NaturezaOperacaoParams) => {
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.tipoMovimentoId) queryParams.append('tipoMovimentoId', params.tipoMovimentoId.toString());
  if (params.stAtivo !== undefined) queryParams.append('stAtivo', params.stAtivo.toString());

  const response = await axios.get(`${API_ENDPOINT}?${queryParams.toString()}`);
  return response.data;
};
```

---

## Benefícios

✅ **Filtros Dinâmicos** - Consultas adaptadas ao contexto  
✅ **Validação de Dependências** - Desabilita botões se não há contexto  
✅ **Performance** - Retorna apenas dados relevantes  
✅ **UX Melhorada** - Usuário vê apenas opções válidas  
✅ **Reutilizável** - Mesma config serve para diferentes contextos  

---

## Resumo

1. **Adicione `getContextParams`** na config do modal
2. **Retorne os parâmetros** baseados nos valores do formulário
3. **Backend deve aceitar** os parâmetros contextuais
4. **Desabilite botões** quando não há contexto necessário
5. **Teste** se os filtros estão funcionando corretamente
