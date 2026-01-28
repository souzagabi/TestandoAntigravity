# Módulo Financeiro - Guia de Implementação

Documento de referência para implementação do módulo financeiro do ERP, consolidando decisões, fluxos e estratégias definidas.

## 1. Visão Geral

O módulo financeiro gerencia:

- **Contas a Receber** - Parcelas em carteira, boletos, cheques, cartões, conta corrente
- **Contas a Pagar** - Parcelas em carteira, boletos, cheques, conta corrente
- **Cheques** - Recebidos e emitidos
- **Cartões de Crédito** - Parcelas de operadoras
- **Créditos** - Saldos de clientes e fornecedores
- **Conta Corrente** - Registro de débitos/créditos entre partes com fechamento periódico
- **Acordos Financeiros** - Renegociação de dívidas
- **Integração Contábil** - Lançamentos automáticos

## 1.1 Controllers e Rotas (Guia para não confundir endpoints)

O módulo financeiro possui **mais de um controller** operando sobre o mesmo modelo base `mov_movimento_parcela`, porém com **finalidades diferentes**.

Este guia existe para evitar um erro comum: **alterar um controller achando que a tela/endpoint usa outro**.

### 1.1.1 Regra de ouro

- Se a tela chama `GET /api/financeiro/contas-receber`, então o controller é o **CarteiraReceberController** (arquivo `server/src/controller/financeiro/carteiraReceberController.ts`).
- Se a tela chama `GET /api/financeiro/contas-pagar`, então o controller é o **CarteiraPagarController** (arquivo `server/src/controller/financeiro/carteiraPagarController.ts`).
- Se a tela chama `GET /api/financeiro/parcelas`, então o controller é o **FinanceiroParcelaController** (arquivo `server/src/controller/financeiro/financeiroParcelaController.ts`).

### 1.1.2 Mapa de rotas (fonte: `server/src/routes/financeiro/financeiroRoutes.ts`)

#### Rotas genéricas de parcelas

| Rota                                                | Controller                                  | Observação                                        |
| --------------------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| `GET /api/financeiro/parcelas`                      | `FinanceiroParcelaController.findAll`       | Listagem genérica (pode englobar múltiplos tipos) |
| `GET /api/financeiro/parcelas/:parcelaId`           | `FinanceiroParcelaController.findOne`       | Busca por ID                                      |
| `POST /api/financeiro/parcelas/:parcelaId/baixar`   | `FinanceiroParcelaController.baixar`        | Baixa genérica de parcela                         |
| `POST /api/financeiro/parcelas/:parcelaId/estornar` | `FinanceiroParcelaController.estornarBaixa` | Estorno da baixa                                  |

#### Rotas específicas por “carteira” (recomendado para telas de listagem por tipo)

| Rota                                     | Controller                    | Arquivo                        | tipoRegistro |
| ---------------------------------------- | ----------------------------- | ------------------------------ | ------------ |
| `GET /api/financeiro/contas-receber`     | `CarteiraReceberController`   | `carteiraReceberController.ts` | 1            |
| `GET /api/financeiro/contas-pagar`       | `CarteiraPagarController`     | `carteiraPagarController.ts`   | 2            |
| `GET /api/financeiro/cheques-receber`    | `ChequeReceberController`     | `chequeController.ts`          | 3            |
| `GET /api/financeiro/cheques-pagar`      | `ChequePagarController`       | `chequeController.ts`          | 4            |
| `GET /api/financeiro/credito-cliente`    | `CreditoClienteController`    | `creditoController.ts`         | 5            |
| `GET /api/financeiro/credito-fornecedor` | `CreditoFornecedorController` | `creditoController.ts`         | 6            |
| `GET /api/financeiro/cartao-receber`     | `CartaoReceberController`     | `cartaoController.ts`          | 7            |
| `GET /api/financeiro/conta-corrente`     | `ContaCorrenteController`     | `contaCorrenteController.ts`   | 9            |

### 1.1.3 Como a herança funciona (ParcelaBaseController)

Alguns controllers (ex.: `CarteiraReceberController`, `CarteiraPagarController`, cheques, cartão) são “controllers finos” que:

- definem `tipoRegistro`
- definem `attributes`
- reutilizam `ParcelaBaseController.findAll/findOne/getResumo/baixar/estornar/delete` (dependendo do controller)

O arquivo base é:

- `server/src/controller/financeiro/parcelaBaseController.ts`

### 1.1.4 Services do Frontend

Os services do frontend estão organizados por tipo de registro em `front/src/services/financeiro/`:

| Service                       | tipoRegistro | Endpoint                             |
| ----------------------------- | ------------ | ------------------------------------ |
| `carteiraReceberService.ts`   | 1            | `/api/financeiro/contas-receber`     |
| `carteiraPagarService.ts`     | 2            | `/api/financeiro/contas-pagar`       |
| `chequeReceberService.ts`     | 3            | `/api/financeiro/cheques-receber`    |
| `chequePagarService.ts`       | 4            | `/api/financeiro/cheques-pagar`      |
| `creditoClienteService.ts`    | 5            | `/api/financeiro/credito-cliente`    |
| `creditoFornecedorService.ts` | 6            | `/api/financeiro/credito-fornecedor` |
| `cartaoReceberService.ts`     | 7            | `/api/financeiro/cartao-receber`     |
| `contaCorrenteService.ts`     | 9            | `/api/financeiro/conta-corrente`     |

O arquivo `parcelaService.ts` é mantido para compatibilidade com código legado.

### 1.1.5 Onde colocar mudanças para não duplicar lógica

- **Filtros comuns / paginação / includes comuns**:
  - preferir alterar `ParcelaBaseController`.
- **Regras específicas da baixa (financeiroParcelaPagamento, transações, integração contábil, geração de crédito/troco)**:
  - ficam em `FinanceiroParcelaController` e/ou nos services (`baixaService`, `TransacaoService`, `FinanceiroContabilIntegracaoService`).
- **Quando uma tela usa `/contas-receber` e você alterou `/parcelas`**:
  - a mudança não terá efeito na tela.

### 1.1.6 Dica prática de debug

No frontend, procure por:

- `getCarteiraReceber()` => chama `/api/financeiro/contas-receber` (service: `carteiraReceberService.ts`)
- `getCarteiraPagar()` => chama `/api/financeiro/contas-pagar` (service: `carteiraPagarService.ts`)
- `getChequeReceber()` => chama `/api/financeiro/cheques-receber` (service: `chequeReceberService.ts`)
- `getChequePagar()` => chama `/api/financeiro/cheques-pagar` (service: `chequePagarService.ts`)
- `getCreditoCliente()` => chama `/api/financeiro/credito-cliente` (service: `creditoClienteService.ts`)
- `getCreditoFornecedor()` => chama `/api/financeiro/credito-fornecedor` (service: `creditoFornecedorService.ts`)
- `getCartaoReceber()` => chama `/api/financeiro/cartao-receber` (service: `cartaoReceberService.ts`)
- `getContaCorrente()` => chama `/api/financeiro/conta-corrente` (service: `contaCorrenteService.ts`)
- `getParcelas()` => chama `/api/financeiro/parcelas` (service legado: `parcelaService.ts`)

No backend, procure a rota em:

- `server/src/routes/financeiro/financeiroRoutes.ts`

e então altere o controller correto.

### 1.1.7 Estrutura de Arquivos

#### Backend (`server/src/controller/financeiro/`)

```
├── parcelaBaseController.ts       # Classe base abstrata com métodos comuns
├── carteiraReceberController.ts   # Contas a Receber - Carteira (tipoRegistro = 1)
├── carteiraPagarController.ts     # Contas a Pagar - Carteira (tipoRegistro = 2)
├── chequeController.ts            # Cheques a Receber/Pagar (tipoRegistro = 3, 4)
├── creditoController.ts           # Crédito Cliente/Fornecedor (tipoRegistro = 5, 6)
├── cartaoController.ts            # Cartão de Crédito (tipoRegistro = 7)
├── contaCorrenteController.ts     # Conta Corrente (tipoRegistro = 9)
├── financeiroParcelaController.ts # Controller genérico para operações comuns
└── dashboardController.ts         # Dashboard financeiro
```

#### Frontend (`front/src/services/financeiro/`)

```
├── index.ts                       # Barrel exports de todos os services
├── carteiraReceberService.ts      # Contas a Receber - Carteira (tipoRegistro = 1)
├── carteiraPagarService.ts        # Contas a Pagar - Carteira (tipoRegistro = 2)
├── chequeReceberService.ts        # Cheques a Receber (tipoRegistro = 3)
├── chequePagarService.ts          # Cheques a Pagar (tipoRegistro = 4)
├── creditoClienteService.ts       # Crédito de Cliente (tipoRegistro = 5)
├── creditoFornecedorService.ts    # Crédito de Fornecedor (tipoRegistro = 6)
├── cartaoReceberService.ts        # Cartão de Crédito (tipoRegistro = 7)
├── contaCorrenteService.ts        # Conta Corrente (tipoRegistro = 9)
├── parcelaService.ts              # Service legado (mantido para compatibilidade)
└── ... (services auxiliares)
```

#### Frontend - Componentes (`front/src/pages/presentation/financeiro/components/`)

```
├── index.ts                       # Barrel exports dos componentes
├── CarteiraReceberList.tsx        # Lista de Contas a Receber - Carteira
├── CarteiraPagarList.tsx          # Lista de Contas a Pagar - Carteira
├── ChequeReceberList.tsx          # Lista de Cheques a Receber
├── ChequePagarList.tsx            # Lista de Cheques a Pagar
├── CreditoClienteList.tsx         # Lista de Créditos de Cliente
├── CreditoFornecedorList.tsx      # Lista de Créditos de Fornecedor
├── CartaoReceberList.tsx          # Lista de Cartão de Crédito
└── ContaCorrenteList.tsx          # Lista de Conta Corrente
```

### 1.1.8 Padrão de Nomenclatura

A nomenclatura segue o padrão consistente entre backend e frontend:

| tipoRegistro | Controller Backend            | Service Frontend           | Componente              |
| ------------ | ----------------------------- | -------------------------- | ----------------------- |
| 1            | `carteiraReceberController`   | `carteiraReceberService`   | `CarteiraReceberList`   |
| 2            | `carteiraPagarController`     | `carteiraPagarService`     | `CarteiraPagarList`     |
| 3            | `chequeReceberController`     | `chequeReceberService`     | `ChequeReceberList`     |
| 4            | `chequePagarController`       | `chequePagarService`       | `ChequePagarList`       |
| 5            | `creditoClienteController`    | `creditoClienteService`    | `CreditoClienteList`    |
| 6            | `creditoFornecedorController` | `creditoFornecedorService` | `CreditoFornecedorList` |
| 7            | `cartaoReceberController`     | `cartaoReceberService`     | `CartaoReceberList`     |
| 9            | `contaCorrenteController`     | `contaCorrenteService`     | `ContaCorrenteList`     |

### 1.1.9 Como Adicionar um Novo Tipo de Registro

1. **Backend**:

   - Criar novo controller herdando de `ParcelaBaseController`
   - Definir `tipoRegistro` e `attributes`
   - Implementar métodos `create` e `update` específicos
   - Adicionar rotas em `financeiroRoutes.ts`

2. **Frontend**:

   - Criar novo service em `front/src/services/financeiro/`
   - Exportar no `index.ts`
   - Criar componente de listagem em `front/src/pages/presentation/financeiro/components/`
   - Exportar no `index.ts` dos componentes

3. **Documentação**:
   - Atualizar este documento com o novo tipo

## 2. Tipos de Registro (tipoRegistro)

O campo `tipoRegistro` em `mov_movimento_parcela` define o tipo de lançamento financeiro:

| Código | Descrição                        | Uso                                                   |
| ------ | -------------------------------- | ----------------------------------------------------- |
| `1`    | Contas a Receber - Carteira      | Parcelas de vendas em carteira                        |
| `2`    | Contas a Pagar - Boleto/Carteira | Parcelas de compras                                   |
| `3`    | Cheques a Receber                | Cheques recebidos de clientes                         |
| `4`    | Cheques a Pagar                  | Cheques emitidos para fornecedores                    |
| `5`    | Crédito de Cliente               | Saldo a favor do cliente                              |
| `6`    | Crédito de Fornecedor            | Saldo a favor do fornecedor                           |
| `7`    | Cartão de Crédito                | Parcelas de operadoras de cartão                      |
| `9`    | Conta Corrente                   | Registro de débitos/créditos com fechamento periódico |

O enum `ParcelaTipoRegistro` está definido em `shared/constants/movimento.ts`.

## 3. Modelos Existentes

### 3.1 Financeiro (`server/src/database/models/financeiro/`)

| Modelo                           | Descrição                               |
| -------------------------------- | --------------------------------------- |
| `financeiroPortador`             | Bancos/Portadores                       |
| `financeiroAgencia`              | Agências bancárias                      |
| `financeiroContaBancaria`        | Contas bancárias                        |
| `financeiroContaCaixa`           | Contas de caixa                         |
| `financeiroOperadoraCredito`     | Operadoras de cartão                    |
| `financeiroSituacaoCheque`       | Situações de cheque                     |
| `financeiroTipoDocumento`        | Tipos de documento (Boleto, DARF, etc.) |
| `financeiroTipoParcela`          | Tipos de parcela                        |
| `financeiroClassificacaoCredito` | Classificação de crédito                |
| `financeiroMotivoDesconto`       | Motivos de desconto                     |

### 3.2 Movimento (`server/src/database/models/movimento/`)

| Modelo                        | Descrição                                |
| ----------------------------- | ---------------------------------------- |
| `movMovimentoParcela`         | Modelo principal de parcelas financeiras |
| `movFormaPagamento`           | Formas de pagamento                      |
| `movCondicaoPagamento`        | Condições de pagamento                   |
| `movCondicaoPagamentoParcela` | Detalhes das parcelas da condição        |
| `movCondicaoPagamentoForma`   | Formas permitidas por condição           |

### 3.3 Contábil (`server/src/database/models/contabil/`)

| Modelo                | Descrição             |
| --------------------- | --------------------- |
| `contabilLancamento`  | Lançamentos contábeis |
| `contabilPlanoContas` | Plano de contas       |
| `contabilHistorico`   | Históricos padrão     |
| `contabilCentroCusto` | Centros de custo      |

## 4. Modelos a Implementar

### 4.1 Histórico de Pagamento (`financeiroParcelaPagamento`)

Registra cada pagamento/recebimento de uma parcela. Baseado na tabela legada `PRJ020118`.

```typescript
interface FinanceiroParcelaPagamentoAttributes {
  pagamentoId: number;           // PK
  empresaId: number;
  parcelaId: number;             // FK -> mov_movimento_parcela
  transacaoId: number;           // FK -> financeiro_transacao (CHAVE PARA RASTREIO/ESTORNO)
  dataVencimento: Date;
  dataPagamento: Date;
  valorPrincipal: string;
  percentualMulta: string;
  valorMulta: string;
  percentualJuros: string;
  valorJuros: string;
  valorOutrosAcrescimos: string;
  valorSubtotal: string;
  percentualDesconto: string;
  valorDesconto: string;
  valorTotal: string;
  valorPago: string;
  valorSaldo: string;
  formaPagamentoId: number;
  historicoId: number;           // FK -> contabil_historico (para descrição)
  usuarioId: number;
  stEstornado: boolean;
  timestamps...
}

// NOTA: Os campos contaBaixaId, lancamentoContabilId e contaReceitaDespesaId
// foram removidos pois agora são rastreados via financeiroTransacaoItem.
// O transacaoId é a única referência necessária para estornos.
```

### 4.2 Transação Financeira (`financeiroTransacao`)

Agrupa operações relacionadas para facilitar estornos. **Modelo crítico para rastreabilidade.**

```typescript
interface FinanceiroTransacaoAttributes {
  transacaoId: number;           // PK
  empresaId: number;
  tipoTransacao: TipoTransacao;  // Enum abaixo
  dataTransacao: Date;
  usuarioId: number;
  observacoes: string;
  stEstornado: boolean;
  dataEstorno: Date | null;
  usuarioEstornoId: number | null;
  transacaoEstornoId: number | null; // FK -> self (transação de estorno)
  timestamps...
}

enum TipoTransacao {
  BAIXA_SIMPLES = 'BAIXA_SIMPLES',
  BAIXA_MULTIPLA = 'BAIXA_MULTIPLA',
  ACORDO_FINANCEIRO = 'ACORDO_FINANCEIRO',
  USO_CREDITO = 'USO_CREDITO',
  TRANSICAO_TIPO = 'TRANSICAO_TIPO',
  GERACAO_CREDITO = 'GERACAO_CREDITO',
}
```

### 4.3 Item de Transação (`financeiroTransacaoItem`)

Registra cada operação individual dentro de uma transação.

```typescript
interface FinanceiroTransacaoItemAttributes {
  itemId: number;                // PK
  transacaoId: number;           // FK -> financeiro_transacao
  tipoOperacao: TipoOperacao;    // Enum abaixo
  entidadeOrigem: string;        // Nome da tabela (mov_movimento_parcela, etc.)
  entidadeId: number;            // ID do registro na tabela
  valorOperacao: string;
  dadosSnapshot: object;         // JSON com estado anterior
  ordemExecucao: number;         // Para estorno na ordem inversa
  timestamps...
}

enum TipoOperacao {
  BAIXA_PARCELA = 'BAIXA_PARCELA',
  CRIACAO_CHEQUE = 'CRIACAO_CHEQUE',
  CRIACAO_CARTAO = 'CRIACAO_CARTAO',
  CONSUMO_CREDITO = 'CONSUMO_CREDITO',
  RESTAURACAO_CREDITO = 'RESTAURACAO_CREDITO',
  FECHAMENTO_PARCELA = 'FECHAMENTO_PARCELA',
  CRIACAO_PARCELA = 'CRIACAO_PARCELA',
  LANCAMENTO_CONTABIL = 'LANCAMENTO_CONTABIL',
  ESTORNO_LANCAMENTO = 'ESTORNO_LANCAMENTO',
}
```

### 4.4 Acordo Financeiro (`financeiroAcordo`)

Detalhes específicos de acordos/renegociações.

```typescript
interface FinanceiroAcordoAttributes {
  acordoId: number;              // PK
  empresaId: number;
  transacaoId: number;           // FK -> financeiro_transacao
  clienteId: number;             // FK -> pessoa
  valorOriginal: string;
  valorMultaJuros: string;
  valorDesconto: string;
  valorNegociado: string;
  quantidadeParcelasOriginal: number;
  quantidadeParcelasNovo: number;
  dataAcordo: Date;
  observacoes: string;
  timestamps...
}
```

## 5. Estratégia de Estornos

### 5.1 O Problema

Operações financeiras complexas envolvem múltiplas entidades que precisam ser revertidas em conjunto:

| Cenário                   | Operação Original                              | O que precisa ser estornado           |
| ------------------------- | ---------------------------------------------- | ------------------------------------- |
| Baixa múltipla com cheque | N parcelas baixadas + 1 cheque criado          | Excluir cheque + reabrir N parcelas   |
| Baixa múltipla com cartão | N parcelas baixadas + 1 registro cartão        | Excluir cartão + reabrir N parcelas   |
| Acordo financeiro         | N parcelas antigas fechadas + M parcelas novas | Excluir M novas + reabrir N antigas   |
| Uso de crédito            | Parcela baixada + crédito consumido            | Reabrir parcela + restaurar crédito   |
| Qualquer baixa            | Parcela baixada + lançamento contábil          | Reabrir parcela + estornar lançamento |

### 5.2 A Solução: Transações Financeiras

Toda operação financeira cria uma `financeiroTransacao` que agrupa todos os `financeiroTransacaoItem` relacionados.

**Benefícios:**

- Estorno com 1 clique
- Auditoria completa
- Integridade (tudo ou nada)
- Histórico de estornos

### 5.3 Fluxo de Baixa Múltipla com Cheque

```
OPERAÇÃO:
1. Criar financeiroTransacao (tipo: BAIXA_MULTIPLA)
2. Para cada parcela:
   - Salvar snapshot do estado atual em dadosSnapshot
   - Baixar parcela (atualizar valorPago, valorSaldo, dataPagamento)
   - Criar financeiroTransacaoItem (tipo: BAIXA_PARCELA)
   - Criar financeiroParcelaPagamento
3. Criar cheque a receber (nova parcela com tipoRegistro = '3')
4. Criar financeiroTransacaoItem (tipo: CRIACAO_CHEQUE)
5. Gerar lançamento contábil
6. Criar financeiroTransacaoItem (tipo: LANCAMENTO_CONTABIL)

ESTORNO (automático):
1. Buscar transação pelo transacaoId
2. Buscar todos os itens ordenados por ordemExecucao DESC
3. Para cada item (ordem inversa):
   - Se LANCAMENTO_CONTABIL: criar lançamento de estorno
   - Se CRIACAO_CHEQUE: marcar cheque como excluído
   - Se BAIXA_PARCELA: restaurar parcela usando dadosSnapshot
4. Marcar transação como estornada (stEstornado = true)
5. Criar nova transação de estorno referenciando a original
```

### 5.4 Fluxo de Acordo Financeiro

```
OPERAÇÃO:
1. Criar financeiroTransacao (tipo: ACORDO_FINANCEIRO)
2. Criar financeiroAcordo com detalhes da negociação
3. Para cada parcela antiga:
   - Salvar snapshot
   - Fechar parcela (marcar como renegociada, zerar saldo)
   - Criar item (tipo: FECHAMENTO_PARCELA)
4. Para cada parcela nova:
   - Criar parcela
   - Criar item (tipo: CRIACAO_PARCELA)

ESTORNO:
1. Excluir parcelas novas (CRIACAO_PARCELA)
2. Restaurar parcelas antigas usando snapshot (FECHAMENTO_PARCELA)
3. Marcar acordo como estornado
```

### 5.5 Fluxo de Uso de Crédito

```
OPERAÇÃO:
1. Criar financeiroTransacao (tipo: USO_CREDITO)
2. Salvar snapshot do crédito (valorSaldo atual)
3. Consumir crédito (total ou parcial)
4. Criar item (tipo: CONSUMO_CREDITO, dadosSnapshot: {valorSaldo: X})
5. Baixar parcela (total ou parcial)
6. Criar item (tipo: BAIXA_PARCELA)

ESTORNO:
1. Reabrir parcela usando snapshot
2. Restaurar crédito usando dadosSnapshot.valorSaldo
```

### 5.6 Estrutura do dadosSnapshot (JSON)

```json
// Para parcela
{
  "valorSaldo": "1500.00",
  "valorPago": "0.00",
  "dataPagamento": null,
  "tipoRegistro": "1",
  "preTipoRegistro": null,
  "contaBaixaId": null,
  "historicoId": null,
  "sequenciaLancamentoContabil": null
}

// Para crédito
{
  "valorSaldo": "500.00",
  "statusCreditoBaixado": false
}

// Para lançamento contábil
{
  "lancamentoId": 12345
}
```

## 6. Controllers e Services

### 6.1 Arquitetura de Controllers (Backend)

O módulo financeiro utiliza uma arquitetura baseada em herança para separar responsabilidades por tipo de registro:

```
server/src/controller/financeiro/
├── parcelaBaseController.ts      # Classe base abstrata com métodos comuns
├── carteiraController.ts         # ContasReceberController + ContasPagarController
├── chequeController.ts           # ChequeReceberController + ChequePagarController
└── financeiroParcelaController.ts # Controller legado (compatibilidade)
```

#### ParcelaBaseController (Classe Abstrata)

Contém a lógica comum a todos os tipos de parcelas:

- `findAll()` - Listagem com filtros e paginação
- `findOne()` - Busca por ID
- `getResumo()` - Totalizadores por situação
- `baixar()` - Executa baixa de parcela
- `estornar()` - Estorna baixa de parcela
- `delete()` - Exclusão lógica

Propriedades abstratas:

- `tipoRegistro` - Define o tipo de registro que o controller gerencia
- `attributes` - Campos retornados nas consultas

#### Controllers Específicos

| Controller                | Tipo Registro | Responsabilidade                       |
| ------------------------- | ------------- | -------------------------------------- |
| `ContasReceberController` | `1`           | CRUD de parcelas em carteira a receber |
| `ContasPagarController`   | `2`           | CRUD de parcelas em carteira a pagar   |
| `ChequeReceberController` | `3`           | CRUD de cheques a receber              |
| `ChequePagarController`   | `4`           | CRUD de cheques a pagar                |
| `CartaoReceberController` | `7`           | CRUD de parcelas de cartão de crédito  |
| `ContaCorrenteController` | `9`           | CRUD de lançamentos de conta corrente  |

Cada controller específico implementa:

- `create()` - Criação com validações específicas do tipo
- `update()` - Atualização com validações específicas do tipo

#### Rotas por Tipo

| Endpoint Base                     | Controller                |
| --------------------------------- | ------------------------- |
| `/api/financeiro/contas-receber`  | `contasReceberController` |
| `/api/financeiro/contas-pagar`    | `contasPagarController`   |
| `/api/financeiro/cheques-receber` | `chequeReceberController` |
| `/api/financeiro/cheques-pagar`   | `chequePagarController`   |
| `/api/financeiro/cartao-receber`  | `cartaoReceberController` |
| `/api/financeiro/conta-corrente`  | `contaCorrenteController` |

### 6.2 Services

| Service                     | Responsabilidade                                    |
| --------------------------- | --------------------------------------------------- |
| `ParcelaService`            | Lógica de negócio de parcelas                       |
| `BaixaService`              | Cálculo de multa/juros, execução de baixa e estorno |
| `TransacaoService`          | Criação e estorno de transações                     |
| `AcordoService`             | Lógica de acordos financeiros                       |
| `IntegracaoContabilService` | Geração automática de lançamentos                   |
| `CreditoService`            | Consumo e restauração de créditos                   |

## 7. Telas do Frontend

### 7.1 Arquitetura de Componentes (Frontend)

O módulo financeiro utiliza componentes separados por tipo de registro para melhor organização e manutenibilidade:

```
front/src/pages/presentation/financeiro/
├── contasReceberListPage.tsx     # Página principal com abas
├── contasPagarListPage.tsx       # Página principal com abas
├── contasReceberEditPage.tsx     # Edição de parcela carteira
├── contasPagarEditPage.tsx       # Edição de parcela carteira
├── chequeReceberEditPage.tsx     # Edição de cheque a receber
├── chequePagarEditPage.tsx       # Edição de cheque a pagar
└── components/
    ├── index.ts                  # Exportações
    ├── CarteiraReceberList.tsx   # Listagem carteira a receber
    ├── CarteiraPagarList.tsx     # Listagem carteira a pagar
    ├── ChequeReceberList.tsx     # Listagem cheques a receber
    ├── ChequePagarList.tsx       # Listagem cheques a pagar
    ├── CartaoReceberList.tsx     # (Futuro) Listagem cartão
    └── CreditoClienteList.tsx    # (Futuro) Listagem créditos
```

#### Vantagens da Separação

1. **Colunas específicas** - Cada tipo exibe seus dados relevantes
2. **Filtros específicos** - Cheques filtram por banco/situação, Cartão por operadora
3. **Ações específicas** - Cheques: compensar, devolver; Cartão: conciliar
4. **Manutenção** - Alterações em um tipo não afetam os outros
5. **Código limpo** - Sem condicionais complexas no JSX

#### Estrutura de Cada Componente de Listagem

Cada componente de listagem (`CarteiraReceberList`, `ChequeReceberList`, etc.) contém:

- **Card próprio** com título e botão "Novo"
- **Filtros específicos** do tipo de registro
- **Tabela com colunas específicas**
- **Ações específicas** (baixar, compensar, estornar)
- **Paginação** própria
- **Modais** de baixa e estorno

#### Página Principal (ListPage)

A página principal (`contasReceberListPage.tsx`) é simplificada:

- Cards de resumo/totalizadores
- Navegação por abas (Nav)
- Renderização condicional do componente ativo

```tsx
{
  activeTab === "carteira" && (
    <CarteiraReceberList onDataChange={handleDataChange} />
  );
}
{
  activeTab === "cheques" && (
    <ChequeReceberList onDataChange={handleDataChange} />
  );
}
```

### 7.2 Colunas por Tipo de Registro

#### Carteira (Contas a Receber/Pagar)

| Coluna             | Descrição                              |
| ------------------ | -------------------------------------- |
| Cliente/Fornecedor | Nome e CPF/CNPJ                        |
| Vencimento         | Data de vencimento                     |
| Parcela            | Número da parcela (ex: 1/3)            |
| Valor              | Valor principal                        |
| Saldo              | Saldo restante                         |
| Situação           | Badge (Aberto, Vencido, Pago, Parcial) |
| Ações              | Editar, Detalhes, Baixar/Estornar      |

#### Cheques

| Coluna              | Descrição                                |
| ------------------- | ---------------------------------------- |
| Emitente/Favorecido | Nome do emitente ou favorecido           |
| Nº Cheque           | Número do cheque                         |
| Banco/Agência       | Código do banco e agência                |
| Vencimento          | Data de vencimento                       |
| Valor               | Valor do cheque                          |
| Saldo               | Saldo restante                           |
| Situação            | Badge (Em Custódia, Compensado, Vencido) |
| Ações               | Editar, Detalhes, Compensar/Estornar     |

### 7.3 Abas por Tipo de Registro

**Contas a Receber:**

- Carteira (tipoRegistro = '1') - `CarteiraReceberList`
- Cheques (tipoRegistro = '3') - `ChequeReceberList`
- Cartão (tipoRegistro = '7') - `CartaoReceberList` (futuro)
- Conta Corrente (tipoRegistro = '9') - `ContaCorrenteList` (futuro)
- Crédito (tipoRegistro = '5') - `CreditoClienteList` (futuro)

**Contas a Pagar:**

- Carteira (tipoRegistro = '2') - `CarteiraPagarList`
- Cheques (tipoRegistro = '4') - `ChequePagarList`
- Conta Corrente (tipoRegistro = '9') - `ContaCorrenteList` (futuro)
- Crédito (tipoRegistro = '6') - `CreditoFornecedorList` (futuro)

### 7.4 Conta Corrente (tipoRegistro = 9)

A **Conta Corrente** é uma modalidade de registro financeiro para controle de débitos e créditos entre partes, sem data fixa de vencimento. Diferente de movimentação bancária (que pertence ao módulo de Gestão Bancária/Caixa), esta funcionalidade gerencia saldos correntes entre a empresa e terceiros.

#### Conceito

É utilizada quando:

- Não há data fixa de vencimento/pagamento
- Existe um acordo de fechamento periódico (ex: último dia do mês)
- Há múltiplas operações de débito e crédito durante o período

#### Exemplo de Uso: Clínica Médica

**Cenário:** Médico colaborador que realiza cirurgias na clínica.

| Operação                | Tipo    | Descrição                                          |
| ----------------------- | ------- | -------------------------------------------------- |
| Cirurgia A              | Crédito | Honorários do médico pela cirurgia                 |
| Material usado          | Débito  | Despesas da operação debitadas                     |
| Cirurgia B (particular) | Débito  | Despesas quando médico negocia direto com paciente |
| Taxa de sala            | Débito  | Uso de infraestrutura                              |

**Fechamento mensal:**

1. Sistema calcula saldo da conta corrente do médico
2. Se **saldo credor** (médico tem a receber): Faturamento efetua transferência bancária
3. Se **saldo devedor** (médico deve à clínica): Gera parcela em carteira, cheque ou cartão

#### Fluxo de Fechamento

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTA CORRENTE                           │
│  Período: 01/12 a 31/12                                     │
├─────────────────────────────────────────────────────────────┤
│  (+) Créditos: R$ 15.000,00                                 │
│  (-) Débitos:  R$ 4.500,00                                  │
│  ─────────────────────────────                              │
│  (=) Saldo:    R$ 10.500,00 (CREDOR)                        │
├─────────────────────────────────────────────────────────────┤
│  FECHAMENTO → Gera parcela em Contas a Pagar (Carteira)     │
│               Valor: R$ 10.500,00                           │
│               Vencimento: 05/01 (5 dias úteis)              │
└─────────────────────────────────────────────────────────────┘
```

#### Campos Específicos

| Campo               | Descrição                                                 |
| ------------------- | --------------------------------------------------------- |
| `titularId`         | Pessoa vinculada à conta corrente                         |
| `tipoLancamento`    | 'D' (Débito) ou 'C' (Crédito)                             |
| `dataLancamento`    | Data do lançamento                                        |
| `valorPrincipal`    | Valor do lançamento                                       |
| `descricao`         | Descrição do lançamento                                   |
| `documentoOrigem`   | Referência ao documento que originou (cirurgia, NF, etc.) |
| `periodoReferencia` | Mês/ano de referência                                     |

#### Operações

- **Lançar Débito** - Registra valor a débito na conta
- **Lançar Crédito** - Registra valor a crédito na conta
- **Consultar Extrato** - Visualiza movimentações do período
- **Fechar Período** - Calcula saldo e gera parcela de liquidação
- **Estornar Lançamento** - Cancela um lançamento específico

### 7.5 Modal de Baixa

- Forma de pagamento
- Cálculo automático de multa/juros por atraso
- Opção de desconto (com motivo)
- Seleção de conta de baixa
- Pagamento parcial (gera saldo)
- Opção: Usar crédito do cliente

### 7.6 Modal de Acordo Financeiro

- Lista de parcelas selecionadas
- Cálculo de multa/juros
- Opção de desconto
- Definição de novas parcelas
- Preview do acordo

### 7.7 Modal de Transação

- Detalhes da transação
- Lista de itens/operações
- Botão de estorno (se não estornada)

## 8. Dashboard Financeiro

### 8.1 Indicadores Principais

- **A Receber Hoje** - Vencendo hoje
- **A Pagar Hoje** - Vencendo hoje
- **Inadimplência** - Vencidos há mais de X dias
- **Saldo Previsto** - Entradas - Saídas próximos 30 dias

### 8.2 Gráficos

- Fluxo de Caixa (próximos 30/60/90 dias)
- Inadimplência por período
- Recebimentos por forma de pagamento
- Comparativo Previsto x Realizado

### 8.3 Listas Rápidas

- Maiores devedores
- Parcelas vencendo hoje
- Cheques a compensar
- Cartões a receber

## 9. Ordem de Implementação

| Etapa | Descrição                                 | Dependência |
| ----- | ----------------------------------------- | ----------- |
| 1     | Criar modelo `financeiroTransacao`        | -           |
| 2     | Criar modelo `financeiroTransacaoItem`    | Etapa 1     |
| 3     | Criar modelo `financeiroParcelaPagamento` | Etapa 2     |
| 4     | Criar modelo `financeiroAcordo`           | Etapa 2     |
| 5     | Criar migrations e associations           | Etapas 1-4  |
| 6     | Criar `TransacaoService`                  | Etapa 5     |
| 7     | Criar `ParcelaController` com listagem    | Etapa 5     |
| 8     | Criar tela frontend de listagem           | Etapa 7     |
| 9     | Criar `BaixaService`                      | Etapa 6     |
| 10    | Criar `ParcelaBaixaController`            | Etapa 9     |
| 11    | Criar modal de baixa no frontend          | Etapa 10    |
| 12    | Implementar integração contábil           | Etapa 9     |
| 13    | Implementar estorno de transação          | Etapa 12    |
| 14    | Replicar para Contas a Pagar              | Etapa 13    |
| 15    | Implementar abas específicas              | Etapa 14    |
| 16    | Implementar acordos financeiros           | Etapa 15    |
| 17    | Criar Dashboard                           | Etapa 16    |

## 10. Considerações Técnicas

### 10.1 Valores Monetários

Todos os valores monetários são armazenados como `STRING/DECIMAL(18,8)` para evitar perdas de precisão, conforme padrão do projeto.

### 10.2 Multiempresa

Todos os registros possuem `empresaId` para suporte a múltiplas empresas.

### 10.3 Soft Delete

Registros não são excluídos fisicamente. Usar `stExcluido = true`.

### 10.4 Auditoria

Todos os modelos possuem `createdAt`, `updatedAt` e `usuarioId` quando aplicável.

### 10.5 Transações de Banco

Operações complexas (baixa múltipla, acordos) devem usar transações do Sequelize para garantir atomicidade.

```typescript
const transaction = await sequelize.transaction();
try {
  // operações...
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

## 11. Integração Contábil — De/Para (Padrão)

Esta seção define o padrão de lançamentos contábeis gerados a partir de operações do módulo Financeiro.

### 11.1 Contas e históricos padrão (Configuração)

Os parâmetros abaixo são utilizados como padrão para montagem do lançamento contábil:

- **Conta transitória de clientes (duplicatas a receber)**: `cfgEmpresaFinanceiroContabil.contaCorrenteClienteId`
- **Histórico padrão da integração Financeiro x Contábil**: `cfgEmpresaFinanceiroContabil.integrarFinancHistoricoId`
- **Histórico padrão da baixa (recebimento)**: `cfgEmpresaFinanceiroContabil.rcbtoBaixaHistoricoId`

### 11.2 Inclusão direta de parcela (Contas a Receber)

Quando o usuário incluir uma parcela diretamente no Contas a Receber (sem origem em movimento), e a integração estiver habilitada (`stIntegrarFinanceiroContabil=true`) e houver `contaReceitaDespesaId` preenchida, gerar lançamento contábil de reconhecimento da receita:

- **Débito**: `contaCorrenteClienteId` (Clientes / Duplicatas a Receber)
- **Crédito**: `contaReceitaDespesaId` (Receita escolhida pelo usuário)
- **Histórico**:
  - se `historicoId` informado na parcela, usar este
  - caso contrário, usar `integrarFinancHistoricoId`
- **Valor**: valor principal da parcela
- **Data do lançamento**: `dataEmissao`
- **Conciliado**: sim
- **Centro de custo**: se informado, usar `centroCustoId`

### 11.3 Baixa de parcela (recebimento)

Ao baixar uma parcela (recebimento), gerar lançamento contábil de caixa/banco (financeiro):

- **Débito**: conta de caixa/banco informada na baixa (conta baixa)
- **Crédito**: `contaCorrenteClienteId` (Clientes / Duplicatas a Receber)
- **Histórico**: `rcbtoBaixaHistoricoId`
- **Valor**: valor efetivamente recebido
- **Data do lançamento**: data da baixa
- **Conciliado**: sim
- **Centro de custo**: se informado, usar `centroCustoId`

### 11.4 Alteração da parcela

Quando houver alteração de valor e/ou contas/histórico da integração, atualizar o mesmo lançamento contábil vinculado (não criar novo lançamento para ajuste).

### 11.5 Exclusão/estorno

Quando houver exclusão/estorno de operações financeiras, o lançamento contábil relacionado deve ser estornado/excluído de forma consistente, seguindo o padrão de rastreabilidade via `financeiroTransacao` / `financeiroTransacaoItem`.

---

Este documento deve ser mantido atualizado conforme novas decisões forem tomadas.
