# Estratégia Completa de Migração de Dados - Legado para SaaS

## Visão Geral

Este documento descreve a estratégia completa para migração incremental de dados de 30 bancos de dados locais (Delphi/Firebird) para um único banco de dados SaaS, mantendo integridade referencial e controle total do processo.

## 🏗️ Nova Arquitetura Especializada

### Componentes Principais

1. **Sistema Legado (Delphi/Firebird)**
   - Aplicação de extração de dados
   - Tabelas de controle local
   - Lógica de verificação e envio

2. **API de Migração (Node.js/PostgreSQL) - Estrutura Especializada**
   - **Controller Base** (`MigrationBaseController`) - Métodos genéricos e abstratos
   - **Controllers Especializados** - Validações específicas por entidade
     - `PessoaMigrationController` - CPF/CNPJ, validação de nomes
     - `EnderecoMigrationController` - CEP, UF, formatação de endereços
     - `TelefoneMigrationController` - Formatos internacionais, DDD
   - **Controller Orquestrador** - Coordenação da migração completa

3. **Banco SaaS (PostgreSQL)**
   - Tabelas de destino
   - Tabelas de controle de migração
   - Mapeamento de IDs origem ↔ destino

## 🎯 Benefícios da Nova Estrutura

### Separação de Responsabilidades
- **Cada controller focado** em sua entidade específica
- **Validações especializadas** por tipo de dado
- **Manutenção independente** de cada módulo
- **Testes isolados** e mais simples

### Tratamentos Específicos Implementados

#### PessoaMigrationController
```typescript
// Validação CPF real
private validarCPF(cpf: string): boolean {
    // Algoritmo completo de validação
}

// Normalização de nomes
private normalizarNome(nome: string): string {
    return nome.trim().replace(/\s+/g, '');
}

// Validação de email
private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
```

#### EnderecoMigrationController
```typescript
// Formatação de CEP
private formatarCEP(cep: string): string {
    const numeros = cep.replace(/\D/g, '');
    return `${numeros.substring(0, 5)}-${numeros.substring(5)}`;
}

// Validação de UF
private validarUF(uf: string): boolean {
    const ufsValidas = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', ...];
    return ufsValidas.includes(uf);
}
```

#### TelefoneMigrationController
```typescript
// Validação internacional
private validarCodigoPais(codigo: string): boolean {
    const codigosValidos = ['+55', '+1', '+44', '+33', ...];
    return codigosValidos.includes(codigo);
}

// Normalização de tipos
private normalizarTipoTelefone(tipo: string): string {
    const mapeamento = {
        'CEL': 'CELULAR',
        'RES': 'RESIDENCIAL',
        'COM': 'COMERCIAL'
    };
    return mapeamento[tipo] || tipo;
}
```

## 📁 Estrutura de Arquivos

```
controller/migration/
├── base/
│   └── migrationBaseController.ts      # Classe base abstrata
├── entities/
│   ├── pessoaMigrationController.ts     # Validações de pessoa
│   ├── enderecoMigrationController.ts   # Validações de endereço
│   └── telefoneMigrationController.ts   # Validações de telefone
├── migrationController.ts               # Orquestrador principal
├── fileMigrationController.ts           # Migração de arquivos
└── routes/
    └── migrationRoutes.ts                # Endpoints atualizados
```

## 🔄 API Endpoints

### Migração de Dados (Estrutura Especializada)

```typescript
// Importação completa (orquestrada)
POST /api/migration/import
{
  "empresaOrigem": 1,
  "dados": {
    "pessoas": [...],
    "enderecos": [...],
    "telefones": [...]
  }
}

// Importação individual por entidade
POST /api/migration/import/pessoas
POST /api/migration/import/enderecos
POST /api/migration/import/telefones

// Status e testes
GET /api/migration/status/:empresaOrigem
GET /api/migration/test/:empresaOrigem
```

### Migração de Arquivos (Estratégia Local + FileZilla)

```typescript
// Salvar localmente
POST /api/migration/files/upload
{
  "empresaId": 1,
  "tabela": "pessoa",
  "registroId": "1001",
  "campo": "foto",
  "arquivo": {
    "nome": "foto.jpg",
    "tipo": "image/jpeg",
    "dados": "base64..."
  }
}

// Controle de upload
POST /api/migration/files/mark-uploaded
GET /api/migration/files/list-pending/:empresaOrigem
GET /api/migration/files/status/:empresaOrigem
```

## 📊 Fluxo de Migração Atualizado

### 1. Migração de Dados

#### Passo 1: Pessoas (Entidade Pai)
```typescript
// 1. Valida CPF/CNPJ real
// 2. Normaliza nome e dados
// 3. Salva mapeamento de IDs
// 4. Registra controle
await pessoaController.importarDados(pessoas, empresaOrigem, empresaDestino);
```

#### Passo 2: Endereços (Dependente)
```typescript
// 1. Obtém ID da pessoa mapeada
// 2. Valida CEP/UF
// 3. Formata endereço
// 4. Salva com relacionamento correto
await enderecoController.importarDados(enderecos, empresaOrigem, empresaDestino);
```

#### Passo 3: Telefones (Dependente)
```typescript
// 1. Obtém ID da pessoa mapeada
// 2. Valida telefone internacional
// 3. Normaliza tipo
// 4. Salva com relacionamento correto
await telefoneController.importarDados(telefones, empresaOrigem, empresaDestino);
```

### 2. Migração de Arquivos

#### Passo 1: Salvar Localmente
```typescript
// 1. Recebe base64 do legado
// 2. Converte para buffer
// 3. Salva em temp/migration-files/
// 4. Gera nome único com UUID
// 5. Registra controle como SALVO_LOCAL
```

#### Passo 2: Upload para S3 (FileZilla)
```bash
# Script gerado automaticamente
aws s3 cp "temp/pessoa_foto_1_1001_2025-01-09_abc123.jpg" \
  "s3://erp-saas-arquivos/pessoas/avatares/1/1001/pessoa_foto_1_1001_2025-01-09_abc123.jpg"
```

#### Passo 3: Atualizar Status
```typescript
// Marca como ENVIADO_S3
await fileMigrationController.markUploaded(dados);
```

## 🛡️ Estrutura de Controle

### Tabelas no PostgreSQL (SaaS)

```sql
-- Controle de migração recebida
CREATE TABLE migration_controle (
    id SERIAL PRIMARY KEY,
    empresa_origem_id INTEGER NOT NULL,
    empresa_destino_id INTEGER NOT NULL,
    tabela VARCHAR(100) NOT NULL,
    registro_origem_id VARCHAR(50) NOT NULL,
    registro_destino_id INTEGER,
    data_migracao TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'PENDENTE',
    batch_id VARCHAR(50),
    erro_mensagem TEXT,
    UNIQUE(empresa_origem_id, tabela, registro_origem_id)
);

-- Mapeamento de IDs para relacionamentos
CREATE TABLE migration_id_mapping (
    id SERIAL PRIMARY KEY,
    empresa_origem_id INTEGER NOT NULL,
    empresa_destino_id INTEGER NOT NULL,
    tabela_origem VARCHAR(100) NOT NULL,
    tabela_destino VARCHAR(100) NOT NULL,
    id_origem VARCHAR(50) NOT NULL,
    id_destino INTEGER NOT NULL,
    data_criacao TIMESTAMP DEFAULT NOW(),
    UNIQUE(empresa_origem_id, tabela_origem, id_origem)
);

-- Controle de migração de arquivos
CREATE TABLE migration_arquivo (
    id SERIAL PRIMARY KEY,
    empresa_origem_id INTEGER NOT NULL,
    empresa_destino_id INTEGER NOT NULL,
    tabela VARCHAR(100) NOT NULL,
    registro_id VARCHAR(50) NOT NULL,
    campo VARCHAR(100) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo_arquivo VARCHAR(100) NOT NULL,
    tamanho_arquivo BIGINT NOT NULL,
    url_s3 TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'SALVO_LOCAL',
    batch_id VARCHAR(50),
    erro_mensagem TEXT,
    metadados TEXT,
    data_migracao TIMESTAMP DEFAULT NOW(),
    UNIQUE(empresa_origem_id, tabela, registro_id, campo)
);
```

## 🎯 Vantagens da Abordagem Especializada

### 1. **Qualidade de Dados**
- Validação real de CPF/CNPJ
- Formatação padronizada de endereços
- Validação de telefones internacionais
- Normalização de textos

### 2. **Manutenibilidade**
- Cada entidade tem seu próprio controller
- Mudanças em uma não afetam as outras
- Testes isolados por entidade
- Código mais limpo e organizado

### 3. **Performance**
- Processamento paralelo por entidade
- Cache de mapeamentos em memória
- Validações otimizadas
- Menos dependências entre módulos

### 4. **Extensibilidade**
- Fácil adicionar novas entidades
- Validações específicas por tipo
- Reutilização em outros contextos
- Flexibilidade para diferentes regras

## 📈 Plano de Implementação

### Fase 1: Infraestrutura (✅ Concluído)
- [x] Criar controllers especializados
- [x] Implementar validações específicas
- [x] Configurar estrutura base
- [x] Atualizar rotas e endpoints

### Fase 2: Testes
- [ ] Testar validações de CPF/CNPJ
- [ ] Testar formatação de endereços
- [ ] Testar validação de telefones
- [ ] Testar migração completa

### Fase 3: Produção
- [ ] Deploy da nova estrutura
- [ ] Migração piloto
- [ ] Monitoramento e ajustes
- [ ] Documentação completa

## 🔍 Monitoramento e Auditoria

### Métricas por Entidade
```typescript
// Status detalhado
GET /api/migration/status/1
{
  "porTabela": [
    {
      "tabela": "PESSOA",
      "total": 1000,
      "sucesso": 950,
      "erros": 50,
      "duplicados": 0
    },
    {
      "tabela": "PESSOA_ENDERECO", 
      "total": 800,
      "sucesso": 780,
      "erros": 20,
      "duplicados": 0
    }
  ]
}
```

### Logs de Validação
- CPFs inválidos detectados
- CEPs não encontrados
- Telefones com formato incorreto
- Registros duplicados

## 🎉 Conclusão

A nova arquitetura especializada proporciona:
- **Maior qualidade** na validação de dados
- **Manutenção simplificada** por separação de responsabilidades
- **Performance otimizada** com processamento paralelo
- **Extensibilidade** para futuras entidades
- **Robustez** no tratamento de erros

Esta estrutura está pronta para produção e pode ser estendida facilmente para outras entidades do sistema.

### 2. Processo de Migração

#### Fase 1: Tabelas Pai
- Migrar registros principais (pessoa, empresa, produto)
- Salvar mapeamento de IDs
- Confirmar sucesso

#### Fase 2: Tabelas Filho
- Consultar mapeamento de IDs pais
- Substituir FKs originais pelos novos IDs
- Migrar registros filhos

#### Fase 3: Validação
- Comparar totais
- Verificar integridade referencial
- Gerar relatórios

## API de Migração

### Endpoints Principais

```typescript
// POST /api/migration/import
interface MigrationRequest {
  empresaId: number;
  tabela: string;
  dados: any[];
  metadados: {
    versaoSistema: string;
    dataMigracao: string;
    registrosTotal: number;
    batchId?: string;
  };
}

// GET /api/migration/status/:empresaId
interface MigrationStatus {
  empresa: {
    totalTabelas: number;
    tabelasMigradas: number;
    totalRegistros: number;
    registrosMigrados: number;
  };
  tabelas: Array<{
    nome: string;
    totalRegistros: number;
    registrosMigrados: number;
    erros: number;
    ultimaMigracao: string;
  }>;
}

// POST /api/migration/validate/:batchId
interface ValidationRequest {
  tabela: string;
  idsOrigem: string[];
}
```

## Estratégia de Mapeamento de IDs

### Mapa em Memória

```typescript
class IDMappingService {
  private idMap = new Map<string, number>();
  
  // Chave: `${empresaOrigem}:${tabela}:${idOrigem}`
  // Valor: idDestino
  
  salvarMapping(empresaOrigem: number, tabela: string, 
                idOrigem: string, idDestino: number): void {
    const key = `${empresaOrigem}:${tabela}:${idOrigem}`;
    this.idMap.set(key, idDestino);
  }
  
  obterDestino(empresaOrigem: number, tabela: string, 
               idOrigem: string): number | null {
    const key = `${empresaOrigem}:${tabela}:${idOrigem}`;
    return this.idMap.get(key) || null;
  }
  
  // Para FKs: converter array de IDs
  converterFKs(empresaOrigem: number, tabelaOrigem: string, 
               idsOrigem: string[]): number[] {
    return idsOrigem
      .map(id => this.obterDestino(empresaOrigem, tabelaOrigem, id))
      .filter(id => id !== null) as number[];
  }
}
```

## Exemplo Prático: Migração de Pessoa → Endereço

### 1. Migração de Pessoas (Tabela Pai)

```typescript
// Receber dados do legado
const pessoas = [
  {
    id: "123",
    nome: "João Silva",
    cpf: "12345678900",
    // ... outros campos
  }
];

// Processar migração
for (const pessoa of pessoas) {
  const novaPessoa = await Pessoa.create({
    nome: pessoa.nome,
    cpf: pessoa.cpf,
    empresaId: empresaDestino
  });
  
  // Salvar mapeamento
  await MigrationIDMapping.create({
    empresa_origem_id: empresaOrigem,
    empresa_destino_id: empresaDestino,
    tabela_origem: 'PESSOA',
    tabela_destino: 'pessoa',
    id_origem: pessoa.id,
    id_destino: novaPessoa.id
  });
}
```

### 2. Migração de Endereços (Tabela Filha)

```typescript
// Receber dados do legado
const enderecos = [
  {
    id: "456",
    pessoa_id: "123", // FK original
    logradouro: "Rua A",
    numero: "100",
    // ... outros campos
  }
];

// Processar migração com conversão de FK
for (const endereco of enderecos) {
  // Obter novo ID da pessoa
  const mapping = await MigrationIDMapping.findOne({
    where: {
      empresa_origem_id: empresaOrigem,
      tabela_origem: 'PESSOA',
      id_origem: endereco.pessoa_id
    }
  });
  
  if (mapping) {
    const novoEndereco = await Endereco.create({
      pessoa_id: mapping.id_destino, // FK convertida
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      empresaId: empresaDestino
    });
    
    // Salvar mapeamento do endereço
    await MigrationIDMapping.create({
      empresa_origem_id: empresaOrigem,
      empresa_destino_id: empresaDestino,
      tabela_origem: 'ENDERECO',
      tabela_destino: 'endereco',
      id_origem: endereco.id,
      id_destino: novoEndereco.id
    });
  }
}
```

## Estratégia de Retentativas e Erros

### Tratamento de Falhas

1. **Validação Prévia**: Verificar estrutura dos dados
2. **Transações**: Usar transações para consistência
3. **Rollback**: Desfazer em caso de erro crítico
4. **Log Detalhado**: Registrar todos os erros
5. **Retentativas Automáticas**: 3 tentativas com delays

### Códigos de Erro

- `VALIDATION_ERROR`: Dados inválidos
- `FK_NOT_FOUND`: Chave estrangeira não encontrada
- `DUPLICATE_RECORD`: Registro duplicado
- `TRANSFORMATION_ERROR`: Erro na transformação
- `DATABASE_ERROR`: Erro no banco

## Performance e Otimização

### Estratégias

1. **Processamento em Lotes**: 100-500 registros por vez
2. **Índices Otimizados**: Para consultas frequentes
3. **Cache de Mapeamento**: Manter mapa em memória
4. **Processamento Paralelo**: Múltiplas empresas simultâneas
5. **Limitação de Rate**: Evitar sobrecarga

### Índices Recomendados

```sql
-- No PostgreSQL
CREATE INDEX idx_migration_controle_busca 
ON migration_controle(empresa_origem_id, tabela, status);

CREATE INDEX idx_migration_mapping_busca 
ON migration_id_mapping(empresa_origem_id, tabela_origem, id_origem);

-- No Firebird
CREATE INDEX IDX_MIGRATION_PENDENTES 
ON MIGRATION_CONTROLE(EMPRESA_ID, TABELA, STATUS, REGISTRO_ID);
```

## Monitoramento e Auditoria

### Relatórios

1. **Progresso Geral**: Por empresa e tabela
2. **Taxa de Sucesso**: Percentual de migração concluída
3. **Erros por Tipo**: Análise de falhas
4. **Performance**: Tempo por lote
5. **Integridade**: Verificação de FKs

### Alertas

- Migrações paradas por mais de X horas
- Taxa de erro acima de Y%
- Diferença nos totais de registros
- Falhas consecutivas

## Plano de Implementação

### Fase 1: Infraestrutura (1 semana)
- Criar tabelas de controle
- Implementar endpoints básicos
- Configurar ambiente

### Fase 2: Piloto (2 semanas)
- Migrar 1 empresa completa
- Testar todas as tabelas
- Ajustar estratégia

### Fase 3: Massivo (4-6 semanas)
- Migrar empresas em paralelo
- Monitorar performance
- Tratar exceções

### Fase 4: Consolidação (1 semana)
- Validação final
- Relatórios de auditoria
- Limpeza de dados

## Considerações de Segurança

1. **Autenticação**: Tokens para API
2. **Autorização**: Controle por empresa
3. **Criptografia**: Dados sensíveis
4. **Audit Trail**: Log de todas as operações
5. **Backup**: Backup antes da migração

## Conclusão

Esta estratégia proporciona uma migração controlada, segura e auditável, com capacidade de recuperação e monitoramento completo do processo.
