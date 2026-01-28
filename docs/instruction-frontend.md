# Padrões de Interface e Implementação

Este documento descreve os padrões estabelecidos para interfaces, componentes e implementações da aplicação ADJ-WWW.

## 1. Padrões de Tabelas

### 1.1 Classes CSS e Estilo
- Usar as seguintes classes Bootstrap para todas as tabelas:
  ```html
  <table className="table table-modern table-hover table-sm" style={{ tableLayout: 'fixed' }}>
  ```
- Definir `tableLayout: 'fixed'` para melhor controle de largura das colunas
- Definir larguras explícitas para todas as colunas usando porcentagens ou pixels
- Manter consistência nos estilos de padding:
  - Cabeçalhos: `padding: '0.9rem 0.5rem'`
  - Células: `padding: '0.3rem'`

### 1.2 Alinhamento e Formatação
- Usar `verticalAlign: 'middle'` para alinhar conteúdo verticalmente
- Para textos longos:
  ```jsx
  style={{ 
    verticalAlign: 'middle', 
    whiteSpace: 'normal', 
    wordBreak: 'break-word' 
  }}
  ```
- Para campos numéricos ou códigos:
  ```jsx
  style={{ 
    verticalAlign: 'middle', 
    whiteSpace: 'nowrap' 
  }}
  ```

### 1.3 Status e Badges
- Usar `Badge` do Bootstrap para exibir status:
  ```jsx
  <Badge
    color={item.stAtivo ? 'success' : 'danger'}
    isLight
    className="px-3 py-2"
  >
    {item.stAtivo ? 'Ativo' : 'Inativo'}
  </Badge>
  ```

### 1.4 Mensagem de "Nenhum Registro"
- Usar ícone centralizado e mensagem padronizada:
  ```jsx
  <tr>
    <td colSpan={NUMERO_DE_COLUNAS} className="text-center py-4">
      <Icon 
        icon="SearchOff" 
        size="3x" 
        className="mb-3 text-muted"
      />
      <p className="mb-0 text-muted">Nenhum registro encontrado.</p>
    </td>
  </tr>
  ```
- **IMPORTANTE**: O `colSpan` deve ser igual ao número exato de colunas da tabela

## 2. Filtros e Busca

### 2.1 Filtro de Status
- Implementar dropdown para filtrar por status (Todos, Ativos, Inativos)
- Usar componente `Dropdown` do Bootstrap
- Enviar o parâmetro `stAtivo` para a API quando selecionado

### 2.2 Campo de Busca
- Usar `FormGroup` com `Input` flutuante
- Implementar busca por texto com debounce
- Adicionar botão de busca e limpar
- Desabilitar durante carregamento

### 2.3 Contador de Registros
- Exibir contador no formato: "Mostrando X de Y registros"
- Posicionar no canto inferior direito ou abaixo da tabela

## 3. Paginação

### 3.1 Frontend
- Usar componente `PaginationButtons`
- Implementar com os seguintes parâmetros:
  ```jsx
  <PaginationButtons
    data={Array(totalPages).fill(0)}
    currentPage={page}
    perPage={limit}
    label="páginas"
    setCurrentPage={handlePageChange}
    setPerPage={handleLimitChange}
  />
  ```
- Exibir apenas quando há mais de uma página: `{totalPages > 1 && (...)}`

### 3.2 Backend (Controller)
- Implementar paginação com `findAndCountAll` do Sequelize
- Aceitar parâmetros `page` e `limit` via query
- Calcular `offset` com base na página atual
- Retornar estrutura padronizada:
  ```typescript
  {
    total: count,
    totalPages: Math.ceil(count / limit),
    page: Number(page),
    limit: Number(limit),
    items: rows
  }
  ```

### 3.3 Serviço (Service)
- Criar interfaces para parâmetros de paginação:
  ```typescript
  export interface IPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    stAtivo?: boolean;
  }
  
  export interface IPaginatedResponse<T> {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
    items: T[];
  }
  ```
- Passar parâmetros de paginação para a API

## 4. Modais de Busca/Seleção

### 4.1 Botões de Seleção
- Usar botões em vez de checkboxes para seleção
- Implementar texto dinâmico baseado no estado:
  - "Selecionar" (não selecionado)
  - "Selecionado" (já selecionado)
  - "Confirmar" (modo de seleção única)

### 4.2 Estilo dos Botões
- Botão não selecionado: `color="light" isOutline`
- Botão selecionado: `color="primary"`
- Usar ícones consistentes: `Check` para selecionado

## 5. Exclusão Lógica

### 5.1 Backend
- Usar flag `stExcluido` para exclusão lógica
- Sempre filtrar registros excluídos nas consultas:
  ```typescript
  where.stExcluido = false;
  ```

## 6. Ordenação

### 6.1 Frontend
- Implementar ordenação por colunas clicáveis
- Exibir ícones indicando a direção da ordenação
- Passar parâmetros `sortField` e `sortOrder` para a API

### 6.2 Backend
- Aceitar parâmetros de ordenação via query
- Aplicar ordenação no Sequelize:
  ```typescript
  order: [[sortField || 'descricao', sortOrder || 'ASC']]
  ```

## 7. Responsividade

- Usar classes Bootstrap para layout responsivo:
  - `col-md-6` para divisão em telas médias
  - `d-flex justify-content-between` para alinhamento
  - `table-responsive` para tabelas em dispositivos móveis

## 8. Padrão de Desenvolvimento Mestre/Detalhe

### 8.1 Componentização de Detalhes

- Separar a lógica de detalhes em componentes independentes
- O componente mestre deve apenas passar a chave de ligação (ID) e callbacks quando necessário
- Cada componente de detalhe deve ser responsável por:
  - Carregar seus próprios dados
  - Gerenciar seu próprio estado
  - Implementar suas próprias operações CRUD
  - Gerenciar seus próprios modais

### 8.2 Estrutura de Componentes

```jsx
// Componente Mestre (Página)
<MestrePage>
  {/* Formulário do registro mestre */}
  <FormularioMestre />
  
  {/* Componentes de detalhe são renderizados condicionalmente */}
  {idMestre && (
    <>
      <DetalheAManager idMestre={idMestre} onUpdate={callbackOpcional} />
      <DetalheBManager idMestre={idMestre} />
    </>
  )}
</MestrePage>
```

### 8.3 Props dos Componentes de Detalhe

- **Obrigatórias**:
  - ID do registro mestre (ex: `convenioId`, `planoId`)
- **Opcionais**:
  - Callbacks para notificar o componente mestre sobre alterações
  - Flags de modo (ex: `isEditMode`, `isReadOnly`)

### 8.4 Responsabilidades

#### Componente Mestre:
- Gerenciar o estado do registro principal
- Renderizar condicionalmente os componentes de detalhe
- Passar apenas as chaves necessárias para os componentes de detalhe

#### Componente de Detalhe:
- Carregar seus próprios dados usando a chave do mestre
- Gerenciar seu próprio estado interno (loading, edição, etc.)
- Implementar suas próprias operações CRUD
- Gerenciar seus próprios modais e formulários
- Notificar o mestre sobre alterações apenas quando necessário

### 8.5 Exemplo Prático

Ver implementação em:
- `ConvenioSaudeEditPage.tsx` (mestre)
- `PlanoConvenioManager.tsx` (detalhe de primeiro nível)
- `ProcedimentoPlanoManager.tsx` (detalhe de segundo nível)
- `PortePlanoManager.tsx` (detalhe de segundo nível)
- `TabelaChPlanoManager.tsx` (detalhe de segundo nível)

## 9. Padrões para CRUDs Frontend

### 9.1 Páginas de Listagem

#### 9.1.1 Estrutura do SubHeader
- **SubHeaderLeft**: Título da página (h4) + contador de registros
  ```jsx
  <SubHeaderLeft>
    <span className="h4 mb-0">Título da Página</span>
    <span className="text-muted ms-2">
      {!isLoading && `(${totalItems} registros)`}
    </span>
  </SubHeaderLeft>
  ```
- **SubHeaderRight**: Botão de ação principal (Novo/Adicionar)
  ```jsx
  <SubHeaderRight>
    <Button
      color="info"
      icon="Add"
      onClick={handleCreate}
    >
      Novo Registro
    </Button>
  </SubHeaderRight>
  ```

#### 9.1.2 Filtros e Busca
- Usar componente `FormGroup` com `Input` para campo de busca
- Implementar debounce para evitar múltiplas requisições:
  ```jsx
  const handleSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setPage(1); // Resetar para a primeira página ao pesquisar
      fetchData({
        page: 1,
        limit,
        search: searchTerm,
        // outros parâmetros
      });
    }, 500);
    
    setSearchTimeout(timeout);
  };
  ```
- Usar componente `Select` para filtros de status:
  ```jsx
  <FormGroup>
    <Select
      id="statusFilter"
      ariaLabel="Status"
      placeholder="Filtrar por status"
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusFilterChange(e.target.value)}
      value={statusFilter}
      list={[
        { value: 'todos', text: 'Todos os Status' },
        { value: 'true', text: 'Status Ativos' },
        { value: 'false', text: 'Status Inativos' },
      ]}
    />
  </FormGroup>
  ```

#### 9.1.3 Diálogos de Confirmação
- Usar o contexto `useDialog` para confirmações em duas etapas:
  ```jsx
  const { yesNo, warning } = useDialog();
  
  const handleDelete = async (id: number) => {
    const confirm = await yesNo('Deseja realmente excluir este registro?');
    if (confirm) {
      const alert = await warning('Tem certeza que deseja continuar?', 'Aviso');
      if (alert) {
        try {
          setIsLoading(true);
          await deleteRecord(id);
          showNotification('Sucesso', 'Registro excluído com sucesso', 'success');
          fetchData(); // Recarregar a lista
        } catch (error: any) {
          console.error('Erro ao excluir:', error);
          showNotification('Erro', error.message || 'Erro ao excluir', 'danger');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  ```

#### 9.1.4 Tabelas e Estilo
- Usar classes consistentes para tabelas:
  ```jsx
  <table className="table table-modern table-hover table-sm" style={{ tableLayout: 'fixed' }}>
  ```
- Manter botões de ação com tamanho e cores consistentes:
  ```jsx
  <Button
    color="info"
    isLight
    icon='Edit'
    size='lg'
    className='me-2'
    onClick={() => handleEdit(item.id)}
    title='Editar'
  />
  
  <Button
    color="danger"
    isLight
    icon='Delete'
    size='lg'
    onClick={() => handleDelete(item.id)}
    title='Excluir'
  />
  ```

#### 9.1.5 Contador e Paginação
- Exibir contador de registros no formato padronizado:
  ```jsx
  <div className="col-auto">
    <span className="text-muted">
      Mostrando {items.length} de {totalItems} registros
    </span>
  </div>
  ```
- Implementar paginação com `PaginationButtons`:
  ```jsx
  {totalPages > 1 && (
    <div className="row mt-3">
      <div className="col-12 d-flex justify-content-center">
        <PaginationButtons
          data={Array(totalPages).fill(0)}
          currentPage={page}
          perPage={limit}
          label="páginas"
          setCurrentPage={handlePageChange}
          setPerPage={handleLimitChange}
        />
      </div>
    </div>
  )}
  ```

### 9.2 Páginas de Edição/Criação

#### 9.2.1 Estrutura do SubHeader
- **SubHeaderLeft**: Botão "Voltar" + Título da página
  ```jsx
  <SubHeaderLeft>
    <Button
      color='info'
      isLink
      icon='ArrowBack'
      onClick={handleCancel}
    >
      Voltar
    </Button>
    <span className='h4 mb-0 ms-3'>
      {isEdit ? `Editar Registro` : `Novo Registro`}
    </span>
  </SubHeaderLeft>
  ```
- **SubHeaderRight**: Botão "Salvar/Atualizar" com spinner durante o salvamento
  ```jsx
  <SubHeaderRight>
    <Button
      color='info'
      icon='Save'
      isDisable={formik.isSubmitting || isSaving}
      onClick={() => formik.handleSubmit()}
    >
      {isSaving ? (
        <>
          <Spinner isSmall inButton />
          {isEdit ? 'Atualizando...' : 'Salvando...'}
        </>
      ) : (
        isEdit ? 'Atualizar' : 'Salvar'
      )}
    </Button>
  </SubHeaderRight>
  ```

#### 9.2.2 Formulários e Validação
- Usar Formik para gerenciamento de formulários
- Implementar validação diretamente no objeto `validate` do Formik:
  ```jsx
  const validate = (values: IFormValues) => {
    const errors: Partial<IFormValues> = {};
    
    if (!values.descricao?.trim()) {
      errors.descricao = 'Descrição é obrigatória';
    }
    
    return errors;
  };
  ```
- Usar `useRef` e `useEffect` para foco automático no primeiro campo:
  ```jsx
  const descricaoInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (descricaoInputRef.current) {
      descricaoInputRef.current.focus();
    }
  }, []);
  ```

#### 9.2.3 Diálogos de Confirmação
- Usar `useDialog` para confirmação ao sair com alterações não salvas:
  ```jsx
  const handleCancel = () => {
    if (formik.dirty) {
      yesNo('Há alterações não salvas. Deseja realmente sair?').then((result) => {
        if (result) {
          navigate('/caminho/para/listagem');
        }
      });
    } else {
      navigate('/caminho/para/listagem');
    }
  };
  ```

### 9.3 Exemplos de Implementação

- Ver implementação em:
  - `ConvenioSaudeListPage.tsx` (listagem)
  - `ConvenioSaudeEditPage.tsx` (edição/criação)
  - `AgendaStatusTransicaoListPage.tsx` (listagem)
  - `AgendaStatusTransicaoEditPage.tsx` (edição/criação)

---

Documento atualizado em: 27/06/2025
