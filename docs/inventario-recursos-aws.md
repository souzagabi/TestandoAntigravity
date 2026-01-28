# Inventário de Recursos AWS - Projeto ADJ ERP

**Data de Atualização**: 09/01/2026  
**Ambiente**: Produção (prod) e Desenvolvimento (dev)

---

## 📋 Resumo Executivo

O projeto ADJ ERP está utilizando **AWS Copilot** como ferramenta de IaC (Infrastructure as Code) para provisionar e gerenciar a infraestrutura na AWS. A aplicação está containerizada com Docker e roda em **ECS Fargate** com **Application Load Balancer**.

### Ambientes Configurados:

- ✅ **dev**: Ambiente de desenvolvimento
- ✅ **prod**: Ambiente de produção (2 instâncias para alta disponibilidade)

---

## 🏗️ Arquitetura Implementada

### Diagrama de Infraestrutura

```
GitHub Repository
    ↓
GitHub Actions (CI/CD)
    ↓
AWS ECR (Container Registry)
    ↓
AWS ECS Fargate (Containers)
    ↓
Application Load Balancer (ALB)
    ↓
Internet (HTTPS)

Dados:
- AWS RDS Aurora PostgreSQL 16.6 (Serverless v2)
- AWS SSM Parameter Store (Credenciais)
- AWS S3 (Armazenamento de arquivos)
```

---

## 🔐 Gerenciamento de Secrets

### ✅ Status Atual: **SSM Parameter Store (GRATUITO)**

Conforme a proposta inicial de **não usar AWS Secrets Manager**, o projeto utiliza o **AWS Systems Manager (SSM) Parameter Store** para armazenar credenciais e configurações sensíveis.

### Parâmetros Criados no SSM:

#### **Ambiente DEV** (`/copilot/adj-erp/dev/secrets/`)

1. ✅ `DB_HOST` - Host do banco de dados
2. ✅ `DB_USERNAME` - Usuário do banco
3. ✅ `DB_PASSWORD` - Senha do banco
4. ✅ `AWS_SECRET_ACCESS_KEY` - Chave secreta AWS para S3
5. ✅ `CNPJA_ACCESS_KEY` - Chave de acesso API CNPJA
6. ✅ `INTEGRAICP_CHANNEL_KEY` - Chave de integração ICP

#### **Ambiente PROD** (`/copilot/adj-erp/prod/secrets/`)

1. ✅ `DB_HOST` - Host do banco de dados
2. ✅ `DB_USERNAME` - Usuário do banco
3. ✅ `DB_PASSWORD` - Senha do banco
4. ✅ `AWS_SECRET_ACCESS_KEY` - Chave secreta AWS para S3
5. ✅ `CNPJA_ACCESS_KEY` - Chave de acesso API CNPJA
6. ✅ `INTEGRAICP_CHANNEL_KEY` - Chave de integração ICP

#### **Metadados do Copilot** (`/copilot/applications/adj-erp/`)

- ✅ `/copilot/applications/adj-erp` - Configuração da aplicação
- ✅ `/copilot/applications/adj-erp/components/api` - Configuração do serviço API
- ✅ `/copilot/applications/adj-erp/environments/dev` - Configuração do ambiente DEV
- ✅ `/copilot/applications/adj-erp/environments/prod` - Configuração do ambiente PROD

#### **RDS Aurora Database** (`adjerpdbAuroraSecret`)

- ✅ Secret gerenciado automaticamente pelo CloudFormation
- Contém: `username` e `password` do banco de dados
- Tipo: `AWS::SecretsManager::Secret` (criado automaticamente pelo addon do RDS)
- Rotação automática de senha: Não configurada
- **Custo**: ~$0.40/mês (único secret do Secrets Manager)

### Custo do SSM Parameter Store:

- **GRATUITO** até 10.000 parâmetros padrão
- **Parâmetros SecureString**: Criptografados com AWS KMS (gratuito para chaves gerenciadas pela AWS)
- **Total de parâmetros**: 16 (bem abaixo do limite gratuito)

### Como Funciona:

Quando você define `secrets:` no `manifest.yml` do Copilot, ele automaticamente:

1. Cria os parâmetros no SSM Parameter Store como `SecureString`
2. Injeta os valores como variáveis de ambiente nos containers ECS
3. Criptografa os valores usando AWS KMS

---

## 🗄️ Banco de Dados

### **RDS Aurora PostgreSQL Serverless v2**

**Cluster**: `adj-erp-prod-addonsstack-7etawld-adjerpdbdbcluster-tacomikn3xoo`

#### Especificações:

- **Engine**: `aurora-postgresql`
- **Versão**: `16.6` ✅ (Atualizado em 09/01/2026)
  - Versão anterior: 16.2
  - Motivo: Compliance com EOS (End of Support) da AWS
- **Tipo**: Serverless v2
- **Capacidade**:
  - Mínima: 0.5 ACU (~$0.06/hora)
  - Máxima: 8 ACU (~$0.96/hora)
- **Multi-AZ**: Sim (6 cópias em 3 zonas de disponibilidade)
- **Backup**: Contínuo para S3
- **Port**: 5432

#### Configuração por Ambiente:

**DEV**:

- Min Capacity: 0.5 ACU
- Max Capacity: 8 ACU
- Database: `adj_erp_dev` (ou conforme configurado)

**PROD**:

- Min Capacity: 0.5 ACU
- Max Capacity: 8 ACU
- Database: `adj_erp_prod`
- Username: `postgres`
- Password: Armazenada no Secrets Manager

#### Custo Estimado:

- **Uso médio**: ~$30-60/mês (dependendo da carga)
- **Armazenamento**: $0.10/GB-mês
- **I/O**: $0.20 por 1 milhão de requests

#### Conexão:

- **VPC**: Privada (não acessível publicamente)
- **Security Group**: `adjerpdbDBClusterSecurityGroup`
- **Acesso**: Apenas via ECS tasks no mesmo VPC

---

## 🐳 Container Registry (ECR)

### Repositórios Criados:

1. ✅ `erp-api-dev` - Imagens do ambiente DEV
2. ✅ `erp-api-prod` - Imagens do ambiente PROD (provável)

### Configuração:

- **Scan on Push**: Habilitado (segurança)
- **Lifecycle Policy**: Não configurada (recomendado: manter últimas 10 imagens)
- **Encryption**: AWS KMS

### Custo:

- **Armazenamento**: $0.10/GB-mês
- **Transfer**: Gratuito para ECS na mesma região

---

## 🚀 ECS (Elastic Container Service)

### **Cluster**: `adj-erp-dev` e `adj-erp-prod`

#### Service: `api`

- **Tipo**: Load Balanced Web Service
- **Launch Type**: Fargate (serverless)
- **Dockerfile**: `server/Dockerfile`
- **Context**: Raiz do projeto (`.`)

#### Configuração por Ambiente:

**DEV**:

- **Tasks**: 1 instância
- **CPU**: 256 (0.25 vCPU)
- **Memory**: 512 MB
- **Port**: 8080
- **Health Check**: `/health`
- **Domain**: `api-erp-dev.adjsistemas.com.br`

**PROD**:

- **Tasks**: 2 instâncias (alta disponibilidade)
- **CPU**: 512 (0.5 vCPU) - provável
- **Memory**: 1024 MB - provável
- **Port**: 8080
- **Health Check**: `/health`
- **Domain**: `api-erp.adjsistemas.com.br`

#### Auto Scaling:

- **Target Tracking**: CPU 70%
- **Min Tasks**: 1 (dev) / 2 (prod)
- **Max Tasks**: 10

#### Custo Estimado:

- **DEV**: ~$15-20/mês (1 task, 0.25 vCPU, 512MB)
- **PROD**: ~$60-80/mês (2 tasks, 0.5 vCPU, 1GB)

---

## ⚖️ Application Load Balancer (ALB)

### **Load Balancer**: `adj-er-Publi-*`

#### Configuração:

- **Scheme**: Internet-facing (público)
- **Listeners**:
  - HTTP (80): Redireciona para HTTPS
  - HTTPS (443): Certificado SSL/TLS
- **Target Group**: ECS tasks na porta 8080
- **Health Check**:
  - Path: `/health`
  - Interval: 30s
  - Timeout: 5s
  - Healthy Threshold: 2
  - Unhealthy Threshold: 2

#### Domínios Configurados:

- ✅ `api-erp-dev.adjsistemas.com.br` (DEV)
- ✅ `api-erp.adjsistemas.com.br` (PROD)

#### Custo:

- **ALB**: ~$16/mês (fixo)
- **LCU (Load Balancer Capacity Units)**: ~$5-10/mês

---

## 🌐 Rede (VPC)

### VPC Criada pelo Copilot:

- **CIDR**: Automático (ex: 10.0.0.0/16)
- **Subnets Públicas**: 2 (para ALB)
- **Subnets Privadas**: 2 (para ECS tasks e RDS)
- **NAT Gateway**: 1 por AZ (para acesso internet das tasks)
- **Internet Gateway**: 1

#### Security Groups:

1. **ALB Security Group**: Permite HTTP/HTTPS de qualquer lugar
2. **ECS Security Group**: Permite tráfego do ALB na porta 8080
3. **RDS Security Group**: Permite PostgreSQL (5432) do ECS

#### Custo:

- **NAT Gateway**: ~$32/mês por AZ (~$64/mês total)
- **Data Transfer**: $0.045/GB

---

## 📦 Armazenamento (S3)

### Buckets:

1. ✅ `adj-www` - Armazenamento de arquivos da aplicação
2. ✅ Bucket de artefatos do Copilot (automático)

#### Configuração:

- **Região**: us-east-1
- **Encryption**: AES-256 (padrão)
- **Versioning**: Não configurado
- **Lifecycle**: Não configurado

#### Acesso:

- **IAM Role**: ECS tasks têm permissão via role
- **Access Key**: Configurada nas variáveis de ambiente
  - `AWS_ACCESS_KEY_ID`: AKIA3M7IH6O3BVB4RJBB (público no manifest)
  - `AWS_SECRET_ACCESS_KEY`: Armazenada no Secrets Manager

#### Custo:

- **Armazenamento**: $0.023/GB-mês
- **Requests**: $0.005 por 1.000 PUT, $0.0004 por 1.000 GET

---

## 📊 Monitoramento (CloudWatch)

### Logs:

- **Log Groups**: `/aws/ecs/adj-erp/api` (automático)
- **Retention**: 7 dias (padrão, recomendado: 30 dias)
- **Logs de acesso do ALB**: Não configurado

### Métricas:

- **ECS**: CPU, Memory, Network
- **ALB**: Request Count, Target Response Time, HTTP Errors
- **RDS**: CPU, Connections, Read/Write IOPS

### Alarmes:

- ❌ **Não configurados** (recomendado criar)

#### Custo:

- **Logs**: $0.50/GB ingerido, $0.03/GB armazenado
- **Métricas**: Gratuito (métricas básicas)
- **Alarmes**: $0.10/alarme/mês

---

## 🔑 IAM (Identity and Access Management)

### Usuários:

1. ✅ `adjdeploy` - Usuário para deploy via GitHub Actions
   - Permissões: AdministratorAccess (ou PowerUserAccess + IAMFullAccess)

### Roles Criadas pelo Copilot:

1. **ECS Task Execution Role**: Permite ECS puxar imagens do ECR e escrever logs
2. **ECS Task Role**: Permite tasks acessarem S3, Secrets Manager, etc.
3. **CodePipeline Role**: Se usar CodePipeline (não implementado)

---

## 🔄 CI/CD

### **GitHub Actions** (Implementado)

#### Workflows:

- ❌ `.github/workflows/deploy-dev.yml` - Não encontrado no código
- ❌ `.github/workflows/deploy-prod.yml` - Não encontrado no código
- ❌ `.github/workflows/test.yml` - Não encontrado no código

**Status**: Planejado mas não implementado ainda

#### Alternativa: Deploy Manual

Atualmente o deploy é feito via:

```bash
copilot svc deploy --name api --env dev
copilot svc deploy --name api --env prod
```

---

## 💰 Estimativa de Custos Mensais

### Ambiente DEV:

| Recurso               | Custo Estimado   |
| --------------------- | ---------------- |
| ECS Fargate (1 task)  | $15-20           |
| ALB                   | $16              |
| NAT Gateway (1 AZ)    | $32              |
| RDS Aurora Serverless | $20-30           |
| Secrets Manager       | $2.40            |
| S3                    | $5-10            |
| CloudWatch Logs       | $5               |
| ECR                   | $2               |
| **Total DEV**         | **~$95-115/mês** |

### Ambiente PROD:

| Recurso               | Custo Estimado    |
| --------------------- | ----------------- |
| ECS Fargate (2 tasks) | $60-80            |
| ALB                   | $16               |
| NAT Gateway (2 AZs)   | $64               |
| RDS Aurora Serverless | $40-60            |
| Secrets Manager (RDS) | $0.40             |
| SSM Parameter Store   | **GRATUITO**      |
| S3                    | $10-20            |
| CloudWatch Logs       | $10               |
| ECR                   | $2                |
| **Total PROD**        | **~$202-252/mês** |

### **Total Geral: ~$297-367/mês**

---

## 🎯 Recomendações

### 1. **Remover Secrets Manager (Opcional)**

Se o custo de $3.60/mês incomoda, você pode:

- Migrar para **AWS Systems Manager Parameter Store** (gratuito)
- Usar variáveis de ambiente diretas (menos seguro)

**Como migrar**:

```bash
# Criar parâmetros no SSM
aws ssm put-parameter --name "/adj-erp/dev/DB_PASSWORD" --value "senha" --type SecureString

# Atualizar manifest.yml
secrets:
  DB_PASSWORD:
    from_ssm: /adj-erp/dev/DB_PASSWORD
```

### 2. **Implementar GitHub Actions**

Automatizar o deploy via GitHub Actions conforme planejado no `ambiente-aws.md`.

### 3. **Configurar Alarmes CloudWatch**

Criar alarmes para:

- CPU > 80%
- Memory > 80%
- HTTP 5xx errors > 10/min
- RDS Connections > 80% do máximo

### 4. **Lifecycle Policy no ECR**

Manter apenas últimas 10 imagens para economizar espaço.

### 5. **Logs Retention**

Aumentar retenção de logs para 30 dias (compliance).

### 6. **Backup Strategy**

Configurar snapshots automáticos do RDS com retenção de 7-30 dias.

---

## 📝 Comandos Úteis

### Copilot:

```bash
# Ver status do serviço
copilot svc status --name api --env prod

# Ver logs
copilot svc logs --name api --env prod --follow

# Deploy
copilot svc deploy --name api --env prod

# Executar comando no container
copilot svc exec --name api --env prod --command "npm run migrate:up"
```

### AWS CLI:

```bash
# Listar secrets
aws secretsmanager list-secrets --region us-east-1

# Ver valor de um secret
aws secretsmanager get-secret-value --secret-id /copilot/adj-erp/prod/secrets/DB_PASSWORD

# Atualizar secret
aws secretsmanager update-secret --secret-id /copilot/adj-erp/prod/secrets/DB_PASSWORD --secret-string "nova_senha"
```

---

## 📚 Documentação de Referência

- **AWS Copilot**: https://aws.github.io/copilot-cli/
- **ECS Fargate**: https://docs.aws.amazon.com/ecs/
- **RDS Aurora**: https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/
- **Secrets Manager**: https://docs.aws.amazon.com/secretsmanager/

---

## 🔄 Histórico de Mudanças

### 09/01/2026

- ✅ Upgrade do RDS Aurora PostgreSQL de 16.2 para 16.6
- ✅ Criação deste inventário de recursos

### 02/01/2026

- ✅ Deploy inicial bem-sucedido no ambiente DEV
- ✅ Configuração do ALB com health check em `/health`
- ✅ Integração com banco Railway (temporário)

### 31/12/2025

- ✅ Inicialização do projeto com AWS Copilot
- ✅ Criação da infraestrutura base (VPC, ECR, ECS)
