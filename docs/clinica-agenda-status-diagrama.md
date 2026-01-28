# Clínica - Fluxos de Status de Agendamento

Este diagrama representa a máquina de estados (FSM) dos agendamentos, com as transições permitidas conforme os seeders:
- `server/src/database/seeders/20250625-02-clinica-agenda-status-Default.ts`
- `server/src/database/seeders/20250625-03-clinica-agenda-status-trans-Default.ts`

Os nós estão agrupados por categoria e coloridos conforme a cor definida em cada status.

```mermaid
stateDiagram-v2
  state "Pré-Atendimento" as PreAt {
    state "1 - AGENDADO" as S1
    state "2 - PRESENTE AGUARDANDO" as S2
    state "6 - NÃO COMPARECEU" as S6
    state "7 - CANCELOU" as S7
    state "8 - REAGENDOU" as S8
  }

  state "Atendimento" as Atend {
    state "3 - EM PRÉ-ATENDIMENTO" as S3
    state "4 - EM ATENDIMENTO" as S4
    state "5 - ATENDIDO" as S5
  }

  state "Financeiro" as Fin {
    state "9 - AGUARDANDO FATURAR" as S9
    state "10 - CARTEIRA" as S10
    state "11 - RECEBIDO (FIN)" as S11
  }

  state "Faturamento" as Fat {
    state "12 - AUTORIZADO" as S12
    state "13 - EM LOTE DE FATURAMENTO" as S13
    state "14 - FATURADO" as S14
    state "15 - GLOSA" as S15
    state "16 - GLOSA-RECURSO" as S16
    state "17 - RECEBIDO (FAT)" as S17
  }

  %% Transições de Pré-Atendimento
  S1 --> S2
  S1 --> S6
  S1 --> S7
  S1 --> S8

  S2 --> S3
  S2 --> S4
  S2 --> S5
  S2 --> S1

  S3 --> S4
  S4 --> S5

  S5 --> S1
  S6 --> S1
  S7 --> S1
  S8 --> S1

  %% Transições de Financeiro/Faturamento
  S9 --> S11
  S9 --> S10
  S9 --> S12

  S10 --> S9
  S10 --> S11

  S11 --> S9

  S12 --> S13
  S12 --> S9
  S12 --> S14

  S13 --> S12
  S13 --> S14
  S13 --> S15

  S14 --> S13
  S14 --> S15
  S14 --> S17

  S15 --> S13
  S15 --> S14
  S15 --> S16

  S16 --> S14
  S16 --> S15
  S16 --> S13

  S17 --> S14

  %% Estilos (cores conforme seeders) - usar classDef/class em stateDiagram-v2
  classDef cS1 fill:#f6f86d,stroke:#333,color:#000
  classDef cS2 fill:#a1ff2e,stroke:#333,color:#000
  classDef cS3 fill:#28c3a9,stroke:#333,color:#000
  classDef cS4 fill:#33ffdd,stroke:#333,color:#000
  classDef cS5 fill:#3399FF,stroke:#333,color:#fff
  classDef cS6 fill:#990036,stroke:#333,color:#fff
  classDef cS7 fill:#ef1f68,stroke:#333,color:#fff
  classDef cS8 fill:#ffa033,stroke:#333,color:#000
  classDef cS9 fill:#ffffff,stroke:#333,color:#000
  classDef cS10 fill:#e538ae,stroke:#333,color:#fff
  classDef cS11 fill:#49e01f,stroke:#333,color:#000
  classDef cS12 fill:#33ffdd,stroke:#333,color:#000
  classDef cS13 fill:#d6d1cd,stroke:#333,color:#000
  classDef cS14 fill:#adb3b8,stroke:#333,color:#000
  classDef cS15 fill:#e538ae,stroke:#333,color:#fff
  classDef cS16 fill:#af04a9,stroke:#333,color:#fff
  classDef cS17 fill:#49e01f,stroke:#333,color:#000

  class S1 cS1
  class S2 cS2
  class S3 cS3
  class S4 cS4
  class S5 cS5
  class S6 cS6
  class S7 cS7
  class S8 cS8
  class S9 cS9
  class S10 cS10
  class S11 cS11
  class S12 cS12
  class S13 cS13
  class S14 cS14
  class S15 cS15
  class S16 cS16
  class S17 cS17
```

## Observações
- As cores dos nós correspondem ao campo `cor` de cada status no seeder `20250625-02-clinica-agenda-status-Default.ts`.
- Como há dois status com descrição "RECEBIDO" (11 e 17), foram rotulados como `RECEBIDO (FIN)` e `RECEBIDO (FAT)` para desambiguar as categorias.
- Este diagrama utiliza `stateDiagram-v2` do Mermaid, adequado para modelar máquinas de estados finitos.
