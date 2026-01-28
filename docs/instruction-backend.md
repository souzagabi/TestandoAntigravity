# Padrões de Desenvolvimento Backend - Projeto ADJ-WWW

Este documento descreve os padrões de desenvolvimento utilizados no backend do projeto ADJ-WWW. Use estas orientações como referência ao solicitar a geração de código ou ao implementar novas funcionalidades.

## Estrutura de Diretórios

```
src/server/
├── src/
│   ├── config/             # Configurações do projeto
│   ├── controller/         # Controllers da aplicação
│   │   ├── cfg/            # Controllers do módulo de configurações
│   │   ├── clinica/        # Controllers do módulo de clínica
│   │   ├── pessoa/         # Controllers do módulo de pessoa
│   │   └── security/       # Controllers do módulo de segurança
│   ├── database/
│   │   ├── config/         # Configurações do banco de dados
│   │   ├── migrations/     # Migrations do banco de dados
│   │   ├── models/         # Modelos do Sequelize
│   │   │   ├── cfg/        # Modelos do módulo de configurações
│   │   │   ├── clinica/    # Modelos do módulo de clínica
│   │   │   ├── pessoa/     # Modelos do módulo de pessoa
│   │   │   └── security/   # Modelos do módulo de segurança
│   │   └── seeders/        # Seeders para popular o banco
│   ├── middleware/         # Middlewares da aplicação
│   ├── routes/             # Rotas da aplicação
│   │   ├── cfg/            # Rotas do módulo de configurações
│   │   ├── clinica/        # Rotas do módulo de clínica
│   │   ├── pessoa/         # Rotas do módulo de pessoa
│   │   └── security/       # Rotas do módulo de segurança
│   ├── services/           # Serviços da aplicação
│   └── utils/              # Utilitários
```

## Padrões de Nomenclatura

- **Arquivos**: Utilizar camelCase para nomes de arquivos
- **Classes**: Utilizar PascalCase para nomes de classes
- **Variáveis e funções**: Utilizar camelCase
- **Constantes**: Utilizar UPPER_SNAKE_CASE
- **Interfaces**: Utilizar PascalCase com prefixo "I" (opcional)
- **Tabelas no banco**: Utilizar snake_case
- **Colunas no banco**: Utilizar snake_case

## Padrão de Modelos (Models)

Os modelos seguem o padrão do Sequelize com TypeScript:

1. **Definição de interfaces**:
   - Interface para os atributos da entidade
   - Interface para os atributos opcionais durante a criação

2. **Classe do modelo**:
   - Estende `Model<Attributes, CreationAttributes>`
   - Implementa a interface de atributos

3. **Inicialização do modelo**:
   - Método `init` com definição de campos e opções
   - Mapeamento entre nomes de campos no código (camelCase) e no banco (snake_case)
   
4. **Documentação com comentários**:
   - Use a propriedade `comment` nas definições de campos para documentar seu propósito
   - Estes comentários são armazenados no banco de dados PostgreSQL
   - Também use JSDoc acima das propriedades da classe para documentação no código

4. **Exemplo**:

```typescript
// Definição das propriedades da entidade
interface ModelAttributes {
  id: number;
  nome: string;
  stAtivo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Definição das propriedades opcionais (para criação/atualização)
interface ModelCreationAttributes extends Optional<ModelAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Classe do modelo
class Model extends Model<ModelAttributes, ModelCreationAttributes> implements ModelAttributes {
  public id!: number;
  public nome!: string;
  public stAtivo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicialização do modelo
Model.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id',
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nome',
    },
    stAtivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'st_ativo',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'tabela_nome',
    modelName: 'ModelName',
    timestamps: true,
  }
);

export { Model, ModelAttributes, ModelCreationAttributes };
```

## Associações entre Modelos

As associações entre modelos devem ser centralizadas em um arquivo `xxxAssociations.ts` dentro de cada pasta de módulo:

```typescript
// Exemplo: cfgAssociations.ts
import { ModelA } from './modelA';
import { ModelB } from './modelB';

export function setupAssociations() {
  // Associações de ModelA
  ModelA.hasMany(ModelB, {
    foreignKey: 'modelAId',
    as: 'modelBs'
  });

  // Associações de ModelB
  ModelB.belongsTo(ModelA, {
    foreignKey: 'modelAId',
    as: 'modelA'
  });
}
```

## Padrão de Migrations

As migrations seguem o padrão do Sequelize com TypeScript:

1. **Nomenclatura**: Data de criação + nome da tabela (ex: `20250613000001-create-tabela.ts`)
2. **Estrutura**:
   - Método `up`: Cria ou modifica tabelas
   - Método `down`: Reverte as alterações

3. **Exemplo**:

```typescript
import { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable('nome_tabela', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nome_campo: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      st_ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
    
    // Adicionar índices se necessário
    await queryInterface.addIndex('nome_tabela', ['campo1', 'campo2'], {
      unique: true,
      name: 'idx_nome_tabela_unique'
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable('nome_tabela');
  }
};
```

## Padrão de Seeders

Os seeders são usados para popular o banco de dados com dados iniciais:

1. **Nomenclatura**:
   - Formato: `YYYYMMDD-XX-nome-tabela-Default.ts`
   - Onde XX é um número sequencial para ordenação no mesmo dia

2. **Estrutura**:
   - Método `up`: Insere dados iniciais
   - Método `down`: Remove os dados inseridos e reseta a sequência de IDs

3. **Padrões importantes**:
   - Sempre resetar a sequência de IDs no método `down` usando:
     ```typescript
     await queryInterface.sequelize.query(
       `ALTER SEQUENCE nome_tabela_id_seq RESTART WITH 1;`
     );
     ```
   - Para tabelas com empresa_id, vincular à empresa padrão (geralmente ID 1)
   - Usar `QueryTypes` importado diretamente do Sequelize para consultas SQL

4. **Exemplo**:

```typescript
import { QueryInterface, QueryTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    // Inserir dados
    return queryInterface.bulkInsert('nome_tabela', [
      {
        campo1: 'valor1',
        campo2: 'valor2',
        st_ativo: true,
        st_excluido: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    // Remover dados
    await queryInterface.bulkDelete('nome_tabela', {}, {});
    
    // Resetar a sequência para 1
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE nome_tabela_id_seq RESTART WITH 1;`
    );
  }
};
```

## Padrão de Controllers

Os controllers seguem um padrão CRUD com métodos para operações básicas:

1. **Estrutura**:
   - Classe com nome `NomeEntidadeController`
   - Propriedade privada `model` referenciando o modelo Sequelize
   - Métodos para operações CRUD (findAll, findById, create, update, delete)
   - Tratamento de erros com try/catch e next(error)
   - Interface `AuthenticatedRequest` para acesso ao `empresaId` do token de autenticação
   - Uso do `empresaId` para filtrar dados por empresa (multi-tenant)

2. **Interface AuthenticatedRequest**:
   - Estende a interface `Request` do Express
   - Adiciona a propriedade `empresaId` que é injetada pelo middleware de autenticação
   - Deve ser usada em todos os controllers que precisam do contexto da empresa

```typescript
// Interface para incluir o empresaId do authGuard
interface AuthenticatedRequest extends Request {
    empresaId?: number;
}
```

3. **Exemplo**:

```typescript
import { NextFunction, Request, Response } from "express";
import { ModelStatic, Op } from "sequelize";
import { Model } from "../database/models/model";

// Interface para incluir o empresaId do authGuard
interface AuthenticatedRequest extends Request {
    empresaId?: number;
class ModelController {
    private model: ModelStatic<Model> = Model;

    async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { search } = req.query;
            const { empresaId } = req;
            
            let where: any = { empresaId };
            if (search) {
                where = {
                    ...where,
                    nome: {
                        [Op.iLike]: `%${search}%`
                    }
                };
            }
            
            const result = await this.model.findAll({ where });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async findById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { empresaId } = req;
            
            const result = await this.model.findOne({
                where: {
                    id,
                    empresaId
                }
            });
            
            if (!result) {
                res.status(404).json({ message: "Registro não encontrado" });
                return;
            }
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const { empresaId } = req;
            
            const result = await this.model.create({
                ...data,
                empresaId: Number(empresaId)
            });
            
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { empresaId } = req;
            
            const record = await this.model.findOne({
                where: {
                    id,
                    empresaId
                }
            });
            
            if (!record) {
                res.status(404).json({ message: "Registro não encontrado" });
                return;
            }
            
            const data = req.body;
            await record.update(data);
            res.json(record);
        } catch (error) {
            next(error);
        }
    }

export default ModelController;
```

## Padrão de Rotas

As rotas são organizadas por módulos e seguem o padrão do Express:

```typescript
import { Router } from 'express';
import ModelController from '../controller/modelController';

const router = Router();
const controller = new ModelController();

router.get('/', controller.findAll.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
```

## Convenções de Nomenclatura para Tabelas e Colunas

- **Tabelas**: Prefixo do módulo + nome da entidade (ex: `cfg_empresa`, `pessoa_endereco`)
- **Colunas de ID**: nome da entidade + `_id` (ex: `empresa_id`, `pessoa_id`)
- **Colunas de Status**: Prefixo `st_` (ex: `st_ativo`, `st_excluido`)
- **Colunas de Data**: `created_at`, `updated_at`

## Dicas para Geração de Código

Ao solicitar a geração de código para o backend, forneça as seguintes informações:

1. **Módulo**: Em qual módulo a nova funcionalidade será implementada
2. **Entidade**: Nome e atributos da entidade
3. **Relacionamentos**: Como a entidade se relaciona com outras entidades existentes
4. **Operações**: Quais operações específicas além do CRUD básico são necessárias

## Exemplo de Prompt para Geração de Código

```
Preciso gerar um novo modelo no módulo [nome do módulo].
Este modelo será para a entidade [nome da entidade] com os seguintes atributos:
- atributo1: tipo (descrição)
- atributo2: tipo (descrição)
...

Este modelo tem os seguintes relacionamentos:
- Relacionamento com [entidade1]: [tipo de relacionamento]
- Relacionamento com [entidade2]: [tipo de relacionamento]
...

Além do CRUD básico, preciso das seguintes operações específicas:
- [operação específica 1]
- [operação específica 2]
...

Por favor, gere o modelo, a migration e o controller seguindo os padrões do projeto.
```

## Padrão de Formatação de Tabelas no Frontend

Para garantir consistência visual e melhor experiência do usuário nas tabelas da aplicação, siga estas diretrizes:

### Espaçamento e Alinhamento

1. **Cabeçalho da Tabela**:
   - Use padding vertical maior para o cabeçalho: `padding: '0.9rem 0.5rem'`
   - Destaque os títulos das colunas com a classe `fw-bold`
   - Exemplo:
   ```tsx
   <th style={{ userSelect: 'none', width: '15%', padding: '0.9rem 0.5rem' }}>
     <span className="fw-bold">Título da Coluna</span>
   </th>
   ```

2. **Células da Tabela**:
   - Use padding reduzido para as células de dados: `padding: '0.3rem'`
   - Mantenha alinhamento vertical centralizado: `verticalAlign: 'middle'`
   - Exemplo:
   ```tsx
   <td style={{ verticalAlign: 'middle', padding: '0.3rem' }}>{valor}</td>
   ```

3. **Texto da Quantidade de Registros**:
   - Posicione o texto de contagem de registros na parte inferior da div
   - Use classes flexbox para alinhamento: `d-flex align-items-end`
   - Exemplo:
   ```tsx
   <div className="col-md-3 d-flex align-items-end">
     <span className="text-muted me-2">
       Mostrando {itens.length} de {total} registros
     </span>
   </div>
   ```

4. **Tratamento de Texto nas Células**:
   - Para códigos ou identificadores: `whiteSpace: 'nowrap'`
   - Para descrições ou textos longos: `whiteSpace: 'normal', wordBreak: 'break-word'`

5. **Estilo da Tabela**:
   - Use a classe `table-sm` para tabelas mais compactas
   - Defina `tableLayout: 'fixed'` para melhor controle da largura das colunas
   - Use `table-hover` para destacar a linha sob o cursor

### Formatação de Dados

1. **Datas**:
   - Exiba datas no formato brasileiro (dd/mm/yyyy)
   - Implemente uma função formatadora consistente:
   ```tsx
   const formatarData = (data: string | Date | null | undefined): string => {
     if (!data) return '';
     try {
       const dataObj = data instanceof Date ? data : new Date(data);
       const dia = dataObj.getDate().toString().padStart(2, '0');
       const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
       const ano = dataObj.getFullYear();
       return `${dia}/${mes}/${ano}`;
     } catch (error) {
       console.error('Erro ao formatar data:', error);
       return String(data);
     }
   };
   ```

2. **Valores Monetários**:
   - Use o componente `CurrencyField` para edição
   - Para exibição, formate com `Intl.NumberFormat`

3. **Campos Booleanos**:
   - Use ícones ou badges para representação visual
   - Mantenha consistência em toda a aplicação

## Padrão de Componentes Master-Detail

Para interfaces que apresentam relações master-detail (pai-filho), siga estas diretrizes:

### Estrutura de Componentes

1. **Separação de Responsabilidades**:
   - Crie componentes separados para cada nível de detalhe (master e detail)
   - Toda a lógica específica do detalhe deve estar contida em seu próprio componente
   - Evite compartilhar estados entre componentes master e detail

2. **Nomenclatura de Componentes**:
   - Componente master: `[Entidade]Manager.tsx` (ex: `PlanoConvenioManager.tsx`)
   - Componente detail: `[EntidadeDetalhe]Manager.tsx` (ex: `ProcedimentoPlanoManager.tsx`, `PortePlanoManager.tsx`)

3. **Comunicação entre Componentes**:
   - O componente master deve passar apenas os dados essenciais para o componente detail (geralmente IDs ou objetos completos)
   - Evite callbacks de notificação do detail para o master quando possível
   - Cada componente detail deve gerenciar seu próprio estado e operações CRUD

### Boas Práticas

1. **Gerenciamento de Estado**:
   - Mantenha o estado local no componente que o utiliza
   - Use estados temporários para edições antes de confirmar (ex: `valoresEditados`)
   - Implemente confirmação explícita para operações de atualização

2. **Chamadas à API**:
   - Cada componente detail deve ter seus próprios serviços e chamadas à API
   - Evite chamadas à API em cascata ou dependentes entre master e detail
   - Implemente tratamento de erros específico para cada componente

3. **Experiência do Usuário**:
   - Forneça feedback visual para operações em andamento
   - Implemente validações locais antes de enviar dados ao servidor
   - Use componentes de confirmação para operações destrutivas

4. **Otimizações**:
   - Implemente carregamento sob demanda (lazy loading) para listas grandes
   - Considere paginação para conjuntos de dados extensos
   - Minimize re-renderizações desnecessárias com memoização

### Exemplo de Implementação

```typescript
// Componente Master (PlanoConvenioManager.tsx)
const PlanoConvenioManager: React.FC = () => {
  const [plano, setPlano] = useState<IPlanoConvenio | null>(null);
  
  // Lógica específica do plano...
  
  return (
    <div>
      {/* Detalhes do plano */}
      
      {/* Componente Detail para procedimentos */}
      {plano && <ProcedimentoPlanoManager planoId={plano.planoId} />}
      
      {/* Componente Detail para portes */}
      {plano && <PortePlanoManager plano={plano} />}
    </div>
  );
};

// Componente Detail (ProcedimentoPlanoManager.tsx)
const ProcedimentoPlanoManager: React.FC<{ planoId: number }> = ({ planoId }) => {
  const [procedimentos, setProcedimentos] = useState<IProcedimentoConvenioPlano[]>([]);
  const [valoresEditados, setValoresEditados] = useState<Record<string, number>>({});
  
  // Lógica específica dos procedimentos...
  
  return (
    <div>
      {/* Interface para gerenciar procedimentos */}
    </div>
  );
};
```
