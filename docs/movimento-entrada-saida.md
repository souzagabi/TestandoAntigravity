# Módulo de Movimento de Entrada/Saída

Guia de referência para o novo módulo do ERP, consolidando decisões e fluxos definidos até o momento.

## 1. Visão Geral

O módulo centraliza os processos de compra e venda, integrando:

- **Movimento** (`mov_movimento`, `mov_movimento_item`, `mov_movimento_parcela`).
- **Integrações** com financeiro, contábil, DFe, estoque e pessoa.
- **Máquina de estados** configurável, inspirada no módulo Clínica (`mov_status`, `mov_status_transicao`, `mov_status_historico`).
- **Rastreabilidade avançada** (lotes, validade, séries e log de estoque).

Todos os registros seguem as diretrizes de multiempresa (`empresa_id`) e armazenamento de valores monetários como `STRING/DECIMAL(18,8)` para evitar perdas de precisão.

## 2. Fluxo Geral do Movimento

1. **Pré-configuração**
   - Tipo de movimento (`mov_tipo_movimento`) determina se é entrada/saída e qual natureza usar.
   - Natureza da operação carrega parâmetros fiscais, contábeis e de estoque (CFOP, `stMovimentarEstoque`, `stIntegrarContabil`, etc.).

2. **Cabeçalho (`mov_movimento`)**
   - Dados do titular, transportador, documentos e totais.
   - Campos de status: `statusOperacionalId`, `statusFinanceiroId` (e opcionalmente `statusEstoqueId`, caso seja necessário criar no futuro).

3. **Itens (`mov_movimento_item`)**
   - Quantidades, tributos, embalagens e CFOP dos bens (`produto_bem`).
   - Itens acionam reservas/baixas conforme configuração da natureza e do produto.

4. **Parcelas (`mov_movimento_parcela`)**
   - Geração baseada em condição/forma de pagamento, com vínculos financeiros (contas, bancos, portadores, etc.).
   - Campo `tipoRegistro` indica o tipo de lançamento (CR/CP, cheques, cartões, créditos).

5. **Integrações fiscais/contábeis**
   - Disparadas conforme flags da natureza e do tipo de movimento.

6. **Fluxo de estoque**
   - Entradas incrementam saldo e baixam reservas.
   - Saídas validam disponibilidade e registram movimentações físicas e lógicas.

### 2.1 Exemplo resumido (saída)

```mermaid
documentation
   ORCAMENTO --> PRE_RESERVA --> RESERVADO --> FATURADO --> EXPEDIDO --> CONCLUIDO
```

- `PRE_RESERVA`: valida estoque.
- `RESERVADO`: gera reservas por lote/série.
- `FATURADO`: emite NF-e e gera parcelas.
- `EXPEDIDO`: integra com WMS/transporte.
- `CONCLUIDO`: baixa financeira/estoque e encerra ciclo.

## 3. Controle de Estoque e Log

Além do saldo por produto/deposito (`produto_estoque`), foi proposto o modelo **`produto_estoque_log`** para auditar cada alteração de saldo. Campos principais:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `estoqueLogId` | INTEGER PK | Identificador do log |
| `bemId` | INTEGER FK | Produto movimentado |
| `depositoId` | INTEGER FK | Depósito/posição |
| `movimentoId` / `movimentoItemId` | INTEGER FK | Origem no movimento |
| `tipoOperacao` | CHAR(1) | `E` Entrada, `S` Saída, `T` Transferência, `A` Ajuste |
| `quantidade` | DECIMAL(18,8) | Positivo ou negativo |
| `saldoAnterior` / `saldoAtual` | DECIMAL(18,8) | Snapshots |
| `referenciaOrigem` | JSONB | Metadados (ordem, lote, usuário) |
| Flags (`stAtivo`, `stExcluido`) + auditoria |

## 4. Tipagem de `tipoRegistro`

- Campo `tipoRegistro` em `mov_movimento_parcela` representa o tipo de lançamento financeiro (1=CR, 2=CP, 3=Cheque CR, 4=Cheque CP, 5=Crédito cliente, 6=Crédito fornecedor, 7=Cartão, 9=Conta corrente).
- Recomendações:
  1. Criar um `enum ParcelaTipoRegistro` compartilhado entre backend/frontend, mantendo persistência em `CHAR(1)` com validação via `isIn`.
  2. Adicionar `tipoRegistroPadrao` em `mov_forma_pagamento` para mapear automaticamente o registro padrão de cada forma.
  3. Opcional: evoluir para tabela `financeiro_tipo_registro` caso seja necessário maior flexibilidade, mantendo compatibilidade com o legado.

## 5. Máquina de Estados

- Uso de `mov_status` com categorias (Operacional, Financeiro, Estoque) para permitir múltiplos pipelines.
- `mov_status_transicao` controla eventos, guardas, pre/post actions e exigência de observação.
- `mov_status_historico` registra cada transição com `payload` opcional.

### 5.1 Campos nos movimentos
- `statusOperacionalId`: pipeline logístico (orçamento → expedição → conclusão).
- `statusFinanceiroId`: pipeline financeiro (aberto → aprovado → faturado → pago/cancelado).
- Possível `statusEstoqueId` futuro, caso o WMS opere de forma independente.

### 5.2 Boas práticas
1. Criar `MovimentoStatusService` para aplicar transições.
2. Utilizar `guards` no JSON da transição (ex.: `{ "estoqueReservado": true }`).
3. Implementar `preActions` (validações, reservas) e `postActions` (gerar NF, lançar financeiro, disparar webhooks).

## 6. Lotes, Validade e Séries

Novos modelos criados:

- **`ProdutoLote`**: liga `bemId` a lotes/depósitos, guarda datas, saldos específicos, ANVISA e flags de bloqueio.
- **`ProdutoSerie`**: rastreia números de série, opcionalmente vinculados a um lote.
- **`MovMovimentoItemLote`**: associa itens do movimento a lotes consumidos (quantidade, depósito, rastreabilidade, baixa).
- **`MovMovimentoItemSerie`**: registra os números de série utilizados em cada item (com referências a lote, datas e status).

Associações configuradas no `produtoAssociations.ts`:
- `Produto -> ProdutoLote/ProdutoSerie` (1:N) e relações inversas.
- `ProdutoDeposito -> ProdutoLote` (1:N) para mapear lotes por depósito.
- `ProdutoLote -> ProdutoSerie` (1:N) garantindo vínculo entre lote e séries.

## 7. Fluxo para Lotes/Séries

1. **Entrada**
   - Usuário informa lote/validade e, se necessário, cadastra séries (`produto_serie`).
   - Itens de movimento geram registros em `mov_movimento_item_lote`/`_serie`.
   - Atualiza `produto_lote.quantidadeAtual` e `produto_estoque_log` com o impacto.

2. **Saída**
   - Operador seleciona lotes/validade (padrão FEFO) e séries obrigatórias.
   - Atualiza saldo/reserva por lote; séries marcadas como indisponíveis (`stDisponivel=false`, `stBaixado=true`).

3. **Auditoria**
   - Consultas podem ser feitas por lote ou série, rastreando entrada, reservas e baixa.

## 8. Próximos Passos (sugestões)

1. Criar migrations e seeders para os novos modelos.
2. Implementar serviços/middlewares:
   - Reserva/liberação de estoque por lote/série.
   - Aplicação da máquina de estados com ações automatizadas.
3. Documentar endpoints e telas (backend/frontend) para manipular lotes/séries.
4. Adicionar testes automatizados para garantir integridade das transições e do estoque.

## 9. Checklist de Modelos Gerados

- `mov_movimento` (atualizado com múltiplos status).
- `mov_movimento_item`, `mov_movimento_parcela`.
- `mov_tipo_movimento`, `mov_natureza_operacao`, `mov_tipo_movimento_natureza`.
- Máquina de estados: `mov_status`, `mov_status_transicao`, `mov_status_historico`.
- Pagamentos/fiscal: `mov_condicao_pagamento`, `mov_forma_pagamento`, `mov_cfop`.
- Contábil: `contabil_historico_padrao`, `contabil_centro_custo`, `contabil_lancamento`, `contabil_grupo_conta`, `contabil_grupo_conta_relacao`.
- Financeiro: `financeiro_tipo_documento`, `financeiro_tipo_parcela`, `financeiro_portador`, `financeiro_agencia`, `financeiro_conta_bancaria`, `financeiro_situacao_cheque`, `financeiro_operadora_credito`, `financeiro_classificacao_credito`.
- DFe: `dfe_lote_nfe`, `dfe_documento_fiscal`.
- Produto/Pessoa: `produto_bem`, `produto_estoque`, `produto_lote`, `produto_serie`, `pessoa_regiao`.
- Associações adicionais para lotes/séries em `produtoAssociations.ts`.

---

Este documento deve ser mantido atualizado conforme novas decisões forem tomadas (migrations, APIs, telas, workflows detalhados e integrações externas).
