## Orientação para campos decimais usando Sequelize (Financeiro)

### Contexto
- Modelo: `FinanceiroOperadoraCredito` (`server/src/database/models/financeiro/financeiroOperadoraCredito.ts`).
- Campos: `percentualTarifaAvista` e `percentualTarifaCredito`.
- Banco: definidos como `DECIMAL(14,2)` nas migrations/tabelas.
- Modelos/DTOs atuais usam `string | null`.

### Motivações para tipar como `string`
1. **Precisão:** JavaScript não possui tipo decimal fixo; usar `number` pode gerar arredondamentos inesperados. Mantendo `string`, preservamos exatamente o valor vindo do banco (ex.: `12.34`).
2. **Comportamento do Sequelize:** para colunas `DECIMAL/NUMERIC`, o Sequelize retorna `string` por padrão (exceto se configurarmos `dialectOptions.decimalNumbers = true`). Tipar o campo como `string` evita conversões implícitas e inconsistências.
3. **Conversões explícitas:** quando for necessário calcular percentuais, a conversão para `number`/`Big.js` acontece de forma consciente, facilitando validações e reduzindo risco de perda de precisão.

### Boas práticas ao consumir esses campos
- **Exibição/UI:** utilizar o valor string diretamente ou aplicar formatação (ex.: `parseFloat(valor).toLocaleString(...)`).
- **Cálculos:** converter explicitamente (`const tarifa = Number(percentualTarifaAvista ?? 0) / 100`) ou usar bibliotecas de precisão decimal.
- **APIs/DTOs:** manter o contrato em string para evitar diferença entre backend e frontend.
- **Necessidade de números nativos?**
  - Configurar `dialectOptions.decimalNumbers = true` no Sequelize _obriga_ revisar todos os pontos que assumem string.
  - Alternativamente, ajustar o model/interface para `number` apenas quando existir validação sólida de que nenhuma precisão será perdida.

### Checklist antes de alterar o tipo
1. Conferir se existem cálculos ou comparações que dependem de string.
2. Revisar services/serializers que enviam esses campos ao frontend.
3. Garantir testes (unitários ou manuais) cobrindo arredondamentos e validações de limites.

> **Resumo:** Manter campos `DECIMAL` como `string` no model é intencional para preservar precisão e seguir o comportamento default do Sequelize. Converta explicitamente apenas quando necessário.
