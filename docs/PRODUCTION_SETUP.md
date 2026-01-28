# Configuração do Ambiente de Produção - Resumo

## ✅ O que foi feito

### 1. Infraestrutura AWS (Copilot)
- ✅ Criado ambiente `prod` com `copilot env init`
- ✅ Configurado VPC, subnets, load balancer e ECS cluster
- ✅ Adicionado certificado SSL wildcard (*.adjsistemas.com.br)
- ✅ Configurado para 2 instâncias (alta disponibilidade)
- ✅ Recursos aumentados: CPU 512, Memory 1024 MB

### 2. Configuração de Manifests
- ✅ Atualizado `copilot/api/manifest.yml` com seção `environments`
  - Configurações específicas para `dev` e `prod`
  - Alias correto: `api-erp.adjsistemas.com.br` (prod)
  - Secrets separados por ambiente
- ✅ Criado `copilot/environments/prod/manifest.yml`
  - Certificado SSL configurado

### 3. GitHub Actions Workflow
- ✅ Atualizado `.github/workflows/deploy.yml`
  - Suporte para branches `dev` e `main`
  - Deploy automático da API detecta ambiente pela branch
  - Deploy automático do Frontend detecta ambiente pela branch
  - Configurações dinâmicas:
    - **Dev**: S3 `adj-dev-frontend`, CloudFront `ESIEM8QIAHJB`, API `api-erp-dev`
    - **Prod**: S3 `adj-erp-frontend`, CloudFront `EDQKV3ASQBY4C`, API `api-erp`

## 🔧 Próximos Passos Necessários

### 1. Configurar Secrets na AWS (CRÍTICO)
Você precisa criar os seguintes secrets no AWS Systems Manager Parameter Store para produção:

```bash
# Conectar à AWS via AWS CLI ou Console
# Ir para: Systems Manager > Parameter Store

# Criar os seguintes parâmetros (SecureString):
/copilot/adj-erp/prod/secrets/DB_PASSWORD
/copilot/adj-erp/prod/secrets/AWS_SECRET_ACCESS_KEY
/copilot/adj-erp/prod/secrets/CNPJA_ACCESS_KEY
/copilot/adj-erp/prod/secrets/INTEGRAICP_CHANNEL_KEY
```

**Valores sugeridos:**
- `DB_PASSWORD`: Senha do banco RDS de produção (você precisará criar o RDS)
- `AWS_SECRET_ACCESS_KEY`: Mesma que está usando em dev (ou criar nova para prod)
- `CNPJA_ACCESS_KEY`: Mesma que está usando em dev
- `INTEGRAICP_CHANNEL_KEY`: Chave de produção do IntegralCP

### 2. Criar Banco de Dados RDS para Produção
Você tem duas opções:

**Opção A: Usar Copilot para criar RDS automaticamente**
```bash
.\copilot.exe storage init
# Escolher: Aurora Serverless v2 PostgreSQL
# Ambiente: prod
```

**Opção B: Criar RDS manualmente no Console AWS**
- PostgreSQL 14+
- Configurar em VPC do ambiente prod
- Anotar: host, porta, usuário, senha, database name
- Atualizar variáveis no `manifest.yml`

### 3. Atualizar Variáveis de Ambiente para Produção
Editar `copilot/api/manifest.yml` na seção `environments.prod.variables`:

```yaml
prod:
  variables:
    DB_HOST: <seu-rds-endpoint>.rds.amazonaws.com
    DB_PORT: "5432"
    DB_USERNAME: postgres
    DB_NAME: adj_erp_prod
    INTEGRAICP_CALLBACK_URL: https://api-erp.adjsistemas.com.br/api/assinaturas/callback
    # Outras variáveis específicas de produção
```

### 4. Deploy da API em Produção
Após configurar secrets e banco de dados:

```bash
# Via terminal local:
.\copilot.exe svc deploy --name api --env prod

# OU via GitHub Actions:
# Fazer merge da branch dev para main
# O GitHub Actions vai fazer o deploy automaticamente
```

### 5. Configurar DNS
Adicionar registro DNS apontando para o Load Balancer:
- `api-erp.adjsistemas.com.br` → CNAME para o ALB do Copilot
  - Você pode ver o endpoint com: `.\copilot.exe svc show --name api --env prod`

### 6. Testar Produção
- Verificar health check: `https://api-erp.adjsistemas.com.br/health`
- Testar endpoints da API
- Verificar logs: `.\copilot.exe svc logs --name api --env prod`

## 📋 Checklist Final

- [ ] Secrets criados no AWS Parameter Store
- [ ] Banco de dados RDS criado e configurado
- [ ] Variáveis de ambiente atualizadas no manifest
- [ ] Deploy da API realizado com sucesso
- [ ] DNS configurado
- [ ] Health check respondendo
- [ ] Frontend apontando para API de produção
- [ ] Testes de integração passando

## 🚀 Fluxo de Deploy Automático

Agora que está tudo configurado:

1. **Desenvolvimento**: Trabalhe na branch `dev`
   - Push para `dev` → Deploy automático para ambiente DEV
   
2. **Produção**: Quando estiver pronto
   - Criar Pull Request de `dev` para `main`
   - Aprovar e fazer merge
   - Push para `main` → Deploy automático para ambiente PROD

## 📞 Comandos Úteis

```bash
# Ver status dos ambientes
.\copilot.exe env ls

# Ver status dos serviços
.\copilot.exe svc ls

# Ver logs da API em produção
.\copilot.exe svc logs --name api --env prod --follow

# Ver informações do serviço
.\copilot.exe svc show --name api --env prod

# Executar comando no container (debug)
.\copilot.exe svc exec --name api --env prod
```

## ⚠️ Importante

- **Nunca commite secrets no código!** Use sempre AWS Parameter Store
- **Teste em dev antes de prod**: Sempre valide mudanças em dev primeiro
- **Monitore custos**: Produção com 2 instâncias + RDS vai custar mais que dev
- **Backups**: Configure backups automáticos do RDS de produção
