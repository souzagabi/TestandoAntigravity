# Estratégia de Migração de Arquivos: DB Legado → S3

## Visão Geral

Este documento descreve a estratégia completa para migração de arquivos armazenados como BLOB no banco de dados legado (Firebird) para o Amazon S3, mantendo o controle e integridade do processo.

## 🎯 Estratégia Otimizada: Local + FileZilla

### **Por que esta abordagem é superior:**

1. **🚀 Performance**: Sem processamento em memória no servidor
2. **💾 Resiliência**: Arquivos salvos localmente permitem recuperação
3. **⚡ Paralelismo**: FileZilla pode fazer múltiplos uploads simultâneos
4. **🔧 Operacional**: Upload pode ser pausado/retomado
5. **📊 Monitoramento**: Progresso visual no FileZilla

## Cenário Atual

### **Sistema Legado**
- **Armazenamento**: Arquivos salvos como BLOB/BINARY no Firebird
- **Tipos de Arquivos**: 
  - Imagens de pessoas (avatars)
  - Prontuários médicos (PDFs, imagens)
  - Documentos diversos
  - Anexos clínicos

### **Sistema SaaS**
- **Armazenamento**: Amazon S3
- **Referências**: URLs no PostgreSQL
- **Estrutura**: Organização por empresa e tipo de arquivo

## 🏗️ Nova Arquitetura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Legado DB     │    │  API Migração    │    │   Disco Local   │    │   AWS S3        │
│  (Firebird)     │───▶│   (Node.js)      │───▶│  (Temp Files)   │───▶│  (Bucket)       │
│                 │    │                  │    │                 │    │                 │
│ - BLOB Images   │    │ - Base64 → Buffer│    │ - UUID Naming   │    │ - /pessoas/     │
│ - BLOB Docs     │    │ - Save Local     │    │ - Temp Storage  │    │ - /clinica/     │
│ - Metadata      │    │ - Generate Scripts│    │ - File Tracking │    │ - /prontuarios/ │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Estrutura de Arquivos

### **Temporário (Local)**
```
temp/migration-files/
├── pessoa_foto_1_1001_2025-01-09_abc123.jpg
├── clinica_prontuario_anexo_1_2001_2025-01-09_def456.pdf
└── clinica_anexo_documento_1_3001_2025-01-09_ghi789.pdf
```

### **S3 (Destino Final)**
```
s3://erp-saas-arquivos/
├── pessoas/
│   └── avatares/
│       ├── {empresaId}/
│       │   ├── {pessoaId}/
│       │   │   ├── original_2025-01-09.jpg
│       │   │   ├── thumb_2025-01-09.jpg
│       │   │   └── medium_2025-01-09.jpg
├── clinica/
│   ├── prontuarios/
│   │   ├── {empresaId}/
│   │   │   ├── {pacienteId}/
│   │   │   │   ├── documentos/
│   │   │   │   │   ├── 2025-01-09_exame.pdf
│   │   │   │   ├── imagens/
│   │   │   │   │   ├── 2025-01-09_raio-x.jpg
│   │   │   │   └── pdfs/
│   │   ├── anexos/
│   │   │   ├── {empresaId}/
│   │   │   │   ├── {agendamentoId}/
│   │   │   │   │   ├── 2025-01-09_laudo.pdf
│   │   └── laudos/
│   │       ├── {empresaId}/
│   │       │   ├── {profissionalId}/
│   │       │   │   ├── 2025-01-09_assinatura.png
└── temporario/
    └── uploads/
        └── {batchId}/
```

## 🔄 Fluxo de Migração

### **Fase 1: Extração e Salva Local**

#### 1.1 Delphi → API (Base64)
```delphi
procedure TMigrador.ExtrairArquivo(EmpresaID: Integer; Tabela: string);
var
  Query: TFDQuery;
  BlobField: TBlobField;
  Base64String: string;
begin
  Query := TFDQuery.Create(nil);
  try
    Query.SQL.Text := 'SELECT ID, FOTO FROM ' + Tabela + ' WHERE FOTO IS NOT NULL';
    Query.Open;
    
    while not Query.Eof do
    begin
      BlobField := Query.FieldByName('FOTO') as TBlobField;
      
      if not BlobField.IsNull then
      begin
        // Converter BLOB para Base64
        Base64String := BlobToBase64(BlobField);
        
        // Enviar para API
        EnviarArquivoParaAPI(EmpresaID, Tabela, Query.FieldByName('ID').AsString, 'FOTO', Base64String);
      end;
      
      Query.Next;
    end;
  finally
    Query.Free;
  end;
end;
```

#### 1.2 API Salva Localmente
```typescript
// POST /api/migration/files/upload
{
  "empresaId": 1,
  "tabela": "pessoa",
  "registroId": "1001",
  "campo": "foto",
  "arquivo": {
    "nome": "foto_pessoa.jpg",
    "tipo": "image/jpeg",
    "tamanho": 1024000,
    "dados": "base64_encoded_image_data"
  }
}

// Response
{
  "success": true,
  "data": {
    "nomeArquivo": "pessoa_foto_1_1001_2025-01-09_abc123.jpg",
    "localPath": "/app/temp/migration-files/pessoa_foto_1_1001_2025-01-09_abc123.jpg",
    "s3Path": "pessoas/avatares/1/1001/pessoa_foto_1_1001_2025-01-09_abc123.jpg",
    "status": "SALVO_LOCAL",
    "instrucoes": {
      "proximoPasso": "Enviar arquivo para S3 usando FileZilla ou S3 CLI",
      "comandoS3CLI": "aws s3 cp \"/app/temp/migration-files/pessoa_foto_1_1001_2025-01-09_abc123.jpg\" \"s3://erp-saas-arquivos/pessoas/avatares/1/1001/pessoa_foto_1_1001_2025-01-09_abc123.jpg\""
    }
  }
}
```

### **Fase 2: Upload para S3 (FileZilla)**

#### 2.1 Scripts Gerados Automaticamente
```bash
#!/bin/bash
# Script para upload com AWS S3 CLI (gerado pela API)
aws s3 cp "/app/temp/migration-files/pessoa_foto_1_1001_2025-01-09_abc123.jpg" \
  "s3://erp-saas-arquivos/pessoas/avatares/1/1001/pessoa_foto_1_1001_2025-01-09_abc123.jpg"

aws s3 cp "/app/temp/migration-files/clinica_prontuario_anexo_1_2001_2025-01-09_def456.pdf" \
  "s3://erp-saas-arquivos/clinica/prontuarios/1/2001/documentos/clinica_prontuario_anexo_1_2001_2025-01-09_def456.pdf"

# Após upload, atualizar status
curl -X POST http://api/migration/files/mark-uploaded \
  -d '{
    "empresaOrigem": 1,
    "tabela": "pessoa",
    "registroId": "1001",
    "campo": "foto",
    "nomeArquivo": "pessoa_foto_1_1001_2025-01-09_abc123.jpg",
    "urlS3": "https://s3.amazonaws.com/erp-saas-arquivos/pessoas/avatares/1/1001/pessoa_foto_1_1001_2025-01-09_abc123.jpg"
  }'
```

#### 2.2 Configuração FileZilla
```
Host: s3.amazonaws.com
Port: 443
Protocol: S3
Access Key: [AWS_ACCESS_KEY_ID]
Secret Key: [AWS_SECRET_ACCESS_KEY]
```

### **Fase 3: Atualização de Status**

#### 3.1 Marcar como Enviado
```typescript
// POST /api/migration/files/mark-uploaded
{
  "empresaOrigem": 1,
  "tabela": "pessoa",
  "registroId": "1001",
  "campo": "foto",
  "nomeArquivo": "pessoa_foto_1_1001_2025-01-09_abc123.jpg",
  "urlS3": "https://s3.amazonaws.com/erp-saas-arquivos/pessoas/avatares/1/1001/..."
}

// Response
{
  "success": true,
  "message": "Arquivo marcado como enviado para S3",
  "data": {
    "status": "ENVIADO_S3",
    "urlS3": "https://s3.amazonaws.com/..."
  }
}
```

## 🛡️ Estrutura de Controle

### Tabela migration_arquivo
```sql
CREATE TABLE migration_arquivo (
    id SERIAL PRIMARY KEY,
    empresa_origem_id INTEGER NOT NULL,
    empresa_destino_id INTEGER NOT NULL,
    tabela VARCHAR(100) NOT NULL,
    registro_id VARCHAR(50) NOT NULL,
    campo VARCHAR(100) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo_arquivo VARCHAR(100) NOT NULL,
    tamanho_arquivo BIGINT NOT NULL,
    url_s3 TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'SALVO_LOCAL',
    batch_id VARCHAR(50),
    erro_mensagem TEXT,
    metadados TEXT,
    data_migracao TIMESTAMP DEFAULT NOW(),
    UNIQUE(empresa_origem_id, tabela, registro_id, campo)
);
```

### Status de Migração
- **SALVO_LOCAL**: Arquivo salvo no disco temporário
- **ENVIADO_S3**: Arquivo enviado com sucesso para S3
- **ERRO_SALVAR_LOCAL**: Falha ao salvar localmente
- **ERRO_UPLOAD_S3**: Falha no upload para S3

## 📊 Monitoramento e Status

### Verificar Status
```typescript
// GET /api/migration/files/status/1
{
  "success": true,
  "data": {
    "porTabela": [
      {
        "tabela": "pessoa",
        "campo": "foto",
        "total": 1500,
        "salvosLocal": 1500,
        "enviadosS3": 1450,
        "erros": 50
      },
      {
        "tabela": "clinica_prontuario",
        "campo": "anexo",
        "total": 5000,
        "salvosLocal": 5000,
        "enviadosS3": 4800,
        "erros": 200
      }
    ],
    "totais": {
      "total": 6500,
      "salvosLocal": 6500,
      "enviadosS3": 6250,
      "erros": 250,
      "tamanhoTotal": 25000000000 // 25GB
    }
  }
}
```

### Listar Pendentes
```typescript
// GET /api/migration/files/list-pending/1
{
  "success": true,
  "data": {
    "total": 250,
    "arquivos": [
      {
        "nome_arquivo": "pessoa_foto_1_1001_2025-01-09_abc123.jpg",
        "local_path": "/app/temp/migration-files/...",
        "url_s3": "pessoas/avatares/1/1001/...",
        "status": "SALVO_LOCAL"
      }
    ],
    "scripts": {
      "filezilla": "# Script para FileZilla\n...",
      "s3CLI": "#!/bin/bash\naws s3 cp..."
    }
  }
}
```

## 🎯 Benefícios da Estratégia

### 1. **Performance**
- ✅ Sem processamento em memória no servidor
- ✅ Upload paralelo com FileZilla
- ✅ Não bloqueia a API durante uploads grandes

### 2. **Resiliência**
- ✅ Arquivos salvos localmente permitem recuperação
- ✅ Upload pode ser pausado e retomado
- ✅ Reenvio fácil em caso de falha

### 3. **Operacional**
- ✅ Progresso visual no FileZilla
- ✅ Monitoramento de transferência
- ✅ Controle manual do processo

### 4. **Escalabilidade**
- ✅ Múltiplos uploads simultâneos
- ✅ Processamento em lotes
- ✅ Aproveitamento de banda larga

## 🔧 Implementação Técnica

### Controller FileMigrationController
```typescript
class FileMigrationController {
    private readonly TEMP_DIR = path.join(process.cwd(), 'temp', 'migration-files');
    
    async upload(req: Request, res: Response) {
        // 1. Converter base64 para buffer
        const buffer = Buffer.from(arquivo.dados, 'base64');
        
        // 2. Gerar nome único
        const fileName = this.generateFileName(tabela, empresaId, registroId, campo, extensao);
        
        // 3. Salvar localmente
        const localPath = await this.saveFileLocally(fileName, buffer);
        
        // 4. Gerar path S3
        const s3Path = this.generateS3Path(tabela, empresaId, registroId, fileName);
        
        // 5. Salvar controle
        await MigrationArquivo.create({
            empresaOrigemId: empresaOrigem,
            empresaDestinoId: empresaDestino,
            tabela: tabela.toUpperCase(),
            registroId: registroId,
            campo: campo,
            nomeArquivo: fileName,
            tipoArquivo: arquivo.tipo,
            tamanhoArquivo: arquivo.tamanho,
            urlS3: s3Path,
            status: 'SALVO_LOCAL'
        });
    }
    
    private generateFileName(tabela: string, empresaId: number, registroId: string, campo: string, extensao: string): string {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const uuid = uuidv4().substring(0, 8);
        return `${tabela}_${campo}_${empresaId}_${registroId}_${timestamp}_${uuid}${extensao}`;
    }
    
    private generateS3Path(tabela: string, empresaId: number, registroId: string, nomeArquivo: string): string {
        switch (tabela.toUpperCase()) {
            case 'PESSOA':
                return `pessoas/avatares/${empresaId}/${registroId}/${nomeArquivo}`;
            case 'CLINICA_PRONTUARIO':
                return `clinica/prontuarios/${empresaId}/${registroId}/documentos/${nomeArquivo}`;
            default:
                return `geral/${tabela}/${empresaId}/${registroId}/${nomeArquivo}`;
        }
    }
}
```

## 📈 Estratégias de Otimização

### 1. **Processamento em Lotes**
```typescript
const BATCH_SIZE = 100; // Arquivos por lote
const PARALLEL_UPLOADS = 10; // Uploads simultâneos no FileZilla

// Processar em lotes para não sobrecarregar o disco
for (let i = 0; i < arquivos.length; i += BATCH_SIZE) {
    const lote = arquivos.slice(i, i + BATCH_SIZE);
    await processarLote(lote);
}
```

### 2. **Compressão de Imagens**
```typescript
// Opcional: compressão antes de salvar
const sharp = require('sharp');
const optimizedBuffer = await sharp(buffer)
    .jpeg({ quality: 85, progressive: true })
    .toBuffer();
```

### 3. **Validação de Arquivos**
```typescript
private validarArquivo(buffer: Buffer, mimeType: string): boolean {
    // Validar tamanho máximo
    if (buffer.length > 50 * 1024 * 1024) { // 50MB
        throw new Error('Arquivo muito grande');
    }
    
    // Validar tipo MIME
    const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!tiposPermitidos.includes(mimeType)) {
        throw new Error('Tipo de arquivo não permitido');
    }
    
    return true;
}
```

## 🚀 Plano de Implementação

### Fase 1: Preparação (✅ Concluído)
- [x] Criar tabela migration_arquivo
- [x] Implementar FileMigrationController
- [x] Configurar endpoints
- [x] Criar estrutura de diretórios

### Fase 2: Testes
- [ ] Testar upload de pequenos arquivos
- [ ] Testar upload de arquivos grandes
- [ ] Testar scripts FileZilla/S3 CLI
- [ ] Validar recuperação de erros

### Fase 3: Produção
- [ ] Configurar bucket S3
- [ ] Setup FileZilla
- [ ] Executar migração piloto
- [ ] Monitorar performance

### Fase 4: Limpeza
- [ ] Remover arquivos temporários após upload
- [ ] Configurar lifecycle no S3
- [ ] Documentar processo completo

## 🎉 Conclusão

Esta estratégia de migração de arquivos proporciona:

- **🚀 Performance superior** sem processamento em memória
- **💾 Resiliência** com arquivos salvos localmente
- **⚡ Escalabilidade** com uploads paralelos
- **🔧 Operacionalidade** com controle manual via FileZilla
- **📊 Monitoramento** completo do processo

A abordagem local + FileZilla é definitivamente superior para migração de grandes volumes de arquivos, proporcionando controle total e recuperação fácil em caso de falhas.
aws s3 mb s3://erp-saas-arquivos

# Configurar estrutura de pastas
aws s3api put-object --bucket erp-saas-arquivos --key pessoas/
aws s3api put-object --bucket erp-saas-arquivos --key clinica/
```

#### 2.2 Configurar IAM
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::erp-saas-arquivos",
                "arn:aws:s3:::erp-saas-arquivos/*"
            ]
        }
    ]
}
```

#### 2.3 Tabelas de Controle
```sql
-- Tabela de controle de migração de arquivos
CREATE TABLE migration_arquivo (
    id SERIAL PRIMARY KEY,
    empresa_origem_id INTEGER NOT NULL,
    empresa_destino_id INTEGER NOT NULL,
    tabela VARCHAR(100) NOT NULL,
    registro_id VARCHAR(50) NOT NULL,
    campo VARCHAR(100) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo_arquivo VARCHAR(100) NOT NULL,
    tamanho_arquivo BIGINT NOT NULL,
    url_s3 TEXT NOT NULL,
    url_thumb TEXT,
    url_medium TEXT,
    status VARCHAR(20) DEFAULT 'PENDENTE',
    batch_id VARCHAR(50),
    erro_mensagem TEXT,
    metadados TEXT,
    data_migracao TIMESTAMP DEFAULT NOW(),
    UNIQUE(empresa_origem_id, tabela, registro_id, campo)
);
```

### **Fase 3: Processo de Migração**

#### 3.1 Extração do Legado (Delphi)
```delphi
procedure TMigrador.ExtrairArquivos(EmpresaID: Integer; Tabela: string);
var
  Query: TFDQuery;
  BlobField: TBlobField;
  FileStream: TFileStream;
  ArquivoID: string;
begin
  Query := TFDQuery.Create(nil);
  try
    Query.Connection := FConexaoFirebird;
    Query.SQL.Text := 
      'SELECT ID, FOTO, NOME_ARQUIVO FROM ' + Tabela + 
      ' WHERE EMPRESA_ID = :EMPRESA_ID AND FOTO IS NOT NULL';
    Query.ParamByName('EMPRESA_ID').AsInteger := EmpresaID;
    Query.Open;
    
    while not Query.Eof do
    begin
      BlobField := Query.FieldByName('FOTO') as TBlobField;
      
      if not BlobField.IsNull then
      begin
        ArquivoID := Query.FieldByName('ID').AsString;
        
        // Salvar arquivo temporário
        FileStream := TFileStream.Create(
          'temp_' + ArquivoID + '.bin', fmCreate);
        try
          FileStream.CopyFrom(BlobField, BlobField.Size);
          
          // Enviar para API
          EnviarArquivoParaAPI(EmpresaID, Tabela, ArquivoID, 
            'FOTO', FileStream);
        finally
          FileStream.Free;
        end;
      end;
      
      Query.Next;
    end;
  finally
    Query.Free;
  end;
end;
```

#### 3.2 Upload para S3 (API Node.js)
```typescript
// Endpoint principal de upload
POST /api/migration/files/upload
Content-Type: application/json

{
  "empresaId": 1,
  "tabela": "pessoa",
  "registroId": "1001",
  "campo": "foto",
  "arquivo": {
    "nome": "foto_pessoa_1001.jpg",
    "tipo": "image/jpeg",
    "tamanho": 1024000,
    "dados": "base64_encoded_image_data",
    "metadados": {
      "dataCriacao": "2020-01-01",
      "usuarioCriacao": "admin"
    }
  },
  "metadados": {
    "versaoSistema": "1.0.0",
    "dataMigracao": "2025-01-09T16:00:00Z",
    "batchId": "batch_files_001"
  }
}
```

#### 3.3 Processamento de Imagens
```typescript
// Redimensionamento e otimização
const processImage = async (buffer: Buffer, mimeType: string) => {
  const result = { original: buffer };
  
  if (mimeType.startsWith('image/')) {
    // Thumbnail 100x100
    result.thumb = await sharp(buffer)
      .resize(100, 100, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    // Medium 300x300
    result.medium = await sharp(buffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toBuffer();
  }
  
  return result;
};
```

### **Fase 4: Estrutura no S3**

#### 4.1 Organização de Arquivos
```
s3://erp-saas-arquivos/
├── pessoas/
│   ├── avatares/
│   │   ├── {empresaId}/
│   │   │   ├── {pessoaId}/
│   │   │   │   ├── original_2025-01-09.jpg
│   │   │   │   ├── thumb_2025-01-09.jpg
│   │   │   │   └── medium_2025-01-09.jpg
├── clinica/
│   ├── prontuarios/
│   │   ├── {empresaId}/
│   │   │   ├── {pacienteId}/
│   │   │   │   ├── documentos/
│   │   │   │   │   ├── 2025-01-09_exame.pdf
│   │   │   │   ├── imagens/
│   │   │   │   │   ├── 2025-01-09_raio-x.jpg
│   │   │   │   └── pdfs/
│   │   ├── anexos/
│   │   │   ├── {empresaId}/
│   │   │   │   ├── {agendamentoId}/
│   │   │   │   │   ├── 2025-01-09_laudo.pdf
│   │   └── laudos/
│   │       ├── {empresaId}/
│   │       │   ├── {profissionalId}/
│   │       │   │   ├── 2025-01-09_assinatura.png
└── temporario/
    └── uploads/
        └── {batchId}/
```

#### 4.2 Nomenclatura de Arquivos
```typescript
// Padrão de nomeclatura
const generateFileName = (
  tabela: string,
  empresaId: number,
  registroId: string,
  campo: string,
  timestamp: string,
  extensao: string
): string => {
  return `${tabela}_${campo}_${empresaId}_${registroId}_${timestamp}${extensao}`;
};

// Exemplo: pessoa_foto_1_1001_2025-01-09.jpg
```

### **Fase 5: Controle e Monitoramento**

#### 5.1 Status da Migração
```typescript
// GET /api/migration/files/status/:empresaOrigem
{
  "success": true,
  "data": {
    "porTabela": [
      {
        "tabela": "PESSOA",
        "campo": "FOTO",
        "total": 1500,
        "sucesso": 1450,
        "erros": 50,
        "processando": 0
      },
      {
        "tabela": "CLINICA_PRONTUARIO",
        "campo": "ANEXO",
        "total": 5000,
        "sucesso": 4800,
        "erros": 200,
        "processando": 0
      }
    ],
    "totais": {
      "total": 6500,
      "sucesso": 6250,
      "erros": 250,
      "processando": 0,
      "tamanhoTotal": 25000000000 // 25GB
    }
  }
}
```

#### 5.2 Relatórios de Erros
```sql
-- Arquivos com erro de migração
SELECT 
    tabela,
    campo,
    COUNT(*) as total_erros,
    erro_mensagem
FROM migration_arquivo 
WHERE status = 'ERRO' 
GROUP BY tabela, campo, erro_mensagem
ORDER BY total_erros DESC;
```

## Estratégias de Otimização

### **1. Processamento em Lotes**
```typescript
const BATCH_SIZE = 50; // Arquivos por lote
const PARALLEL_UPLOADS = 5; // Uploads simultâneos

const processBatch = async (arquivos: FileData[]) => {
  const promises = arquivos.map(arquivo => 
    uploadFileWithRetry(arquivo, 3) // 3 tentativas
  );
  
  await Promise.allSettled(promises);
};
```

### **2. Compressão de Imagens**
```typescript
// Otimização baseada no tipo
const optimizeImage = async (buffer: Buffer, quality: number = 85) => {
  return await sharp(buffer)
    .jpeg({ 
      quality,
      progressive: true,
      mozjpeg: true 
    })
    .toBuffer();
};
```

### **3. Upload Multipart para Arquivos Grandes**
```typescript
// Para arquivos > 5MB
if (fileSize > 5 * 1024 * 1024) {
  await uploadMultipart(file, partSize = 5 * 1024 * 1024);
}
```

### **4. Cache de Metadados**
```typescript
// Evitar reprocessamento
const fileCache = new Map<string, boolean>();

const isFileProcessed = (empresaId: number, tabela: string, registroId: string, campo: string) => {
  const key = `${empresaId}:${tabela}:${registroId}:${campo}`;
  return fileCache.has(key);
};
```

## Estratégias de Recuperação

### **1. Retentativas Automáticas**
```typescript
const uploadWithRetry = async (file: FileData, maxRetries: number = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadFile(file);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await sleep(delay);
    }
  }
};
```

### **2. Ponto de Checkpoint**
```typescript
// Salvar progresso a cada N arquivos
const CHECKPOINT_INTERVAL = 100;

let processedCount = 0;
for (const file of files) {
  await processFile(file);
  processedCount++;
  
  if (processedCount % CHECKPOINT_INTERVAL === 0) {
    await saveCheckpoint(processedCount);
  }
}
```

### **3. Validação Pós-Migração**
```typescript
const validateMigration = async (empresaOrigem: number) => {
  // Comparar totais
  const origemCount = await countFilesInLegacy(empresaOrigem);
  const destinoCount = await countFilesInS3(empresaOrigem);
  
  if (origemCount !== destinoCount) {
    throw new Error('Discrepância na contagem de arquivos');
  }
  
  // Verificar integridade (hash comparison)
  await verifyFileIntegrity(empresaOrigem);
};
```

## Plano de Implementação

### **Semana 1: Infraestrutura**
- [ ] Configurar bucket S3
- [ ] Criar tabelas de controle
- [ ] Implementar API básica
- [ ] Configurar permissões AWS

### **Semana 2: Desenvolvimento**
- [ ] Implementar upload service
- [ ] Adicionar processamento de imagens
- [ ] Criar endpoints de status
- [ ] Implementar retentativas

### **Semana 3: Testes**
- [ ] Testar com dados reais
- [ ] Validar performance
- [ ] Testar recuperação de erros
- [ ] Otimizar processo

### **Semana 4: Migração**
- [ ] Executar migração piloto
- [ ] Monitorar processo
- [ ] Tratar exceções
- [ ] Validar resultado final

## Considerações de Segurança

### **1. Criptografia**
- SSL/TLS em trânsito
- Criptografia server-side no S3
- KMS para chaves de criptografia

### **2. Controle de Acesso**
- IAM roles específicas
- Políticas de bucket restritas
- Logs de acesso auditados

### **3. Backup**
- Versionamento no S3
- Cross-region replication
- Backup periódico para Glacier

## Monitoramento e Alertas

### **Métricas Importantes**
- Taxa de upload (arquivos/minuto)
- Volume transferido (GB/hora)
- Taxa de erro (%)
- Tempo médio de processamento

### **Alertas**
- Migração parada por > 1 hora
- Taxa de erro > 5%
- Espaço em disco baixo
- Custos acima do esperado

## Custos Estimados

### **AWS S3**
- Storage: $0.023/GB/mês
- Requests: $0.004/1.000 uploads
- Data Transfer: $0.09/GB (primeiros 10TB/mês)

### **Exemplo**: 1TB de arquivos
- Storage: ~$23/mês
- Uploads: ~$40 (10.000 arquivos)
- Transfer: ~$90
- **Total**: ~$153 no primeiro mês, ~$23/mês subsequentes

## Conclusão

Esta estratégia proporciona uma migração controlada, eficiente e segura de arquivos do banco de dados legado para o S3, com capacidade de recuperação, monitoramento completo e otimização de custos.
