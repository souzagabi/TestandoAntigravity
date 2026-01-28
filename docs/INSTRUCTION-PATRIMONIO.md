# Módulo de Gestão de Patrimônio - Modelagem Completa

## Visão Geral

O módulo de Gestão de Patrimônio permite o controle completo dos bens patrimoniais das empresas, incluindo:
- Cadastro de bens patrimoniais
- Cadastro de locais onde os bens se encontram
- Registro de movimentações dos bens entre locais
- Registro de ocorrências (reparos, manutenção, quebra, substituição, perda, roubo)
- Controle de manutenções preventivas
- Controle de seguros
- Gestão de imagens dos bens
- Histórico completo de movimentações e ocorrências

## Estrutura de Tabelas

### 1. patrimonio_categoria
Categorização dos bens patrimoniais (ex: Móveis, Equipamentos, Veículos, Imóveis, TI)

**Campos:**
- `categoria_id` (PK, SERIAL)
- `empresa_id` (FK -> cfg_empresa)
- `codigo` (VARCHAR(20), UNIQUE por empresa)
- `nome` (VARCHAR(100), NOT NULL)
- `descricao` (TEXT)
- `st_ativo` (BOOLEAN, DEFAULT true)
- `st_excluido` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_patrimonio_categoria_empresa` (empresa_id)
- `idx_patrimonio_categoria_codigo` (empresa_id, codigo) UNIQUE

---

### 2. patrimonio_local
Locais físicos onde os bens podem estar localizados

**Campos:**
- `local_id` (PK, SERIAL)
- `empresa_id` (FK -> cfg_empresa)
- `local_pai_id` (FK -> patrimonio_local, NULLABLE) - Para hierarquia de locais
- `codigo` (VARCHAR(20), UNIQUE por empresa)
- `nome` (VARCHAR(100), NOT NULL)
- `descricao` (TEXT)
- `tipo_local` (VARCHAR(50)) - Ex: Prédio, Andar, Sala, Depósito, Filial
- `endereco` (TEXT)
- `responsavel_pessoa_id` (FK -> pessoa, NULLABLE)
- `st_ativo` (BOOLEAN, DEFAULT true)
- `st_excluido` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_patrimonio_local_empresa` (empresa_id)
- `idx_patrimonio_local_codigo` (empresa_id, codigo) UNIQUE
- `idx_patrimonio_local_pai` (local_pai_id)
- `idx_patrimonio_local_responsavel` (responsavel_pessoa_id)

---

### 3. patrimonio_bem
Cadastro dos bens patrimoniais

**Campos:**
- `bem_id` (PK, SERIAL)
- `empresa_id` (FK -> cfg_empresa)
- `categoria_id` (FK -> patrimonio_categoria)
- `local_atual_id` (FK -> patrimonio_local, NULLABLE)
- `codigo` (VARCHAR(30), UNIQUE por empresa) - Código/Plaqueta do bem
- `descricao` (VARCHAR(200), NOT NULL)
- `marca` (VARCHAR(100))
- `modelo` (VARCHAR(100))
- `numero_serie` (VARCHAR(100))
- `numero_nota_fiscal` (VARCHAR(50))
- `fornecedor_pessoa_id` (FK -> pessoa, NULLABLE)
- `data_aquisicao` (DATE)
- `valor_aquisicao` (DECIMAL(15,2))
- `valor_atual` (DECIMAL(15,2))
- `vida_util_anos` (INTEGER) - Para cálculo de depreciação
- `estado_conservacao` (VARCHAR(50)) - Novo, Bom, Regular, Ruim, Péssimo
- `status` (VARCHAR(50), NOT NULL) - Ativo, Em Manutenção, Inativo, Baixado, Perdido, Roubado
- `observacoes` (TEXT)
- `st_ativo` (BOOLEAN, DEFAULT true)
- `st_excluido` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_patrimonio_bem_empresa` (empresa_id)
- `idx_patrimonio_bem_codigo` (empresa_id, codigo) UNIQUE
- `idx_patrimonio_bem_categoria` (categoria_id)
- `idx_patrimonio_bem_local` (local_atual_id)
- `idx_patrimonio_bem_fornecedor` (fornecedor_pessoa_id)
- `idx_patrimonio_bem_status` (status)

---

### 4. patrimonio_bem_imagem
Imagens dos bens patrimoniais

**Campos:**
- `imagem_id` (PK, SERIAL)
- `bem_id` (FK -> patrimonio_bem)
- `nome_arquivo` (VARCHAR(255), NOT NULL)
- `caminho_arquivo` (VARCHAR(500), NOT NULL)
- `tamanho_bytes` (INTEGER)
- `tipo_mime` (VARCHAR(100))
- `descricao` (VARCHAR(200))
- `ordem` (INTEGER, DEFAULT 0) - Para ordenação das imagens
- `st_principal` (BOOLEAN, DEFAULT false) - Imagem principal do bem
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_patrimonio_bem_imagem_bem` (bem_id)
- `idx_patrimonio_bem_imagem_ordem` (bem_id, ordem)

---

### 5. patrimonio_bem_seguro
Controle de seguros dos bens

**Campos:**
- `seguro_id` (PK, SERIAL)
- `bem_id` (FK -> patrimonio_bem)
- `seguradora_pessoa_id` (FK -> pessoa)
- `numero_apolice` (VARCHAR(50), NOT NULL)
- `data_inicio` (DATE, NOT NULL)
- `data_vencimento` (DATE, NOT NULL)
- `valor_segurado` (DECIMAL(15,2), NOT NULL)
- `valor_premio` (DECIMAL(15,2)) - Valor pago pelo seguro
- `cobertura` (TEXT) - Descrição das coberturas
- `observacoes` (TEXT)
- `st_ativo` (BOOLEAN, DEFAULT true)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_patrimonio_bem_seguro_bem` (bem_id)
- `idx_patrimonio_bem_seguro_seguradora` (seguradora_pessoa_id)
- `idx_patrimonio_bem_seguro_vencimento` (data_vencimento)

---

### 6. patrimonio_tipo_ocorrencia
Tipos de ocorrências que podem acontecer com os bens

**Campos:**
- `tipo_ocorrencia_id` (PK, SERIAL)
- `empresa_id` (FK -> cfg_empresa)
- `codigo` (VARCHAR(20), UNIQUE por empresa)
- `nome` (VARCHAR(100), NOT NULL)
- `descricao` (TEXT)
- `categoria` (VARCHAR(50)) - Manutenção, Reparo, Quebra, Substituição, Perda, Roubo, Outros
- `st_altera_status` (BOOLEAN, DEFAULT false) - Se altera o status do bem
- `status_destino` (VARCHAR(50)) - Status para qual o bem deve ir
- `st_ativo` (BOOLEAN, DEFAULT true)
- `st_excluido` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_patrimonio_tipo_ocorrencia_empresa` (empresa_id)
- `idx_patrimonio_tipo_ocorrencia_codigo` (empresa_id, codigo) UNIQUE
- `idx_patrimonio_tipo_ocorrencia_categoria` (categoria)

---

### 7. patrimonio_ocorrencia
Registro de ocorrências dos bens

**Campos:**
- `ocorrencia_id` (PK, SERIAL)
- `bem_id` (FK -> patrimonio_bem)
- `tipo_ocorrencia_id` (FK -> patrimonio_tipo_ocorrencia)
- `data_ocorrencia` (TIMESTAMP, NOT NULL)
- `data_prevista_conclusao` (DATE)
- `data_conclusao` (TIMESTAMP)
- `responsavel_pessoa_id` (FK -> pessoa, NULLABLE)
- `executor_pessoa_id` (FK -> pessoa, NULLABLE) - Quem executou o serviço
- `descricao` (TEXT, NOT NULL)
- `solucao` (TEXT)
- `valor_custo` (DECIMAL(15,2))
- `numero_os` (VARCHAR(50)) - Número da ordem de serviço
- `status` (VARCHAR(50), NOT NULL) - Aberta, Em Andamento, Concluída, Cancelada
- `prioridade` (VARCHAR(20)) - Baixa, Normal, Alta, Urgente
- `observacoes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_patrimonio_ocorrencia_bem` (bem_id)
- `idx_patrimonio_ocorrencia_tipo` (tipo_ocorrencia_id)
- `idx_patrimonio_ocorrencia_data` (data_ocorrencia)
- `idx_patrimonio_ocorrencia_status` (status)
- `idx_patrimonio_ocorrencia_responsavel` (responsavel_pessoa_id)

---

### 8. patrimonio_movimentacao
Registro de movimentações dos bens entre locais

**Campos:**
- `movimentacao_id` (PK, SERIAL)
- `bem_id` (FK -> patrimonio_bem)
- `local_origem_id` (FK -> patrimonio_local, NULLABLE)
- `local_destino_id` (FK -> patrimonio_local, NOT NULL)
- `data_movimentacao` (TIMESTAMP, NOT NULL)
- `responsavel_pessoa_id` (FK -> pessoa, NULLABLE)
- `motivo` (TEXT)
- `observacoes` (TEXT)
- `usuario_id` (FK -> security_usuario) - Usuário que registrou a movimentação
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_patrimonio_movimentacao_bem` (bem_id)
- `idx_patrimonio_movimentacao_origem` (local_origem_id)
- `idx_patrimonio_movimentacao_destino` (local_destino_id)
- `idx_patrimonio_movimentacao_data` (data_movimentacao)
- `idx_patrimonio_movimentacao_responsavel` (responsavel_pessoa_id)

---

### 9. patrimonio_manutencao_preventiva
Planejamento de manutenções preventivas

**Campos:**
- `manutencao_preventiva_id` (PK, SERIAL)
- `bem_id` (FK -> patrimonio_bem)
- `tipo_ocorrencia_id` (FK -> patrimonio_tipo_ocorrencia)
- `descricao` (VARCHAR(200), NOT NULL)
- `periodicidade_dias` (INTEGER) - Periodicidade em dias
- `data_ultima_execucao` (DATE)
- `data_proxima_execucao` (DATE, NOT NULL)
- `responsavel_pessoa_id` (FK -> pessoa, NULLABLE)
- `observacoes` (TEXT)
- `st_ativo` (BOOLEAN, DEFAULT true)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_patrimonio_manutencao_preventiva_bem` (bem_id)
- `idx_patrimonio_manutencao_preventiva_proxima` (data_proxima_execucao)
- `idx_patrimonio_manutencao_preventiva_tipo` (tipo_ocorrencia_id)

---

### 10. patrimonio_depreciacao
Registro de depreciação dos bens

**Campos:**
- `depreciacao_id` (PK, SERIAL)
- `bem_id` (FK -> patrimonio_bem)
- `data_referencia` (DATE, NOT NULL)
- `valor_original` (DECIMAL(15,2), NOT NULL)
- `valor_depreciado_acumulado` (DECIMAL(15,2), NOT NULL)
- `valor_residual` (DECIMAL(15,2), NOT NULL)
- `taxa_depreciacao` (DECIMAL(5,2)) - Taxa em percentual
- `metodo_depreciacao` (VARCHAR(50)) - Linear, Acelerada, etc
- `observacoes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Índices:**
- `idx_patrimonio_depreciacao_bem` (bem_id)
- `idx_patrimonio_depreciacao_data` (data_referencia)

---

## Relacionamentos

### Principais Relacionamentos:

1. **patrimonio_categoria**
   - `belongsTo` CfgEmpresa (empresa_id)
   - `hasMany` PatrimonioBem (categoria_id)

2. **patrimonio_local**
   - `belongsTo` CfgEmpresa (empresa_id)
   - `belongsTo` PatrimonioLocal (local_pai_id) - auto-relacionamento
   - `hasMany` PatrimonioLocal (local_pai_id) - filhos
   - `belongsTo` Pessoa (responsavel_pessoa_id)
   - `hasMany` PatrimonioBem (local_atual_id)
   - `hasMany` PatrimonioMovimentacao (local_origem_id)
   - `hasMany` PatrimonioMovimentacao (local_destino_id)

3. **patrimonio_bem**
   - `belongsTo` CfgEmpresa (empresa_id)
   - `belongsTo` PatrimonioCategoria (categoria_id)
   - `belongsTo` PatrimonioLocal (local_atual_id)
   - `belongsTo` Pessoa (fornecedor_pessoa_id)
   - `hasMany` PatrimonioBemImagem (bem_id)
   - `hasMany` PatrimonioBemSeguro (bem_id)
   - `hasMany` PatrimonioOcorrencia (bem_id)
   - `hasMany` PatrimonioMovimentacao (bem_id)
   - `hasMany` PatrimonioManutencaoPreventiva (bem_id)
   - `hasMany` PatrimonioDepreciacao (bem_id)

4. **patrimonio_bem_imagem**
   - `belongsTo` PatrimonioBem (bem_id)

5. **patrimonio_bem_seguro**
   - `belongsTo` PatrimonioBem (bem_id)
   - `belongsTo` Pessoa (seguradora_pessoa_id)

6. **patrimonio_tipo_ocorrencia**
   - `belongsTo` CfgEmpresa (empresa_id)
   - `hasMany` PatrimonioOcorrencia (tipo_ocorrencia_id)
   - `hasMany` PatrimonioManutencaoPreventiva (tipo_ocorrencia_id)

7. **patrimonio_ocorrencia**
   - `belongsTo` PatrimonioBem (bem_id)
   - `belongsTo` PatrimonioTipoOcorrencia (tipo_ocorrencia_id)
   - `belongsTo` Pessoa (responsavel_pessoa_id)
   - `belongsTo` Pessoa (executor_pessoa_id)

8. **patrimonio_movimentacao**
   - `belongsTo` PatrimonioBem (bem_id)
   - `belongsTo` PatrimonioLocal (local_origem_id)
   - `belongsTo` PatrimonioLocal (local_destino_id)
   - `belongsTo` Pessoa (responsavel_pessoa_id)
   - `belongsTo` SecurityUsuario (usuario_id)

9. **patrimonio_manutencao_preventiva**
   - `belongsTo` PatrimonioBem (bem_id)
   - `belongsTo` PatrimonioTipoOcorrencia (tipo_ocorrencia_id)
   - `belongsTo` Pessoa (responsavel_pessoa_id)

10. **patrimonio_depreciacao**
    - `belongsTo` PatrimonioBem (bem_id)

---

## Interfaces TypeScript

### Interface Principal - IPatrimonioBem

```typescript
export interface IPatrimonioBem {
  bemId: number;
  empresaId: number;
  categoriaId: number;
  localAtualId?: number;
  codigo: string;
  descricao: string;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  numeroNotaFiscal?: string;
  fornecedorPessoaId?: number;
  dataAquisicao?: Date;
  valorAquisicao?: number;
  valorAtual?: number;
  vidaUtilAnos?: number;
  estadoConservacao?: string;
  status: string;
  observacoes?: string;
  stAtivo: boolean;
  stExcluido: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relacionamentos
  categoria?: IPatrimonioCategoria;
  localAtual?: IPatrimonioLocal;
  fornecedor?: IPessoa;
  imagens?: IPatrimonioBemImagem[];
  seguros?: IPatrimonioBemSeguro[];
  ocorrencias?: IPatrimonioOcorrencia[];
  movimentacoes?: IPatrimonioMovimentacao[];
  manutencoesPreventivas?: IPatrimonioManutencaoPreventiva[];
  depreciacoes?: IPatrimonioDepreciacao[];
}
```

### Demais Interfaces

```typescript
export interface IPatrimonioCategoria {
  categoriaId: number;
  empresaId: number;
  codigo: string;
  nome: string;
  descricao?: string;
  stAtivo: boolean;
  stExcluido: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatrimonioLocal {
  localId: number;
  empresaId: number;
  localPaiId?: number;
  codigo: string;
  nome: string;
  descricao?: string;
  tipoLocal?: string;
  endereco?: string;
  responsavelPessoaId?: number;
  stAtivo: boolean;
  stExcluido: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relacionamentos
  localPai?: IPatrimonioLocal;
  locaisFilhos?: IPatrimonioLocal[];
  responsavel?: IPessoa;
}

export interface IPatrimonioBemImagem {
  imagemId: number;
  bemId: number;
  nomeArquivo: string;
  caminhoArquivo: string;
  tamanhoBytes?: number;
  tipoMime?: string;
  descricao?: string;
  ordem: number;
  stPrincipal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatrimonioBemSeguro {
  seguroId: number;
  bemId: number;
  seguradoraPessoaId: number;
  numeroApolice: string;
  dataInicio: Date;
  dataVencimento: Date;
  valorSegurado: number;
  valorPremio?: number;
  cobertura?: string;
  observacoes?: string;
  stAtivo: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relacionamentos
  seguradora?: IPessoa;
}

export interface IPatrimonioTipoOcorrencia {
  tipoOcorrenciaId: number;
  empresaId: number;
  codigo: string;
  nome: string;
  descricao?: string;
  categoria: string;
  stAlteraStatus: boolean;
  statusDestino?: string;
  stAtivo: boolean;
  stExcluido: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatrimonioOcorrencia {
  ocorrenciaId: number;
  bemId: number;
  tipoOcorrenciaId: number;
  dataOcorrencia: Date;
  dataPrevistaConclusao?: Date;
  dataConclusao?: Date;
  responsavelPessoaId?: number;
  executorPessoaId?: number;
  descricao: string;
  solucao?: string;
  valorCusto?: number;
  numeroOs?: string;
  status: string;
  prioridade?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relacionamentos
  bem?: IPatrimonioBem;
  tipoOcorrencia?: IPatrimonioTipoOcorrencia;
  responsavel?: IPessoa;
  executor?: IPessoa;
}

export interface IPatrimonioMovimentacao {
  movimentacaoId: number;
  bemId: number;
  localOrigemId?: number;
  localDestinoId: number;
  dataMovimentacao: Date;
  responsavelPessoaId?: number;
  motivo?: string;
  observacoes?: string;
  usuarioId: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relacionamentos
  bem?: IPatrimonioBem;
  localOrigem?: IPatrimonioLocal;
  localDestino?: IPatrimonioLocal;
  responsavel?: IPessoa;
  usuario?: ISecurityUsuario;
}

export interface IPatrimonioManutencaoPreventiva {
  manutencaoPreventivaId: number;
  bemId: number;
  tipoOcorrenciaId: number;
  descricao: string;
  periodicidadeDias: number;
  dataUltimaExecucao?: Date;
  dataProximaExecucao: Date;
  responsavelPessoaId?: number;
  observacoes?: string;
  stAtivo: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relacionamentos
  bem?: IPatrimonioBem;
  tipoOcorrencia?: IPatrimonioTipoOcorrencia;
  responsavel?: IPessoa;
}

export interface IPatrimonioDepreciacao {
  depreciacaoId: number;
  bemId: number;
  dataReferencia: Date;
  valorOriginal: number;
  valorDepreciadoAcumulado: number;
  valorResidual: number;
  taxaDepreciacao?: number;
  metodoDepreciacao?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relacionamentos
  bem?: IPatrimonioBem;
}
```

---

## Controllers

### Estrutura de Controllers

1. **PatrimonioCategoriaController** - CRUD de categorias
2. **PatrimonioLocalController** - CRUD de locais
3. **PatrimonioBemController** - CRUD de bens patrimoniais
4. **PatrimonioBemImagemController** - Gestão de imagens
5. **PatrimonioBemSeguroController** - Gestão de seguros
6. **PatrimonioTipoOcorrenciaController** - CRUD de tipos de ocorrência
7. **PatrimonioOcorrenciaController** - Gestão de ocorrências
8. **PatrimonioMovimentacaoController** - Gestão de movimentações
9. **PatrimonioManutencaoPreventivaController** - Gestão de manutenções preventivas
10. **PatrimonioDepreciacaoController** - Cálculo e gestão de depreciação

### Endpoints Principais

#### PatrimonioBemController

```
GET    /api/patrimonio/bem                    - Lista todos os bens
GET    /api/patrimonio/bem/:id                - Busca bem por ID
POST   /api/patrimonio/bem                    - Cria novo bem
PUT    /api/patrimonio/bem/:id                - Atualiza bem
DELETE /api/patrimonio/bem/:id                - Exclui bem (soft delete)
GET    /api/patrimonio/bem/codigo/:codigo     - Busca bem por código
GET    /api/patrimonio/bem/categoria/:id      - Lista bens por categoria
GET    /api/patrimonio/bem/local/:id          - Lista bens por local
GET    /api/patrimonio/bem/status/:status     - Lista bens por status
GET    /api/patrimonio/bem/:id/historico      - Histórico completo do bem
```

#### PatrimonioMovimentacaoController

```
GET    /api/patrimonio/movimentacao                    - Lista movimentações
GET    /api/patrimonio/movimentacao/:id                - Busca movimentação
POST   /api/patrimonio/movimentacao                    - Registra movimentação
GET    /api/patrimonio/movimentacao/bem/:bemId         - Histórico de movimentações do bem
GET    /api/patrimonio/movimentacao/local/:localId     - Movimentações de um local
```

#### PatrimonioOcorrenciaController

```
GET    /api/patrimonio/ocorrencia                      - Lista ocorrências
GET    /api/patrimonio/ocorrencia/:id                  - Busca ocorrência
POST   /api/patrimonio/ocorrencia                      - Cria ocorrência
PUT    /api/patrimonio/ocorrencia/:id                  - Atualiza ocorrência
DELETE /api/patrimonio/ocorrencia/:id                  - Exclui ocorrência
GET    /api/patrimonio/ocorrencia/bem/:bemId           - Ocorrências de um bem
GET    /api/patrimonio/ocorrencia/status/:status       - Ocorrências por status
PUT    /api/patrimonio/ocorrencia/:id/concluir         - Conclui ocorrência
```

#### PatrimonioManutencaoPreventivaController

```
GET    /api/patrimonio/manutencao-preventiva                   - Lista manutenções
GET    /api/patrimonio/manutencao-preventiva/:id               - Busca manutenção
POST   /api/patrimonio/manutencao-preventiva                   - Cria manutenção
PUT    /api/patrimonio/manutencao-preventiva/:id               - Atualiza manutenção
DELETE /api/patrimonio/manutencao-preventiva/:id               - Exclui manutenção
GET    /api/patrimonio/manutencao-preventiva/vencidas          - Lista manutenções vencidas
GET    /api/patrimonio/manutencao-preventiva/proximas/:dias    - Manutenções próximas (X dias)
POST   /api/patrimonio/manutencao-preventiva/:id/executar      - Registra execução
```

---

## Regras de Negócio

### Bens Patrimoniais

1. **Código único**: O código do bem deve ser único por empresa
2. **Status**: Ao criar um bem, o status padrão é "Ativo"
3. **Local atual**: Sempre que houver uma movimentação, o campo `local_atual_id` do bem deve ser atualizado
4. **Imagem principal**: Apenas uma imagem pode ser marcada como principal por bem
5. **Valor atual**: Pode ser atualizado manualmente ou calculado pela depreciação

### Movimentações

1. **Atualização automática**: Ao registrar uma movimentação, o `local_atual_id` do bem deve ser atualizado automaticamente
2. **Local origem**: Deve ser igual ao `local_atual_id` do bem no momento da movimentação
3. **Histórico completo**: Todas as movimentações devem ser mantidas para auditoria

### Ocorrências

1. **Alteração de status**: Se o tipo de ocorrência tem `st_altera_status = true`, o status do bem deve ser alterado para `status_destino`
2. **Conclusão**: Ao concluir uma ocorrência, a `data_conclusao` deve ser preenchida e o status alterado para "Concluída"
3. **Custo**: O valor de custo das ocorrências pode ser usado para controle financeiro

### Manutenções Preventivas

1. **Cálculo automático**: Ao executar uma manutenção preventiva, a `data_proxima_execucao` deve ser calculada automaticamente: `data_ultima_execucao + periodicidade_dias`
2. **Criação de ocorrência**: Ao executar uma manutenção preventiva, deve ser criada uma ocorrência correspondente
3. **Alertas**: O sistema deve alertar sobre manutenções vencidas ou próximas do vencimento

### Seguros

1. **Vencimento**: O sistema deve alertar sobre seguros próximos do vencimento
2. **Múltiplos seguros**: Um bem pode ter múltiplos seguros (histórico)
3. **Seguro ativo**: Apenas um seguro deve estar ativo (`st_ativo = true`) por vez

### Depreciação

1. **Cálculo periódico**: A depreciação deve ser calculada periodicamente (mensal ou anual)
2. **Métodos**: Suportar diferentes métodos de depreciação (linear, acelerada)
3. **Valor residual**: O valor residual nunca pode ser negativo

---

## Funcionalidades Especiais

### 1. Dashboard de Patrimônio

- Total de bens por categoria
- Total de bens por local
- Total de bens por status
- Valor total do patrimônio
- Manutenções vencidas/próximas
- Seguros a vencer
- Gráficos de evolução

### 2. Relatórios

- Inventário completo
- Bens por local
- Bens por categoria
- Histórico de movimentações
- Histórico de ocorrências
- Manutenções realizadas/pendentes
- Depreciação acumulada
- Seguros vigentes

### 3. Alertas e Notificações

- Manutenções preventivas vencidas
- Seguros próximos do vencimento
- Ocorrências em aberto há muito tempo
- Bens sem movimentação há muito tempo

### 4. Etiquetas/Plaquetas

- Geração de etiquetas com QR Code
- QR Code contém o código do bem
- Leitura de QR Code para consulta rápida

### 5. Importação/Exportação

- Importação em lote de bens (CSV/Excel)
- Exportação de inventário
- Exportação de relatórios

---

## Considerações de Implementação

### Backend

1. **Validações**: Implementar validações robustas em todos os controllers
2. **Transações**: Usar transações para operações que envolvem múltiplas tabelas
3. **Soft Delete**: Implementar exclusão lógica (`st_excluido`) para manter histórico
4. **Auditoria**: Registrar usuário e data em todas as operações importantes
5. **Performance**: Criar índices adequados para consultas frequentes
6. **Upload de imagens**: Implementar upload seguro com validação de tipo e tamanho

### Frontend

1. **Componentes reutilizáveis**: Criar componentes genéricos para listagens e formulários
2. **Validação**: Validar dados no frontend antes de enviar ao backend
3. **Feedback visual**: Mostrar loading, sucesso e erros de forma clara
4. **Filtros avançados**: Implementar filtros por múltiplos critérios
5. **Paginação**: Implementar paginação para listas grandes
6. **Responsividade**: Interface deve funcionar bem em desktop e mobile

### Segurança

1. **Permissões**: Implementar controle de acesso por perfil
2. **Multi-tenant**: Garantir isolamento de dados por empresa
3. **Upload seguro**: Validar e sanitizar arquivos enviados
4. **Logs**: Registrar todas as operações críticas

---

## Próximos Passos

1. Criar migrations para todas as tabelas
2. Criar modelos Sequelize
3. Criar arquivo de associações
4. Implementar controllers
5. Criar rotas
6. Criar interfaces TypeScript compartilhadas
7. Implementar serviços no frontend
8. Criar componentes de interface
9. Implementar testes
10. Criar seeders com dados iniciais

---

## Observações Finais

Este módulo foi projetado para ser:
- **Escalável**: Suporta grande volume de bens e movimentações
- **Flexível**: Permite customização de categorias, tipos de ocorrência e locais
- **Completo**: Cobre todos os aspectos da gestão patrimonial
- **Auditável**: Mantém histórico completo de todas as operações
- **Integrado**: Se integra com outros módulos (Pessoa, Financeiro, etc)

O módulo segue todos os padrões estabelecidos no projeto e está pronto para implementação.
