no sistema legado era feito de duas formas 
gerar parcelas financeiras no sistema
a principal é através de um movimento de saída 
podendo ser venda de mercadorias ou serviços
a partir deste lançamento é gerado as parcelas financeiras e também a integração com a contabilidade gerencial

neste caso o registro contábil
na configuração da natureza de operação existe as contas de crédito e débito e histórico que serão utilizadas para o lançamento
aqui um exemplo:
debito     -> caixa
credito    -> serviços prestados
histórico  -> venda de serviços conforme documento
valor      -> 100,00
data       -> mesma data do movimento
conciliado -> sim

já o lançamento do registro financeiro vai ser:
debito     -> conta corrente padrão de clientes
credito    -> caixa
histórico  -> venda de serviços conforme documento
valor      -> 100,00
data       -> mesma data do movimento
conciliado -> sim

quando o cliente efetuar o pagamento da parcela vai ser:
debito     -> caixa
credito    -> conta corrente padrão de clientes
histórico  -> duplicata recebida conforme documento
valor      -> 100,00
data       -> data da baixa
conciliado -> sim


agora o lançamento quando o usuário inclui a parcela diretamente no contas a receber sem passar pelo movimento de venda de serviço ou mercadoria:

neste caso o registro contábil
na configuração da natureza de operação existe as contas de crédito e débito e histórico que serão utilizadas para o lançamento
aqui um exemplo:
debito     -> conta corrente padrão de clientes
credito    -> conta que o usuário escolheu como receita para este lançamento
histórico  -> histórico que o usuário escolheu como histórico para este lançamento
valor      -> 100,00
data       -> mesma data da emissão da parcela
conciliado -> sim

quando baixar o recebimento da parcela:
debito     -> caixa
credito    -> conta corrente padrão de clientes
histórico  -> duplicata recebida conforme documento
valor      -> 100,00
data       -> data da baixa
conciliado -> sim


este é o fluxo que ocorria no sistema legado
inclusive quando era processado o movimento de venda, ele executava um lançamento duplicado no caixa, para registro
se você tiver alguma orientação, talvez alguma conta transitória
ficamos abertos para sugestões e analises

### fluxo para registro de baixas quando ocorrer incidencia de multa/juros/descontos
nas configurações do sistema existem as contas especificas para registrar multas/juros/descontos nas receitas e despesas

receber
  rcbtoMultaContaId
  rcbtoMultaHistoricoId
  rcbtoJurosContaId
  rcbtoJurosHistoricoId
  descConcedidoContaId
  descConcedidoHistoricoId

pagar
  pgtoMultaContaId
  pgtoMultaHistoricoId
  pgtoJurosContaId
  pgtoJurosHistoricoId
  descRecebidoContaId
  descRecebidoHistoricoId


## quando baixar o recebimento da parcela e tiver multa e Juros:
Valor da Parcela: 100,00
Valor da Multa: 2,00
Valor de Juros: 1,00
Valor Total: 103,00

Lançamento no CAIXA ou conta que o usuário escolheu como recebimento
debito     -> caixa  
credito    -> conta corrente padrão de clientes
histórico  -> duplicata recebida conforme documento
valor      -> 103,00
data       -> data da baixa
conciliado -> sim

debito     -> conta corrente padrão de clientes  
credito    -> rcbtoMultaContaId
histórico  -> rcbtoMultaHistoricoId
valor      -> 2,00
data       -> data da baixa
conciliado -> sim

debito     -> conta corrente padrão de clientes  
credito    -> rcbtoJurosContaId
histórico  -> rcbtoJurosHistoricoId
valor      -> 1,00
data       -> data da baixa
conciliado -> sim


## Quando baixar o recebimento da parcela e tiver Descontos:
Valor da Parcela: 100,00
Valor Desconto: 10,00
Valor Total: 90,00

Lançamento no CAIXA ou conta que o usuário escolheu como recebimento
debito     -> caixa  
credito    -> conta corrente padrão de clientes
histórico  -> duplicata recebida conforme documento
valor      -> 90,00
data       -> data da baixa
conciliado -> sim

debito     -> descConcedidoContaId
credito    -> conta corrente padrão de clientes  
histórico  -> descConcedidoHistoricoId
valor      -> 10,00
data       -> data da baixa
conciliado -> sim

