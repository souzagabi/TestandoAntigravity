# Sistema de Triggers para Transições de Status

## 📋 Visão Geral

O sistema de triggers permite executar ações automáticas durante as transições de status dos agendamentos, implementando regras de negócio complexas de forma **database-driven** e **multi-clínica**. Cada clínica pode configurar seus próprios triggers através da tabela `clinica_agenda_status_trans`.

## 🏗️ Arquitetura Database-Driven

### Componentes Principais

1. **StatusTransitionTriggerService**: Serviço principal que gerencia e executa triggers
2. **clinica_agenda_status_trans**: Tabela que define transições e triggers por empresa
3. **TriggerFunctions**: Funções de trigger registradas por nome
4. **Integration Point**: Integração no `agendamentoController.changeStatus()`

### Fluxo de Execução Database-Driven (com Contexto)

```
1. Usuário solicita mudança de status informando o contexto (`AGENDAMENTO` ou `FATURAMENTO`)
2. Validação da transição (regras de negócio)
3. Atualização do status no banco
4. 🎯 BUSCA TRIGGER NA TABELA (por empresa + transição)
5. EXECUÇÃO DO TRIGGER (se configurado)
6. Criação do histórico
7. Commit da transação
```

## 🗄️ Estrutura da Tabela clinica_agenda_status_trans

```sql
CREATE TABLE clinica_agenda_status_trans (
  trans_status_id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL,
  de_status_id INTEGER NOT NULL,
  para_status_id INTEGER NOT NULL,
  trigger VARCHAR(128) NULL,        -- 🎯 Nome do trigger a executar
  st_ativo BOOLEAN DEFAULT TRUE,
  st_excluido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  UNIQUE(empresa_id, de_status_id, para_status_id)
);
```

## 🔧 Estrutura de uma Função de Trigger

```typescript
type TriggerFunction = (
  agendamento: ClinicaAgendamento,
  fromStatus: number,
  toStatus: number,
  transaction: Transaction
) => Promise<void>;
```

## Implementação

### 1. Arquivo de Serviço
**Localização**: `/server/src/services/clinica/StatusTransitionTriggerService.ts`

### ⚙️ Configuração e Uso Database-Driven

### 1. Registrar Funções de Trigger

**No arquivo de inicialização da aplicação** (ex: `app.ts` ou `server.ts`):

```typescript
import { StatusTransitionTriggerService, TriggerFunctions } from './services/clinica/StatusTransitionTriggerService';

// Registrar funções de trigger na inicialização
StatusTransitionTriggerService.registerTriggerFunction('registrarChegada', TriggerFunctions.registrarChegada);
StatusTransitionTriggerService.registerTriggerFunction('iniciarAtendimento', TriggerFunctions.iniciarAtendimento);
StatusTransitionTriggerService.registerTriggerFunction('finalizarAtendimento', TriggerFunctions.finalizarAtendimento);
StatusTransitionTriggerService.registerTriggerFunction('processarFalta', TriggerFunctions.processarFalta);
```

### 2. Configurar Transições e Triggers no Banco

Para cada empresa, configure as transições de status e seus triggers:

```sql
-- Configuração completa para Clínica A
INSERT INTO clinica_agenda_status_trans 
(empresa_id, de_status_id, para_status_id, trigger, st_ativo) VALUES
(1, 1, 2, 'registrarChegada', true),      -- AGENDADO → PRESENTE (com trigger)
(1, 2, 3, 'iniciarAtendimento', true),    -- PRESENTE → ATENDIMENTO (com trigger)
(1, 3, 4, 'finalizarAtendimento', true),  -- ATENDIMENTO → ATENDIDO (com trigger)
(1, 1, 5, 'processarFalta', true),        -- AGENDADO → NAO_COMPARECEU (com trigger)
(1, 2, 5, NULL, true),                    -- PRESENTE → NAO_COMPARECEU (sem trigger)
(1, 1, 6, NULL, true);                    -- AGENDADO → CANCELADO (sem trigger)

-- Configuração personalizada para Clínica B
INSERT INTO clinica_agenda_status_trans 
(empresa_id, de_status_id, para_status_id, trigger, st_ativo) VALUES
(2, 1, 2, 'registrarChegada', true),      -- Apenas registra chegada
(2, 2, 3, NULL, true),                    -- Sem trigger para início
(2, 3, 4, 'finalizarAtendimento', true),  -- Apenas finaliza atendimento
(2, 1, 5, NULL, true);                    -- Sem trigger para falta
```

### 3. Uso Automático (com Contexto)

Os triggers são executados automaticamente durante as mudanças de status através do endpoint:

```http
POST /api/clinica/agendamento/:agendamentoId/status/transicao?contexto=AGENDAMENTO|FATURAMENTO
Content-Type: application/json

{
  "novoStatusId": 2,
  "observacoes": "Paciente chegou no horário"
}
```

**Fluxo Interno**:
1. Sistema busca transição na tabela `clinica_agenda_status_trans`
2. Se encontrar campo `trigger` preenchido, executa a função correspondente (em qualquer contexto)
3. Se campo `trigger` for NULL, apenas faz a transição sem trigger

## Funções de Trigger Disponíveis

### 1. registrarChegada
**Uso**: Quando paciente chega (→ PRESENTE)

**Ações Executadas**:
- Registra horário de chegada (`horaChegada`)
- Ativa senha no painel (se configurado)

```typescript
registrarChegada: async (agendamento, fromStatus, toStatus, transaction) => {
  await agendamento.update({
    horaChegada: new Date()
  }, { transaction });
  
  if (agendamento.nroSenhaPainel) {
    console.log(`Ativando senha ${agendamento.nroSenhaPainel} no painel`);
  }
}
```

### 2. iniciarAtendimento
**Uso**: Quando inicia atendimento (→ EM_ATENDIMENTO)

**Ações Executadas**:
- Registra horário de início (`horaInicioAtendimento`)
- Notifica sistema de prontuário eletrônico

```typescript
iniciarAtendimento: async (agendamento, fromStatus, toStatus, transaction) => {
  await agendamento.update({
    horaInicioAtendimento: new Date()
  }, { transaction });
  
  // await notificarProntuario(agendamento.agendamentoId);
}
```

### 3. finalizarAtendimento
**Uso**: Quando finaliza atendimento (→ ATENDIDO)

**Ações Executadas**:
- Registra horário de fim (`horaFimAtendimento`)
- Calcula tempo total de atendimento
- Inicia processo de faturamento (opcional)

```typescript
finalizarAtendimento: async (agendamento, fromStatus, toStatus, transaction) => {
  await agendamento.update({
    horaFimAtendimento: new Date()
  }, { transaction });
  
  if (agendamento.horaInicioAtendimento) {
    const tempo = new Date().getTime() - agendamento.horaInicioAtendimento.getTime();
    console.log(`Tempo de atendimento: ${Math.round(tempo / 60000)} minutos`);
  }
}
```

### 4. processarFalta
**Uso**: Quando paciente não comparece (→ NAO_COMPARECEU)

**Ações Executadas**:
- Libera horário na agenda
- Registra falta do paciente
- Envia notificação para reagendamento

```typescript
processarFalta: async (agendamento, fromStatus, toStatus, transaction) => {
  // Registrar falta no histórico do paciente
  console.log(`Paciente ${agendamento.pacienteId} não compareceu ao agendamento ${agendamento.agendamentoId}`);
  
  // Liberar horário para reagendamento
  // await liberarHorarioAgenda(agendamento);
  
  // Enviar notificação para reagendamento
  // await enviarNotificacaoReagendamento(agendamento.pacienteId);
}
```

## Configuração e Uso

### 1. Registrar Triggers

No arquivo de inicialização da aplicação (ex: `server.ts`):

```typescript
import { StatusTransitionTriggerService, StatusTriggers } from './services/clinica/StatusTransitionTriggerService';

// Registrar triggers padrão
StatusTransitionTriggerService.registerTrigger(StatusTriggers.onPacienteChegou);
StatusTransitionTriggerService.registerTrigger(StatusTriggers.onIniciarAtendimento);
StatusTransitionTriggerService.registerTrigger(StatusTriggers.onFinalizarAtendimento);
StatusTransitionTriggerService.registerTrigger(StatusTriggers.onPacienteNaoCompareceu);
```

### 2. Criar Trigger Personalizado

```typescript
const meuTriggerPersonalizado: StatusTrigger = {
  name: 'Meu Trigger Personalizado',
  fromStatusId: 1, // Apenas quando vem do status 1
  toStatusId: 3,   // Para o status 3
  execute: async (agendamento, fromStatus, toStatus, transaction) => {
    // Sua lógica personalizada aqui
    console.log(`Executando trigger personalizado para agendamento ${agendamento.agendamentoId}`);
    
    // Exemplo: enviar email
    // await enviarEmail(agendamento.paciente.pessoa.email);
    
    // Exemplo: atualizar campo personalizado
    await agendamento.update({
      observacao: `Trigger executado em ${new Date().toISOString()}`
    }, { transaction });
  }
};

// Registrar o trigger
StatusTransitionTriggerService.registerTrigger(meuTriggerPersonalizado);
```

## 🔍 Casos de Uso Avançados

### 1. Triggers Condicionais

```typescript
const triggerCondicional: StatusTrigger = {
  name: 'Cobrança Particular',
  toStatusId: 4, // ATENDIDO
  execute: async (agendamento, fromStatus, toStatus, transaction) => {
    // Só executar para convênio particular
    if (agendamento.convenioId === CONVENIO_PARTICULAR_ID) {
      await gerarCobrancaImediata(agendamento, transaction);
    }
  }
};
```

### 2. Triggers em Cadeia

```typescript
const triggerCadeia: StatusTrigger = {
  name: 'Controle de Faltas',
  toStatusId: 5, // NAO_COMPARECEU
  execute: async (agendamento, fromStatus, toStatus, transaction) => {
    const faltas = await contarFaltasPaciente(agendamento.pacienteId);
    
    // Se for terceira falta, bloquear paciente
    if (faltas >= 3) {
      await bloquearPaciente(agendamento.pacienteId, transaction);
      
      // Notificar administração
      await notificarAdministracao(`Paciente ${agendamento.pacienteId} bloqueado por excesso de faltas`);
    }
  }
};
```

### 3. Triggers com Validação

```typescript
const triggerComValidacao: StatusTrigger = {
  name: 'Validar Documentos',
  toStatusId: 3, // EM_ATENDIMENTO
  execute: async (agendamento, fromStatus, toStatus, transaction) => {
    // Verificar se documentos estão completos
    const documentosOk = await verificarDocumentosPaciente(agendamento.pacienteId);
    
    if (!documentosOk) {
      throw new Error('Documentos do paciente incompletos. Não é possível iniciar atendimento.');
    }
    
    // Continuar com o atendimento
    await agendamento.update({
      horaInicioAtendimento: new Date(),
      observacao: 'Documentos validados automaticamente'
    }, { transaction });
  }
};
```

## 🛠️ Utilitários do Serviço

### Listar Triggers Registrados
```typescript
const triggers = StatusTransitionTriggerService.getRegisteredTriggers();
console.log('Triggers registrados:', triggers.map(t => t.name));
```

### Limpar Triggers (útil para testes)
```typescript
StatusTransitionTriggerService.clearTriggers();
```

## ⚠️ Considerações Importantes

### 1. Transações
- Todos os triggers são executados dentro da **mesma transação**
- Se um trigger falha, **toda a transição é revertida**
- Use `transaction` em todas as operações de banco

### 2. Performance
- Triggers são executados **sequencialmente**
- Evite operações longas que podem travar a transição
- Para operações assíncronas, considere usar filas

### 3. Logs e Debugging
- Cada trigger logga sua execução
- Erros são capturados e propagados
- Use `console.log` para debugging durante desenvolvimento

### 4. Mapeamento de Status
- Certifique-se de usar os **IDs corretos** dos status
- Consulte a tabela `clinica_agenda_status` para os IDs reais
- Status IDs podem variar entre ambientes

## 📊 Exemplo de Fluxo Completo (com Contexto + preActions)

```
AGENDADO (1) → PRESENTE (2)
├── Trigger: onPacienteChegou
├── Ação: Registrar horaChegada
├── Ação: Ativar senha no painel
└── Histórico: Criado

PRESENTE (2) → EM_ATENDIMENTO (3)
├── Trigger: onIniciarAtendimento
├── Ação: Registrar horaInicioAtendimento
├── Ação: Notificar prontuário
└── Histórico: Criado

EM_ATENDIMENTO (3) → ATENDIDO (4)
├── Trigger: onFinalizarAtendimento
├── Ação: Registrar horaFimAtendimento
├── Ação: Calcular tempo de atendimento
├── Ação: Iniciar faturamento
└── Histórico: Criado
```

## 🌐 Integração com Frontend (Orchestrator + preActions)

- O frontend recebe `preActions` em `GET /api/clinica/agendamento/:agendamentoId/status/proximos?contexto=...` e executa via `StatusTransitionOrchestrator`.
- O Orchestrator usa `ModalStackContext` para abrir modais encadeados e consolidar `requestData` (ex.: observação) e `overrideStatusId` quando indicado.
- A transição final é enviada para `POST /status/transicao?contexto=...` com os dados reunidos.

### Endpoints consumidos pelo Frontend
- `GET /api/clinica/agendamento/:agendamentoId/status/proximos?contexto=AGENDAMENTO|FATURAMENTO`
- `POST /api/clinica/agendamento/:agendamentoId/status/transicao?contexto=AGENDAMENTO|FATURAMENTO`

## 🚀 Próximos Passos

1. **Mapear Status IDs**: Identificar IDs reais dos status no banco
2. **Implementar Triggers Específicos**: Baseado nas regras de negócio
3. **Registrar na Inicialização**: Ativar triggers no startup da aplicação
4. **Testar Transições**: Verificar execução correta dos triggers
5. **Monitorar Performance**: Acompanhar tempo de execução
6. **Documentar Regras**: Manter documentação atualizada

---

**Arquivo**: `StatusTransitionTriggerService.ts`  
**Versão**: 1.0  
**Última Atualização**: 2025-08-20
