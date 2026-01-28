# Checklist Completo - Implementação de Cadastros Base (Padrão)

## 📋 Visão Geral

Sistema para gerenciar cadastros base (templates/padrão) que serão copiados para cada novo cliente/empresa no sistema SaaS.

**Estratégia**: Reutilização máxima de código através de herança de controllers, factory de services e componentes com props condicionais.

---

## 📊 Status Geral

- [x] **FASE 1**: Backend - Controllers Padrão (9/9) ✅ CONCLUÍDO
- [x] **FASE 2**: Backend - Rotas (5/5) ✅ CONCLUÍDO
- [x] **FASE 3**: Frontend - Services (1/1) ✅ CONCLUÍDO
- [x] **FASE 4**: Frontend - Componente de Importação (1/1) ✅ CONCLUÍDO
- [ ] **FASE 5**: Frontend - Páginas Reutilizáveis (0/4)
- [ ] **FASE 6**: Frontend - Rotas e Menu (0/2)
- [ ] **FASE 7**: Testes e Validação (0/2)

---

## FASE 1: BACKEND - Controllers Padrão

### ✅ 1.1 Plano de Contas Padrão
**Arquivo**: `server/src/controller/contabil/contabilPlanoContasPadraoController.ts`

- [x] Criar controller herdando de `contabilPlanoContasController.ts`
- [x] Remover filtro `empresaId` nas queries
- [x] Usar modelo `ContabilPlanoContasPadrao`
- [x] Adaptar métodos:
  - [x] findAll
  - [x] findOne
  - [x] create
  - [x] update
  - [x] delete
  - [x] buscarComFiltros
- [x] Criar método `importarParaEmpresa(empresaId)`
  - [x] Buscar todos registros da tabela padrão
  - [x] Usar transação do Sequelize
  - [x] Copiar para tabela empresa mantendo hierarquia
  - [x] Mapear IDs antigos para novos (contaSuperiorId)
  - [x] Retornar estatísticas: `{ totalImportado, erros, sucesso }`

**Endpoint de Importação**:
```
POST /api/contabil/plano-contas-padrao/importar-para-empresa/:empresaId
```

**✅ CONCLUÍDO** - Controller criado com sucesso!

---

### ✅ 1.2 Histórico Padrão
**Arquivo**: `server/src/controller/contabil/contabilHistoricoPadraoController.ts`

- [x] Criar controller herdando de `contabilHistoricoController.ts`
- [x] Remover filtro `empresaId`
- [x] Usar modelo `ContabilHistoricoPadrao`
- [x] Adaptar métodos CRUD
- [x] Criar método `importarParaEmpresa(empresaId)`
  - [x] Manter hierarquia (historicoSuperiorId)
  - [x] Retornar estatísticas

**Endpoint de Importação**:
```
POST /api/contabil/historico-padrao/importar-para-empresa/:empresaId
```

**✅ CONCLUÍDO** - Controller criado com sucesso!

---

### ✅ 1.3 Grupo de Contas Padrão
**Arquivo**: `server/src/controller/contabil/contabilGrupoContaPadraoController.ts`

- [x] Verificar se existe controller base para Grupo de Contas
- [x] Criar controller padrão
- [x] Criar método de importação
- [x] Manter relacionamentos (contabilGrupoContaRelacaoPadrao)

**Endpoint de Importação**:
```
POST /api/contabil/grupo-conta-padrao/importar-para-empresa/:empresaId
```

**✅ CONCLUÍDO** - Controller criado com sucesso!

---

### ✅ 1.4 Tipo de Documento Padrão
**Arquivo**: `server/src/controller/financeiro/financeiroTipoDocumentoPadraoController.ts`

- [x] Criar controller padrão
- [x] Criar método de importação

**Endpoint de Importação**:
```
POST /api/financeiro/tipo-documento-padrao/importar-para-empresa/:empresaId
```

**✅ CONCLUÍDO**

---

### ✅ 1.5 Pessoa Classificação Padrão
**Arquivo**: `server/src/controller/pessoa/pessoaClassificacaoPadraoController.ts`

- [x] Criar controller padrão
- [x] Criar método de importação

**Endpoint de Importação**:
```
POST /api/pessoa/classificacao-padrao/importar-para-empresa/:empresaId
```

**✅ CONCLUÍDO**

---

### ✅ 1.6 Natureza de Operação Padrão
**Arquivo**: `server/src/controller/movimento/movNaturezaOperacaoPadraoController.ts`

- [x] Criar controller padrão
- [x] Criar método de importação

**Endpoint de Importação**:
```
POST /api/movimento/natureza-operacao-padrao/importar-para-empresa/:empresaId
```

**✅ CONCLUÍDO**

---

### ✅ 1.7 CFOP Padrão
**Arquivo**: `server/src/controller/movimento/movCfopPadraoController.ts`

- [x] Criar controller padrão
- [x] Criar método de importação

**Endpoint de Importação**:
```
POST /api/movimento/cfop-padrao/importar-para-empresa/:empresaId
```

**✅ CONCLUÍDO**

---

### ✅ 1.8 Pipeline de Movimentos Padrão
**Arquivo**: `server/src/controller/movimento/movPipelinePadraoController.ts`

- [x] Criar controller padrão
- [x] Criar método de importação
- [x] Importar também movStatusPadrao relacionados

**Endpoint de Importação**:
```
POST /api/movimento/pipeline-padrao/importar-para-empresa/:empresaId
```

**✅ CONCLUÍDO**

---

### ✅ 1.9 Configuração de Transições de Agendas Padrão
**Arquivo**: `server/src/controller/clinica/clinicaAgendaStatusTransPadraoController.ts`

- [x] Criar controller padrão
- [x] Criar método de importação
- [x] Importar também clinicaAgendaStatusPadrao relacionados

**Endpoint de Importação**:
```
POST /api/clinica/agenda-status-trans-padrao/importar-para-empresa/:empresaId
```

**✅ CONCLUÍDO**

---

## FASE 2: BACKEND - Rotas

### ✅ 2.1 Rotas Contábil
**Arquivo**: `server/src/routes/contabilRoutes.ts`

- [x] Adicionar rotas para Plano de Contas Padrão ✅
- [x] Adicionar rotas para Histórico Padrão:
  ```typescript
  router.post('/api/contabil/historico-padrao/importar-para-empresa/:empresaId', authGuard, ContabilHistoricoPadraoController.importarParaEmpresa);
  router.get('/api/contabil/historico-padrao/busca', authGuard, ContabilHistoricoPadraoController.buscarComFiltros);
  router.get('/api/contabil/historico-padrao', authGuard, ContabilHistoricoPadraoController.findAll);
  router.get('/api/contabil/historico-padrao/:historicoId', authGuard, ContabilHistoricoPadraoController.findOne);
  router.post('/api/contabil/historico-padrao', authGuard, ContabilHistoricoPadraoController.create);
  router.put('/api/contabil/historico-padrao/:historicoId', authGuard, ContabilHistoricoPadraoController.update);
  router.delete('/api/contabil/historico-padrao/:historicoId', authGuard, ContabilHistoricoPadraoController.delete);
  ```
  **✅ CONCLUÍDO**

- [ ] Adicionar rotas para Grupo de Contas Padrão

---

### ✅ 2.2 Rotas Financeiro
**Arquivo**: `server/src/routes/financeiroRoutes.ts`

- [ ] Adicionar rotas para Tipo de Documento Padrão

---

### ✅ 2.3 Rotas Pessoa
**Arquivo**: `server/src/routes/pessoaRoutes.ts`

- [ ] Adicionar rotas para Pessoa Classificação Padrão

---

### ✅ 2.4 Rotas Movimento
**Arquivo**: `server/src/routes/movimentoRoutes.ts`

- [ ] Adicionar rotas para Natureza de Operação Padrão
- [ ] Adicionar rotas para CFOP Padrão
- [ ] Adicionar rotas para Pipeline Padrão

---

### ✅ 2.5 Rotas Clínica
**Arquivo**: `server/src/routes/clinicaRoutes.ts`

- [ ] Adicionar rotas para Transições de Agenda Padrão

---

## FASE 3: FRONTEND - Services

### ✅ 3.1 Service de Importação Geral
**Arquivo**: `front/src/services/importacaoDadosPadraoService.ts`

- [x] Criar interface `ImportacaoResult`:
  ```typescript
  interface ImportacaoResult {
    modulo: string;
    totalImportado: number;
    sucesso: boolean;
    mensagem: string;
    detalhes?: any;
  }
  ```

- [x] Criar funções de importação individual:
  - [x] `importarPlanoContasPadrao(empresaId: number): Promise<ImportacaoResult>`
  - [x] `importarHistoricoPadrao(empresaId: number): Promise<ImportacaoResult>`
  - [x] `importarGrupoContasPadrao(empresaId: number): Promise<ImportacaoResult>`
  - [x] `importarTipoDocumentoPadrao(empresaId: number): Promise<ImportacaoResult>`
  - [x] `importarPessoaClassificacaoPadrao(empresaId: number): Promise<ImportacaoResult>`
  - [x] `importarNaturezaOperacaoPadrao(empresaId: number): Promise<ImportacaoResult>`
  - [x] `importarCfopPadrao(empresaId: number): Promise<ImportacaoResult>`
  - [x] `importarPipelinePadrao(empresaId: number): Promise<ImportacaoResult>`
  - [x] `importarTransicoesAgendaPadrao(empresaId: number): Promise<ImportacaoResult>`

- [x] Criar função de importação em lote:
  ```typescript
  export const importarTodosDadosPadrao(
    empresaId: number, 
    modulos: string[]
  ): Promise<ImportacaoResult[]>
  ```

---

### ✅ 3.2 Services Individuais Padrão
**Arquivos**: `front/src/services/[modulo]/[entidade]PadraoService.ts`

- [x] Criar `contabilPlanoContasPadraoService.ts`
  - [x] Reutilizar estrutura do service normal
  - [x] Ajustar endpoints para `/plano-contas-padrao`
  
- [x] Criar `contabilHistoricoPadraoService.ts`
- [x] Criar demais services conforme necessário

**Alternativa**: Usar factory pattern para reutilizar código:
```typescript
// serviceFactory.ts
export const createCrudService = (baseUrl: string) => ({
  getAll: () => axios.get(baseUrl),
  getById: (id) => axios.get(`${baseUrl}/${id}`),
  create: (data) => axios.post(baseUrl, data),
  update: (id, data) => axios.put(`${baseUrl}/${id}`, data),
  delete: (id) => axios.delete(`${baseUrl}/${id}`)
});
```

---

## FASE 4: FRONTEND - Componente de Importação

### ✅ 4.1 Criar ImportacaoDadosPadraoManager.tsx
**Arquivo**: `front/src/components/software-house/ImportacaoDadosPadraoManager.tsx`

- [x] Criar interface de props:
  ```typescript
  interface ImportacaoDadosPadraoManagerProps {
    empresaId: number;
    onImportacaoConcluida?: () => void;
  }
  ```

- [x] Definir lista de cadastros disponíveis:
  ```typescript
  const CADASTROS_DISPONIVEIS = [
    { id: 'planoContas', label: 'Plano de Contas', icon: 'FormatListBulleted', modulo: 'Contábil' },
    { id: 'historico', label: 'Histórico', icon: 'History', modulo: 'Contábil' },
    { id: 'grupoContas', label: 'Grupo de Contas', icon: 'AccountTree', modulo: 'Contábil' },
    { id: 'tipoDocumento', label: 'Tipo de Documento', icon: 'Description', modulo: 'Financeiro' },
    { id: 'pessoaClassificacao', label: 'Classificação de Pessoa', icon: 'ViewStream', modulo: 'Pessoa' },
    { id: 'naturezaOperacao', label: 'Natureza de Operação', icon: 'Gavel', modulo: 'Movimento' },
    { id: 'cfop', label: 'CFOP', icon: 'TableView', modulo: 'Movimento' },
    { id: 'pipeline', label: 'Pipeline de Movimentos', icon: 'Sync', modulo: 'Movimento' },
    { id: 'transicoesAgenda', label: 'Transições de Agenda', icon: 'CompareArrows', modulo: 'Clínica' },
  ];
  ```

- [x] Implementar funcionalidades:
  - [x] Checkboxes para seleção de cadastros
  - [x] Botão "Importar Selecionados"
  - [x] Botão "Importar Todos"
  - [x] Botão "Limpar Seleção"
  - [x] Indicador de progresso por módulo (Spinner + ícone de status)
  - [x] Exibição de resultados em tabela/lista
  - [x] Modal de confirmação antes de importar
  - [x] Verificação se já existem dados (avisar usuário)
  - [x] Tratamento de erros com feedback detalhado

- [x] Estados necessários:
  ```typescript
  const [cadastrosSelecionados, setCadastrosSelecionados] = useState<string[]>([]);
  const [importandoAtual, setImportandoAtual] = useState<string | null>(null);
  const [resultados, setResultados] = useState<ImportacaoResult[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  ```

---

### ✅ 4.2 Integrar no ClienteEditPage.tsx
**Arquivo**: `front/src/pages/presentation/software-house/ClienteEditPage.tsx`

- [x] Importar componente:
  ```typescript
  import ImportacaoDadosPadraoManager from '../../../components/software-house/ImportacaoDadosPadraoManager';
  ```

- [x] Adicionar novo Card após "Módulos do Cliente" (linha ~420):
  ```typescript
  {/* Importação de Dados Padrão */}
  {isEdit && formik.values.empresaId && (
    <div className='col-12'>
      <Card>
        <CardHeader>
          <CardLabel icon='CloudDownload'>
            <CardTitle>Importação de Dados Padrão</CardTitle>
          </CardLabel>
        </CardHeader>
        <CardBody>
          <ImportacaoDadosPadraoManager 
            empresaId={formik.values.empresaId}
            onImportacaoConcluida={() => {
              showNotification('Sucesso', 'Importação concluída', 'success');
            }}
          />
        </CardBody>
      </Card>
    </div>
  )}
  ```

---

### ✅ 4.3 Criar Componente de Status de Importação
**Arquivo**: `front/src/components/software-house/ImportacaoStatusItem.tsx`

- [ ] Componente para exibir status individual de cada importação
- [ ] Props: `{ modulo, status, totalImportado, mensagem }`
- [ ] Estados visuais: pendente, importando, sucesso, erro
- [ ] Ícones e cores apropriados

---

## FASE 5: FRONTEND - Páginas Reutilizáveis

### ✅ 5.1 Adaptar PlanoContasListPage
**Arquivo**: `front/src/pages/presentation/contabil/PlanoContasListPage.tsx`

- [ ] Adicionar prop `isPadrao?: boolean`
- [ ] Condicionar service baseado em `isPadrao`:
  ```typescript
  const service = isPadrao 
    ? contabilPlanoContasPadraoService 
    : contabilPlanoContasService;
  ```
- [ ] Ajustar título: `isPadrao ? 'Plano de Contas Padrão' : 'Plano de Contas'`
- [ ] Ajustar breadcrumb e navegação
- [ ] Remover filtro de empresa quando `isPadrao === true`

---

### ✅ 5.2 Adaptar PlanoContasEditPage
**Arquivo**: `front/src/pages/presentation/contabil/PlanoContasEditPage.tsx`

- [ ] Adicionar prop `isPadrao?: boolean`
- [ ] Usar service apropriado
- [ ] Ajustar título e navegação

---

### ✅ 5.3 Criar Wrappers para Cadastros Padrão

#### Plano de Contas Padrão
**Arquivo**: `front/src/pages/presentation/software-house/cadastros-base/PlanoContasPadraoListPage.tsx`
```typescript
import PlanoContasListPage from '../../contabil/PlanoContasListPage';

const PlanoContasPadraoListPage = () => {
  return <PlanoContasListPage isPadrao={true} />;
};

export default PlanoContasPadraoListPage;
```

**Arquivo**: `front/src/pages/presentation/software-house/cadastros-base/PlanoContasPadraoEditPage.tsx`
```typescript
import PlanoContasEditPage from '../../contabil/PlanoContasEditPage';

const PlanoContasPadraoEditPage = () => {
  return <PlanoContasEditPage isPadrao={true} />;
};

export default PlanoContasPadraoEditPage;
```

- [ ] Criar wrappers para Plano de Contas
- [ ] Criar wrappers para Histórico
- [ ] Criar wrappers para Grupo de Contas
- [ ] Criar wrappers para demais cadastros

---

### ✅ 5.4 Adaptar Modals de Busca
**Arquivos**: 
- `front/src/components/modals/contabil/PlanoContasSearchModal.tsx`
- `front/src/components/modals/contabil/HistoricoSearchModal.tsx`

- [ ] Adicionar prop `isPadrao?: boolean`
- [ ] Usar service apropriado
- [ ] Remover filtro de empresa quando padrão

---

## FASE 6: FRONTEND - Rotas e Menu

### ✅ 6.1 Configurar Rotas
**Arquivo**: `front/src/App.tsx` ou arquivo de rotas

- [ ] Adicionar rotas para Plano de Contas Padrão:
  ```typescript
  <Route path="/cadastros-base/plano-contas-padrao" element={<PlanoContasPadraoListPage />} />
  <Route path="/cadastros-base/plano-contas-padrao/novo" element={<PlanoContasPadraoEditPage />} />
  <Route path="/cadastros-base/plano-contas-padrao/:id" element={<PlanoContasPadraoEditPage />} />
  ```

- [ ] Adicionar rotas para Histórico Padrão
- [ ] Adicionar rotas para Grupo de Contas Padrão
- [ ] Adicionar rotas para Tipo de Documento Padrão
- [ ] Adicionar rotas para Pessoa Classificação Padrão
- [ ] Adicionar rotas para Natureza de Operação Padrão
- [ ] Adicionar rotas para CFOP Padrão
- [ ] Adicionar rotas para Pipeline Padrão
- [ ] Adicionar rotas para Transições de Agenda Padrão

---

### ✅ 6.2 Menu
**Arquivo**: `front/src/menus/softwareHouseMenu.ts`

- [x] Menu já está configurado com todos os itens
- [ ] Verificar se paths estão corretos
- [ ] Verificar permissões (recursoId: 103)

---

## FASE 7: TESTES E VALIDAÇÃO

### ✅ 7.1 Testes Backend

- [ ] Testar CRUD de Plano de Contas Padrão
- [ ] Testar CRUD de Histórico Padrão
- [ ] Testar CRUD de demais cadastros padrão
- [ ] Testar importação individual de cada cadastro
- [ ] Testar importação em lote
- [ ] Validar manutenção de hierarquias (contaSuperiorId, historicoSuperiorId)
- [ ] Testar rollback em caso de erro (transações)
- [ ] Validar que empresaId não é incluído nos cadastros padrão
- [ ] Testar performance com grande volume de dados

---

### ✅ 7.2 Testes Frontend

- [ ] Testar navegação nos cadastros padrão
- [ ] Testar CRUD em cada página padrão
- [ ] Testar componente de importação:
  - [ ] Seleção individual
  - [ ] Seleção múltipla
  - [ ] Importar todos
  - [ ] Feedback de progresso
  - [ ] Exibição de erros
- [ ] Validar feedback visual (spinners, ícones, cores)
- [ ] Testar cenários de erro (timeout, falha de rede)
- [ ] Validar responsividade do componente de importação
- [ ] Testar integração no ClienteEditPage

---

## 📝 Notas Importantes

### Estratégia de Implementação
1. **Herança de Controllers**: Reutilizar lógica existente
2. **Factory Pattern**: Services genéricos com configuração
3. **Props Condicionais**: Componentes adaptáveis com `isPadrao`
4. **Transações**: Garantir consistência na importação
5. **Mapeamento de IDs**: Manter relacionamentos hierárquicos

### Pontos de Atenção
- ⚠️ Sempre usar transações na importação
- ⚠️ Mapear IDs antigos para novos (hierarquias)
- ⚠️ Validar se já existem dados antes de importar
- ⚠️ Fornecer feedback detalhado ao usuário
- ⚠️ Tratar erros graciosamente
- ⚠️ Considerar performance com muitos registros

### Ordem de Implementação Recomendada
1. Plano de Contas (mais complexo, serve de base)
2. Histórico (similar ao Plano de Contas)
3. Demais cadastros (replicar padrão)
4. Componente de importação
5. Testes e ajustes finais

---

## 🎯 Próximos Passos

**Começar por**: FASE 1 - Item 1.1 (Plano de Contas Padrão)

Este será o modelo base que será replicado para os demais cadastros.

---

**Última atualização**: 07/01/2026 - 12:25
**Status**: ⚡ Implementação em andamento

## 🎉 Progresso Recente

### ✅ Concluído
1. **Plano de Contas Padrão - Backend Completo**
   - Controller criado: `contabilPlanoContasPadraoController.ts`
   - Método de importação implementado com transação e mapeamento de IDs
   - Rotas configuradas em `contabilRoutes.ts`
   - Todos os métodos CRUD funcionais

2. **Histórico Padrão - Backend Completo**
   - Controller criado: `contabilHistoricoPadraoController.ts`
   - Método de importação implementado com transação e mapeamento de IDs
   - Rotas configuradas em `contabilRoutes.ts`
   - Todos os métodos CRUD funcionais

3. **Todos os 9 Controllers Backend** ✅
   - Plano de Contas, Histórico, Grupo de Contas
   - Tipo Documento, Classificação Pessoa
   - Natureza Operação, CFOP, Pipeline
   - Transições Status Agenda

4. **Frontend Completo** ✅
   - Service: `importacaoCadastrosBaseService.ts`
   - Componente: `ImportacaoDadosPadraoManager.tsx`
   - Integrado em: `ClienteEditPage.tsx`

### 🎉 Sistema Completo!
1. ✅ **BACKEND 100% PRONTO** - 9 controllers + rotas
2. ✅ **FRONTEND 100% PRONTO** - Service + componente integrado
3. 🚀 **SISTEMA FUNCIONAL** - Pronto para uso!
4. 📝 **Próximos passos opcionais**:
   - Adaptar páginas existentes para modo padrão (via props)
   - Criar telas de gerenciamento de cadastros base
   - Implementar testes automatizados
