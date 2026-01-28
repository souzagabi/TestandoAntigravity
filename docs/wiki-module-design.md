# Documentação do Módulo Wiki - ADJ-WWW

Este documento descreve a modelagem completa do módulo Wiki para base de conhecimento.

## 1. Visão Geral

O módulo Wiki permite criar uma base de conhecimento colaborativa com:
- **Artigos/Documentos** com conteúdo rico (texto formatado, imagens, links)
- **Categorias** para organização hierárquica
- **Anexos** armazenados no AWS S3
- **Controle de visibilidade** granular (todos, perfis específicos, usuários específicos)
- **Versionamento** completo do conteúdo
- **Rastreamento de imagens** para controle de storage

---

## 2. Stack Tecnológica

### Backend
- **Banco de dados**: PostgreSQL
- **ORM**: Sequelize com TypeScript
- **Storage**: AWS S3
- **Server**: Node.js com Express

### Frontend
- **Framework**: React com Vite
- **Template**: Facit
- **Editor Rich Text**: TipTap

---

## 3. Editor Rich Text - TipTap

### 3.1 Informações Gerais

| Item | Descrição |
|------|-----------|
| **Nome** | TipTap |
| **Licença** | MIT (Open Source) |
| **Uso Comercial** | ✅ Permitido sem restrições |
| **Site Oficial** | https://tiptap.dev |
| **Documentação** | https://tiptap.dev/docs |
| **GitHub** | https://github.com/ueberdosis/tiptap |
| **Versão Recomendada** | ^2.x (última estável) |

### 3.2 Por que TipTap?

- **Headless**: Sem estilos pré-definidos, total controle visual
- **Extensível**: Sistema de extensões modular
- **TypeScript**: Suporte nativo
- **React**: Integração oficial com React
- **Colaborativo**: Suporte a edição colaborativa (Yjs)
- **Markdown**: Suporte a Markdown
- **Comunidade**: Ativa e bem documentada

### 3.3 Extensões Recomendadas

```bash
# Instalação base
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit

# Extensões adicionais recomendadas
npm install @tiptap/extension-image
npm install @tiptap/extension-link
npm install @tiptap/extension-placeholder
npm install @tiptap/extension-text-align
npm install @tiptap/extension-underline
npm install @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header
npm install @tiptap/extension-code-block-lowlight
npm install @tiptap/extension-highlight
npm install @tiptap/extension-typography
```

### 3.4 Exemplo de Implementação Base

```tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

interface WikiEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  editable?: boolean;
}

const WikiEditor: React.FC<WikiEditorProps> = ({
  content = '',
  onChange,
  onImageUpload,
  placeholder = 'Comece a escrever...',
  editable = true,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Image.configure({
        allowBase64: false, // Força upload para S3
        HTMLAttributes: {
          class: 'wiki-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'wiki-link',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Handler para upload de imagem
  const handleImageUpload = async (file: File) => {
    if (!onImageUpload) return;
    
    try {
      const url = await onImageUpload(file);
      editor?.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
    }
  };

  // Handler para drag and drop de imagens
  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    for (const file of imageFiles) {
      await handleImageUpload(file);
    }
  };

  // Handler para colar imagens
  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = Array.from(event.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));
    
    for (const item of imageItems) {
      const file = item.getAsFile();
      if (file) {
        event.preventDefault();
        await handleImageUpload(file);
      }
    }
  };

  return (
    <div 
      className="wiki-editor-container"
      onDrop={handleDrop}
      onPaste={handlePaste}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Toolbar */}
      <WikiEditorToolbar editor={editor} onImageUpload={handleImageUpload} />
      
      {/* Editor Content */}
      <EditorContent editor={editor} className="wiki-editor-content" />
    </div>
  );
};

export default WikiEditor;
```

### 3.5 Componente de Toolbar

```tsx
import { Editor } from '@tiptap/react';
import Button from '../../../components/bootstrap/Button';

interface WikiEditorToolbarProps {
  editor: Editor | null;
  onImageUpload?: (file: File) => Promise<void>;
}

const WikiEditorToolbar: React.FC<WikiEditorToolbarProps> = ({ editor, onImageUpload }) => {
  if (!editor) return null;

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onImageUpload) {
        await onImageUpload(file);
      }
    };
    input.click();
  };

  const handleLinkClick = () => {
    const url = window.prompt('URL do link:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="wiki-editor-toolbar d-flex flex-wrap gap-1 p-2 border-bottom">
      {/* Formatação de texto */}
      <Button
        color={editor.isActive('bold') ? 'primary' : 'light'}
        isLight={!editor.isActive('bold')}
        icon="FormatBold"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Negrito"
      />
      <Button
        color={editor.isActive('italic') ? 'primary' : 'light'}
        isLight={!editor.isActive('italic')}
        icon="FormatItalic"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Itálico"
      />
      <Button
        color={editor.isActive('underline') ? 'primary' : 'light'}
        isLight={!editor.isActive('underline')}
        icon="FormatUnderlined"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Sublinhado"
      />
      <Button
        color={editor.isActive('strike') ? 'primary' : 'light'}
        isLight={!editor.isActive('strike')}
        icon="FormatStrikethrough"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Riscado"
      />

      <div className="vr mx-1" />

      {/* Headings */}
      <Button
        color={editor.isActive('heading', { level: 1 }) ? 'primary' : 'light'}
        isLight={!editor.isActive('heading', { level: 1 })}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Título 1"
      >
        H1
      </Button>
      <Button
        color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'light'}
        isLight={!editor.isActive('heading', { level: 2 })}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Título 2"
      >
        H2
      </Button>
      <Button
        color={editor.isActive('heading', { level: 3 }) ? 'primary' : 'light'}
        isLight={!editor.isActive('heading', { level: 3 })}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Título 3"
      >
        H3
      </Button>

      <div className="vr mx-1" />

      {/* Listas */}
      <Button
        color={editor.isActive('bulletList') ? 'primary' : 'light'}
        isLight={!editor.isActive('bulletList')}
        icon="FormatListBulleted"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Lista com marcadores"
      />
      <Button
        color={editor.isActive('orderedList') ? 'primary' : 'light'}
        isLight={!editor.isActive('orderedList')}
        icon="FormatListNumbered"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Lista numerada"
      />

      <div className="vr mx-1" />

      {/* Alinhamento */}
      <Button
        color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'light'}
        isLight={!editor.isActive({ textAlign: 'left' })}
        icon="FormatAlignLeft"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="Alinhar à esquerda"
      />
      <Button
        color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'light'}
        isLight={!editor.isActive({ textAlign: 'center' })}
        icon="FormatAlignCenter"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="Centralizar"
      />
      <Button
        color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'light'}
        isLight={!editor.isActive({ textAlign: 'right' })}
        icon="FormatAlignRight"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="Alinhar à direita"
      />

      <div className="vr mx-1" />

      {/* Outros */}
      <Button
        color={editor.isActive('blockquote') ? 'primary' : 'light'}
        isLight={!editor.isActive('blockquote')}
        icon="FormatQuote"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Citação"
      />
      <Button
        color={editor.isActive('codeBlock') ? 'primary' : 'light'}
        isLight={!editor.isActive('codeBlock')}
        icon="Code"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Bloco de código"
      />
      <Button
        color="light"
        isLight
        icon="HorizontalRule"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Linha horizontal"
      />

      <div className="vr mx-1" />

      {/* Link e Imagem */}
      <Button
        color={editor.isActive('link') ? 'primary' : 'light'}
        isLight={!editor.isActive('link')}
        icon="Link"
        size="sm"
        onClick={handleLinkClick}
        title="Inserir link"
      />
      <Button
        color="light"
        isLight
        icon="Image"
        size="sm"
        onClick={handleImageClick}
        title="Inserir imagem"
      />

      <div className="vr mx-1" />

      {/* Tabela */}
      <Button
        color="light"
        isLight
        icon="TableChart"
        size="sm"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        title="Inserir tabela"
      />

      <div className="vr mx-1" />

      {/* Undo/Redo */}
      <Button
        color="light"
        isLight
        icon="Undo"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Desfazer"
      />
      <Button
        color="light"
        isLight
        icon="Redo"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Refazer"
      />
    </div>
  );
};

export default WikiEditorToolbar;
```

### 3.6 Estilos CSS para o Editor

```css
/* wiki-editor.css */

.wiki-editor-container {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background: #fff;
}

.wiki-editor-toolbar {
  background: #f8f9fa;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.wiki-editor-content {
  min-height: 300px;
  padding: 1rem;
}

.wiki-editor-content .ProseMirror {
  outline: none;
  min-height: 280px;
}

.wiki-editor-content .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

/* Imagens */
.wiki-editor-content .wiki-image {
  max-width: 100%;
  height: auto;
  border-radius: 0.25rem;
  margin: 0.5rem 0;
}

/* Links */
.wiki-editor-content .wiki-link {
  color: #0d6efd;
  text-decoration: underline;
  cursor: pointer;
}

/* Tabelas */
.wiki-editor-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

.wiki-editor-content th,
.wiki-editor-content td {
  border: 1px solid #dee2e6;
  padding: 0.5rem;
  text-align: left;
}

.wiki-editor-content th {
  background: #f8f9fa;
  font-weight: 600;
}

/* Citações */
.wiki-editor-content blockquote {
  border-left: 4px solid #dee2e6;
  padding-left: 1rem;
  margin-left: 0;
  color: #6c757d;
  font-style: italic;
}

/* Código */
.wiki-editor-content pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
}

.wiki-editor-content code {
  background: #f1f3f4;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: 'Fira Code', monospace;
}

/* Headings */
.wiki-editor-content h1 {
  font-size: 2rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.wiki-editor-content h2 {
  font-size: 1.5rem;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

.wiki-editor-content h3 {
  font-size: 1.25rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

/* Listas */
.wiki-editor-content ul,
.wiki-editor-content ol {
  padding-left: 1.5rem;
}

.wiki-editor-content li {
  margin-bottom: 0.25rem;
}

/* Linha horizontal */
.wiki-editor-content hr {
  border: none;
  border-top: 2px solid #dee2e6;
  margin: 1.5rem 0;
}
```

---

## 4. Diagrama de Entidades (ERD)

```
┌─────────────────────┐
│   wiki_categoria    │
├─────────────────────┤
│ categoria_id (PK)   │
│ empresa_id (FK)     │
│ categoria_pai_id    │◄──┐ (auto-relacionamento hierárquico)
│ titulo              │   │
│ descricao           │   │
│ icone               │───┘
│ ordem               │
│ st_ativo            │
│ st_excluido         │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐      ┌─────────────────────────┐
│   wiki_documento    │      │  wiki_documento_perfil  │
├─────────────────────┤      ├─────────────────────────┤
│ documento_id (PK)   │──1:N─│ documento_perfil_id(PK) │
│ empresa_id (FK)     │      │ documento_id (FK)       │
│ categoria_id (FK)   │      │ perfil_id (FK)          │
│ titulo              │      │ created_at              │
│ slug                │      │ updated_at              │
│ resumo              │      └─────────────────────────┘
│ conteudo (TEXT)     │
│ tipo_visibilidade   │      ┌─────────────────────────┐
│ autor_id (FK)       │      │ wiki_documento_usuario  │
│ st_publicado        │      ├─────────────────────────┤
│ st_destaque         │──1:N─│ documento_usuario_id(PK)│
│ ordem               │      │ documento_id (FK)       │
│ visualizacoes       │      │ usuario_id (FK)         │
│ versao_atual        │      │ created_at              │
│ st_ativo            │      │ updated_at              │
│ st_excluido         │      └─────────────────────────┘
└─────────────────────┘
         │
         │ 1:N
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────────┐    ┌─────────────────────────┐
│wiki_documento_anexo │    │ wiki_documento_versao   │
├─────────────────────┤    ├─────────────────────────┤
│ anexo_id (PK)       │    │ versao_id (PK)          │
│ empresa_id (FK)     │    │ documento_id (FK)       │
│ documento_id (FK)   │    │ numero_versao           │
│ nome_original       │    │ titulo                  │
│ nome_arquivo        │    │ conteudo                │
│ tipo_arquivo        │    │ usuario_id (FK)         │
│ tamanho_arquivo     │    │ observacao              │
│ caminho_s3          │    │ created_at              │
│ usuario_id (FK)     │    │ updated_at              │
│ st_ativo            │    └─────────────────────────┘
│ st_excluido         │
└─────────────────────┘

┌─────────────────────────┐
│  wiki_documento_imagem  │  (rastreamento de imagens inline)
├─────────────────────────┤
│ imagem_id (PK)          │
│ empresa_id (FK)         │
│ documento_id (FK) NULL  │  ← NULL = imagem ainda não vinculada
│ nome_original           │
│ nome_arquivo            │
│ tipo_arquivo            │
│ tamanho_arquivo         │
│ caminho_s3              │
│ usuario_id (FK)         │
│ st_ativo                │
│ st_excluido             │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
```

---

## 5. Detalhamento das Tabelas

### 5.1 `wiki_categoria`

Organização hierárquica dos documentos em categorias e subcategorias.

| Campo | Tipo | Null | Default | Descrição |
|-------|------|------|---------|-----------|
| `categoria_id` | INTEGER | NO | AUTO | Chave primária |
| `empresa_id` | INTEGER | NO | - | FK para cfg_empresa (multi-tenant) |
| `categoria_pai_id` | INTEGER | YES | NULL | FK para wiki_categoria (hierarquia) |
| `titulo` | VARCHAR(100) | NO | - | Título da categoria |
| `descricao` | VARCHAR(500) | YES | NULL | Descrição opcional |
| `icone` | VARCHAR(50) | YES | NULL | Nome do ícone (Lucide icons) |
| `cor` | VARCHAR(20) | YES | NULL | Cor para destaque (hex ou nome) |
| `ordem` | INTEGER | NO | 0 | Ordenação na listagem |
| `st_ativo` | BOOLEAN | NO | true | Status ativo |
| `st_excluido` | BOOLEAN | NO | false | Exclusão lógica |
| `created_at` | TIMESTAMP | NO | NOW | Data de criação |
| `updated_at` | TIMESTAMP | NO | NOW | Data de atualização |

**Índices:**
- `idx_wiki_categoria_empresa` (empresa_id)
- `idx_wiki_categoria_pai` (categoria_pai_id)
- `uk_wiki_categoria_titulo` UNIQUE (empresa_id, titulo, categoria_pai_id)

---

### 5.2 `wiki_documento`

Tabela principal dos artigos/documentos da wiki.

| Campo | Tipo | Null | Default | Descrição |
|-------|------|------|---------|-----------|
| `documento_id` | INTEGER | NO | AUTO | Chave primária |
| `empresa_id` | INTEGER | NO | - | FK para cfg_empresa (multi-tenant) |
| `categoria_id` | INTEGER | YES | NULL | FK para wiki_categoria |
| `titulo` | VARCHAR(200) | NO | - | Título do documento |
| `slug` | VARCHAR(200) | NO | - | URL amigável (único por empresa) |
| `resumo` | VARCHAR(500) | YES | NULL | Resumo/descrição breve |
| `conteudo` | TEXT | YES | NULL | Conteúdo HTML do documento |
| `tipo_visibilidade` | VARCHAR(20) | NO | 'TODOS' | Enum: TODOS, PERFIS, USUARIOS |
| `autor_id` | INTEGER | NO | - | FK para sec_usuario (autor original) |
| `editor_id` | INTEGER | YES | NULL | FK para sec_usuario (último editor) |
| `st_publicado` | BOOLEAN | NO | false | Se está publicado/visível |
| `st_destaque` | BOOLEAN | NO | false | Documento em destaque |
| `ordem` | INTEGER | NO | 0 | Ordenação manual |
| `visualizacoes` | INTEGER | NO | 0 | Contador de visualizações |
| `versao_atual` | INTEGER | NO | 1 | Número da versão atual |
| `st_ativo` | BOOLEAN | NO | true | Status ativo |
| `st_excluido` | BOOLEAN | NO | false | Exclusão lógica |
| `publicado_em` | TIMESTAMP | YES | NULL | Data da publicação |
| `created_at` | TIMESTAMP | NO | NOW | Data de criação |
| `updated_at` | TIMESTAMP | NO | NOW | Data de atualização |

**Índices:**
- `idx_wiki_documento_empresa` (empresa_id)
- `idx_wiki_documento_categoria` (categoria_id)
- `idx_wiki_documento_autor` (autor_id)
- `uk_wiki_documento_slug` UNIQUE (empresa_id, slug)
- `idx_wiki_documento_busca` (empresa_id, st_publicado, st_ativo, st_excluido)

**Enum `tipo_visibilidade`:**
```sql
CREATE TYPE wiki_tipo_visibilidade AS ENUM ('TODOS', 'PERFIS', 'USUARIOS');
```

---

### 5.3 `wiki_documento_perfil`

Controle de visibilidade por perfil de usuário.

| Campo | Tipo | Null | Default | Descrição |
|-------|------|------|---------|-----------|
| `documento_perfil_id` | INTEGER | NO | AUTO | Chave primária |
| `documento_id` | INTEGER | NO | - | FK para wiki_documento |
| `perfil_id` | INTEGER | NO | - | FK para cfg_perfil |
| `created_at` | TIMESTAMP | NO | NOW | Data de criação |
| `updated_at` | TIMESTAMP | NO | NOW | Data de atualização |

**Índices:**
- `uk_wiki_doc_perfil` UNIQUE (documento_id, perfil_id)
- `idx_wiki_doc_perfil_doc` (documento_id)
- `idx_wiki_doc_perfil_perfil` (perfil_id)

---

### 5.4 `wiki_documento_usuario`

Controle de visibilidade por usuário específico.

| Campo | Tipo | Null | Default | Descrição |
|-------|------|------|---------|-----------|
| `documento_usuario_id` | INTEGER | NO | AUTO | Chave primária |
| `documento_id` | INTEGER | NO | - | FK para wiki_documento |
| `usuario_id` | INTEGER | NO | - | FK para sec_usuario |
| `created_at` | TIMESTAMP | NO | NOW | Data de criação |
| `updated_at` | TIMESTAMP | NO | NOW | Data de atualização |

**Índices:**
- `uk_wiki_doc_usuario` UNIQUE (documento_id, usuario_id)
- `idx_wiki_doc_usuario_doc` (documento_id)
- `idx_wiki_doc_usuario_user` (usuario_id)

---

### 5.5 `wiki_documento_anexo`

Arquivos anexados aos documentos (armazenados no S3).

| Campo | Tipo | Null | Default | Descrição |
|-------|------|------|---------|-----------|
| `anexo_id` | INTEGER | NO | AUTO | Chave primária |
| `empresa_id` | INTEGER | NO | - | FK para cfg_empresa |
| `documento_id` | INTEGER | NO | - | FK para wiki_documento |
| `nome_original` | VARCHAR(255) | NO | - | Nome original do arquivo |
| `nome_arquivo` | VARCHAR(255) | NO | - | Nome no S3 (UUID + extensão) |
| `tipo_arquivo` | VARCHAR(100) | NO | - | MIME type do arquivo |
| `tamanho_arquivo` | INTEGER | NO | - | Tamanho em bytes |
| `caminho_s3` | VARCHAR(500) | NO | - | Path completo no S3 |
| `usuario_id` | INTEGER | NO | - | FK para sec_usuario (quem fez upload) |
| `st_ativo` | BOOLEAN | NO | true | Status ativo |
| `st_excluido` | BOOLEAN | NO | false | Exclusão lógica |
| `created_at` | TIMESTAMP | NO | NOW | Data de criação |
| `updated_at` | TIMESTAMP | NO | NOW | Data de atualização |

**Índices:**
- `idx_wiki_anexo_empresa` (empresa_id)
- `idx_wiki_anexo_documento` (documento_id)

---

### 5.6 `wiki_documento_versao`

Histórico de versões do conteúdo para versionamento completo.

| Campo | Tipo | Null | Default | Descrição |
|-------|------|------|---------|-----------|
| `versao_id` | INTEGER | NO | AUTO | Chave primária |
| `documento_id` | INTEGER | NO | - | FK para wiki_documento |
| `numero_versao` | INTEGER | NO | - | Número sequencial da versão |
| `titulo` | VARCHAR(200) | NO | - | Título nesta versão |
| `resumo` | VARCHAR(500) | YES | NULL | Resumo nesta versão |
| `conteudo` | TEXT | YES | NULL | Conteúdo HTML nesta versão |
| `usuario_id` | INTEGER | NO | - | FK para sec_usuario (quem editou) |
| `observacao` | VARCHAR(500) | YES | NULL | Nota/comentário da alteração |
| `created_at` | TIMESTAMP | NO | NOW | Data de criação da versão |
| `updated_at` | TIMESTAMP | NO | NOW | Data de atualização |

**Índices:**
- `idx_wiki_versao_documento` (documento_id)
- `uk_wiki_versao_numero` UNIQUE (documento_id, numero_versao)
- `idx_wiki_versao_usuario` (usuario_id)

---

### 5.7 `wiki_documento_imagem`

Rastreamento de imagens inseridas inline no conteúdo (via editor).

| Campo | Tipo | Null | Default | Descrição |
|-------|------|------|---------|-----------|
| `imagem_id` | INTEGER | NO | AUTO | Chave primária |
| `empresa_id` | INTEGER | NO | - | FK para cfg_empresa |
| `documento_id` | INTEGER | YES | NULL | FK para wiki_documento (NULL = órfã) |
| `nome_original` | VARCHAR(255) | NO | - | Nome original do arquivo |
| `nome_arquivo` | VARCHAR(255) | NO | - | Nome no S3 (UUID + extensão) |
| `tipo_arquivo` | VARCHAR(100) | NO | - | MIME type (image/jpeg, image/png, etc) |
| `tamanho_arquivo` | INTEGER | NO | - | Tamanho em bytes |
| `caminho_s3` | VARCHAR(500) | NO | - | Path completo no S3 |
| `usuario_id` | INTEGER | NO | - | FK para sec_usuario (quem fez upload) |
| `st_ativo` | BOOLEAN | NO | true | Status ativo |
| `st_excluido` | BOOLEAN | NO | false | Exclusão lógica |
| `created_at` | TIMESTAMP | NO | NOW | Data de criação |
| `updated_at` | TIMESTAMP | NO | NOW | Data de atualização |

**Índices:**
- `idx_wiki_imagem_empresa` (empresa_id)
- `idx_wiki_imagem_documento` (documento_id)
- `idx_wiki_imagem_orfas` (documento_id, created_at) WHERE documento_id IS NULL

**Observação:** Imagens com `documento_id = NULL` são consideradas órfãs e podem ser removidas por um job de limpeza após X dias.

---

## 6. Lógica de Visibilidade

### 6.1 Tipos de Visibilidade

```typescript
enum TipoVisibilidade {
  TODOS = 'TODOS',       // Todos usuários da empresa podem ver
  PERFIS = 'PERFIS',     // Apenas perfis específicos
  USUARIOS = 'USUARIOS'  // Apenas usuários específicos
}
```

### 6.2 Regras de Acesso

1. **TODOS**: Qualquer usuário autenticado da empresa pode visualizar
2. **PERFIS**: Verifica se algum perfil do usuário está em `wiki_documento_perfil`
3. **USUARIOS**: Verifica se o usuário está em `wiki_documento_usuario`

### 6.3 Query de Verificação de Acesso

```sql
-- Verifica se usuário tem acesso ao documento
SELECT d.* 
FROM wiki_documento d
WHERE d.documento_id = :documentoId
  AND d.empresa_id = :empresaId
  AND d.st_publicado = true
  AND d.st_ativo = true
  AND d.st_excluido = false
  AND (
    -- Visível para todos
    d.tipo_visibilidade = 'TODOS'
    
    -- Ou usuário está na lista de perfis permitidos
    OR (d.tipo_visibilidade = 'PERFIS' AND EXISTS (
      SELECT 1 FROM wiki_documento_perfil dp
      INNER JOIN sec_usuario_perfil up ON up.perfil_id = dp.perfil_id
      WHERE dp.documento_id = d.documento_id
        AND up.usuario_id = :usuarioId
    ))
    
    -- Ou usuário está na lista de usuários permitidos
    OR (d.tipo_visibilidade = 'USUARIOS' AND EXISTS (
      SELECT 1 FROM wiki_documento_usuario du
      WHERE du.documento_id = d.documento_id
        AND du.usuario_id = :usuarioId
    ))
    
    -- Ou é o autor do documento
    OR d.autor_id = :usuarioId
  );
```

---

## 7. Sistema de Versionamento

### 7.1 Fluxo de Versionamento

```
1. Documento criado
   └── versao_atual = 1
   └── Cria registro em wiki_documento_versao (numero_versao = 1)

2. Documento editado
   └── Incrementa versao_atual
   └── Cria novo registro em wiki_documento_versao
   └── Mantém histórico completo

3. Restaurar versão anterior
   └── Copia conteúdo da versão selecionada
   └── Incrementa versao_atual (nova versão)
   └── Cria registro indicando restauração
```

### 7.2 Exemplo de Implementação

```typescript
// Service de versionamento
class WikiVersaoService {
  
  // Criar nova versão ao salvar documento
  async criarVersao(
    documentoId: number, 
    usuarioId: number, 
    observacao?: string
  ): Promise<WikiDocumentoVersao> {
    const documento = await WikiDocumento.findByPk(documentoId);
    if (!documento) throw new Error('Documento não encontrado');
    
    const novaVersao = documento.versaoAtual + 1;
    
    // Criar registro de versão
    const versao = await WikiDocumentoVersao.create({
      documentoId,
      numeroVersao: novaVersao,
      titulo: documento.titulo,
      resumo: documento.resumo,
      conteudo: documento.conteudo,
      usuarioId,
      observacao: observacao || `Versão ${novaVersao}`,
    });
    
    // Atualizar versão atual no documento
    await documento.update({ versaoAtual: novaVersao });
    
    return versao;
  }
  
  // Listar histórico de versões
  async listarVersoes(documentoId: number): Promise<WikiDocumentoVersao[]> {
    return WikiDocumentoVersao.findAll({
      where: { documentoId },
      order: [['numeroVersao', 'DESC']],
      include: [{
        model: SecUsuario,
        as: 'usuario',
        attributes: ['usuarioId', 'email'],
      }],
    });
  }
  
  // Restaurar versão anterior
  async restaurarVersao(
    documentoId: number, 
    numeroVersao: number, 
    usuarioId: number
  ): Promise<WikiDocumento> {
    const versao = await WikiDocumentoVersao.findOne({
      where: { documentoId, numeroVersao },
    });
    
    if (!versao) throw new Error('Versão não encontrada');
    
    const documento = await WikiDocumento.findByPk(documentoId);
    if (!documento) throw new Error('Documento não encontrado');
    
    // Atualizar documento com conteúdo da versão
    await documento.update({
      titulo: versao.titulo,
      resumo: versao.resumo,
      conteudo: versao.conteudo,
      editorId: usuarioId,
    });
    
    // Criar nova versão indicando restauração
    await this.criarVersao(
      documentoId, 
      usuarioId, 
      `Restaurado da versão ${numeroVersao}`
    );
    
    return documento;
  }
  
  // Comparar duas versões (diff)
  async compararVersoes(
    documentoId: number, 
    versaoA: number, 
    versaoB: number
  ): Promise<{ versaoA: WikiDocumentoVersao; versaoB: WikiDocumentoVersao }> {
    const [vA, vB] = await Promise.all([
      WikiDocumentoVersao.findOne({ where: { documentoId, numeroVersao: versaoA } }),
      WikiDocumentoVersao.findOne({ where: { documentoId, numeroVersao: versaoB } }),
    ]);
    
    if (!vA || !vB) throw new Error('Versão não encontrada');
    
    return { versaoA: vA, versaoB: vB };
  }
}
```

---

## 8. Estrutura de Armazenamento S3

### 8.1 Organização de Pastas

```
bucket-name/
└── wiki/
    └── empresa-{empresaId}/
        ├── documentos/
        │   └── {documentoId}/
        │       ├── imagens/
        │       │   ├── {uuid}-imagem1.jpg
        │       │   └── {uuid}-imagem2.png
        │       └── anexos/
        │           ├── {uuid}-documento.pdf
        │           └── {uuid}-planilha.xlsx
        └── temp/
            └── imagens/
                └── {uuid}-imagem-orfã.jpg  (imagens não vinculadas)
```

### 8.2 Nomenclatura de Arquivos

- **Padrão**: `{uuid}-{nome-original-sanitizado}.{extensão}`
- **Exemplo**: `a1b2c3d4-relatorio-mensal.pdf`

### 8.3 Job de Limpeza de Imagens Órfãs

```typescript
// Executar diariamente via cron
async function limparImagensOrfas(): Promise<void> {
  const diasLimite = 7; // Imagens órfãs há mais de 7 dias
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - diasLimite);
  
  const imagensOrfas = await WikiDocumentoImagem.findAll({
    where: {
      documentoId: null,
      createdAt: { [Op.lt]: dataLimite },
      stExcluido: false,
    },
  });
  
  for (const imagem of imagensOrfas) {
    // Deletar do S3
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imagem.caminhoS3,
    }));
    
    // Marcar como excluída no banco
    await imagem.update({ stExcluido: true });
  }
  
  console.log(`Limpeza concluída: ${imagensOrfas.length} imagens órfãs removidas`);
}
```

---

## 9. Endpoints da API

### 9.1 Categorias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/wiki/categorias` | Listar categorias (árvore) |
| GET | `/api/wiki/categorias/:id` | Buscar categoria por ID |
| POST | `/api/wiki/categorias` | Criar categoria |
| PUT | `/api/wiki/categorias/:id` | Atualizar categoria |
| DELETE | `/api/wiki/categorias/:id` | Excluir categoria |

### 9.2 Documentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/wiki/documentos` | Listar documentos (com filtros) |
| GET | `/api/wiki/documentos/:id` | Buscar documento por ID |
| GET | `/api/wiki/documentos/slug/:slug` | Buscar documento por slug |
| POST | `/api/wiki/documentos` | Criar documento |
| PUT | `/api/wiki/documentos/:id` | Atualizar documento |
| DELETE | `/api/wiki/documentos/:id` | Excluir documento |
| POST | `/api/wiki/documentos/:id/publicar` | Publicar documento |
| POST | `/api/wiki/documentos/:id/despublicar` | Despublicar documento |

### 9.3 Versionamento

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/wiki/documentos/:id/versoes` | Listar versões |
| GET | `/api/wiki/documentos/:id/versoes/:numero` | Buscar versão específica |
| POST | `/api/wiki/documentos/:id/versoes/:numero/restaurar` | Restaurar versão |

### 9.4 Visibilidade

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/wiki/documentos/:id/perfis` | Listar perfis com acesso |
| POST | `/api/wiki/documentos/:id/perfis` | Adicionar perfil |
| DELETE | `/api/wiki/documentos/:id/perfis/:perfilId` | Remover perfil |
| GET | `/api/wiki/documentos/:id/usuarios` | Listar usuários com acesso |
| POST | `/api/wiki/documentos/:id/usuarios` | Adicionar usuário |
| DELETE | `/api/wiki/documentos/:id/usuarios/:usuarioId` | Remover usuário |

### 9.5 Upload de Arquivos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/wiki/documentos/:id/imagens` | Upload de imagem inline |
| POST | `/api/wiki/documentos/:id/anexos` | Upload de anexo |
| DELETE | `/api/wiki/documentos/:id/anexos/:anexoId` | Remover anexo |
| GET | `/api/wiki/documentos/:id/anexos/:anexoId/download` | Download de anexo |

---

## 10. Considerações Finais

### 10.1 Segurança

- Validar permissões em todos os endpoints
- Sanitizar HTML do conteúdo (prevenir XSS)
- Validar tipos de arquivo no upload
- Limitar tamanho de uploads

### 10.2 Performance

- Índices otimizados para buscas frequentes
- Cache de documentos populares (Redis)
- Lazy loading de imagens no editor
- Paginação em listagens

### 10.3 Futuras Melhorias

- Busca full-text com PostgreSQL (tsvector)
- Sistema de tags para documentos
- Favoritos por usuário
- Comentários em documentos
- Notificações de alterações
- Exportação para PDF
- Edição colaborativa em tempo real (Yjs + TipTap)

---

**Documento criado em:** Dezembro/2025  
**Última atualização:** Dezembro/2025 
**Versão:** 1.0
