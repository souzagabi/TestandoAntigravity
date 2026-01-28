# Arquitetura do Módulo Indexador de Documentos

## Visão Geral

Este documento descreve a arquitetura completa para o módulo **Indexador de Documentos**, uma modernização do sistema legado de armazenamento de publicações da área jurídica. O novo sistema migrará do modelo desktop com arquivos RTF para uma solução SaaS com armazenamento em banco de dados, anexos na AWS S3 e recursos avançados de IA para resumo e busca inteligente.

## 🏗️ Estrutura de Diretórios

### Backend (Node.js + TypeScript + Sequelize)

```
src/server/src/
├── controller/indexador/
│   ├── indexadorDocumentoController.ts          # CRUD básico de documentos
│   ├── indexadorAnexoController.ts              # Gestão de anexos S3
│   └── indexadorAiController.ts                 # Endpoints de IA (resumo, busca)
├── database/models/indexador/
│   ├── indexadorDocumento.ts                     # Modelo principal de documentos
│   ├── indexadorNatureza.ts                     # Classificações de natureza
│   ├── indexadorExpedidor.ts                     # Entidades expedidoras
│   ├── indexadorPasta.ts                         # Organização de pastas
│   ├── indexadorAnexo.ts                         # Metadados de anexos
│   └── indexadorAssociations.ts                  # Relacionamentos entre modelos
├── services/indexador/
│   ├── indexadorService.ts                       # Lógica de negócio principal
│   ├── indexadorAiService.ts                     # Integração com APIs de IA
│   ├── indexadorSearchService.ts                 # Busca vetorial e semântica
│   └── indexadorS3Service.ts                     # Integração com AWS S3
├── routes/indexador/
│   ├── indexadorRoutes.ts                        # Rotas REST principais
│   └── indexadorAiRoutes.ts                      # Rotas específicas de IA
└── middleware/indexador/
    ├── indexadorUploadMiddleware.ts               # Upload de arquivos
    └── indexadorAuthMiddleware.ts                 # Controle de acesso
```

### Frontend (React + TypeScript + Material-UI)

```
src/front/src/
├── pages/indexador/
│   ├── IndexadorListPage.tsx               # Listagem com busca inteligente
│   ├── IndexadorEditPage.tsx               # Editor de documentos
│   ├── IndexadorSearchPage.tsx             # Busca avançada com IA
│   └── IndexadorViewPage.tsx               # Visualização de documentos
├── components/indexador/
│   ├── IndexadorEditor.tsx                 # Editor de texto rico (TipTap)
│   ├── IndexadorViewer.tsx                  # Visualizador de PDF/anexos
│   ├── IndexadorSearch.tsx                  # Componente de busca IA
│   ├── IndexadorCard.tsx                    # Card de documento na lista
│   └── IndexadorFilters.tsx                # Filtros avançados
├── services/indexador/
│   ├── indexadorApi.ts                      # Cliente API principal
│   ├── indexadorAiApi.ts                    # Cliente API de IA
│   └── indexadorTypes.ts                    # Interfaces TypeScript
└── hooks/indexador/
    ├── useIndexadorSearch.ts               # Hook para busca inteligente
    ├── useIndexadorEditor.ts               # Hook para editor de texto
    └── useIndexadorUpload.ts               # Hook para upload de arquivos
```

## 📊 Modelo de Dados

### Tabela Principal: `indexador_documento`

```sql
CREATE TABLE indexador_documento (
    id SERIAL PRIMARY KEY,
    numero_arquivo VARCHAR(50) UNIQUE NOT NULL,
    natureza_id INTEGER REFERENCES indexador_natureza(id),
    expedidor_id INTEGER REFERENCES indexador_expedidor(id),
    pasta_id INTEGER REFERENCES indexador_pasta(id),
    data_expedicao DATE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    numero_pasta VARCHAR(20),
    numero_folha VARCHAR(20),
    resumo TEXT,
    conteudo TEXT,                    -- Conteúdo completo do documento
    resumo_ia TEXT,                   -- Resumo gerado por IA
    embedding VECTOR(1536),           -- Embedding para busca semântica
    empresa_id INTEGER NOT NULL,
    st_ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_indexador_documento_empresa ON indexador_documento(empresa_id);
CREATE INDEX idx_indexador_documento_natureza ON indexador_documento(natureza_id);
CREATE INDEX idx_indexador_documento_data ON indexador_documento(data_expedicao);
CREATE INDEX idx_indexador_documento_embedding ON indexador_documento USING ivfflat (embedding vector_cosine_ops);
```

### Tabelas Auxiliares

```sql
-- Natureza dos documentos
CREATE TABLE indexador_natureza (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    empresa_id INTEGER NOT NULL,
    st_ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entidades expedidoras
CREATE TABLE indexador_expedidor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(50), -- 'Conselho', 'Tribunal', 'Cartório', etc.
    empresa_id INTEGER NOT NULL,
    st_ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organização de pastas
CREATE TABLE indexador_pasta (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    pasta_pai_id INTEGER REFERENCES indexador_pasta(id),
    empresa_id INTEGER NOT NULL,
    st_ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anexos dos documentos
CREATE TABLE indexador_anexo (
    id SERIAL PRIMARY KEY,
    documento_id INTEGER NOT NULL REFERENCES indexador_documento(id),
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo_arquivo VARCHAR(100),
    tamanho_bytes INTEGER,
    s3_key VARCHAR(500),               -- Caminho no bucket S3
    s3_url TEXT,                       -- URL assinada temporária
    texto_extraido TEXT,               -- Texto extraído do PDF
    embedding VECTOR(1536),             -- Embedding do anexo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📄 Extração de Texto de PDFs

Para extração de textos de PDFs, **não utilize OpenAI** - é muito caro e ineficiente para essa tarefa. OpenAI é ideal para geração de conteúdo, mas não para extração de texto.

### Tecnologias Recomendadas

#### Opção 1: AWS Textract (Recomendado)
**Vantagens:**
- **OCR de alta qualidade** para PDFs digitalizados e imagens
- **Detecção automática** de tabelas e formulários
- **Integração nativa** com seu ecossistema AWS (já usa S3)
- **Custo razoável**: ~$1.50 por 1000 páginas

**Implementação:**
```typescript
import { TextractClient, AnalyzeDocumentCommand } from '@aws-sdk/client-textract';

class IndexadorExtractionService {
  private textractClient = new TextractClient({ region: 'us-east-1' });

  async extractTextFromS3(s3Key: string): Promise<string> {
    const command = new AnalyzeDocumentCommand({
      Document: {
        S3Object: {
          Bucket: process.env.AWS_S3_BUCKET,
          Name: s3Key
        }
      },
      FeatureTypes: ['TABLES', 'FORMS']
    });
    
    const response = await this.textractClient.send(command);
    return this.extractTextFromBlocks(response.Blocks);
  }

  private extractTextFromBlocks(blocks: any[]): string {
    return blocks
      .filter(block => block.BlockType === 'LINE')
      .map(block => block.Text)
      .join('\n');
  }
}
```

#### Opção 2: Apache Tika (Self-hosted)
**Vantagens:**
- **Gratuito** (open-source)
- **Suporte a 1000+ formatos** de arquivo
- **Processamento local** (sem custos por API)
- **Alta precisão** para PDFs textuais

**Implementação:**
```typescript
import { fromBuffer } from 'pdf-parse';

class IndexadorExtractionService {
  async extractTextFromBuffer(buffer: Buffer): Promise<string> {
    const data = await fromBuffer(buffer);
    return data.text;
  }
}
```

#### Opção 3: pdf-parse (Node.js)
**Vantagens:**
- **Leve e rápido** para PDFs textuais
- **Zero dependências externas**
- **Perfeito para PDFs já digitais**
- **Gratuito**

**Limitações:**
- Não funciona com PDFs escaneados/imagens
- Não extrai tabelas complexas

### Estratégia Híbrida Recomendada

Use **duas abordagens complementares** para máxima eficiência:

```typescript
class IndexadorExtractionService {
  async extractText(file: Buffer, filename: string): Promise<ExtractionResult> {
    // 1. Tentar extração direta (PDFs textuais)
    try {
      const directText = await this.extractTextualPDF(file);
      if (directText && directText.trim().length > 100) {
        return {
          text: directText,
          method: 'direct',
          confidence: 'high'
        };
      }
    } catch (error) {
      console.log('PDF não é textual, usando OCR...');
    }
    
    // 2. Fallback para OCR (PDFs escaneados)
    return await this.extractWithOCR(file, filename);
  }
  
  private async extractTextualPDF(buffer: Buffer): Promise<string> {
    // Usar pdf-parse (rápido e gratuito)
    const data = await fromBuffer(buffer);
    return data.text;
  }
  
  private async extractWithOCR(buffer: Buffer, filename: string): Promise<ExtractionResult> {
    // Upload temporário para S3
    const s3Key = `temp/${Date.now()}-${filename}`;
    await this.uploadToS3(buffer, s3Key);
    
    // Extrair com AWS Textract
    const text = await this.extractTextFromS3(s3Key);
    
    // Limpar arquivo temporário
    await this.deleteFromS3(s3Key);
    
    return {
      text,
      method: 'ocr',
      confidence: 'medium'
    };
  }
}

interface ExtractionResult {
  text: string;
  method: 'direct' | 'ocr';
  confidence: 'high' | 'medium' | 'low';
}
```

### Análise de Custos

| Tecnologia | Custo | Vantagens | Ideal para |
|------------|-------|-----------|------------|
| **AWS Textract** | $1.50/1000 páginas | OCR avançado, tabelas | PDFs escaneados |
| **Apache Tika** | $0 (servidor) | Multi-formato | Volume alto |
| **pdf-parse** | $0 | Ultra rápido | PDFs textuais |

### Estratégia de Implementação

1. **Fase 1**: Começar com `pdf-parse` (gratuito)
2. **Fase 2**: Adicionar `AWS Textract` para OCR quando necessário
3. **Fase 3**: Implementar `Apache Tika` para mais formatos

**Recomendação Final:** Começar com **AWS Textract** pois:
- Você já usa AWS S3
- Qualidade superior para documentos jurídicos
- Custo previsível e baixo para seu volume
- Não precisa manter infraestrutura adicional

### Integração com o Fluxo Principal

```typescript
class IndexadorAiService {
  async processDocument(documentoId: number, anexoId: number): Promise<void> {
    // 1. Extrair texto do PDF
    const anexo = await this.indexadorAnexoService.findById(anexoId);
    const fileBuffer = await this.downloadFromS3(anexo.s3_key);
    const extraction = await this.extractionService.extractText(fileBuffer, anexo.nome_arquivo);
    
    // 2. Atualizar texto extraído no anexo
    await this.indexadorAnexoService.update(anexoId, {
      texto_extraido: extraction.text
    });
    
    // 3. Gerar embedding do texto
    const embedding = await this.generateEmbedding(extraction.text);
    
    // 4. Atualizar embedding do documento
    await this.indexadorDocumentoService.updateEmbedding(documentoId, embedding);
    
    // 5. Gerar resumo automático
    const resumo = await this.generateSummary(extraction.text);
    
    // 6. Atualizar resumo do documento
    await this.indexadorDocumentoService.update(documentoId, {
      resumo_ia: resumo,
      conteudo: extraction.text
    });
  }
}
```

## 🤖 Tecnologias de IA

### Opção A: OpenAI (Recomendado para MVP)

**Vantagens:**
- Alta qualidade de geração
- Implementação simplificada
- Custos previsíveis
- API robusta e documentada

**Serviços Utilizados:**
- **GPT-4o-mini**: Geração de resumos (~$0.15/1M tokens)
- **text-embedding-3-small**: Embeddings para busca (~$0.02/1K tokens)
- **gpt-4o**: Classificação e extração de entidades (quando necessário)

**Custos Estimados:**
- Resumos: ~$0.50 por 1000 documentos
- Embeddings: ~$20 para 10000 documentos
- Busca: ~$0.02 por 1000 buscas

### Opção B: AWS Ecosystem

**Vantagens:**
- Integração completa com AWS
- Conformidade e segurança
- Controle total da infraestrutura

**Serviços Utilizados:**
- **AWS Textract**: Extração de texto de PDFs (~$1.50/1000 páginas)
- **AWS Bedrock**: Modelos de linguagem (Claude, Titan)
- **Amazon OpenSearch**: Busca vetorial com k-NN
- **AWS Comprehend**: Análise de sentimentos e entidades

### Opção C: Self-Hosted (Hugging Face)

**Vantagens:**
- Sem custos por API
- Controle total dos modelos
- Privacidade dos dados

**Modelos Recomendados:**
- **sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2**: Embeddings
- **t5-small-portuguese**: Resumos em português
- **bert-base-portuguese-cased**: Classificação de texto

## 🔄 Fluxo de Processamento de IA

```mermaid
graph TD
    A[Upload Documento] --> B[Extração de Texto]
    B --> C[Pré-processamento]
    C --> D[Geração de Embedding]
    C --> E[Geração de Resumo IA]
    D --> F[Indexação Vetorial]
    E --> G[Armazenamento]
    F --> H[Busca Disponível]
    G --> H
```

### Etapas Detalhadas

1. **Extração de Texto**
   - PDFs: AWS Textract ou Apache Tika
   - Imagens: OCR com Tesseract
   - Documentos digitais: Parse direto

2. **Pré-processamento**
   - Limpeza de texto
   - Remoção de ruído
   - Normalização de encoding

3. **Geração de Embedding**
   - Conversão do texto em vetor numérico
   - Dimensão: 1536 (OpenAI) ou 384 (modelos locais)
   - Armazenamento em coluna vetorial

4. **Geração de Resumo**
   - Análise do conteúdo completo
   - Extração de pontos principais
   - Geração de resumo conciso (200-500 caracteres)

5. **Indexação**
   - Armazenamento em PostgreSQL com pgvector
   - Criação de índices IVFFlat para busca eficiente
   - Atualização incremental

## 🔍 Funcionalidades de Busca

### Busca Híbrida

A busca combina três abordagens para máxima relevância:

1. **Busca Textual Tradicional**
   - Full-text search do PostgreSQL
   - Índices GIN para performance
   - Suporte a operadores booleanos

2. **Busca Semântica**
   - Similaridade de cosseno entre embeddings
   - Busca por conceito, não apenas palavras
   - Limiar de similaridade configurável

3. **Busca Híbrida (RRF - Reciprocal Rank Fusion)**
   - Combinação dos resultados das duas buscas
   - Ranking otimizado por relevância
   - Filtros aplicados após o ranking

### Exemplo de Query SQL

```sql
-- Busca híbrida combinando texto e semântica
WITH busca_textual AS (
    SELECT id, 
           ts_rank(search_vector, plainto_tsquery('portuguese', :query)) as rank_texto
    FROM indexador_documento 
    WHERE empresa_id = :empresa_id
      AND search_vector @@ plainto_tsquery('portuguese', :query)
),
busca_semantica AS (
    SELECT id, 
           1 - (embedding <=> :query_embedding) as similarity
    FROM indexador_documento 
    WHERE empresa_id = :empresa_id
      AND embedding IS NOT NULL
      AND 1 - (embedding <=> :query_embedding) > 0.7
)
SELECT d.*, 
       COALESCE(bt.rank_texto, 0) * 0.4 + COALESCE(bs.similarity, 0) * 0.6 as final_rank
FROM indexador_documento d
LEFT JOIN busca_textual bt ON d.id = bt.id
LEFT JOIN busca_semantica bs ON d.id = bs.id
WHERE d.id IN (SELECT id FROM busca_textual UNION SELECT id FROM busca_semantica)
ORDER BY final_rank DESC
LIMIT 20;
```

## 📱 Interfaces do Usuário

### Página Principal: Lista de Documentos

**Componentes:**
- **Barra de Busca Inteligente**: Input com sugestões e busca em tempo real
- **Filtros Avançados**: Natureza, expedidor, período, pasta
- **Modo de Visualização**: Cards ou tabela
- **Ordenação**: Relevância, data, número de arquivo

**Funcionalidades:**
- Busca por texto ou conceito
- Filtros combinados
- Paginação infinita
- Preview rápido de documentos

### Editor de Documentos

**Tecnologia:** TipTap (já utilizado no projeto)

**Recursos:**
- Formatação rica (negrito, itálico, listas)
- Suporte a tabelas
- Histórico de alterações
- Auto-save
- Importação de RTF legado

**Integração com IA:**
- Sugestões de classificação
- Geração automática de resumo
- Extração de entidades

### Visualizador de Anexos

**Componentes:**
- Visualizador de PDF integrado
- Download de anexos
- Extração de texto em tempo real
- Sync com S3

## 🚀 Estratégia de Implementação

### Fase 1 - MVP (2-3 semanas)

**Backend:**
- [ ] Criar modelos de dados (migrations)
- [ ] Implementar controllers básicos (CRUD)
- [ ] Configurar integração S3
- [ ] Implementar upload de anexos

**Frontend:**
- [ ] Criar páginas básicas (lista, edit)
- [ ] Implementar editor TipTap
- [ ] Configurar upload de arquivos
- [ ] Busca textual tradicional

**Entregáveis:**
- Sistema funcional sem IA
- Migração de dados básica
- Upload de anexos funcionando

### Fase 2 - IA Básica (2-3 semanas)

**Backend:**
- [ ] Integração com OpenAI
- [ ] Serviço de geração de embeddings
- [ ] Serviço de resumo automático
- [ ] Extração de texto de PDFs
- [ ] Configurar pgvector

**Frontend:**
- [ ] Interface de busca inteligente
- [ ] Exibição de resumos gerados
- [ ] Indicadores de processamento IA

**Entregáveis:**
- Resumos automáticos funcionando
- Busca semântica básica
- Processamento de PDFs

### Fase 3 - IA Avançada (2-3 semanas)

**Backend:**
- [ ] Busca híbrida otimizada
- [ ] Classificação automática de documentos
- [ ] Análise de similaridade avançada
- [ ] API de recomendações
- [ ] Dashboard de analytics

**Frontend:**
- [ ] Busca avançada com filtros semânticos
- [ ] Visualização de documentos similares
- [ ] Dashboard de insights
- [ ] Relatórios de uso

**Entregáveis:**
- Sistema completo de IA
- Analytics e insights
- Recomendações inteligentes

### Fase 4 - Otimização (1-2 semanas)

**Performance:**
- [ ] Otimização de queries
- [ ] Cache de embeddings
- [ ] Processamento assíncrono
- [ ] Monitoramento de performance

**Escalabilidade:**
- [ ] Queue para processamento IA
- [ ] Rate limiting
- [ ] Monitoramento de custos
- [ ] Backup e recuperação

## 💰 Análise de Custos

### OpenAI (Recomendado)

**Custos Fixos Mensais:**
- Embeddings: ~$20 para 10.000 documentos
- Resumos: ~$5 para 1.000 novos documentos
- Busca: ~$2 para 100.000 buscas

**Custo Total Estimado:** ~$27/mês para 10.000 documentos

### AWS Alternative

**Custos Fixos Mensais:**
- Textract: ~$15 para 1.000 páginas
- Bedrock: ~$40 para 1.000 resumos
- OpenSearch: ~$175 (instância small)
- S3 Storage: ~$23/GB

**Custo Total Estimado:** ~$253/mês

### Self-Hosted

**Custos Fixos Mensais:**
- Servidor dedicado: ~$100
- Manutenção: ~$50/hora
- Energia e infra: ~$30

**Custo Total Estimado:** ~$180/mês + manutenção

## 🔧 Configuração Técnica

### Variáveis de Ambiente

```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL_GPT=gpt-4o-mini
OPENAI_MODEL_EMBEDDING=text-embedding-3-small

# AWS S3
AWS_S3_BUCKET=documentos-adj
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/adj
PGVECTOR_INSTALLED=true

# Aplicação
NODE_ENV=production
PORT=3001
JWT_SECRET=...
```

### Dependências Backend

```json
{
  "dependencies": {
    "openai": "^4.20.1",
    "pgvector": "^0.1.4",
    "@aws-sdk/client-s3": "^3.787.0",
    "@aws-sdk/client-textract": "^3.787.0",
    "multer": "^1.4.5-lts.2",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.6.0"
  }
}
```

### Dependências Frontend

```json
{
  "dependencies": {
    "@tiptap/react": "^3.13.0",
    "@tiptap/starter-kit": "^3.13.0",
    "react-pdf": "^7.7.0",
    "react-dropzone": "^14.2.3",
    "fuse.js": "^7.0.0"
  }
}
```

## 📊 Métricas e KPIs

### Métricas de Uso
- Número de documentos indexados
- Volume de buscas realizadas
- Taxa de cliques em resultados
- Tempo médio de processamento IA

### Métricas de Qualidade
- Precisão da busca (relevância)
- Satisfação com resumos gerados
- Taxa de classificação automática correta
- Tempo de resposta da busca

### Métricas de Performance
- Tempo de indexação
- Latência de busca
- Uso de recursos (CPU, memória)
- Custo por operação

## 🔄 Migração do Sistema Legado

### Estratégia de Migração

1. **Análise dos Dados Legados**
   - Mapeamento de campos
   - Validação de integridade
   - Identificação de inconsistências

2. **Extração de RTFs**
   - Parse de arquivos RTF
   - Conversão para HTML/Texto
   - Preservação de formatação

3. **Importação em Lotes**
   - Processamento assíncrono
   - Validação durante importação
   - Rollback em caso de erro

4. **Validação Pós-Migração**
   - Comparação de registros
   - Teste de funcionalidades
   - Ajustes finos

### Script de Migração (Exemplo)

```typescript
class LegadoMigrationService {
  async migrarDocumentos() {
    const rtfFiles = await this.getRtfFiles();
    
    for (const file of rtfFiles) {
      try {
        const conteudo = await this.parseRtf(file.path);
        const metadados = this.extractMetadata(file);
        
        await this.createDocumento({
          ...metadados,
          conteudo,
          empresaId: 1
        });
        
        console.log(`Migrado: ${file.name}`);
      } catch (error) {
        console.error(`Erro em ${file.name}:`, error);
      }
    }
  }
}
```

## 🛡️ Segurança e Privacidade

### Controles de Acesso
- Autenticação por empresa (multi-tenant)
- RBAC para diferentes perfis
- Audit trail de todas as operações

### Proteção de Dados
- Criptografia em repouso (PostgreSQL)
- Criptografia em trânsito (HTTPS)
- Anonimização de dados sensíveis

### Conformidade
- LGPD compliance
- Log de acesso a dados
- Políticas de retenção

## 📈 Monitoramento e Manutenção

### Health Checks
- Status da API OpenAI
- Conectividade com S3
- Performance do banco
- Uso de memória/CPU

### Alertas
- Falhas na integração IA
- Custos acima do esperado
- Performance degradation
- Erros de upload

### Backup e Recovery
- Backup diário do banco
- Versionamento de embeddings
- Recuperação pontual
- Testes de restore

## 🎯 Próximos Passos

1. **Aprovação da Arquitetura**
2. **Setup do Ambiente**
3. **Criação dos Modelos**
4. **Implementação do MVP**
5. **Testes com Dados Reais**
6. **Integração com IA**
7. **Deploy em Produção**

---

**Documento Versão:** 1.0  
**Data:** 23/01/2026  
**Autor:** Sistema ADJ-WWW  
**Status:** Proposta Técnica
