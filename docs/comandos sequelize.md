# Migrations

1. Para rodar as migrations:

1. 1. Para rodar as migrations:

## Guia de Comandos do Sequelize (Backend)

Este guia padroniza como executar migrations e seeders no backend.

- **Diretório**: execute os comandos dentro de `server/`.
- **Script**: use sempre `npm run sequelize -- <comando>` para passar argumentos ao CLI.
- **Configuração**: o arquivo `server/sequelize-config.js` carrega `.env`, `.env-local` (dev) ou `.env-remote` (prod) baseado em `NODE_ENV`.

### Estrutura de pastas

- **Migrations**: `server/src/database/migrations/`
- **Seeders**: `server/src/database/seeders/`

Observação: dentro de cada pasta acima, os arquivos podem estar organizados em subpastas por módulo (ex.: `clinica/`, `pessoa/`, `produto/`, `cfg/`, `security/`, `contabil/`, `academica/`, `common/`). Os runners com Umzug (abaixo) fazem a varredura recursiva automaticamente.

---

## Nova forma recomendada (Umzug - recursivo por módulos)

Os scripts abaixo usam Umzug para executar migrations e seeders recursivamente em todas as subpastas por módulo. Eles respeitam a ordem pelo timestamp no nome do arquivo.

- **Rodar todas as migrations pendentes**

  ```bash
  npm run migrate:up
  ```

- **Listar migrations pendentes (dry-run)**

  ```bash
  npm run migrate:pending
  ```

- **Desfazer a última migration**

  ```bash
  npm run migrate:down
  ```

- **Desfazer todas as migrations**

  ```bash
  npm run migrate:down:all
  ```

- **Listar migrations já executadas**

  ```bash
  npm run migrate:executed
  ```

- **Visualizar ordem de reversão das migrations (sem executar)**

  ```bash
  npm run migrate:down:preview
  ```

  Útil para validar a ordem antes de executar `migrate:down:all`

- **Desfazer uma migration específica pelo nome**

  ```bash
  npm run migrate:down:name <nome_da_migration>
  ```

  Exemplo:

  ```bash
  npm run migrate:down:name 20241120220208-secUsuario.ts
  ```

- **Rodar todos os seeders pendentes**

  ```bash
  npm run seed:up
  ```

  Para executar apenas seeders de produção (ignora `.dev.`):

  ```bash
  NODE_ENV=production npm run seed:up
  ```

- **Listar seeders pendentes (dry-run)**

  ```bash
  npm run seed:pending
  ```

- **Desfazer o último seeder** (se o arquivo possuir `down`)

  ```bash
  npm run seed:down
  ```

- **Desfazer todos os seeders** (depende dos arquivos possuírem `down`)

  ```bash
  npm run seed:down:all
  ```

- **Listar seeders já executados**

  ```bash
  npm run seed:executed
  ```

  Para listar apenas seeders de produção:

  ```bash
  NODE_ENV=production npm run seed:executed
  ```

---

## Gerenciamento de Banco de Dados

- **Criar um novo banco de dados**

  ```bash
  npm run db:create <nome_do_banco>
  ```

  Exemplo:

  ```bash
  npm run db:create producao
  npm run db:create teste_dev
  ```

  Validações:

  - Nome aceita apenas letras, números e underscore
  - Verifica se o banco já existe antes de criar
  - Fornece instruções dos próximos passos após criação

- **Resetar banco de dados (DROP + CREATE schema + migrations)**
  ```bash
  npm run db:reset
  ```
  **ATENÇÃO**: Este comando apaga TODOS os dados do banco!
  - Dropa o schema `public` com CASCADE
  - Recria o schema `public`
  - Executa todas as migrations automaticamente
  - Útil para testes e desenvolvimento

---

## Fluxo Completo: Criar Banco Limpo e Popular

Para desenvolvedores e testadores que precisam criar um ambiente limpo:

```bash
# 1. Criar novo banco de dados
npm run db:create meu_banco_teste

# 2. Atualizar .env com o novo banco
# Edite o arquivo .env e altere:
# DB_NAME=meu_banco_teste

# 3. Executar todas as migrations
npm run migrate:up

# 4. Executar seeders de produção
NODE_ENV=production npm run seed:up

# 5. (Opcional) Verificar o que foi executado
npm run migrate:executed
NODE_ENV=production npm run seed:executed
```

Para resetar e recriar tudo:

```bash
# 1. Resetar banco (apaga tudo e roda migrations)
npm run db:reset

# 2. Executar seeders
NODE_ENV=production npm run seed:up
```

Para destruir completamente:

```bash
# 1. Reverter todos os seeders
NODE_ENV=production npm run seed:down:all

# 2. Reverter todas as migrations
npm run migrate:down:all

# 3. (Opcional) Dropar o banco via SQL
# Conecte ao PostgreSQL e execute:
# DROP DATABASE meu_banco_teste;
```

Notas:

- Execute sempre dentro de `server/`.
- A ordem entre módulos é garantida pelos timestamps; se houver dependências entre módulos, assegure que os timestamps reflitam a sequência correta.
- Use `NODE_ENV=production` para filtrar seeders de desenvolvimento (`.dev.`)
- O comando `db:reset` é mais rápido que `migrate:down:all` + `migrate:up` para ambientes de teste

---

## Comandos básicos

- **Rodar todas as migrations pendentes**

  ```bash
  npm run sequelize -- db:migrate \
    --config sequelize-config.js \
    --migrations-path src/database/migrations
  ```

- **Desfazer a última migration**

  ```bash
  npm run sequelize -- db:migrate:undo \
    --config sequelize-config.js \
    --migrations-path src/database/migrations
  ```

- **Desfazer todas as migrations**

  ```bash
  npm run sequelize -- db:migrate:undo:all \
    --config sequelize-config.js \
    --migrations-path src/database/migrations
  ```

- **Rodar todos os seeders**

  ```bash
  npm run sequelize -- db:seed:all \
    --config sequelize-config.js \
    --seeders-path src/database/seeders
  ```

- **Desfazer o último seeder**

  ```bash
  npm run sequelize -- db:seed:undo \
    --config sequelize-config.js \
    --seeders-path src/database/seeders
  ```

- **Desfazer todos os seeders**

  ```bash
  npm run sequelize -- db:seed:undo:all \
    --config sequelize-config.js \
    --seeders-path src/database/seeders
  ```

- **Ver status das migrations**
  ```bash
  npm run sequelize -- db:migrate:status \
    --config sequelize-config.js \
    --migrations-path src/database/migrations
  ```

---

## Rodar APENAS um arquivo de migration

Existem duas formas:

- **Executar somente a migration especificada (recomendado)** usando `db:migrate:up --name`:

  ```bash
  # Exemplo real (ajuste o nome conforme necessário)
  npm run sequelize -- db:migrate:up \
    --name 20250415124501-create-pessoa-telefone.ts \
    --config sequelize-config.js \
    --migrations-path src/database/migrations
  ```

- **Executar até uma migration específica** (rodará todas as pendentes até incluí-la) usando `--to`:
  ```bash
  npm run sequelize -- db:migrate \
    --to 20250415124501-create-pessoa-telefone.ts \
    --config sequelize-config.js \
    --migrations-path src/database/migrations
  ```

## Desfazer APENAS uma migration específica

- **Undo individual por nome**:

  ```bash
  npm run sequelize -- db:migrate:undo \
    --name 20250415124501-create-pessoa-telefone.ts \
    --config sequelize-config.js \
    --migrations-path src/database/migrations
  ```

- **Desfazer até uma migration específica** (reverte múltiplas) com `db:migrate:down --to`:
  ```bash
  npm run sequelize -- db:migrate:down \
    --to 20250415124500-create-pessoa-endereco.ts \
    --config sequelize-config.js \
    --migrations-path src/database/migrations
  ```

---

## Rodar APENAS um seeder

- **Executar um seeder específico** com `db:seed --seed`:

  ```bash
  # Exemplo real
  js \
    --seed 20250402130332-cfgPermissao-Admin.ts \
    --config sequelize-config.js \
    --seeders-path src/database/seeders
  ```

- **Desfazer um seeder específico**:
  ```bash
  npm run sequelize -- db:seed:undo \
    --seed 20250402130332-cfgPermissao-Admin.ts \
    --config sequelize-config.js \
    --seeders-path src/database/seeders
  ```

---

## Exemplos rápidos (copiar e colar)

- **Próxima migration pendente** (somente uma):

  ```bash
  npm run sequelize -- db:migrate:up \
    --config sequelize-config.js \
    --migrations-path src/database/migrations
  ```

- **Undo da última migration**:

  ```bash
  npm run sequelize -- db:migrate:undo \
    --config sequelize-config.js \
    --migrations-path src/database/migrations
  ```

- **Rodar um seeder específico**:
  ```bash
  npm run sequelize -- db:seed \
    --seed 20241117222730-cfgRecurso-Default.ts \
    --config sequelize-config.js \
    --seeders-path src/database/seeders
  ```
  - **Rodar um seeder específico em formato .js**:
  ```bash segunda opção - gerar um arquivo .js
  npx sequelize-cli -- db:seed \
    --seed 202509021410-produto-embalagem.js
  ```

---

## Dicas

- **Windows/PowerShell**: para escolher o ambiente antes do comando:
  ```powershell
  $env:NODE_ENV = "development"   # ou "production"
  npm run sequelize -- db:migrate --config sequelize-config.js --migrations-path src/database/migrations
  ```
- Se aparecer erro de caminho, confirme se está dentro de `server/` e se os paths relativos começam com `src/database/...`.
- Use nomes de arquivos exatamente como estão em `server/src/database/migrations/` e `server/src/database/seeders/`.

---

## Quando usar CLI x Umzug

- **Umzug (recomendado para executar)**

  - `npm run migrate:*` e `npm run seed:*` fazem varredura recursiva por módulo.
  - Use para rodar/inspecionar todo o conjunto de migrations/seeders.

- **Sequelize-CLI (recomendado para gerar e executar pontualmente)**
  - Gerar migration por módulo:
    ```bash
    npm run sequelize -- migration:generate --name <nome> --migrations-path src/database/migrations/<modulo>
    ```
  - Gerar seeder por módulo:
    ```bash
    npm run sequelize -- seed:generate -- name <nome> --seeders-path src/database/seeders/<modulo>
    ```
  - Rodar/undo de um arquivo específico continuam possíveis via CLI (ver seções acima).
