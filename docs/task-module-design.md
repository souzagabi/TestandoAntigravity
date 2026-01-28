# Modelagem do Módulo de Tarefas e Projetos (Task/Project)

Este documento descreve a modelagem completa do módulo de gerenciamento de tarefas e projetos.

## 1. Visão Geral

O módulo permite:

- Cadastrar tarefas individuais ou vinculadas a projetos
- Atribuir tarefas a um ou mais usuários
- Dividir tarefas em subtarefas
- Organizar projetos em fases
- Anexar arquivos, imagens e links
- Acompanhar progresso com indicadores visuais
- Controlar prazos e prioridades
- Avaliar tarefas concluídas (feedback do solicitante)

## 2. Diagrama de Entidades (ERD)

```text

┌─────────────────┐       ┌─────────────────────┐
│  task_projeto   │───────│ task_projeto_fase   │
│  (Projetos)     │ 1:N   │ (Fases do Projeto)  │
└────────┬────────┘       └──────────┬──────────┘
         │                           │
         │ 1:N                       │ 1:N
         ▼                           ▼
┌─────────────────────────────────────────────────┐
│                  task_tarefa                     │
│                  (Tarefas)                       │
│  - Pode ser independente (sem projeto)          │
│  - Pode ter subtarefas (auto-relacionamento)    │
└──────┬──────────┬──────────┬──────────┬─────────┘
       │          │          │          │
       │ 1:N      │ 1:N      │ 1:N      │ 1:N
       ▼          ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────────┐ ┌──────────┐
│atribuicao│ │comentario│ │ anexo  │ │   link     │ │avaliacao │
└──────────┘ └──────────┘ └────────┘ └────────────┘ └──────────┘

Tabelas de Domínio:
┌───────────────┐  ┌─────────────┐
│task_prioridade│  │ task_status │
└───────────────┘  └─────────────┘
```

## 3. Especificação das Tabelas

### 3.1 task_prioridade (Prioridades)

Tabela de domínio para níveis de prioridade.

| Coluna | Tipo | Null | Descrição |
|--------|------|------|-----------|

| prioridade_id | SERIAL | PK | Identificador único |
| empresa_id | INTEGER | FK | Multi-tenant |
| codigo | VARCHAR(20) | NOT NULL | Código único (BAIXA, MEDIA, ALTA, URGENTE) |
| descricao | VARCHAR(100) | NOT NULL | Descrição da prioridade |
| cor | VARCHAR(7) | NOT NULL | Cor hexadecimal (#FF0000) |
| icone | VARCHAR(50) | NULL | Nome do ícone (opcional) |
| ordem | INTEGER | NOT NULL | Ordenação |
| st_ativo | BOOLEAN | NOT NULL | Status ativo |
| st_excluido | BOOLEAN | NOT NULL | Exclusão lógica |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Valores padrão sugeridos:**

- BAIXA (#28A745, ordem 1)
- MEDIA (#FFC107, ordem 2)
- ALTA (#FD7E14, ordem 3)
- URGENTE (#DC3545, ordem 4)

---

### 3.2 task_status (Status)

Tabela de domínio para status das tarefas.

| Coluna | Tipo | Null | Descrição |
|--------|------|------|-----------|

| status_id | SERIAL | PK | Identificador único |
| empresa_id | INTEGER | FK | Multi-tenant |
| codigo | VARCHAR(20) | NOT NULL | Código único |
| descricao | VARCHAR(100) | NOT NULL | Descrição do status |
| cor | VARCHAR(7) | NOT NULL | Cor hexadecimal |
| icone | VARCHAR(50) | NULL | Nome do ícone |
| categoria | VARCHAR(20) | NOT NULL | PENDENTE, EM_ANDAMENTO, CONCLUIDO, CANCELADO |
| ordem | INTEGER | NOT NULL | Ordenação |
| st_inicial | BOOLEAN | NOT NULL | É status inicial? |
| st_final | BOOLEAN | NOT NULL | É status final? |
| st_ativo | BOOLEAN | NOT NULL | Status ativo |
| st_excluido | BOOLEAN | NOT NULL | Exclusão lógica |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Valores padrão sugeridos:**

- PENDENTE (categoria: PENDENTE, inicial: true)
- EM_ANDAMENTO (categoria: EM_ANDAMENTO)
- AGUARDANDO (categoria: PENDENTE)
- DEVOLVIDO (categoria: EM_ANDAMENTO) - *Tarefa devolvida para ajustes após avaliação*
- CONCLUIDO (categoria: CONCLUIDO, final: true)
- CANCELADO (categoria: CANCELADO, final: true)

---

### 3.3 task_projeto (Projetos)

Entidade principal para projetos.

| Coluna | Tipo | Null | Descrição |
|--------|------|------|-----------|

| projeto_id | SERIAL | PK | Identificador único |
| empresa_id | INTEGER | FK | Multi-tenant |
| codigo | VARCHAR(20) | NULL | Código do projeto (opcional) |
| titulo | VARCHAR(200) | NOT NULL | Título do projeto |
| descricao | TEXT | NULL | Descrição detalhada |
| responsavel_id | INTEGER | FK | Usuário responsável principal |
| data_inicio | DATE | NULL | Data de início prevista |
| data_fim_prevista | DATE | NULL | Data de término prevista |
| data_fim_real | DATE | NULL | Data de término real |
| status_id | INTEGER | FK | Status atual do projeto |
| prioridade_id | INTEGER | FK | Prioridade do projeto |
| percentual_concluido | DECIMAL(5,2) | NOT NULL | % de conclusão (0-100) |
| cor | VARCHAR(7) | NULL | Cor do projeto (visual) |
| st_ativo | BOOLEAN | NOT NULL | Status ativo |
| st_excluido | BOOLEAN | NOT NULL | Exclusão lógica |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Índices:**

- `idx_task_projeto_empresa` (empresa_id)
- `idx_task_projeto_responsavel` (responsavel_id)
- `idx_task_projeto_status` (status_id)

---

### 3.4 task_projeto_fase (Fases do Projeto)

Divisão do projeto em fases/etapas.

| Coluna | Tipo | Null | Descrição |
|--------|------|------|-----------|

| fase_id | SERIAL | PK | Identificador único |
| empresa_id | INTEGER | FK | Multi-tenant |
| projeto_id | INTEGER | FK | Projeto pai |
| titulo | VARCHAR(200) | NOT NULL | Título da fase |
| descricao | TEXT | NULL | Descrição da fase |
| ordem | INTEGER | NOT NULL | Ordem sequencial |
| data_inicio | DATE | NULL | Data início prevista |
| data_fim_prevista | DATE | NULL | Data fim prevista |
| data_fim_real | DATE | NULL | Data fim real |
| status_id | INTEGER | FK | Status da fase |
| percentual_concluido | DECIMAL(5,2) | NOT NULL | % de conclusão |
| st_ativo | BOOLEAN | NOT NULL | Status ativo |
| st_excluido | BOOLEAN | NOT NULL | Exclusão lógica |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Índices:**

- `idx_task_fase_projeto` (projeto_id)
- `idx_task_fase_ordem` (projeto_id, ordem)

---

### 3.5 task_tarefa (Tarefas)

Entidade central do módulo.

| Coluna | Tipo | Null | Descrição |
|--------|------|------|-----------|

| tarefa_id | SERIAL | PK | Identificador único |
| empresa_id | INTEGER | FK | Multi-tenant |
| projeto_id | INTEGER | FK | Projeto (opcional) |
| fase_id | INTEGER | FK | Fase do projeto (opcional) |
| tarefa_pai_id | INTEGER | FK | Tarefa pai (subtarefas) |
| codigo | VARCHAR(20) | NULL | Código da tarefa (auto-gerado) |
| titulo | VARCHAR(200) | NOT NULL | Título da tarefa |
| descricao | TEXT | NULL | Descrição detalhada (HTML) |
| criador_id | INTEGER | FK | Usuário que criou |
| status_id | INTEGER | FK | Status atual |
| prioridade_id | INTEGER | FK | Prioridade |
| data_inicio | DATE | NULL | Data de início |
| data_fim_prevista | DATE | NULL | Prazo/deadline |
| data_fim_real | DATE | NULL | Data de conclusão real |
| hora_estimada | DECIMAL(6,2) | NULL | Horas estimadas |
| hora_realizada | DECIMAL(6,2) | NULL | Horas realizadas |
| percentual_concluido | DECIMAL(5,2) | NOT NULL | % de conclusão (0-100) |
| ordem | INTEGER | NOT NULL | Ordenação |
| st_ativo | BOOLEAN | NOT NULL | Status ativo |
| st_excluido | BOOLEAN | NOT NULL | Exclusão lógica |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Índices:**

- `idx_task_tarefa_empresa` (empresa_id)
- `idx_task_tarefa_projeto` (projeto_id)
- `idx_task_tarefa_fase` (fase_id)
- `idx_task_tarefa_pai` (tarefa_pai_id)
- `idx_task_tarefa_criador` (criador_id)
- `idx_task_tarefa_status` (status_id)
- `idx_task_tarefa_prazo` (data_fim_prevista)

---

### 3.6 task_tarefa_atribuicao (Atribuições)

Relacionamento N:M entre tarefas e usuários.

| Coluna | Tipo | Null | Descrição |
|--------|------|------|-----------|

| atribuicao_id | SERIAL | PK | Identificador único |
| empresa_id | INTEGER | FK | Multi-tenant |
| tarefa_id | INTEGER | FK | Tarefa |
| usuario_id | INTEGER | FK | Usuário atribuído |
| st_responsavel | BOOLEAN | NOT NULL | É o responsável principal? |
| data_atribuicao | TIMESTAMP | NOT NULL | Data da atribuição |
| atribuido_por_id | INTEGER | FK | Quem atribuiu |
| st_ativo | BOOLEAN | NOT NULL | Status ativo |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Índices:**

- `idx_task_atribuicao_tarefa` (tarefa_id)
- `idx_task_atribuicao_usuario` (usuario_id)
- `uk_task_atribuicao` UNIQUE (tarefa_id, usuario_id)

**Regras de Negócio:**

- Usuários só podem ser atribuídos a tarefas de um projeto se forem **membros do projeto** (caso a tarefa esteja vinculada a um projeto).

---

### 3.7 task_tarefa_comentario (Comentários)

Histórico de comentários e atualizações.

| Coluna | Tipo | Null | Descrição |
|--------|------|------|-----------|

| comentario_id | SERIAL | PK | Identificador único |
| empresa_id | INTEGER | FK | Multi-tenant |
| tarefa_id | INTEGER | FK | Tarefa |
| usuario_id | INTEGER | FK | Autor do comentário |
| conteudo | TEXT | NOT NULL | Conteúdo (HTML) |
| tipo | VARCHAR(20) | NOT NULL | COMENTARIO, ATUALIZACAO, SISTEMA |
| st_editado | BOOLEAN | NOT NULL | Foi editado? |
| st_excluido | BOOLEAN | NOT NULL | Exclusão lógica |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Índices:**

- `idx_task_comentario_tarefa` (tarefa_id)
- `idx_task_comentario_usuario` (usuario_id)

---

### 3.8 task_tarefa_anexo (Anexos)

Arquivos anexados às tarefas (armazenados no S3).

| Coluna | Tipo | Null | Descrição |
|--------|------|------|-----------|

| anexo_id | SERIAL | PK | Identificador único |
| empresa_id | INTEGER | FK | Multi-tenant |
| tarefa_id | INTEGER | FK | Tarefa |
| nome_original | VARCHAR(255) | NOT NULL | Nome original do arquivo |
| nome_arquivo | VARCHAR(255) | NOT NULL | Nome no S3 (UUID) |
| tipo_arquivo | VARCHAR(100) | NOT NULL | MIME type |
| tamanho_arquivo | INTEGER | NOT NULL | Tamanho em bytes |
| caminho_s3 | VARCHAR(500) | NOT NULL | Path no S3 |
| usuario_id | INTEGER | FK | Quem fez upload |
| st_ativo | BOOLEAN | NOT NULL | Status ativo |
| st_excluido | BOOLEAN | NOT NULL | Exclusão lógica |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Índices:**

- `idx_task_anexo_tarefa` (tarefa_id)

---

### 3.9 task_tarefa_link (Links)

URLs relacionadas às tarefas.

| Coluna | Tipo | Null | Descrição |
|--------|------|------|-----------|

| link_id | SERIAL | PK | Identificador único |
| empresa_id | INTEGER | FK | Multi-tenant |
| tarefa_id | INTEGER | FK | Tarefa |
| titulo | VARCHAR(200) | NOT NULL | Título/descrição do link |
| url | VARCHAR(500) | NOT NULL | URL completa |
| usuario_id | INTEGER | FK | Quem adicionou |
| st_ativo | BOOLEAN | NOT NULL | Status ativo |
| st_excluido | BOOLEAN | NOT NULL | Exclusão lógica |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Índices:**

- `idx_task_link_tarefa` (tarefa_id)

---

### 3.10 task_tarefa_avaliacao (Avaliação/Feedback)

Avaliação da tarefa pelo solicitante após conclusão.

| Coluna | Tipo | Null | Descrição |
|--------|------|------|-----------|

| avaliacao_id | SERIAL | PK | Identificador único |
| empresa_id | INTEGER | FK | Multi-tenant |
| tarefa_id | INTEGER | FK | Tarefa avaliada |
| avaliador_id | INTEGER | FK | Usuário que avaliou (solicitante) |
| **st_aprovado** | BOOLEAN | NOT NULL | **true = aprovado, false = devolvido** |
| nota | INTEGER | NULL | Nota de 1 a 5 (obrigatório se aprovado) |
| comentario | TEXT | NULL | Comentário (obrigatório se devolvido) |
| data_avaliacao | TIMESTAMP | NOT NULL | Data/hora da avaliação |
| st_excluido | BOOLEAN | NOT NULL | Exclusão lógica |
| created_at | TIMESTAMP | NOT NULL | Data criação |
| updated_at | TIMESTAMP | NOT NULL | Data atualização |

**Regras de Negócio:**

- Apenas o **criador da tarefa** (solicitante) pode avaliar
- Avaliação só é permitida quando a tarefa está com status **CONCLUIDO**
- Uma tarefa pode ter **múltiplas avaliações** (histórico de devoluções)
- Se **aprovado**: nota obrigatória (1-5 estrelas), comentário opcional
- Se **devolvido**: comentário obrigatório explicando os ajustes, nota opcional

**Índices:**

- `idx_task_avaliacao_tarefa` (tarefa_id)
- `idx_task_avaliacao_avaliador` (avaliador_id)

**Fluxo de Avaliação:**

```text

Tarefa CONCLUÍDA → Solicitante avalia:
  ├─ APROVAR (st_aprovado = true)
  │    ├─ Nota obrigatória (1-5 estrelas)
  │    ├─ Comentário opcional
  │    └─ Tarefa permanece CONCLUÍDA ✓
  │
  └─ DEVOLVER (st_aprovado = false)
       ├─ Comentário obrigatório (explicar ajustes)
       ├─ Nota opcional
       └─ Tarefa volta para status DEVOLVIDO
           └─ Executor recebe notificação
```

**Validações:**

```typescript
// Verificar se pode avaliar
function podeAvaliar(tarefa: TaskTarefa, usuarioId: number): boolean {
  // Apenas o criador pode avaliar
  if (tarefa.criadorId !== usuarioId) return false;
  
  // Apenas tarefas concluídas
  if (tarefa.status.categoria !== 'CONCLUIDO') return false;
  
  return true;
}

// Validar avaliação
function validarAvaliacao(avaliacao: TaskTarefaAvaliacao): string[] {
  const erros: string[] = [];
  
  if (avaliacao.stAprovado) {
    // Aprovado: nota obrigatória
    if (!avaliacao.nota || avaliacao.nota < 1 || avaliacao.nota > 5) {
      erros.push('Nota é obrigatória (1-5) para aprovação');
    }
  } else {
    // Devolvido: comentário obrigatório
    if (!avaliacao.comentario?.trim()) {
      erros.push('Comentário é obrigatório ao devolver tarefa');
    }
  }
  
  return erros;
}
```

---

## 4. Relacionamentos

```text

CfgEmpresa (1) ──────────────────────────────────────────────────────────┐
    │                                                                     │
    ├──(1:N)──> task_projeto                                              │
    │               │                                                     │
    │               ├──(1:N)──> task_projeto_fase                         │
    │               │               │                                     │
    │               │               └──(1:N)──> task_tarefa               │
    │               │                                                     │
    │               └──(1:N)──> task_tarefa (sem fase)                    │
    │                                                                     │
    ├──(1:N)──> task_tarefa (independente, sem projeto)                   │
    │               │                                                     │
    │               ├──(1:N)──> task_tarefa (subtarefas - auto-ref)       │
    │               │                                                     │
    │               ├──(1:N)──> task_tarefa_atribuicao ──> SecUsuario     │
    │               │                                                     │
    │               ├──(1:N)──> task_tarefa_comentario ──> SecUsuario     │
    │               │                                                     │
    │               ├──(1:N)──> task_tarefa_anexo ──> SecUsuario          │
    │               │                                                     │
    │               │                                                     │
    │               ├──(1:N)──> task_tarefa_link ──> SecUsuario           │
    │               │                                                     │
    │               └──(1:1)──> task_tarefa_avaliacao ──> SecUsuario      │
    │                                                                     │
    ├──(1:N)──> task_prioridade                                           │
    │                                                                     │
    └──(1:N)──> task_status                                               │
                                                                          │
SecUsuario ───────────────────────────────────────────────────────────────┘
    │
    ├── criador de tarefas
    ├── responsável de projetos
    ├── atribuído a tarefas
    ├── autor de comentários
    ├── uploader de anexos
    └── avaliador de tarefas
```

## 5. Indicadores de Progresso

### 5.1 Cálculo de Status de Prazo

Para cada tarefa, calcular dinamicamente:

```typescript
enum StatusPrazo {
  SEM_PRAZO = 'SEM_PRAZO',      // Sem data_fim_prevista
  ADIANTADO = 'ADIANTADO',      // Concluída antes do prazo
  EM_DIA = 'EM_DIA',            // Dentro do prazo
  ATRASADO = 'ATRASADO',        // Prazo vencido
  CONCLUIDO = 'CONCLUIDO',      // Finalizada
}

function calcularStatusPrazo(tarefa: TaskTarefa): StatusPrazo {
  if (!tarefa.dataFimPrevista) return StatusPrazo.SEM_PRAZO;
  
  const hoje = new Date();
  const prazo = new Date(tarefa.dataFimPrevista);
  
  // Se está concluída
  if (tarefa.status.categoria === 'CONCLUIDO') {
    const dataFim = new Date(tarefa.dataFimReal || tarefa.updatedAt);
    return dataFim <= prazo ? StatusPrazo.ADIANTADO : StatusPrazo.CONCLUIDO;
  }
  
  // Se está cancelada
  if (tarefa.status.categoria === 'CANCELADO') {
    return StatusPrazo.CONCLUIDO;
  }
  
  // Em andamento ou pendente
  return hoje > prazo ? StatusPrazo.ATRASADO : StatusPrazo.EM_DIA;
}
```

### 5.2 Cores dos Indicadores

| Status | Cor | Badge |
|--------|-----|-------|

| SEM_PRAZO | Cinza (#6C757D) | `secondary` |
| ADIANTADO | Verde (#28A745) | `success` |
| EM_DIA | Azul (#007BFF) | `info` |
| ATRASADO | Vermelho (#DC3545) | `danger` |
| CONCLUIDO | Verde (#28A745) | `success` |

### 5.3 Cálculo de Percentual do Projeto

```typescript
function calcularPercentualProjeto(projeto: TaskProjeto): number {
  const tarefas = projeto.tarefas.filter(t => !t.stExcluido);
  
  if (tarefas.length === 0) return 0;
  
  const somaPercentuais = tarefas.reduce((acc, t) => acc + t.percentualConcluido, 0);
  return Math.round(somaPercentuais / tarefas.length);
}
```

## 6. Painel do Usuário (Dashboard)

### 6.1 Visões Principais

1. **Minhas Tarefas** - Tarefas atribuídas ao usuário logado
2. **Tarefas da Equipe** - Tarefas atribuídas a outros (visão gerencial)
3. **Meus Projetos** - Projetos onde é responsável
4. **Todos os Projetos** - Visão geral de projetos

### 6.2 Filtros Sugeridos

- Por status (Pendente, Em Andamento, Concluído)
- Por prioridade
- Por prazo (Atrasadas, Hoje, Esta Semana, Este Mês)
- Por projeto
- Por responsável

### 6.3 Widgets do Dashboard

1. **Resumo de Tarefas**
   - Total de tarefas
   - Pendentes
   - Em andamento
   - Atrasadas
   - Concluídas hoje

2. **Gráfico de Progresso**
   - Pizza ou barra com distribuição por status

3. **Próximos Prazos**
   - Lista das 5 próximas tarefas com prazo

4. **Tarefas Atrasadas**
   - Lista de tarefas com prazo vencido

## 7. Estrutura de Arquivos

### 7.1 Backend

```text

server/src/
├── database/
│   ├── models/
│   │   └── task/
│   │       ├── taskPrioridade.ts
│   │       ├── taskStatus.ts
│   │       ├── taskProjeto.ts
│   │       ├── taskProjetoFase.ts
│   │       ├── taskTarefa.ts
│   │       ├── taskTarefaAtribuicao.ts
│   │       ├── taskTarefaComentario.ts
│   │       ├── taskTarefaAnexo.ts
│   │       ├── taskTarefaLink.ts
│   │       ├── taskTarefaAvaliacao.ts
│   │       ├── taskAssociations.ts
│   │       └── initModelsTask.ts
│   ├── migrations/
│   │   └── task/
│   │       ├── 20241211000001-create-task-prioridade.ts
│   │       ├── 20241211000002-create-task-status.ts
│   │       ├── 20241211000003-create-task-projeto.ts
│   │       ├── 20241211000004-create-task-projeto-fase.ts
│   │       ├── 20241211000005-create-task-tarefa.ts
│   │       ├── 20241211000006-create-task-tarefa-atribuicao.ts
│   │       ├── 20241211000007-create-task-tarefa-comentario.ts
│   │       ├── 20241211000008-create-task-tarefa-anexo.ts
│   │       ├── 20241211000009-create-task-tarefa-link.ts
│   │       └── 20241211000010-create-task-tarefa-avaliacao.ts
│   └── seeders/
│       └── task/
│           ├── 20241211-01-task-prioridade-Default.ts
│           └── 20241211-02-task-status-Default.ts
├── controller/
│   └── task/
│       ├── taskPrioridadeController.ts
│       ├── taskStatusController.ts
│       ├── taskProjetoController.ts
│       ├── taskTarefaController.ts
│       ├── taskTarefaAvaliacaoController.ts
│       └── taskDashboardController.ts
├── routes/
│   └── task/
│       └── taskRoutes.ts
└── services/
    └── task/
        └── taskService.ts
```

### 7.2 Frontend

```text

front/src/
├── pages/
│   └── presentation/
│       └── task/
│           ├── TaskDashboardPage.tsx
│           ├── TaskTarefaListPage.tsx
│           ├── TaskTarefaEditPage.tsx
│           ├── TaskProjetoListPage.tsx
│           ├── TaskProjetoEditPage.tsx
│           ├── TaskPrioridadeListPage.tsx
│           └── TaskStatusListPage.tsx
├── components/
│   └── task/
│       ├── TarefaCard.tsx
│       ├── TarefaKanban.tsx
│       ├── ProjetoCard.tsx
│       ├── ComentarioManager.tsx
│       ├── AnexoManager.tsx
│       ├── LinkManager.tsx
│       ├── AtribuicaoManager.tsx
│       ├── SubtarefaManager.tsx
│       └── AvaliacaoManager.tsx
├── services/
│   └── task/
│       ├── taskTarefaService.ts
│       ├── taskProjetoService.ts
│       ├── taskTarefaAvaliacaoService.ts
│       └── taskDashboardService.ts
└── interfaces/
    └── task/
        └── index.ts
```

## 8. APIs Sugeridas

### 8.1 Tarefas

| Método | Endpoint | Descrição |
|--------|----------|-----------|

| GET | /api/task/tarefa | Listar tarefas (com filtros) |
| GET | /api/task/tarefa/:id | Buscar tarefa por ID |
| POST | /api/task/tarefa | Criar tarefa |
| PUT | /api/task/tarefa/:id | Atualizar tarefa |
| DELETE | /api/task/tarefa/:id | Excluir tarefa (lógico) |
| GET | /api/task/tarefa/:id/subtarefas | Listar subtarefas |
| POST | /api/task/tarefa/:id/atribuir | Atribuir usuário |
| DELETE | /api/task/tarefa/:id/atribuir/:usuarioId | Remover atribuição |
| POST | /api/task/tarefa/:id/comentario | Adicionar comentário |
| POST | /api/task/tarefa/:id/anexo | Upload de anexo |
| POST | /api/task/tarefa/:id/link | Adicionar link |
| GET | /api/task/tarefa/:id/avaliacao | Buscar avaliação da tarefa |
| POST | /api/task/tarefa/:id/avaliacao | Criar/atualizar avaliação |
| DELETE | /api/task/tarefa/:id/avaliacao | Remover avaliação |

### 8.2 Projetos

| Método | Endpoint | Descrição |
|--------|----------|-----------|

| GET | /api/task/projeto | Listar projetos |
| GET | /api/task/projeto/:id | Buscar projeto por ID |
| POST | /api/task/projeto | Criar projeto |
| PUT | /api/task/projeto/:id | Atualizar projeto |
| DELETE | /api/task/projeto/:id | Excluir projeto (lógico) |
| GET | /api/task/projeto/:id/fases | Listar fases |
| POST | /api/task/projeto/:id/fase | Criar fase |
| GET | /api/task/projeto/:id/tarefas | Listar tarefas do projeto |

### 8.3 Dashboard

| Método | Endpoint | Descrição |
|--------|----------|-----------|

| GET | /api/task/dashboard/resumo | Resumo geral |
| GET | /api/task/dashboard/minhas-tarefas | Tarefas do usuário |
| GET | /api/task/dashboard/atrasadas | Tarefas atrasadas |
| GET | /api/task/dashboard/proximos-prazos | Próximos prazos |

## 9. Considerações de Implementação

### 9.1 Geração de Código de Tarefa

Sugestão de formato: `TASK-{YYYYMM}-{SEQUENCIAL}`
Exemplo: `TASK-202412-0001`

### 9.2 Notificações (Futuro)

Considerar implementar notificações para:

- Nova tarefa atribuída
- Comentário em tarefa
- Prazo próximo (1 dia, 3 dias)
- Tarefa atrasada
- Mudança de status
- Tarefa avaliada (para o executor)

### 9.3 Permissões

Considerar níveis de acesso:

- Visualizar apenas suas tarefas
- Visualizar tarefas da equipe
- Gerenciar projetos
- Administrador do módulo

## 10. Próximos Passos

1. [ ] Criar modelos Sequelize
2. [ ] Criar migrations das tabelas
3. [ ] Configurar associações
4. [ ] Criar seeders de dados iniciais
5. [ ] Implementar controllers
6. [ ] Configurar rotas
7. [ ] Criar interfaces TypeScript (shared)
8. [ ] Implementar serviços frontend
9. [ ] Criar páginas e componentes
10. [ ] Implementar dashboard

---

Documento criado em: 11/12/2025
Autor: Cascade AI
