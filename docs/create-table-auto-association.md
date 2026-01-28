## # Criar Tabela de Auto-Associação

## 1. Tabela produto_classificacao

# SQL
CREATE TABLE produto_classificacao (
    classificacao_id SERIAL PRIMARY KEY,
    superior_id INTEGER REFERENCES produto_classificacao(classificacao_id),
    pessoa_id INTEGER REFERENCES pessoa(pessoa_id),
    conta_id INTEGER,
    descricao VARCHAR(40) NOT NULL,
    st_ativo BOOLEAN NOT NULL DEFAULT true,
    st_excluido BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

## 2.  Tabela produto_familia
# SQL
CREATE TABLE produto_familia (
    familia_id SERIAL PRIMARY KEY,
    superior_id INTEGER REFERENCES produto_familia(familia_id),
    pessoa_id INTEGER REFERENCES pessoa(pessoa_id),
    estoque_negativo BOOLEAN NOT NULL DEFAULT false,
    descricao VARCHAR(40) NOT NULL,
    st_ativo BOOLEAN NOT NULL DEFAULT true,
    st_excluido BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);