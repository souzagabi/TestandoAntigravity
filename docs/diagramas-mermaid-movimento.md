# Diagramas Mermaid – Módulo Movimento / Financeiro / Contábil

Documentação visual das entidades principais, dividida por domínio e com uma visão consolidada.

## 1. Movimento (Operacional + Estoque)

```mermaid
erDiagram
    MOV_MOVIMENTO ||--o{ MOV_MOVIMENTO_ITEM : possui
    MOV_MOVIMENTO ||--o{ MOV_MOVIMENTO_PARCELA : gera
    MOV_MOVIMENTO ||--o{ MOV_STATUS_HISTORICO : transiciona
    MOV_MOVIMENTO ||--|| MOV_TIPO_MOVIMENTO : usa
    MOV_MOVIMENTO ||--|| MOV_NATUREZA_OPERACAO : aplica
    MOV_MOVIMENTO }o--|| MOV_STATUS : "statusOperacionalId / statusFinanceiroId"
    MOV_MOVIMENTO_ITEM ||--|| PRODUTO_BEM : referencia
    MOV_MOVIMENTO_ITEM ||--o{ MOV_MOV_ITEM_LOTE : consome
    MOV_MOVIMENTO_ITEM ||--o{ MOV_MOV_ITEM_SERIE : rastreia
    MOV_MOV_ITEM_LOTE ||--|| PRODUTO_LOTE : vincula
    MOV_MOV_ITEM_SERIE ||--|| PRODUTO_SERIE : vincula
    PRODUTO_LOTE ||--o{ PRODUTO_SERIE : detalha
    PRODUTO_BEM ||--o{ PRODUTO_ESTOQUE : saldos
    PRODUTO_ESTOQUE ||--o{ PRODUTO_ESTOQUE_LOG : historico
    MOV_MOVIMENTO ||--|| MOV_CONDICAO_PAGAMENTO : define
    MOV_MOVIMENTO ||--|| MOV_FORMA_PAGAMENTO : define
    MOV_FORMA_PAGAMENTO ||--|| PARCELA_TIPO_REGISTRO : "tipoRegistroPadrao"
```

**Notas**
1. `statusOperacionalId` e `statusFinanceiroId` apontam para `mov_status`, permitindo múltiplos pipelines.
2. `mov_movimento_item_lote` e `mov_movimento_item_serie` garantem rastreabilidade farmacêutica (lotes, validade, séries).
3. `produto_estoque_log` audita todo impacto de estoque, associado opcionalmente ao movimento/item.

## 2. Financeiro (Parcelas, Bancos, Cheques, Cartões)

```mermaid
erDiagram
    MOV_MOVIMENTO ||--o{ MOV_MOVIMENTO_PARCELA : gera
    MOV_MOVIMENTO_PARCELA ||--|| MOV_FORMA_PAGAMENTO : utiliza
    MOV_MOVIMENTO_PARCELA ||--|| FINANCEIRO_TIPO_DOCUMENTO : tipoTitulo
    MOV_MOVIMENTO_PARCELA ||--|| FINANCEIRO_TIPO_PARCELA : categoria
    MOV_MOVIMENTO_PARCELA ||--|| FINANCEIRO_PORTADOR : portadorCheque
    MOV_MOVIMENTO_PARCELA ||--|| FINANCEIRO_CONTA_BANCARIA : conta
    MOV_MOVIMENTO_PARCELA ||--|| FINANCEIRO_AGENCIA : agencia
    MOV_MOVIMENTO_PARCELA ||--|| FINANCEIRO_OPERADORA_CREDITO : cartao
    MOV_MOVIMENTO_PARCELA ||--|| FINANCEIRO_CLASSIFICACAO_CREDITO : credito
    MOV_MOVIMENTO_PARCELA }o--|| PARCELA_TIPO_REGISTRO : tipoRegistro
    MOV_FORMA_PAGAMENTO }o--|| PARCELA_TIPO_REGISTRO : tipoRegistroPadrao
    MOV_MOVIMENTO_PARCELA ||--|| MOV_CONDICAO_PAGAMENTO : "origem_cadastro"
```

**Notas**
1. `ParcelaTipoRegistro` garante consistência entre backend e frontend.
2. `mov_forma_pagamento.tipoRegistroPadrao` define automaticamente o registro financeiro ao gerar parcelas.
3. Estrutura preparada para cheques (situação, portador), cartões (operadora) e créditos (cliente/fornecedor).

## 3. Contábil (Integração)

```mermaid
erDiagram
    MOV_MOVIMENTO ||--o{ CONTABIL_LANCAMENTO : gera
    CONTABIL_LANCAMENTO ||--|| CONTABIL_HISTORICO_PADRAO : usa
    CONTABIL_LANCAMENTO ||--|| CONTABIL_PLANO_CONTAS : debitoCredito
    CONTABIL_LANCAMENTO ||--|| CONTABIL_CENTRO_CUSTO : centro
    CONTABIL_LANCAMENTO ||--|| MOV_MOVIMENTO_PARCELA : origemBaixa
    MOV_MOVIMENTO ||--|| CONTABIL_GRUPO_CONTA : configuracao
    CONTABIL_GRUPO_CONTA ||--o{ CONTABIL_GRUPO_CONTA_REL : relacionaContas
```

**Notas**
1. A natureza do movimento define regras para gerar lançamentos (débitos/créditos, centro de custo, histórico padrão).
2. Parcelas quitadas podem gerar lançamentos complementares (baixa financeira).

## 4. Visão Consolidada (Movimento + Financeiro + Contábil)

```mermaid
erDiagram
    MOV_MOVIMENTO ||--o{ MOV_MOVIMENTO_ITEM : itens
    MOV_MOVIMENTO ||--o{ MOV_MOVIMENTO_PARCELA : parcelas
    MOV_MOVIMENTO ||--|| MOV_STATUS : "status_pipeline"
    MOV_MOVIMENTO_ITEM ||--o{ MOV_MOV_ITEM_LOTE : lotes
    MOV_MOVIMENTO_ITEM ||--o{ MOV_MOV_ITEM_SERIE : series
    MOV_MOV_ITEM_LOTE ||--|| PRODUTO_LOTE : lote
    MOV_MOV_ITEM_SERIE ||--|| PRODUTO_SERIE : serie
    MOV_MOVIMENTO ||--|| MOV_CONDICAO_PAGAMENTO : condicao
    MOV_MOVIMENTO ||--|| MOV_FORMA_PAGAMENTO : forma
    MOV_FORMA_PAGAMENTO }o--|| PARCELA_TIPO_REGISTRO : padrao
    MOV_MOVIMENTO_PARCELA }o--|| PARCELA_TIPO_REGISTRO : registro
    MOV_MOVIMENTO_PARCELA ||--|| FINANCEIRO_TIPO_DOCUMENTO : doc
    MOV_MOVIMENTO_PARCELA ||--|| FINANCEIRO_PORTADOR : portador
    MOV_MOVIMENTO_PARCELA ||--|| FINANCEIRO_OPERADORA_CREDITO : operadora
    MOV_MOVIMENTO ||--o{ CONTABIL_LANCAMENTO : contabiliza
    CONTABIL_LANCAMENTO ||--|| CONTABIL_PLANO_CONTAS : contas
    CONTABIL_LANCAMENTO ||--|| CONTABIL_CENTRO_CUSTO : centro
    CONTABIL_LANCAMENTO ||--|| CONTABIL_HISTORICO_PADRAO : historico
    PRODUTO_ESTOQUE ||--o{ PRODUTO_ESTOQUE_LOG : log
    PRODUTO_ESTOQUE_LOG }o--|| MOV_MOVIMENTO_ITEM : origemOpcional
```

**Notas Finais**
- Diagramas seguem uma visão lógica; nomes condensados em MAIÚSCULO indicam tabelas ou modelos Sequelize.
- Ajuste conforme evoluções futuras (p. ex. inclusão de `statusEstoqueId` ou serviços externos).
