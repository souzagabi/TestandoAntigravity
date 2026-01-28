# Teste de Migração - Pessoa, Endereço e Telefone

## Descrição

Este documento descreve o processo completo de teste da migração de dados do sistema legado para o ERP SaaS utilizando a nova arquitetura especializada, mantendo a integridade dos relacionamentos.

## 🏗️ Nova Arquitetura de Teste

### Controllers Especializados
- **PessoaMigrationController**: Valida CPF/CNPJ, normaliza nomes
- **EnderecoMigrationController**: Valida CEP/UF, formata endereços  
- **TelefoneMigrationController**: Valida telefones internacionais
- **MigrationController**: Orquestrador principal

### Estrutura de Teste
```
1. Gerar dados de teste
2. Importar pessoas (validação CPF/CNPJ)
3. Importar endereços (validação CEP/UF)
4. Importar telefones (validação internacional)
5. Verificar status e relacionamentos
```

## 📋 Estrutura do Teste

### 1. Dados de Teste

#### Pessoas (Tabela Pai) - Com Validações
```json
[
  {
    "id": "1001",
    "tipoPessoa": "F",
    "nomeRazao": "João da Silva Teste",
    "cpfCnpj": "123.456.789-09", // Será validado
    "rgIe": "MG-12.345.678",
    "dataNascimento": "1980-01-15",
    "genero": "M", // Mapeado para 'sexo'
    "estadoCivil": "S",
    "nacionalidade": "Brasileira",
    "email": "joao.silva@email.com", // Será validado
    "stAtivo": true,
    "observacoes": "Pessoa de teste para migração"
  },
  {
    "id": "1002",
    "tipoPessoa": "J",
    "nomeRazao": "Empresa Teste S.A.",
    "cpfCnpj": "12.345.678/0001-90", // Será validado
    "rgIe": "ISENTO",
    "email": "contato@empresateste.com.br", // Será validado
    "site": "www.empresateste.com.br",
    "stAtivo": true,
    "observacoes": "Empresa de teste para migração"
  }
]
```

#### Endereços (Tabela Filha) - Com Validações
```json
[
  {
    "id": "2001",
    "pessoaId": "1001",
    "descricao": "Residencial",
    "logradouro": "Rua das Flores",
    "numero": "123",
    "complemento": "Apto 45",
    "bairro": "Centro",
    "cep": "30100000", // Será formatado para 30100-000
    "localidade": "Belo Horizonte",
    "uf": "mg", // Será validado e convertido para MG
    "pais": "Brasil",
    "stPrincipal": true
  },
  {
    "id": "2002",
    "pessoaId": "1002",
    "descricao": "Comercial",
    "logradouro": "Avenida Paulista",
    "numero": "1000",
    "complemento": "Sala 500",
    "bairro": "Bela Vista",
    "cep": "01310000", // Será formatado para 01310-000
    "localidade": "São Paulo",
    "uf": "sp", // Será validado e convertido para SP
    "pais": "Brasil",
    "stPrincipal": true
  }
]
```

#### Telefones (Tabela Filha) - Com Validações
```json
[
  {
    "id": "3001",
    "pessoaId": "1001",
    "descricao": "Celular",
    "telefoneTipo": "CELULAR", // Será normalizado
    "telefonePais": "+55", // Será validado
    "telefone": "31987654321", // Será formatado
    "stPrincipal": true
  },
  {
    "id": "3002",
    "pessoaId": "1002",
    "descricao": "Comercial",
    "telefoneTipo": "COMERCIAL", // Será normalizado
    "telefonePais": "+55", // Será validado
    "telefone": "1131234567", // Será formatado
    "stPrincipal": true
  },
  {
    "id": "3003",
    "pessoaId": "1001",
    "descricao": "Internacional",
    "telefoneTipo": "CELULAR",
    "telefonePais": "+1", // Será validado
    "telefone": "2125551234", // Será formatado
    "stPrincipal": false
  }
]
```

## 🧪 Testes de Validação

### Teste 1: Validação CPF/CNPJ
```bash
# CPF inválido - deve retornar erro
curl -X POST http://localhost:3000/api/migration/import/pessoas \
  -H "Content-Type: application/json" \
  -d '{
    "empresaOrigem": 1,
    "pessoas": [{
      "id": "1003",
      "tipoPessoa": "F",
      "nomeRazao": "Teste CPF Inválido",
      "cpfCnpj": "111.111.111-11", // CPF inválido
      "stAtivo": true
    }]
  }'

# Response esperado:
{
  "success": false,
  "message": "Erro ao migrar pessoas",
  "data": [{
    "idOrigem": "1003",
    "status": "ERRO",
    "mensagem": "Erro ao migrar pessoa: CPF/CNPJ inválido: 111.111.111-11"
  }]
}
```

### Teste 2: Validação CEP
```bash
# CEP inválido - deve retornar erro
curl -X POST http://localhost:3000/api/migration/import/enderecos \
  -H "Content-Type: application/json" \
  -d '{
    "empresaOrigem": 1,
    "enderecos": [{
      "id": "2003",
      "pessoaId": "1001",
      "descricao": "Teste CEP Inválido",
      "logradouro": "Rua Teste",
      "numero": "123",
      "cep": "99999999", // CEP inválido
      "localidade": "Cidade Teste",
      "uf": "XX" // UF inválida
    }]
  }'

# Response esperado:
{
  "success": false,
  "message": "Erro ao migrar endereços",
  "data": [{
    "idOrigem": "2003",
    "status": "ERRO",
    "mensagem": "Erro ao migrar endereço: CEP inválido: 99999999"
  }]
}
```

### Teste 3: Validação Telefone Internacional
```bash
# Código de país inválido - deve retornar erro
curl -X POST http://localhost:3000/api/migration/import/telefones \
  -H "Content-Type: application/json" \
  -d '{
    "empresaOrigem": 1,
    "telefones": [{
      "id": "3004",
      "pessoaId": "1001",
      "descricao": "Teste Código Inválido",
      "telefoneTipo": "CELULAR",
      "telefonePais": "+999", // Código inválido
      "telefone": "12345678"
    }]
  }'

# Response esperado:
{
  "success": false,
  "message": "Erro ao migrar telefones",
  "data": [{
    "idOrigem": "3004",
    "status": "ERRO",
    "mensagem": "Erro ao migrar telefone: Código do país inválido: +999"
  }]
}
```

## 🔄 Fluxo de Teste Completo

### Passo 1: Gerar Dados de Teste
```bash
# Gerar dados mockados
curl -X GET http://localhost:3000/api/migration/test/1

# Response esperado:
{
  "success": true,
  "message": "Dados de teste gerados com sucesso",
  "data": {
    "empresaOrigem": 1,
    "pessoas": [...],
    "enderecos": [...],
    "telefones": [...],
    "batchId": "batch_1641748400000_abc123"
  }
}
```

### Passo 2: Importar Pessoas (Validação CPF/CNPJ)
```bash
curl -X POST http://localhost:3000/api/migration/import/pessoas \
  -H "Content-Type: application/json" \
  -d '{
    "empresaOrigem": 1,
    "pessoas": [
      {
        "id": "1001",
        "tipoPessoa": "F",
        "nomeRazao": "João da Silva Teste",
        "cpfCnpj": "123.456.789-09",
        "email": "joao.silva@email.com",
        "stAtivo": true
      }
    ]
  }'

# Response esperado:
{
  "success": true,
  "message": "Pessoas migradas com sucesso",
  "data": {
    "batchId": "batch_1641748400000_abc123",
    "totais": {
      "total": 1,
      "sucesso": 1,
      "erros": 0,
      "duplicados": 0
    },
    "resultados": [{
      "idOrigem": "1001",
      "idDestino": 1,
      "status": "SUCESSO",
      "mensagem": "Pessoa migrada com sucesso",
      "dados": {
        "pessoaId": 1,
        "nomeRazao": "João da Silva Teste",
        "cpfCnpj": "12345678909" // Limpo e validado
      }
    }]
  }
}
```

### Passo 3: Importar Endereços (Validação CEP/UF)
```bash
curl -X POST http://localhost:3000/api/migration/import/enderecos \
  -H "Content-Type: application/json" \
  -d '{
    "empresaOrigem": 1,
    "enderecos": [
      {
        "id": "2001",
        "pessoaId": "1001",
        "descricao": "Residencial",
        "logradouro": "Rua das Flores",
        "numero": "123",
        "cep": "30100000",
        "localidade": "Belo Horizonte",
        "uf": "mg"
      }
    ]
  }'

# Response esperado:
{
  "success": true,
  "message": "Endereços migrados com sucesso",
  "data": {
    "batchId": "batch_1641748400000_abc123",
    "totais": {
      "total": 1,
      "sucesso": 1,
      "erros": 0,
      "duplicados": 0
    },
    "resultados": [{
      "idOrigem": "2001",
      "idDestino": 1,
      "status": "SUCESSO",
      "mensagem": "Endereço migrado com sucesso",
      "dados": {
        "enderecoId": 1,
        "pessoaId": 1, // ID mapeado corretamente
        "cep": "30100-000", // Formatado
        "uf": "MG" // Validado e convertido
      }
    }]
  }
}
```

### Passo 4: Importar Telefones (Validação Internacional)
```bash
curl -X POST http://localhost:3000/api/migration/import/telefones \
  -H "Content-Type: application/json" \
  -d '{
    "empresaOrigem": 1,
    "telefones": [
      {
        "id": "3001",
        "pessoaId": "1001",
        "descricao": "Celular",
        "telefoneTipo": "CELULAR",
        "telefonePais": "+55",
        "telefone": "31987654321"
      },
      {
        "id": "3003",
        "pessoaId": "1001",
        "descricao": "Internacional",
        "telefoneTipo": "CELULAR",
        "telefonePais": "+1",
        "telefone": "2125551234"
      }
    ]
  }'

# Response esperado:
{
  "success": true,
  "message": "Telefones migrados com sucesso",
  "data": {
    "batchId": "batch_1641748400000_abc123",
    "totais": {
      "total": 2,
      "sucesso": 2,
      "erros": 0,
      "duplicados": 0
    },
    "resultados": [{
      "idOrigem": "3001",
      "idDestino": 1,
      "status": "SUCESSO",
      "dados": {
        "telefoneId": 1,
        "pessoaId": 1, // ID mapeado corretamente
        "telefone": "31987654321", // Formatado
        "telefonePais": "+55" // Validado
      }
    }, {
      "idOrigem": "3003",
      "idDestino": 2,
      "status": "SUCESSO",
      "dados": {
        "telefoneId": 2,
        "pessoaId": 1,
        "telefone": "2125551234", // Internacional validado
        "telefonePais": "+1"
      }
    }]
  }
}
```

### Passo 5: Verificar Status Completo
```bash
curl -X GET http://localhost:3000/api/migration/status/1

# Response esperado:
{
  "success": true,
  "message": "Status da migração obtido com sucesso",
  "data": {
    "porTabela": [
      {
        "tabela": "PESSOA",
        "total": 1,
        "sucesso": 1,
        "erros": 0,
        "duplicados": 0
      },
      {
        "tabela": "PESSOA_ENDERECO",
        "total": 1,
        "sucesso": 1,
        "erros": 0,
        "duplicados": 0
      },
      {
        "tabela": "PESSOA_TELEFONE",
        "total": 2,
        "sucesso": 2,
        "erros": 0,
        "duplicados": 0
      }
    ],
    "totais": {
      "total": 4,
      "sucesso": 4,
      "erros": 0,
      "duplicados": 0,
      "ultimaMigracao": "2025-01-09T16:00:00.000Z"
    }
  }
}
```

## 📊 Scripts de Teste Automatizados

### Script Completo (test-migration.sh)
```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
EMPRESA_ORIGEM="1"

echo "🧪 Iniciando teste de migração especializada..."

# Passo 1: Gerar dados de teste
echo "📝 Gerando dados de teste..."
RESPONSE=$(curl -s -X GET "$BASE_URL/api/migration/test/$EMPRESA_ORIGEM")
BATCH_ID=$(echo $RESPONSE | jq -r '.data.batchId')

echo "✅ Batch ID: $BATCH_ID"

# Passo 2: Importar pessoas
echo "👤 Importando pessoas..."
PESSOAS=$(echo $RESPONSE | jq -r '.data.pessoas | .[] | {id: .id, nomeRazao: .nomeRazao, cpfCnpj: .cpfCnpj}')

curl -s -X POST "$BASE_URL/api/migration/import/pessoas" \
  -H "Content-Type: application/json" \
  -d "{
    \"empresaOrigem\": $EMPRESA_ORIGEM,
    \"pessoas\": $(echo $RESPONSE | jq '.data.pessoas')
  }" | jq '.'

# Passo 3: Importar enderecos
echo "🏠 Importando endereços..."
curl -s -X POST "$BASE_URL/api/migration/import/enderecos" \
  -H "Content-Type: application/json" \
  -d "{
    \"empresaOrigem\": $EMPRESA_ORIGEM,
    \"enderecos\": $(echo $RESPONSE | jq '.data.enderecos')
  }" | jq '.'

# Passo 4: Importar telefones
echo "📞 Importando telefones..."
curl -s -X POST "$BASE_URL/api/migration/import/telefones" \
  -H "Content-Type: application/json" \
  -d "{
    \"empresaOrigem\": $EMPRESA_ORIGEM,
    \"telefones\": $(echo $RESPONSE | jq '.data.telefones')
  }" | jq '.'

# Passo 5: Verificar status
echo "📊 Verificando status final..."
curl -s -X GET "$BASE_URL/api/migration/status/$EMPRESA_ORIGEM" | jq '.'

echo "🎉 Teste concluído!"
```

### Script de Validação (test-validations.sh)
```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
EMPRESA_ORIGEM="1"

echo "🔍 Testando validações especializadas..."

# Teste CPF inválido
echo "📄 Testando CPF inválido..."
curl -s -X POST "$BASE_URL/api/migration/import/pessoas" \
  -H "Content-Type: application/json" \
  -d '{
    "empresaOrigem": 1,
    "pessoas": [{
      "id": "9999",
      "tipoPessoa": "F",
      "nomeRazao": "Teste CPF Inválido",
      "cpfCnpj": "111.111.111-11",
      "stAtivo": true
    }]
  }' | jq -r '.data.resultados[0].mensagem'

# Teste CEP inválido
echo "🏠 Testando CEP inválido..."
curl -s -X POST "$BASE_URL/api/migration/import/enderecos" \
  -H "Content-Type: application/json" \
  -d '{
    "empresaOrigem": 1,
    "enderecos": [{
      "id": "9999",
      "pessoaId": "9999",
      "descricao": "Teste CEP Inválido",
      "logradouro": "Rua Teste",
      "numero": "123",
      "cep": "99999999",
      "localidade": "Cidade Teste",
      "uf": "XX"
    }]
  }' | jq -r '.data.resultados[0].mensagem'

# Teste código país inválido
echo "📞 Testando código país inválido..."
curl -s -X POST "$BASE_URL/api/migration/import/telefones" \
  -H "Content-Type: application/json" \
  -d '{
    "empresaOrigem": 1,
    "telefones": [{
      "id": "9999",
      "pessoaId": "9999",
      "descricao": "Teste Código Inválido",
      "telefoneTipo": "CELULAR",
      "telefonePais": "+999",
      "telefone": "12345678"
    }]
  }' | jq -r '.data.resultados[0].mensagem'

echo "✅ Testes de validação concluídos!"
```

## 🎯 Cenários de Teste

### Cenário 1: Migração Completa com Sucesso
- **Objetivo**: Validar fluxo completo com dados válidos
- **Resultado Esperado**: Todos os registros migrados com sucesso
- **Validação**: Relacionamentos mantidos, dados normalizados

### Cenário 2: Validações de Dados
- **Objetivo**: Testar validações específicas de cada controller
- **Resultado Esperado**: Erros específicos para dados inválidos
- **Validação**: Mensagens de erro claras e específicas

### Cenário 3: Duplicatas
- **Objetivo**: Testar controle de duplicatas
- **Resultado Esperado**: Registros duplicados marcados como tal
- **Validação**: Nenhupamento de dados evitado

### Cenário 4: Relacionamentos
- **Objetivo**: Testar mapeamento correto de IDs
- **Resultado Esperado**: Endereços e telefones vinculados às pessoas corretas
- **Validação**: Integridade referencial mantida

## 📋 Verificação SQL

### Verificar Dados Migrados
```sql
-- Verificar pessoas migradas
SELECT pessoa_id, nome_razao, cpf_cnpj, external_id, st_ativo
FROM pessoa 
WHERE external_id IN ('1001', '1002')
ORDER BY pessoa_id;

-- Verificar endereços com relacionamento
SELECT e.endereco_id, e.pessoa_id, p.nome_razao, e.logradouro, e.cep, e.uf
FROM pessoa_endereco e
JOIN pessoa p ON e.pessoa_id = p.pessoa_id
WHERE p.external_id IN ('1001', '1002');

-- Verificar telefones com relacionamento
SELECT t.telefone_id, t.pessoa_id, p.nome_razao, t.telefone, t.telefone_pais
FROM pessoa_telefone t
JOIN pessoa p ON t.pessoa_id = p.pessoa_id
WHERE p.external_id IN ('1001', '1002');

-- Verificar controle de migração
SELECT tabela, registro_origem_id, registro_destino_id, status, data_migracao
FROM migration_controle
WHERE empresa_origem_id = 1
ORDER BY tabela, data_migracao;

-- Verificar mapeamento de IDs
SELECT tabela_origem, id_origem, tabela_destino, id_destino
FROM migration_id_mapping
WHERE empresa_origem_id = 1
ORDER BY tabela_origem, id_origem;
```

## 🎉 Resultados Esperados

### ✅ Teste Bem-Sucedido
- **4 registros** migrados com sucesso
- **Validações específicas** funcionando corretamente
- **Relacionamentos** mantidos
- **Dados normalizados** (CPF, CEP, telefones)
- **Controle completo** da migração

### 🔍 Validações Testadas
- **CPF/CNPJ**: Algoritmo real de validação
- **CEP**: Formatação e validação de dígitos
- **UF**: Validação de códigos brasileiros
- **Telefone**: Validação de códigos internacionais
- **Email**: Validação de formato
- **Tipos**: Normalização de tipos de telefone

### 📊 Métricas de Performance
- **Tempo de migração**: < 1 segundo para 4 registros
- **Validações**: < 100ms por registro
- **Mapeamento**: Cache em memória para lookup
- **Transações**: ACID garantido para cada entidade

## 🚀 Próximos Passos

1. **Executar scripts automatizados**
2. **Validar com volume real de dados**
3. **Testar cenários de erro**
4. **Documentar resultados**
5. **Preparar para produção**

Esta estrutura de teste valida completamente a nova arquitetura especializada, garantindo que todas as validações específicas funcionem corretamente e que a integridade dos dados seja mantida durante todo o processo de migração.
    "stPrincipal": true
  }
]
```

### 2. Passos do Teste

#### Passo 1: Gerar Dados de Teste
```bash
GET /api/migration/test/1
```

#### Passo 2: Migrar Pessoas (Tabela Pai)
```bash
POST /api/migration/import
Content-Type: application/json

{
  "empresaId": 1,
  "tabela": "pessoa",
  "dados": [/* dados das pessoas */],
  "metadados": {
    "versaoSistema": "1.0.0",
    "dataMigracao": "2025-01-09T15:00:00Z",
    "registrosTotal": 2,
    "batchId": "batch_pessoas_001"
  }
}
```

#### Passo 3: Migrar Endereços (Tabela Filha)
```bash
POST /api/migration/import
Content-Type: application/json

{
  "empresaId": 1,
  "tabela": "endereco",
  "dados": [/* dados dos endereços */],
  "metadados": {
    "versaoSistema": "1.0.0",
    "dataMigracao": "2025-01-09T15:05:00Z",
    "registrosTotal": 2,
    "batchId": "batch_enderecos_001"
  }
}
```

#### Passo 4: Migrar Telefones (Tabela Filha)
```bash
POST /api/migration/import
Content-Type: application/json

{
  "empresaId": 1,
  "tabela": "telefone",
  "dados": [/* dados dos telefones */],
  "metadados": {
    "versaoSistema": "1.0.0",
    "dataMigracao": "2025-01-09T15:10:00Z",
    "registrosTotal": 2,
    "batchId": "batch_telefones_001"
  }
}
```

#### Passo 5: Verificar Status
```bash
GET /api/migration/status/1
```

### 3. Resultados Esperados

#### Resposta da Migração de Pessoas
```json
{
  "success": true,
  "message": "Migração da tabela pessoa concluída",
  "data": {
    "batchId": "batch_pessoas_001",
    "estatisticas": {
      "total": 2,
      "sucesso": 2,
      "erros": 0,
      "duplicados": 0
    },
    "resultados": [
      {
        "idOrigem": "1001",
        "idDestino": 123,
        "status": "SUCESSO",
        "mensagem": "Pessoa migrada com sucesso"
      },
      {
        "idOrigem": "1002",
        "idDestino": 124,
        "status": "SUCESSO",
        "mensagem": "Pessoa migrada com sucesso"
      }
    ]
  }
}
```

#### Resposta da Migração de Endereços
```json
{
  "success": true,
  "message": "Migração da tabela endereco concluída",
  "data": {
    "batchId": "batch_enderecos_001",
    "estatisticas": {
      "total": 2,
      "sucesso": 2,
      "erros": 0,
      "duplicados": 0
    },
    "resultados": [
      {
        "idOrigem": "2001",
        "idDestino": 456,
        "status": "SUCESSO",
        "mensagem": "Endereço migrado com sucesso"
      },
      {
        "idOrigem": "2002",
        "idDestino": 457,
        "status": "SUCESSO",
        "mensagem": "Endereço migrado com sucesso"
      }
    ]
  }
}
```

#### Resposta da Migração de Telefones
```json
{
  "success": true,
  "message": "Migração da tabela telefone concluída",
  "data": {
    "batchId": "batch_telefones_001",
    "estatisticas": {
      "total": 2,
      "sucesso": 2,
      "erros": 0,
      "duplicados": 0
    },
    "resultados": [
      {
        "idOrigem": "3001",
        "idDestino": 789,
        "status": "SUCESSO",
        "mensagem": "Telefone migrado com sucesso"
      },
      {
        "idOrigem": "3002",
        "idDestino": 790,
        "status": "SUCESSO",
        "mensagem": "Telefone migrado com sucesso"
      }
    ]
  }
}
```

### 4. Verificação no Banco de Dados

#### Tabela migration_controle
```sql
SELECT * FROM migration_controle 
WHERE empresa_origem_id = 1 
ORDER BY tabela, id;
```

#### Tabela migration_id_mapping
```sql
SELECT * FROM migration_id_mapping 
WHERE empresa_origem_id = 1 
ORDER BY tabela_origem, id_origem;
```

#### Tabelas de Destino
```sql
-- Pessoas migradas
SELECT pessoa_id, nome_razao, external_id 
FROM pessoa 
WHERE external_id LIKE '1_%';

-- Endereços migrados
SELECT e.endereco_id, e.pessoa_id, e.logradouro, p.nome_razao 
FROM pessoa_endereco e
JOIN pessoa p ON e.pessoa_id = p.pessoa_id
WHERE p.external_id LIKE '1_%';

-- Telefones migrados
SELECT t.telefone_id, t.pessoa_id, t.telefone, p.nome_razao 
FROM pessoa_telefone t
JOIN pessoa p ON t.pessoa_id = p.pessoa_id
WHERE p.external_id LIKE '1_%';
```

### 5. Cenários de Teste

#### Cenário 1: Migração Completa com Sucesso
- Todas as pessoas são migradas
- Endereços e telefones são vinculados corretamente
- Mapeamento de IDs funciona perfeitamente

#### Cenário 2: Tentativa de Duplicação
- Executar a mesma migração novamente
- Sistema deve identificar registros já migrados
- Retornar status "DUPLICADO"

#### Cenário 3: Migração com FK Inválida
- Tentar migrar endereço com pessoaId inexistente
- Sistema deve retornar erro
- Registro marcado como "ERRO" no controle

#### Cenário 4: Migração Parcial
- Migrar apenas algumas pessoas
- Tentar migrar endereços das pessoas não migradas
- Sistema deve identificar FKs não encontradas

### 6. Scripts de Teste Automatizados

#### Script Bash para Teste Completo
```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api/migration"
EMPRESA_ORIGEM="1"
EMPRESA_DESTINO="1"

echo "=== Iniciando Teste de Migração ==="

# 1. Gerar dados de teste
echo "1. Gerando dados de teste..."
curl -s "$BASE_URL/test/$EMPRESA_ORIGEM" | jq .

# 2. Migrar pessoas
echo "2. Migrando pessoas..."
curl -s -X POST "$BASE_URL/import" \
  -H "Content-Type: application/json" \
  -d '{
    "empresaId": '$EMPRESA_DESTINO',
    "tabela": "pessoa",
    "dados": [
      {
        "id": "1001",
        "tipoPessoa": "F",
        "nomeRazao": "João da Silva Teste",
        "cpfCnpj": "12345678901",
        "stAtivo": true
      }
    ],
    "metadados": {
      "versaoSistema": "1.0.0",
      "dataMigracao": "2025-01-09T15:00:00Z",
      "registrosTotal": 1,
      "batchId": "batch_test_001"
    }
  }' | jq .

# 3. Verificar status
echo "3. Verificando status..."
curl -s "$BASE_URL/status/$EMPRESA_ORIGEM" | jq .

echo "=== Teste Concluído ==="
```

### 7. Validações Importantes

1. **Integridade Referencial**: FKs devem ser convertidas corretamente
2. **Controle de Duplicatas**: Registros já migrados não devem ser duplicados
3. **Tratamento de Erros**: Erros devem ser registrados e não bloquear o processo
4. **Performance**: Migração em lote deve ser eficiente
5. **Auditabilidade**: Todas as operações devem ser rastreadas

### 8. Próximos Passos

1. **Implementar retentativas automáticas**
2. **Adicionar validações de dados**
3. **Implementar rollback em caso de erro crítico**
4. **Criar interface de monitoramento**
5. **Implementar migração incremental (delta)**

Este teste demonstra a capacidade do sistema de migrar dados complexos com relacionamentos, mantendo a integridade e fornecendo controle total do processo.
