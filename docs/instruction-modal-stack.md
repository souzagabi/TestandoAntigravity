---
# Gerenciador de Pilha de Modais (ModalStack)

Este documento descreve o padrão oficial de uso do gerenciador de pilha de modais no frontend.

Caminhos principais:
- Contexto: `src/front/src/contexts/ModalStackContext.tsx`
- Provider no App: `src/front/src/App/App.tsx`
- Modal base: `src/front/src/components/bootstrap/Modal.tsx`

## Conceito

O `ModalStackProvider` mantém uma PILHA (stack) de modais abertos. Você pode abrir/fechar modais de qualquer parte do app usando o hook `useModalStack()`.

- Cada modal na pilha possui um `id` único, um `title` e um `component` (conteúdo do modal).
- O Provider renderiza todos os modais com backdrops e z-index progressivo (o modal mais recente fica no topo).

## Integração no App

O provider deve envolver a aplicação (já configurado):

Arquivo: `src/front/src/App/App.tsx`
```tsx
import { ModalStackProvider } from '../contexts/ModalStackContext';

return (
  <ThemeProvider theme={theme}>
    <ModalStackProvider>
      <DialogProvider>
        {/* ... aplicação ... */}
      </DialogProvider>
    </ModalStackProvider>
  </ThemeProvider>
);
```

## API do hook

Arquivo: `src/front/src/contexts/ModalStackContext.tsx`

```ts
const { openModal, closeModal, closeAllModals, getCurrentModal, getModalCount } = useModalStack();
```

- `openModal(config)` abre um modal no topo da pilha.
  - `config: { id: string; title: string; component: ReactNode; size?: 'sm'|'md'|'lg'|'xl'; onClose?: () => void }`
- `closeModal(id?)`
  - Sem `id`: fecha APENAS o topo da pilha.
  - Com `id`: fecha o modal informado e TODOS acima dele na pilha.
- `closeAllModals()`: fecha todos os modais abertos.
- `getCurrentModal()`: retorna o modal do topo (ou `null`).
- `getModalCount()`: retorna a quantidade de modais na pilha.

## Modal base e backdrop estático

Arquivo: `src/front/src/components/bootstrap/Modal.tsx`

- Use `isStaticBackdrop` para impedir fechamento por clique fora e por tecla `ESC`.
- Útil para manter um modal “raiz” aberto enquanto abre submodais.

Exemplo:
```tsx
<Modal isOpen={isOpen} setIsOpen={onClose} isCentered isStaticBackdrop>
  {/* ...conteúdo... */}
</Modal>
```

## Padrões recomendados

- **Modal raiz estático**: Em fluxos principais (ex.: edição de agendamento) use `isStaticBackdrop` no modal raiz. Os submodais podem continuar sem estático para permitir fechar facilmente.
- **Fechamento explícito**: Após concluir a ação de um submodal, chame `closeModal(id)` explicitamente.
- **IDs únicos**: Gere IDs previsíveis e exclusivos por abertura (ex.: `agendamento/paciente/${Date.now()}`) para evitar colisões.
- **Título e tamanho**: Sempre informe `title` e `size` na abertura do modal para consistência visual.

## Exemplos de uso

### 1) Abrindo um submodal de seleção (Paciente)

```tsx
import { useModalStack } from 'src/front/src/contexts/ModalStackContext';
import PacienteSearchModal from 'src/front/src/components/modals/clinica/PacienteSearchModal';

const BotaoPaciente = () => {
  const { openModal, closeModal } = useModalStack();

  const abrirPaciente = () => {
    const id = `paciente-search-${Date.now()}`;
    openModal({
      id,
      title: 'Buscar Paciente',
      size: 'xl',
      component: (
        <PacienteSearchModal
          isOpen
          setIsOpen={() => closeModal(id)}
          onSelectPaciente={(paciente) => {
            // use o retorno aqui
            closeModal(id);
          }}
        />
      ),
    });
  };

  return <button onClick={abrirPaciente}>Selecionar Paciente</button>;
};
```

### 2) Modal raiz (estático) que abre submodal

```tsx
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalTitle } from 'src/front/src/components/bootstrap/Modal';
import { useModalStack } from 'src/front/src/contexts/ModalStackContext';

const ModalRaiz = ({ isOpen, onClose }) => {
  const { openModal, closeModal } = useModalStack();

  const abrirSubmodal = () => {
    const id = `submodal-teste-${Date.now()}`;
    openModal({
      id,
      title: 'Submodal',
      size: 'lg',
      component: (
        <div>
          <p>Conteúdo do submodal</p>
          <button onClick={() => closeModal(id)}>Fechar Submodal</button>
        </div>
      ),
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={onClose} isCentered isStaticBackdrop>
      <ModalHeader setIsOpen={onClose}>
        <ModalTitle id='modal-raiz'>Modal Raiz</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <button onClick={abrirSubmodal}>Abrir Submodal</button>
      </ModalBody>
      <ModalFooter>
        <button onClick={onClose}>Fechar</button>
      </ModalFooter>
    </Modal>
  );
};
```

### 3) Fechando o topo vs. fechando específico

```tsx
const { closeModal } = useModalStack();

// Fecha apenas o topo
closeModal();

// Fecha um modal específico e todos acima dele
closeModal('convenio-search-172711111');
```

### 4) Fluxo real do Agendamento

- Modal raiz: `AgendamentoEditModal.tsx` usa `isStaticBackdrop` para permanecer aberto.
- Submodais: Paciente/Convênio/Procedimento abrem com `openModal` e fecham com `closeModal(id)`.

Trecho simplificado:
```tsx
const openConvenioModal = () => {
  const id = `convenio-search-${Date.now()}`;
  openModal({
    id,
    title: 'Buscar Convênio/Plano',
    size: 'xl',
    component: (
      <ConvenioSearchModal
        isOpen
        setIsOpen={() => closeModal(id)}
        onSelectConvenio={(conv) => {
          handleSelectConvenio(conv);
          closeModal(id);
        }}
        multiSelect={false}
        showPlanos
      />
    ),
  });
};
```

## Problemas comuns e soluções

- **Clique fora fecha tudo**: Use `isStaticBackdrop` no modal raiz. O `Modal.tsx` já foi ajustado para não fechar com clique fora/ESC nesse modo.
- **Submodal não fecha**: verifique se está chamando `closeModal(id)` com o mesmo `id` usado em `openModal`.
- **IDs colidindo**: use um sufixo único por abertura (ex.: `Date.now()`).

## Boas práticas de UX

- Informe `title` e `size` nos modais da pilha.
- Evite lógicas de negócio nos submodais; mantenha no modal raiz.
- Forneça feedback (toast/alert) no modal raiz após ações.
