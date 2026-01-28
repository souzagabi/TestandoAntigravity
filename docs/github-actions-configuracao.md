# Configuração do GitHub Actions - Deploy AWS

**Data**: 09/01/2026  
**Workflow**: `.github/workflows/deploy.yml`

---

## 🎯 Objetivo

Automatizar o deploy da API (backend) e Frontend para AWS quando houver push nas branches `dev` ou `main`.

---

## 🔄 Fluxo de Deploy

```
Push para branch dev/main
    ↓
GitHub Actions inicia
    ↓
┌─────────────────────────────────────┐
│  Job 1: Deploy API (Copilot)       │
│  - Build Docker image               │
│  - Push para ECR                    │
│  - Deploy no ECS via Copilot        │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Job 2: Deploy Frontend             │
│  - Build do React/Vite              │
│  - Upload para S3                   │
│  - Invalidação CloudFront           │
└─────────────────────────────────────┘
```

---

## 🔐 GitHub Secrets Necessários

Configure em: **Settings → Secrets and variables → Actions**

| Secret                  | Descrição                         | Valor                |
| ----------------------- | --------------------------------- | -------------------- |
| `AWS_ACCESS_KEY_ID`     | Access Key do usuário `adjdeploy` | AKIA3M7IH6O3BVB4RJBB |
| `AWS_SECRET_ACCESS_KEY` | Secret Key do usuário `adjdeploy` | (confidencial)       |

**Apenas 2 secrets são necessários!** Todas as outras credenciais estão no SSM Parameter Store.

---

## 🌍 Ambientes Configurados

### **Development (branch: `dev`)**

- **API**: `https://api-erp-dev.adjsistemas.com.br`
- **Frontend S3**: `adj-dev-frontend`
- **CloudFront**: `ESIEM8QIAHJB`
- **Aprovação**: Automática (sem aprovação manual)

### **Production (branch: `main`)**

- **API**: `https://api-erp.adjsistemas.com.br`
- **Frontend S3**: `adj-erp-frontend`
- **CloudFront**: `EDQKV3ASQBY4C`
- **Aprovação**: ✅ **Manual** (requer aprovação no GitHub)

---

## ✅ Aprovação Manual para Produção

### Como Funciona:

1. **Push para `main`** → Workflow inicia
2. **GitHub pausa** e aguarda aprovação
3. **Revisor aprova** no GitHub Actions
4. **Deploy continua** automaticamente

### Configurar Aprovadores:

1. Acesse: **Settings → Environments**
2. Clique em **production**
3. Em **Deployment protection rules**:
   - ✅ Marque **Required reviewers**
   - Adicione os usuários que podem aprovar
   - Defina quantos aprovadores são necessários (mínimo 1)

### Exemplo de Configuração:

```
Environment: production
Required reviewers:
  - @seu-usuario
  - @outro-admin
Minimum reviewers: 1
Wait timer: 0 minutes (opcional)
```

---

## 📋 Jobs do Workflow

### **Job 1: Deploy API (Backend)**

```yaml
deploy-api:
  name: Deploy API (Copilot)
  runs-on: ubuntu-latest
  environment:
    name: ${{ github.ref == 'refs/heads/main' && 'production' || 'development' }}
```

**Passos:**

1. ✅ Checkout do código
2. ✅ Configurar credenciais AWS
3. ✅ Instalar Copilot CLI
4. ✅ Detectar ambiente (dev/prod)
5. ✅ Deploy via Copilot

**O que o Copilot faz:**

- Build da imagem Docker
- Push para ECR
- Atualiza Task Definition no ECS
- Lê secrets do SSM Parameter Store
- Injeta variáveis de ambiente no container

### **Job 2: Deploy Frontend**

```yaml
deploy-frontend:
  name: Deploy Frontend
  runs-on: ubuntu-latest
  environment:
    name: ${{ github.ref == 'refs/heads/main' && 'production' || 'development' }}
```

**Passos:**

1. ✅ Checkout do código
2. ✅ Detectar ambiente e configurar variáveis
3. ✅ Setup Node.js 20 com cache npm
4. ✅ Instalar dependências
5. ✅ Build do frontend (Vite)
6. ✅ Configurar credenciais AWS
7. ✅ Sync para S3
8. ✅ Invalidar cache do CloudFront

---

## 🚀 Como Fazer Deploy

### **Deploy Automático (DEV):**

```bash
git checkout dev
git add .
git commit -m "feat: nova funcionalidade"
git push origin dev
```

→ Deploy automático sem aprovação

### **Deploy com Aprovação (PROD):**

```bash
git checkout main
git merge dev
git push origin main
```

→ Workflow inicia e **aguarda aprovação**

**Aprovar no GitHub:**

1. Acesse: **Actions → Deploy to AWS**
2. Clique no workflow em execução
3. Clique em **Review deployments**
4. Selecione **production**
5. Clique em **Approve and deploy**

---

## 📊 Variáveis de Ambiente

### **O Que NÃO Precisa no GitHub Actions:**

❌ `DB_HOST` - Está no SSM  
❌ `DB_PASSWORD` - Está no SSM  
❌ `JWT_SECRET` - Está no SSM  
❌ `CNPJA_ACCESS_KEY` - Está no SSM  
❌ `INTEGRAICP_CHANNEL_KEY` - Está no SSM

**Por quê?**

- O Copilot lê automaticamente do SSM Parameter Store
- As variáveis são injetadas no container ECS no runtime
- Mais seguro: credenciais não passam pelo GitHub

### **O Que É Necessário:**

✅ `AWS_ACCESS_KEY_ID` - GitHub Secret (para deploy)  
✅ `AWS_SECRET_ACCESS_KEY` - GitHub Secret (para deploy)  
✅ `VITE_API_URL` - Hardcoded no workflow (não é secret)

---

## 🔍 Monitoramento

### **Ver Logs do Deploy:**

```bash
# GitHub Actions
https://github.com/seu-usuario/seu-repo/actions

# Logs da API (AWS)
copilot svc logs --name api --env prod --follow

# Logs do Frontend (CloudFront)
# Acesse o console AWS CloudFront
```

### **Verificar Status:**

```bash
# Status do serviço API
copilot svc status --name api --env prod

# Verificar se frontend está no S3
aws s3 ls s3://adj-erp-frontend/
```

---

## ⚠️ Troubleshooting

### **Erro: "Environment protection rules not met"**

**Causa**: Ninguém aprovou o deploy em produção  
**Solução**: Acesse Actions e aprove o deployment

### **Erro: "AWS credentials not configured"**

**Causa**: Secrets do GitHub não configurados  
**Solução**: Configure `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`

### **Erro: "Copilot command not found"**

**Causa**: Falha ao instalar Copilot CLI  
**Solução**: Verificar conectividade com GitHub releases

### **Erro: "Failed to push image to ECR"**

**Causa**: Permissões insuficientes ou ECR não existe  
**Solução**: Verificar permissões do usuário `adjdeploy`

### **Deploy bem-sucedido mas aplicação não funciona**

**Causa**: Secrets do SSM não configurados corretamente  
**Solução**: Verificar parâmetros no SSM Parameter Store

---

## 🎯 Melhorias Futuras (Opcional)

### **1. Adicionar Testes Antes do Deploy**

```yaml
- name: Run Tests
  run: npm test
  working-directory: server
```

### **2. Rollback Automático em Caso de Falha**

```yaml
- name: Rollback on Failure
  if: failure()
  run: copilot svc rollback --name api --env prod
```

### **3. Notificações (Slack/Discord)**

```yaml
- name: Notify Success
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "✅ Deploy concluído com sucesso!"
      }
```

### **4. Deploy Canary (Gradual)**

```yaml
# No manifest.yml do Copilot
deployment:
  rolling: canary
  canary:
    percentage: 25
    interval: 5m
```

---

## 📝 Checklist de Deploy

### **Antes do Deploy:**

- [ ] Código testado localmente
- [ ] Migrations criadas (se necessário)
- [ ] Variáveis de ambiente atualizadas no SSM
- [ ] Branch atualizada com `main` (se for merge)

### **Durante o Deploy:**

- [ ] Workflow iniciou corretamente
- [ ] Build passou sem erros
- [ ] Aprovação concedida (se prod)
- [ ] Deploy concluído com sucesso

### **Após o Deploy:**

- [ ] API respondendo corretamente
- [ ] Frontend carregando
- [ ] Health check OK (`/health`)
- [ ] Logs sem erros críticos
- [ ] Executar migrations (se necessário)
- [ ] Executar seeders (se necessário)

---

## 🔗 Links Úteis

- **GitHub Actions**: https://github.com/seu-usuario/seu-repo/actions
- **AWS Console**: https://console.aws.amazon.com
- **API DEV**: https://api-erp-dev.adjsistemas.com.br/health
- **API PROD**: https://api-erp.adjsistemas.com.br/health
- **Copilot Docs**: https://aws.github.io/copilot-cli/

---

## 📚 Comandos Úteis

```bash
# Ver workflows disponíveis
gh workflow list

# Executar workflow manualmente
gh workflow run deploy.yml

# Ver status do último workflow
gh run list --workflow=deploy.yml

# Ver logs de um workflow
gh run view <run-id> --log

# Cancelar um workflow em execução
gh run cancel <run-id>
```

---

## 🔄 Histórico de Mudanças

### 09/01/2026

- ✅ Adicionada aprovação manual para ambiente de produção
- ✅ Configurado environment protection rules
- ✅ Documentação criada

### 02/01/2026

- ✅ Workflow inicial criado
- ✅ Deploy automático para dev e prod
- ✅ Integração com Copilot CLI
