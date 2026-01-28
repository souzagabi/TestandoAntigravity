# Modelo Padronizado de Comunicação entre Camadas

Este documento define o padrão para troca de mensagens entre as três camadas da aplicação: backend, serviço e frontend. O objetivo é garantir consistência, facilitar o tratamento de erros e padronizar a paginação para grandes volumes de dados.

## Interfaces oficiais

- As interfaces e tipos oficiais estão em `src/shared/interfaces/ApiResponse.ts`.
  - Interfaces: `ApiResponse<T>`, `PaginationInfo`
  - Enum: `ErrorCode`
- Utilize essas definições como fonte de verdade no backend e no frontend.

[Ver arquivo: ../shared/interfaces/ApiResponse.ts](../shared/interfaces/ApiResponse.ts)

## 1. Backend (Controladores)

### Estrutura de Resposta Padrão

```typescript
// Resposta de sucesso
{
  success: true,
  message: string,  // Mensagem amigável
  data: any,        // Dados retornados (objeto, array, etc.)
  pagination?: {    // Opcional, apenas para listagens paginadas
    page: number,
    pageSize: number,
    totalItems: number,
    totalPages: number
  }
}

// Resposta de erro
{
  success: false,
  message: string,    // Mensagem de erro amigável
  errorCode?: string, // Código de erro opcional para identificação
  details?: any       // Detalhes adicionais do erro (opcional)
}
```

### Os seguintes códigos de erro foram implementados:

- `AUTHENTICATION_ERROR`: Problemas de autenticação ou autorização
- `VALIDATION_ERROR`: Dados inválidos ou regras de negócio violadas
- `RECORD_NOT_FOUND`: Registro não encontrado
- `CREATE_ERROR`: Erro ao criar registro
- `UPDATE_ERROR`: Erro ao atualizar registro
- `DELETE_ERROR`: Erro ao excluir registro
- `READ_ERROR`: Erro ao buscar registros
- `FILE_UPLOAD_ERROR`: Erro no upload de arquivos
- `DOWNLOAD_ERROR`: Erro ao gerar URL de download
- `ATTACHMENT_NOT_FOUND`: Anexo não encontrado
- `INTERNAL_SERVER_ERROR`: Erro interno do servidor
- `DUPLICATE_ENTRY`: Entrada duplicada (violação de unicidade)
- `DUPLICATE_RECORD`: Registro duplicado
- `INTERNAL_ERROR`: Erro interno da aplicação
- `EXTERNAL_API_ERROR`: Erro em chamada de API externa

### Implementação para Operações CRUD

#### CREATE

```typescript
public async create(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    // Lógica de criação
    const novoItem = await ContabilLancamento.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Registro criado com sucesso',
      data: novoItem
    });
  } catch (error: any) {
    // Tratamento de erros específicos
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        success: false,
        message: 'Dados inválidos para criação do registro',
        details: error.errors.map((e: any) => e.message)
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar registro',
        errorCode: 'CREATE_ERROR',
        details: error.message
      });
    }
  }
}
```

#### READ (com paginação)

```typescript
public async findAll(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;
    
    // Aplicar filtros da query
    const where = { empresaId: req.empresaId };
    
    // Adicionar outros filtros da query
    // ...
    
    const { count, rows } = await ContabilLancamento.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      message: 'Registros recuperados com sucesso',
      data: rows,
      pagination: {
        page,
        pageSize,
        totalItems: count,
        totalPages: Math.ceil(count / pageSize)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar registros',
      errorCode: 'READ_ERROR',
      details: error.message
    });
  }
}
```

#### UPDATE

```typescript
public async update(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    // Verificar se o item existe
    const item = await ContabilLancamento.findByPk(id);
    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Registro não encontrado',
        errorCode: 'RECORD_NOT_FOUND'
      });
      return;
    }
    
    // Atualizar o item
    await item.update(req.body);
    
    res.json({
      success: true,
      message: 'Registro atualizado com sucesso',
      data: item
    });
  } catch (error: any) {
    // Tratamento de erros específicos
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        success: false,
        message: 'Dados inválidos para atualização do registro',
        details: error.errors.map((e: any) => e.message)
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar registro',
        errorCode: 'UPDATE_ERROR',
        details: error.message
      });
    }
  }
}
```

#### DELETE

```typescript
public async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    // Verificar se o item existe
    const item = await ContabilLancamento.findByPk(id);
    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Registro não encontrado',
        errorCode: 'RECORD_NOT_FOUND'
      });
      return;
    }
    
    // Exclusão lógica ou física
    await item.update({ stDeletado: true });
    // OU: await item.destroy();
    
    res.json({
      success: true,
      message: 'Registro excluído com sucesso',
      data: { id }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir registro',
      errorCode: 'DELETE_ERROR',
      details: error.message
    });
  }
}
```

## 2. Camada de Serviço (Frontend)

### Interfaces

```typescript
// Interface para resposta da API
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  errorCode?: string;
  details?: any;
}

// Interface para retorno padronizado dos serviços
interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
```

### Implementação dos Métodos

#### CREATE

```typescript
async create(data: any): Promise<ServiceResponse<any>> {
  try {
    const response = await axios.post<ApiResponse<any>>(`${API_URL}/lancamentos`, data);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error: any) {
    return this.handleError(error, 'Erro ao criar registro');
  }
}
```

#### READ (com paginação)

```typescript
async getAll(page = 1, pageSize = 10, filtros?: any): Promise<ServiceResponse<any[]>> {
  try {
    const params = { page, pageSize, ...filtros };
    const response = await axios.get<ApiResponse<any[]>>(`${API_URL}/lancamentos`, { params });
    
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data || [],
      pagination: response.data.pagination || {
        page,
        pageSize,
        totalItems: 0,
        totalPages: 0
      }
    };
  } catch (error: any) {
    return this.handleError(error, 'Erro ao buscar registros');
  }
}
```

#### UPDATE

```typescript
async update(id: number, data: any): Promise<ServiceResponse<any>> {
  try {
    const response = await axios.put<ApiResponse<any>>(`${API_URL}/lancamentos/${id}`, data);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error: any) {
    return this.handleError(error, 'Erro ao atualizar registro');
  }
}
```

#### DELETE

```typescript
async delete(id: number): Promise<ServiceResponse<void>> {
  try {
    const response = await axios.delete<ApiResponse<any>>(`${API_URL}/lancamentos/${id}`);
    return {
      success: response.data.success,
      message: response.data.message
    };
  } catch (error: any) {
    return this.handleError(error, 'Erro ao excluir registro');
  }
}
```

#### Tratamento de Erros

```typescript
handleError(error: any, defaultMessage: string): ServiceResponse<never> {
  console.error(defaultMessage, error);
  
  // Verificar diferentes formatos de resposta de erro
  if (error.response?.data) {
    const errorData = error.response.data;
    
    if (errorData.success === false) {
      // Formato padrão da API
      return {
        success: false,
        message: errorData.message || defaultMessage
      };
    } else if (errorData.message) {
      // Formato alternativo
      return {
        success: false,
        message: errorData.message
      };
    } else if (typeof errorData === 'string') {
      // Mensagem direta
      return {
        success: false,
        message: errorData
      };
    }
  }
  
  // Erro genérico ou de rede
  return {
    success: false,
    message: error.message || defaultMessage
  };
}
```

## 3. Componentes Frontend (React)

### Exemplo de Listagem com Paginação

```tsx
const carregarLancamentos = async () => {
  setLoading(true);
  
  const response = await contabilLancamentoService.getAll(
    pagination.page,
    pagination.pageSize,
    filtros
  );
  
  if (response.success) {
    setLancamentos(response.data || []);
    if (response.pagination) {
      setPagination(response.pagination);
    }
  } else {
    showNotification('Erro', response.message, 'danger');
    setLancamentos([]);
  }
  
  setLoading(false);
};
```

### Exemplo de Operação de Exclusão

```tsx
const handleDelete = async (id: number) => {
  const confirmar = await yesNo('Deseja realmente excluir este registro?');
  if (confirmar) {
    const response = await contabilLancamentoService.delete(id);
    
    if (response.success) {
      showNotification('Sucesso', response.message, 'success');
      carregarLancamentos(); // Recarregar a lista
    } else {
      showNotification('Erro', response.message, 'danger');
    }
  }
};
```

### Exemplo de Submissão de Formulário

```tsx
const handleSubmit = async (values: any, formikHelpers: FormikHelpers<any>) => {
  setLoading(true);
  
  const isNew = !id;
  const serviceMethod = isNew 
    ? contabilLancamentoService.create 
    : (data: any) => contabilLancamentoService.update(Number(id), data);
  
  const response = await serviceMethod(values);
  
  if (response.success) {
    showNotification('Sucesso', response.message, 'success');
    navigate('/lancamentos');
  } else {
    showNotification('Erro', response.message, 'danger');
    // Resetar estado de submissão do Formik
    formikHelpers.setSubmitting(false);
  }
  
  setLoading(false);
};
```

## Benefícios do Modelo

1. **Consistência**: Padrão uniforme em todas as camadas da aplicação
2. **Simplicidade**: Fluxo de controle direto sem uso excessivo de try/catch
3. **Robustez**: Tratamento de erros padronizado e abrangente
4. **Manutenibilidade**: Facilidade para adicionar novos recursos e manter o código existente
5. **Experiência do Usuário**: Feedback claro e consistente para o usuário
6. **Paginação**: Suporte nativo para grandes volumes de dados

## Recomendações de Implementação

1. Criar interfaces TypeScript para todos os modelos de dados
2. Implementar validação de dados no backend e frontend
3. Usar códigos de erro consistentes para facilitar o diagnóstico
4. Documentar mensagens de erro comuns para referência
5. Implementar logs detalhados no backend para depuração
6. Considerar internacionalização das mensagens para suporte a múltiplos idiomas

---

*Este documento serve como referência para o desenvolvimento de novas funcionalidades e manutenção do código existente. Deve ser seguido por todos os desenvolvedores para garantir consistência em toda a aplicação.*