
### Tabela principal de movimento legado
CREATE TABLE PRJ020068 (
    MOV_ID                     INTEGER NOT NULL,
    TPMOV_ID                   INTEGER,
    SEQTPMOVIMENTO             INTEGER,
    NRODOCFISCAL               VARCHAR(10),
    DATA                       DATE,
    HORAEMISSAO                TIMESTAMP,
    DATASAIDA                  DATE,
    HORASAIDA                  TIMESTAMP,
    COMPETENCIA                VARCHAR(6),
    NTZOP_ID                   INTEGER,
    PESSOA_ID                  INTEGER,
    COLABORADOR_ID             INTEGER,
    TITULAR_ID                 INTEGER,
    DTPREVISAOENTREGA          DATE,
    DTENTREGA                  DATE,
    VLRPRODUTOS                NUMERIC(18,8),
    PRCDESCPRODUTO             NUMERIC(14,2),
    VLRDESCPRODUTO             NUMERIC(18,8),
    VLRLIQPRODUTO              NUMERIC(18,8),
    VLRSERVICO                 NUMERIC(18,8),
    PRCDESCSERVICO             NUMERIC(14,2),
    VLRDESCSERVICO             NUMERIC(18,8),
    VLRLIQSERVICO              NUMERIC(18,8),
    VLRTOTAL                   NUMERIC(18,8),
    PERCDESCONTO               NUMERIC(14,2),
    VLRDESCONTO                NUMERIC(18,8),
    VLRLIQUIDO                 NUMERIC(18,8),
    VLRFRETE                   NUMERIC(18,8),
    VLRSEGURO                  NUMERIC(18,8),
    VLROUTROS                  NUMERIC(18,8),
    VLRTOTALIPI                NUMERIC(18,8),
    VLRTOTALNOTA               NUMERIC(18,8),
    VLRBASEICMS                NUMERIC(18,8),
    VLRICMS                    NUMERIC(18,8),
    VLRBASEICMSSUBST           NUMERIC(18,8),
    VLRICMSSUBST               NUMERIC(18,8),
    PERCISS                    NUMERIC(14,2),
    VLRISS                     NUMERIC(18,8),
    FRETEPORCONTA              CHAR(1),
    PLACAVEICULO               VARCHAR(10),
    PLACAVEICULOUF             VARCHAR(2),
    TRANSPORTADOR_ID           INTEGER,
    TRPCNPJCPF                 VARCHAR(18),
    TRPENDERECO                VARCHAR(60),
    TRPMUNICIPIO               VARCHAR(30),
    TRPUF                      VARCHAR(2),
    TRPIERG                    VARCHAR(15),
    QUANTIDADE                 INTEGER,
    ESPECIE                    VARCHAR(10),
    MARCA                      VARCHAR(10),
    NUMERO                     VARCHAR(10),
    TITRAZAOSOCIAL             VARCHAR(60),
    TITCNPJCPF                 VARCHAR(18),
    TITIERG                    VARCHAR(15),
    TITENDERECO                VARCHAR(60),
    TITNUMERO                  VARCHAR(10),
    TITCOMPLEMENTO             VARCHAR(30),
    TITBAIRRO                  VARCHAR(30),
    TITCEP                     VARCHAR(8),
    TITMUNICIPIO               VARCHAR(30),
    TITLOCALIDADECDFISCAL      INTEGER,
    TITUF                      VARCHAR(2),
    TITUFCDFISCAL              INTEGER,
    TITPAIS                    VARCHAR(30),
    TITPAISCDFISCAL            INTEGER,
    TITTELEFONEFAX             VARCHAR(15),
    TITPESSOACONTATO           VARCHAR(100),
    TITCONSUMIDORFINAL         LOGICO /* LOGICO = CHAR(1) */,
    TITEMAIL                   EMAIL /* EMAIL = VARCHAR(50) */,
    ENTENDERECO                VARCHAR(60),
    ENTCOMPLEMENTO             VARCHAR(30),
    ENTBAIRRO                  VARCHAR(30),
    ENTCEP                     VARCHAR(8),
    ENTMUNICIPIO               VARCHAR(30),
    ENTUF                      VARCHAR(2),
    ENTTELEFONEFAX             VARCHAR(15),
    COBENDERECO                VARCHAR(60),
    COBCOMPLEMENTO             VARCHAR(30),
    COBBAIRRO                  VARCHAR(30),
    COBCEP                     VARCHAR(8),
    COBMUNICIPIO               VARCHAR(30),
    COBUF                      VARCHAR(2),
    COBTELEFONEFAX             VARCHAR(15),
    CONDPGTO_ID                INTEGER,
    FRMPGTO_ID                 INTEGER,
    DEPOSITO_ID                INTEGER NOT NULL,
    DEPOSITOTRF_ID             INTEGER,
    PESOBRUTO                  NUMERIC(18,8),
    PESOLIQUIDO                NUMERIC(18,8),
    MT3                        NUMERIC(18,8),
    OBSDOCUMENTO               BLOB SUB_TYPE BINARY SEGMENT SIZE 80,
    OBSOUTROS                  BLOB SUB_TYPE BINARY SEGMENT SIZE 80,
    STPROCESSO                 CHAR(1) NOT NULL,
    CENTROCUSTO_ID             INTEGER,
    PERCCOFINS                 NUMERIC(14,2),
    VLRCOFINS                  NUMERIC(18,8),
    PERCPIS                    NUMERIC(14,2),
    VLRPIS                     NUMERIC(18,8),
    PERCCSLL                   NUMERIC(14,2),
    VLRCSLL                    NUMERIC(18,8),
    PERCIRPJ                   NUMERIC(14,2),
    VLRIRPJ                    NUMERIC(18,8),
    NOMEARQUIVONFE             VARCHAR(255),
    ARQUIVONFE                 BLOB SUB_TYPE TEXT SEGMENT SIZE 50,
    NROCHAVENFE                VARCHAR(100),
    LOTENFE_ID                 INTEGER,
    NRODOCIMPORTACAO           VARCHAR(10),
    DATAREGISTRODOCIMPORTACAO  DATE,
    LOCALDESEMBARACO           VARCHAR(100),
    UFDESEMBARACO              VARCHAR(2),
    DATADESEMBARACO            DATE,
    VLRII                      NUMERIC(18,8),
    NAOSOMARFRETE              LOGICO /* LOGICO = CHAR(1) */,
    USUARIO_ID                 INTEGER,
    CCE                        LOGICO /* LOGICO = CHAR(1) */,
    VLRTOTALIMPOSTOS           NUMERIC(18,8),
    PRCDESCFINANCEIRO          NUMERIC(14,2),
    VLRDESCFINANCEIRO          NUMERIC(18,8),
    VLRTOTALNOTALIQUIDO        NUMERIC(18,8),
    ORIGEMVENDAEXTERNA         LOGICO /* LOGICO = CHAR(1) */,
    STVENDAEXTERNA             VARCHAR(1),
    OBSVENDAEXTERNA            BLOB SUB_TYPE TEXT SEGMENT SIZE 80,
    OBSANALISEFINANCEIRA       BLOB SUB_TYPE TEXT SEGMENT SIZE 80,
    POS_PEDIDOKEY              VARCHAR(40),
    POS_TIPOTRANSPORTE         VARCHAR(20),
    NROCOMANDA                 INTEGER,
    STMARGEMOK                 LOGICO /* LOGICO = CHAR(1) */,
    STBONIFICACAO              LOGICO DEFAULT 'N' /* LOGICO = CHAR(1) */,
    RFIDTAG                    INTEGER,
    SEPARADOR_ID               INTEGER,
    WMSTRACK                   VARCHAR(50),
    VLRTOTALICMSUFDESTINO      NUMERIC(18,8),
    VLRTOTALIPIDEVOLVIDO       NUMERIC(18,8),
    STDEVOLUCAO                LOGICO /* LOGICO = CHAR(1) */,
    STRESERVARESTOQUEOK        LOGICO /* LOGICO = CHAR(1) */,
    CONFERENTE_ID              INTEGER,
    REGIAO_ID                  INTEGER,
    UTILIZARSALDOCREDITO       LOGICO DEFAULT 'N' /* LOGICO = CHAR(1) */,
    VLRTOTALICMSDIFAL          NUMERIC(18,8)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020068 ADD CONSTRAINT PK_PRJ020068 PRIMARY KEY (MOV_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ002001_PRJ020068_SEP FOREIGN KEY (SEPARADOR_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020001_PRJ020068_COL FOREIGN KEY (COLABORADOR_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020001_PRJ020068_CONF FOREIGN KEY (CONFERENTE_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020001_PRJ020068_EMP FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020001_PRJ020068_TIT FOREIGN KEY (TITULAR_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020001_PRJ020068_TRP FOREIGN KEY (TRANSPORTADOR_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020001_PRJ020068_USR FOREIGN KEY (USUARIO_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020060_PRJ020068 FOREIGN KEY (NTZOP_ID, TPMOV_ID) REFERENCES PRJ020060 (NTZOP_ID, TPMOV_ID)
  USING INDEX FK_PRJ020064_PRJ020068;
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020065_PRJ020068 FOREIGN KEY (CONDPGTO_ID) REFERENCES PRJ020065 (CONDPGTO_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020066_PRJ020068 FOREIGN KEY (FRMPGTO_ID) REFERENCES PRJ020066 (FRMPGTO_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020082_PRJ020068 FOREIGN KEY (DEPOSITO_ID) REFERENCES PRJ020082 (DEPOSITO_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020082_PRJ020068_TRF FOREIGN KEY (DEPOSITOTRF_ID) REFERENCES PRJ020082 (DEPOSITO_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020191_PRJ020068 FOREIGN KEY (CENTROCUSTO_ID) REFERENCES PRJ020191 (CENTROCUSTO_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020221_PRJ020068 FOREIGN KEY (LOTENFE_ID) REFERENCES PRJ020221 (LOTENFE_ID);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020241_PRJ020068 FOREIGN KEY (STPROCESSO) REFERENCES PRJ020241 (STPROCESSO);
ALTER TABLE PRJ020068 ADD CONSTRAINT FK_PRJ020298_PRJ020068 FOREIGN KEY (REGIAO_ID) REFERENCES PRJ020294 (REGIAO_ID);


### Tabela de relacionamento entre Tipo de Movimento e Natureza de Operação
CREATE TABLE PRJ020060 (
    NTZOP_ID  INTEGER NOT NULL,
    TPMOV_ID  INTEGER NOT NULL
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020060 ADD CONSTRAINT PK_PRJ020060 PRIMARY KEY (NTZOP_ID, TPMOV_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020060 ADD CONSTRAINT FK_PRJ020062_PRJ020060 FOREIGN KEY (NTZOP_ID) REFERENCES PRJ020062 (NTZOP_ID);
ALTER TABLE PRJ020060 ADD CONSTRAINT FK_PRJ020064_PRJ020060 FOREIGN KEY (TPMOV_ID) REFERENCES PRJ020064 (TPMOV_ID);


### Tabela de tipo de movimento
CREATE TABLE PRJ020064 (
    TPMOV_ID      INTEGER NOT NULL,
    DESCRICAO     VARCHAR(30),
    SEQUENCIA     INTEGER,
    PESSOA_ID     INTEGER,
    UTILIZACAO    CHAR(1),
    DOCFISCAL_ID  INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020064 ADD CONSTRAINT PK_PRJ020064 PRIMARY KEY (TPMOV_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020064 ADD CONSTRAINT FK_PRJ020001_PRJ020064 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020064 ADD CONSTRAINT FK_PRJ020182_PRJ020064 FOREIGN KEY (DOCFISCAL_ID) REFERENCES PRJ020182 (DOCFISCAL_ID);


### Tabela de Natureza de Operação
CREATE TABLE PRJ020062 (
    NTZOP_ID            INTEGER NOT NULL,
    DESCRICAO           VARCHAR(100),
    PESSOA_ID           INTEGER,
    UTILIZACAO          CHAR(1),
    MOVESTOQUE          LOGICO NOT NULL /* LOGICO = CHAR(1) */,
    INTEGRARCONTABIL    LOGICO NOT NULL /* LOGICO = CHAR(1) */,
    INTEGRARFINANCEIRO  LOGICO /* LOGICO = CHAR(1) */,
    INTEGRARBEM         LOGICO /* LOGICO = CHAR(1) */,
    CTACRDVLRPRINCIPAL  INTEGER,
    CTADBTVLRPRINCIPAL  INTEGER,
    HSTVLRPRINCIPAL     INTEGER,
    CTACRDVLRICMS       INTEGER,
    CTADBTVLRICMS       INTEGER,
    HSTVLRICMS          INTEGER,
    CTACRDVLRIPI        INTEGER,
    CTADBTVLRIPI        INTEGER,
    HSTVLRIPI           INTEGER,
    CTACRDVLRISS        INTEGER,
    CTADBTVLRISS        INTEGER,
    HSTVLRISS           INTEGER,
    CFOP_ID             INTEGER,
    CTADBTCOFINS        INTEGER,
    CTACRDCOFINS        INTEGER,
    CTADBTPIS           INTEGER,
    CTACRDPIS           INTEGER,
    CTADBTCSLL          INTEGER,
    CTACRDCSLL          INTEGER,
    CTADBTIRPJ          INTEGER,
    CTACRDIRPJ          INTEGER,
    HSTCOFINSPISCSL     INTEGER,
    FINALIDADENFE       INTEGER,
    PROCESSOTROCA       LOGICO /* LOGICO = CHAR(1) */,
    PROCESSODEVOLUCAO   LOGICO /* LOGICO = CHAR(1) */
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020062 ADD CONSTRAINT PK_PRJ020062 PRIMARY KEY (NTZOP_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020001_PRJ020062 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_CCOFINS FOREIGN KEY (CTACRDCOFINS) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_CCSLL FOREIGN KEY (CTACRDCSLL) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_CICMS FOREIGN KEY (CTACRDVLRICMS) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_CIPI FOREIGN KEY (CTACRDVLRIPI) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_CIRPJ FOREIGN KEY (CTACRDIRPJ) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_CISS FOREIGN KEY (CTADBTVLRISS) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_CPIS FOREIGN KEY (CTACRDPIS) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_CPRC FOREIGN KEY (CTACRDVLRPRINCIPAL) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_DCOFINS FOREIGN KEY (CTADBTCOFINS) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_DCSLL FOREIGN KEY (CTADBTCSLL) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_DICMS FOREIGN KEY (CTADBTVLRICMS) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_DIPI FOREIGN KEY (CTADBTVLRIPI) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_DIRPJ FOREIGN KEY (CTADBTIRPJ) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_DISS FOREIGN KEY (CTACRDVLRISS) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_DPIS FOREIGN KEY (CTADBTPIS) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020057_PRJ020062_DPRC FOREIGN KEY (CTADBTVLRPRINCIPAL) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020058_PRJ020062_ICMS FOREIGN KEY (HSTVLRICMS) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020058_PRJ020062_IPI FOREIGN KEY (HSTVLRIPI) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020058_PRJ020062_ISS FOREIGN KEY (HSTVLRISS) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020058_PRJ020062_PRC FOREIGN KEY (HSTVLRPRINCIPAL) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020058_PRJ020062_SERVICO FOREIGN KEY (HSTCOFINSPISCSL) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020062 ADD CONSTRAINT FK_PRJ020061_PRJ020062 FOREIGN KEY (CFOP_ID) REFERENCES PRJ020061 (CFOP_ID);



### Tabela de CFOP
CREATE TABLE PRJ020061 (
    CFOP_ID            INTEGER NOT NULL,
    CFOPESTADUAL       VARCHAR(4),
    CFOPINTERESTADUAL  VARCHAR(4),
    CFOPEXTERIOR       VARCHAR(4),
    DESCRICAO          VARCHAR(200),
    EXPLICACAO         BLOB SUB_TYPE TEXT SEGMENT SIZE 80,
    ENTRADASAIDA       CHAR(1) NOT NULL
);

/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020061 ADD CONSTRAINT PK_PRJ020061 PRIMARY KEY (CFOP_ID);


### Tabela de Condição de Pagamento
CREATE TABLE PRJ020065 (
    CONDPGTO_ID            INTEGER NOT NULL,
    DESCRICAO              VARCHAR(30),
    PRAZOMEDIO             INTEGER,
    COEFICIENTEFINANCEIRO  NUMERIC(14,2),
    PESSOA_ID              INTEGER,
    DATAVALIDADE           DATE,
    NUMEROPARCELAS         INTEGER NOT NULL,
    COMENTRADA             LOGICO NOT NULL /* LOGICO = CHAR(1) */,
    TIPOPERIODO            CHAR(1) NOT NULL,
    UTILIZACAO             CHAR(1) NOT NULL,
    STATUS                 CHAR(1) NOT NULL,
    POS_HABILITADO         LOGICO /* LOGICO = CHAR(1) */
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020065 ADD CONSTRAINT PK_PRJ020065 PRIMARY KEY (CONDPGTO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020065 ADD CONSTRAINT FK_PRJ020001_PRJ020065 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);


### Tabela de Forma de Pagamento
CREATE TABLE PRJ020066 (
    FRMPGTO_ID         INTEGER NOT NULL,
    DESCRICAO          VARCHAR(30),
    PESSOA_ID          INTEGER,
    DINHEIRO           LOGICO NOT NULL /* LOGICO = CHAR(1) */,
    CHEQUE             LOGICO NOT NULL /* LOGICO = CHAR(1) */,
    CHEQUETERCEIRO     LOGICO NOT NULL /* LOGICO = CHAR(1) */,
    LANCARVCTOS        LOGICO NOT NULL /* LOGICO = CHAR(1) */,
    CARTAO             LOGICO NOT NULL /* LOGICO = CHAR(1) */,
    TRANSACAOBANCARIA  LOGICO NOT NULL /* LOGICO = CHAR(1) */,
    UTILIZARCREDITO    LOGICO /* LOGICO = CHAR(1) */,
    MIX                LOGICO /* LOGICO = CHAR(1) */,
    UTILIZACAO         CHAR(1) NOT NULL,
    ACORDOFINANCEIRO   LOGICO /* LOGICO = CHAR(1) */,
    CONTACORRENTE      LOGICO /* LOGICO = CHAR(1) */
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020066 ADD CONSTRAINT PK_PRJ020066 PRIMARY KEY (FRMPGTO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020066 ADD CONSTRAINT FK_PRJ020001_PRJ020066 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);


### Tabela de Depóstos / Almoxarifados
## Este modelo já foi convertido para o sequelize, está no arquivo produtoDeposito.ts

CREATE TABLE PRJ020082 (
    DEPOSITO_ID  INTEGER NOT NULL,
    DESCRICAO    VARCHAR(30),
    PESSOA_ID    INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020082 ADD CONSTRAINT PK_PRJ020082 PRIMARY KEY (DEPOSITO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020082 ADD CONSTRAINT FK_PRJ020001_PRJ020082 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);



### Tabela de Centro de Custos
CREATE TABLE PRJ020191 (
    CENTROCUSTO_ID  INTEGER NOT NULL,
    CODIGOCONTABIL  VARCHAR(10),
    DESCRICAO       VARCHAR(100),
    TIPOREGISTRO    CHAR(1),
    PESSOA_ID       INTEGER,
    SUPERIOR_ID     INTEGER,
    NTZSALDO        SMALLINT
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020191 ADD CONSTRAINT PK_PRJ020191 PRIMARY KEY (CENTROCUSTO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020191 ADD CONSTRAINT FK_PRJ020001_PRJ020191 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020191 ADD CONSTRAINT FK_PRJ020191_PRJ020191 FOREIGN KEY (SUPERIOR_ID) REFERENCES PRJ020191 (CENTROCUSTO_ID);


### Tabela de Lote de NFe
CREATE TABLE PRJ020221 (
    LOTENFE_ID    INTEGER NOT NULL,
    NROPROTOCOLO  VARCHAR(50),
    NRORECIBO     VARCHAR(50)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020221 ADD CONSTRAINT PK_PRJ020221 PRIMARY KEY (LOTENFE_ID);


### Tabela de Situações dos movimentos
CREATE TABLE PRJ020241 (
    STPROCESSO    CHAR(1) NOT NULL,
    DESCRICAO     VARCHAR(20),
    STFINALIZADO  LOGICO /* LOGICO = CHAR(1) */,
    STANTERIOR    CHAR(1),
    UTILIZACAO    CHAR(1),
    PESSOA_ID     INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020241 ADD CONSTRAINT PK_PRJ020241 PRIMARY KEY (STPROCESSO);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020241 ADD CONSTRAINT FK_PRJ020001_PRJ020241 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID) ON DELETE CASCADE ON UPDATE CASCADE;


### Tabela de Regiões
CREATE TABLE PRJ020294 (
    REGIAO_ID  INTEGER NOT NULL,
    DESCRICAO  VARCHAR(100)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020294 ADD CONSTRAINT PK_PRJ020294 PRIMARY KEY (REGIAO_ID);



### Tabela dos Itens dos Movimentos de Entrada/Saída
CREATE TABLE PRJ020069 (
    LINHA_ID                INTEGER NOT NULL,
    MOV_ID                  INTEGER,
    LNREL_ID                INTEGER,
    BEM_ID                  INTEGER,
    DESCRICAOBEM            VARCHAR(120),
    TIPOBEM                 CHAR(1),
    QTDEPEDIDO              NUMERIC(18,8),
    QUANTIDADE              NUMERIC(18,8),
    QTDEATENDIDA            NUMERIC(18,8),
    EMBALAGEM               VARCHAR(2),
    VLRUNITARIO             NUMERIC(18,8),
    PRCDESCONTO             NUMERIC(18,8),
    VLRDESCONTO             NUMERIC(18,8),
    VLRTOTAL                NUMERIC(18,8),
    ALIQUOTAICMS            NUMERIC(14,2),
    PRCREDUCAOBASEICMS      NUMERIC(14,2),
    VLRBASEICMS             NUMERIC(18,8),
    VLRICMS                 NUMERIC(18,8),
    ALIQUOTAICMSSUBST       NUMERIC(14,2),
    VLRMARGEMIVAST          NUMERIC(18,8),
    VLRPAUTAIVAST           NUMERIC(18,8),
    VLRBASEICMSSUBST        NUMERIC(18,8),
    VLRICMSSUBST            NUMERIC(18,8),
    CDTRIBUTACAOIPI         VARCHAR(2),
    PRCIPI                  NUMERIC(14,2),
    VLRIPI                  NUMERIC(18,8),
    PRCISS                  NUMERIC(14,2),
    VLRISS                  NUMERIC(18,8),
    PESOBRUTO               NUMERIC(18,8),
    PESOLIQUIDO             NUMERIC(18,8),
    CDNCM                   VARCHAR(8),
    CDCEST                  VARCHAR(7),
    CDORIGEM                CHAR(1),
    CDTRIBUTACAO            CHAR(2),
    VLRCUSTO                NUMERIC(18,8),
    COLPRCCOMISSAO          NUMERIC(14,2),
    COLVLRCOMISSAO          NUMERIC(18,8),
    EMPPRCCOMISSAO          NUMERIC(14,2),
    EMPVLRCOMISSAO          NUMERIC(18,8),
    EMBALAGEM_ID            INTEGER,
    EMBMULTIPLOS            VARCHAR(20),
    MULTIPLO_ID             INTEGER,
    OBSERVACOES             BLOB SUB_TYPE TEXT SEGMENT SIZE 50,
    VLRTABELA               NUMERIC(18,8),
    COMPRIMENTO             NUMERIC(18,8),
    LARGURA                 NUMERIC(18,8),
    TAMANHO                 NUMERIC(18,8),
    MT3                     NUMERIC(18,8),
    CFOP_ID                 INTEGER,
    VLRBASEII               NUMERIC(18,8),
    PRCII                   NUMERIC(14,2),
    VLRII                   NUMERIC(18,8),
    VLRFRETE                NUMERIC(18,8),
    LINHARELACIONAMENTO     LOGICO /* LOGICO = CHAR(1) */,
    CSOSN                   VARCHAR(3),
    PCREDSN                 NUMERIC(18,8),
    VCREDICMSSN             NUMERIC(18,8),
    SOMARVLRTOTALNOTA       LOGICO DEFAULT 'S' /* LOGICO = CHAR(1) */,
    ECFTRIBUTACAO           CHAR(1),
    VLROUTROS               NUMERIC(18,8),
    ALIQUOTAIMPOSTOS        NUMERIC(14,2),
    VLRIMPOSTOS             NUMERIC(18,8),
    CLASSIFICACAO_ID        VARCHAR(2),
    POS_ITEMKEY             VARCHAR(40),
    SITUACAOTROCA           VARCHAR(10),
    OBSTROCA                BLOB SUB_TYPE TEXT SEGMENT SIZE 50,
    STMARGEMOK              LOGICO /* LOGICO = CHAR(1) */,
    PRCFCP                  NUMERIC(14,1),
    VLRFCP                  NUMERIC(18,8),
    ALIQUOTAICMSUFDESTINO   NUMERIC(14,2),
    VLRICMSUFDESTINO        NUMERIC(18,8),
    ALIQUOTAICMSDIFAL       NUMERIC(14,2),
    VLRIPIDEVOLVIDO         NUMERIC(18,8),
    DATAHORARESERVAESTOQUE  TIMESTAMP,
    QTDESALDOESTOQUE        NUMERIC(18,8),
    VLRICMSDIFAL            NUMERIC(18,8)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020069 ADD CONSTRAINT PK_PRJ020069 PRIMARY KEY (LINHA_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020069 ADD CONSTRAINT FK_PRJ020032_PRJ020069 FOREIGN KEY (BEM_ID) REFERENCES PRJ020032 (BEM_ID);
ALTER TABLE PRJ020069 ADD CONSTRAINT FK_PRJ020061_PRJ020069 FOREIGN KEY (CFOP_ID) REFERENCES PRJ020061 (CFOP_ID);
ALTER TABLE PRJ020069 ADD CONSTRAINT FK_PRJ020068_PRJ020069 FOREIGN KEY (MOV_ID) REFERENCES PRJ020068 (MOV_ID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE PRJ020069 ADD CONSTRAINT FK_PRJ020069_PRJ020069 FOREIGN KEY (LNREL_ID) REFERENCES PRJ020069 (LINHA_ID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE PRJ020069 ADD CONSTRAINT FK_PRJ020096_PRJ020069 FOREIGN KEY (BEM_ID, MULTIPLO_ID) REFERENCES PRJ020096 (PRODUTO_ID, MULTIPLO_ID);
ALTER TABLE PRJ020069 ADD CONSTRAINT FK_PRJ020136_PRJ020069 FOREIGN KEY (EMBALAGEM_ID) REFERENCES PRJ020136 (EMBALAGEM_ID);


### Tabela Bens/Produtos/Serviços
## Este modelo já foi convertido para o sequelize, está no arquivo produto.ts
CREATE TABLE PRJ020032 (
    BEM_ID     INTEGER NOT NULL,
    PESSOA_ID  INTEGER,
    TIPOBEM    CHAR(1),
    CTABEM_ID  INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020032 ADD CONSTRAINT PK_PRJ020032 PRIMARY KEY (BEM_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020032 ADD CONSTRAINT FK_PRJ020001_PRJ020032 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020032 ADD CONSTRAINT FK_PRJ020057_PRJ020032 FOREIGN KEY (CTABEM_ID) REFERENCES PRJ020057 (CONTA_ID);


### Tabela de Multiplos de Produtos
CREATE TABLE PRJ020096 (
    PRODUTO_ID             INTEGER NOT NULL,
    MULTIPLO_ID            INTEGER NOT NULL,
    DESCRICAO              VARCHAR(20),
    QUANTIDADE             NUMERIC(18,8),
    COEFICIENTEFINANCEIRO  NUMERIC(18,8),
    EMBALAGEM_ID           INTEGER,
    LOTE_ID                INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020096 ADD CONSTRAINT PK_PRJ020096 PRIMARY KEY (PRODUTO_ID, MULTIPLO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020096 ADD CONSTRAINT FK_PRJ020072_PRJ020096 FOREIGN KEY (PRODUTO_ID) REFERENCES PRJ020072 (PRODUTO_ID);
ALTER TABLE PRJ020096 ADD CONSTRAINT FK_PRJ020136_PRJ020096 FOREIGN KEY (EMBALAGEM_ID) REFERENCES PRJ020136 (EMBALAGEM_ID);

### Tabela de Embalagens
## Este modelo já foi convertido para o sequelize, está no arquivo produtoEmbalagem.ts
CREATE TABLE PRJ020136 (
    EMBALAGEM_ID  INTEGER NOT NULL,
    DESCRICAO     VARCHAR(15),
    SIGLA         VARCHAR(3)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020136 ADD CONSTRAINT PK_PRJ020136 PRIMARY KEY (EMBALAGEM_ID);


### Tabela de Parcelas de Movimentos de Entrada/Saída

CREATE TABLE PRJ020108 (
    DOCUMENTO_ID                INTEGER NOT NULL,
    PESSOA_ID                   INTEGER NOT NULL,
    TIPOREGISTRO                CHAR(1),
    PRETIPOREGISTRO             CHAR(1),
    MOV_ID                      INTEGER,
    DATAEMISSAO                 DATE,
    DATAVCTO                    DATE,
    PARCELA                     INTEGER,
    QTDEPARCELA                 INTEGER,
    VLRPRINCIPAL                NUMERIC(18,8),
    PERCMULTAPREVISAO           NUMERIC(18,8),
    VLRMULTAPREVISAO            NUMERIC(18,8),
    PERCJUROSPREVISAO           NUMERIC(18,8),
    VLRJUROSPREVISAO            NUMERIC(18,8),
    PERCMULTAREALIZADO          NUMERIC(18,8),
    VLRMULTAREALIZADO           NUMERIC(18,8),
    PERCJUROSREALIZADO          NUMERIC(18,8),
    VLRJUROSREALIZADO           NUMERIC(18,8),
    VLROUTROSACRESCIMOS         NUMERIC(18,8),
    VLRPAGO                     NUMERIC(18,8),
    VLRSALDO                    NUMERIC(18,8),
    OBS                         VARCHAR(100),
    TITULAR_ID                  INTEGER NOT NULL,
    DATAPGTO                    DATE,
    DATAUPDATE                  DATE,
    PERCDESCCONDICIONAL         NUMERIC(18,8),
    VLRDESCCONDICIONAL          NUMERIC(18,8),
    DATADESCCONDICIONAL         DATE,
    QTDEDIASDESCCONDICIONAL     INTEGER,
    PERCDESCINCONDICIONAL       NUMERIC(18,8),
    VLRDESCINCONDICIONAL        NUMERIC(18,8),
    BCODEMONSTRATIVO            VARCHAR(100),
    BCOINSTRUCOESCAIXA          VARCHAR(100),
    BCONOSSONUMERO              VARCHAR(20),
    CHQCDBANCO                  VARCHAR(3),
    CHQNROAGENCIA               VARCHAR(10),
    CHQNROCONTA                 VARCHAR(20),
    CHQNROCHEQUE                VARCHAR(20),
    CHQNOMEEMITENTE             VARCHAR(60),
    CONTABCO_ID                 INTEGER,
    TPDOCUMENTO_ID              INTEGER,
    SITUACAO_ID                 INTEGER,
    CONTABAIXA_ID               INTEGER,
    HISTORICO_ID                INTEGER,
    CONTARECEITADESPESA_ID      INTEGER,
    SEQLCTOCONTABIL             INTEGER,
    CLASSEPESSOA_ID             INTEGER,
    CENTROCUSTO_ID              INTEGER,
    OPERADOR_ID                 INTEGER,
    DC                          VARCHAR(1),
    INSCRICAOSPC                LOGICO /* LOGICO = CHAR(1) */,
    DATAINSCRICAOSPC            DATE,
    INSCRICAOCARTORIO           LOGICO /* LOGICO = CHAR(1) */,
    DATAINSCRICAOCARTORIO       DATE,
    INSCRICAOJUDICIAL           LOGICO /* LOGICO = CHAR(1) */,
    DATAINSCRICAOJUDICIAL       DATE,
    INSCRICAODIVIDAPERDIDA      LOGICO /* LOGICO = CHAR(1) */,
    DATAINSCRICAODIVIDAPERDIDA  DATE,
    AVALISTA_ID                 INTEGER,
    TIPOPARCELA_ID              INTEGER,
    OBSERVACOES                 BLOB SUB_TYPE TEXT SEGMENT SIZE 80,
    CHQPORTADOR_ID              INTEGER,
    NROCONTROLETRANSACAO        VARCHAR(50),
    FRMPGTO_ID                  INTEGER,
    CLASSIFICACAOCREDITO_ID     INTEGER,
    DOCUMENTOORIGEM_ID          INTEGER,
    SEQUENCIAPROCESSO_ID        INTEGER,
    STCREDITOBAIXADO            LOGICO /* LOGICO = CHAR(1) */,
    SEQLCTOCTBBAIXACREDITO      INTEGER
);

/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020108 ADD CONSTRAINT PK_PRJ020108 PRIMARY KEY (DOCUMENTO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ001_PRJ108_AVALISTA FOREIGN KEY (AVALISTA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ001_PRJ108_CHQPORTADOR FOREIGN KEY (CHQPORTADOR_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ001_PRJ108_PESSOA FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ001_PRJ108_TITULAR FOREIGN KEY (TITULAR_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020057_PRJ020108CTABAIXA FOREIGN KEY (CONTABAIXA_ID) REFERENCES PRJ020057 (CONTA_ID) ON DELETE SET NULL;
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020057_PRJ020108RCTADPZA FOREIGN KEY (CONTARECEITADESPESA_ID) REFERENCES PRJ020057 (CONTA_ID) ON DELETE SET NULL;
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020058_PRJ020108 FOREIGN KEY (HISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020068_PRJ020108 FOREIGN KEY (MOV_ID) REFERENCES PRJ020068 (MOV_ID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020108_PRJ020021 FOREIGN KEY (CLASSEPESSOA_ID, TITULAR_ID) REFERENCES PRJ020021 (CLASSEPESSOA_ID, PESSOA_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020108_PRJ020108 FOREIGN KEY (DOCUMENTOORIGEM_ID) REFERENCES PRJ020108 (DOCUMENTO_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020109_PRJ020108 FOREIGN KEY (CONTABCO_ID) REFERENCES PRJ020109 (CONTABCO_ID) ON DELETE SET NULL;
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020116_PRJ020108 FOREIGN KEY (SITUACAO_ID) REFERENCES PRJ020116 (SITUACAO_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020117_PRJ020108 FOREIGN KEY (TPDOCUMENTO_ID) REFERENCES PRJ020117 (TPDOCUMENTO_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020118_PRJ020108 FOREIGN KEY (SEQUENCIAPROCESSO_ID) REFERENCES PRJ020118 (SEQUENCIA_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020191_PRJ020108 FOREIGN KEY (CENTROCUSTO_ID) REFERENCES PRJ020191 (CENTROCUSTO_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020224_PRJ020108 FOREIGN KEY (OPERADOR_ID) REFERENCES PRJ020224 (OPERADOR_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020248_PRJ020108 FOREIGN KEY (TIPOPARCELA_ID) REFERENCES PRJ020248 (TIPOPARCELA_ID);
ALTER TABLE PRJ020108 ADD CONSTRAINT FK_PRJ020325_PRJ020108 FOREIGN KEY (CLASSIFICACAOCREDITO_ID) REFERENCES PRJ020325 (CLASSIFICACAOCREDITO_ID);



### Tabela do Plano de Contas
## model: ja existe contabilPlanoContas.ts

CREATE TABLE PRJ020057 (
    CONTA_ID        INTEGER NOT NULL,
    CODIGOCONTABIL  VARCHAR(15),
    DESCRICAO       VARCHAR(40),
    NIVEL           INTEGER,
    CONTASUP_ID     INTEGER,
    PESSOA_ID       INTEGER NOT NULL,
    NTZSALDO        SMALLINT DEFAULT 0 NOT NULL,
    IDXBALANCO      SMALLINT,
    IDXDRE          SMALLINT,
    TIPOREGISTRO    CHAR(1) NOT NULL
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020057 ADD CONSTRAINT PK_PRJ020057 PRIMARY KEY (CONTA_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020057 ADD CONSTRAINT FK_PRJ020001_PRJ020057 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020057 ADD CONSTRAINT FK_PRJ020057_PRJ020057 FOREIGN KEY (CONTASUP_ID) REFERENCES PRJ020057 (CONTA_ID);


### Tabela de Histórico Padrão
CREATE TABLE PRJ020058 (
    HISTORICO_ID     INTEGER NOT NULL,
    DESCRICAO        VARCHAR(40),
    PESSOA_ID        INTEGER,
    TIPOREGISTRO     CHAR(1) NOT NULL,
    HISTORICOSUP_ID  INTEGER
);

## TIPOREGISTRO define - D = Débito, C = Crédito

/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020058 ADD CONSTRAINT PK_PRJ020058 PRIMARY KEY (HISTORICO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020058 ADD CONSTRAINT FK_PRJ020001_PRJ020058 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020058 ADD CONSTRAINT FK_PRJ020058_PRJ020058 FOREIGN KEY (HISTORICOSUP_ID) REFERENCES PRJ020058 (HISTORICO_ID);



### Tabela de Lançamento Contábil
CREATE TABLE PRJ020059 (
    LCTO_ID         INTEGER NOT NULL,
    SEQLCTO         INTEGER NOT NULL,
    HISTORICO_ID    INTEGER,
    CRDCONTA_ID     INTEGER,
    DBTCONTA_ID     INTEGER,
    DATA            DATE,
    COMPETENCIA     CHAR(6),
    COMPLEMENTO     VARCHAR(120),
    VALOR           NUMERIC(18,8),
    PESSOA_ID       INTEGER,
    LCTOCONCILIADO  LOGICO NOT NULL /* LOGICO = CHAR(1) */,
    DATADISPONIVEL  DATE,
    LCTOSUP_ID      INTEGER,
    CENTROCUSTO_ID  INTEGER,
    USUARIO_ID      INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020059 ADD CONSTRAINT PK_PRJ020059 PRIMARY KEY (LCTO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020059 ADD CONSTRAINT FK_PRJ020001_PRJ020059 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020059 ADD CONSTRAINT FK_PRJ020057_PRJ020059_CRD FOREIGN KEY (CRDCONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020059 ADD CONSTRAINT FK_PRJ020057_PRJ020059_DBT FOREIGN KEY (DBTCONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020059 ADD CONSTRAINT FK_PRJ020058_PRJ020059 FOREIGN KEY (HISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020059 ADD CONSTRAINT FK_PRJ020059_PRJ020059 FOREIGN KEY (LCTOSUP_ID) REFERENCES PRJ020059 (LCTO_ID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE PRJ020059 ADD CONSTRAINT FK_PRJ020191_PRJ020059 FOREIGN KEY (CENTROCUSTO_ID) REFERENCES PRJ020191 (CENTROCUSTO_ID);


### Tabela de Grupo de Contas Contábil
CREATE TABLE PRJ020120 (
    GRUPOCONTA_ID  INTEGER NOT NULL,
    DESCRICAO      VARCHAR(40),
    PESSOA_ID      INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020120 ADD CONSTRAINT PK_PRJ020120 PRIMARY KEY (GRUPOCONTA_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020120 ADD CONSTRAINT FK_PRJ020001_PRJ020120 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);


### Tabela de Relação de Conta Contábil x Grupo de Contas Contábil
CREATE TABLE PRJ020121 (
    GRUPOCONTA_ID  INTEGER NOT NULL,
    CONTA_ID       INTEGER NOT NULL
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020121 ADD CONSTRAINT PK_PRJ020121 PRIMARY KEY (GRUPOCONTA_ID, CONTA_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020121 ADD CONSTRAINT FK_PRJ020057_PRJ020121 FOREIGN KEY (CONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020121 ADD CONSTRAINT FK_PRJ020120_PRJ020121 FOREIGN KEY (GRUPOCONTA_ID) REFERENCES PRJ020120 (GRUPOCONTA_ID) ON DELETE CASCADE;


### Tabela de Produtos / Serviços
CREATE TABLE PRJ020032 (
    BEM_ID     INTEGER NOT NULL,
    PESSOA_ID  INTEGER,
    TIPOBEM    CHAR(1),
    CTABEM_ID  INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020032 ADD CONSTRAINT PK_PRJ020032 PRIMARY KEY (BEM_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020032 ADD CONSTRAINT FK_PRJ020001_PRJ020032 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020032 ADD CONSTRAINT FK_PRJ020057_PRJ020032 FOREIGN KEY (CTABEM_ID) REFERENCES PRJ020057 (CONTA_ID);


### Tabela de Modelo de documentos Fiscais
CREATE TABLE PRJ020182 (
    DOCFISCAL_ID      INTEGER NOT NULL,
    DESCRICAO         VARCHAR(60),
    SERIEDOCUMENTO    VARCHAR(3),
    NUMEROAUTOMATICO  LOGICO /* LOGICO = CHAR(1) */,
    PROXIMONUMERO     INTEGER,
    MODELODOC_ID      INTEGER,
    PESSOA_ID         INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020182 ADD CONSTRAINT PK_PRJ020182 PRIMARY KEY (DOCFISCAL_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020182 ADD CONSTRAINT FK_PRJ002001_PRJ020182 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020182 ADD CONSTRAINT FK_PRJ020181_PRJ020182 FOREIGN KEY (MODELODOC_ID) REFERENCES PRJ020181 (MODELODOC_ID);


### Tabela de Tipo de Documento
CREATE TABLE PRJ020117 (
    TPDOCUMENTO_ID  INTEGER NOT NULL,
    DESCRICAO       VARCHAR(30)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020117 ADD CONSTRAINT PK_PRJ020117 PRIMARY KEY (TPDOCUMENTO_ID);

### Tabela de Tipo de Parcelas
CREATE TABLE PRJ020248 (
    TIPOPARCELA_ID  INTEGER NOT NULL,
    DESCRICAO       VARCHAR(100)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020248 ADD CONSTRAINT PK_PRJ020248 PRIMARY KEY (TIPOPARCELA_ID);


### Tabela de Contas Bancárias
CREATE TABLE PRJ020109 (
    CONTABCO_ID       INTEGER NOT NULL,
    AGENCIA_ID        INTEGER NOT NULL,
    NROCONTA          VARCHAR(20),
    VLRLIMITECREDITO  NUMERIC(14,2),
    SEQCHEQUE         INTEGER,
    GERENTECONTA      VARCHAR(60),
    DESCRICAO         VARCHAR(30),
    PESSOA_ID         INTEGER NOT NULL,
    CONTA_ID          INTEGER,
    CONTACHQ_ID       INTEGER,
    STREGISTRO        VARCHAR(10)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020109 ADD CONSTRAINT PK_PRJ020109 PRIMARY KEY (CONTABCO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020109 ADD CONSTRAINT FK_PRJ020001_PRJ020109 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020109 ADD CONSTRAINT FK_PRJ020057_PRJ020109 FOREIGN KEY (CONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020109 ADD CONSTRAINT FK_PRJ020057_PRJ020109CHQ FOREIGN KEY (CONTACHQ_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020109 ADD CONSTRAINT FK_PRJ020112_PRJ020109 FOREIGN KEY (AGENCIA_ID) REFERENCES PRJ020112 (AGENCIA_ID);

### Tabela de Agências Bancárias
CREATE TABLE PRJ020112 (
    AGENCIA_ID   INTEGER NOT NULL,
    PORTADOR_ID  INTEGER NOT NULL,
    NROAGENCIA   VARCHAR(10),
    DESCRICAO    VARCHAR(30),
    TELEFONE     VARCHAR(15)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020112 ADD CONSTRAINT PK_PRJ020112 PRIMARY KEY (AGENCIA_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020112 ADD CONSTRAINT FK_PRJ020111_PRJ020112 FOREIGN KEY (PORTADOR_ID) REFERENCES PRJ020111 (PORTADOR_ID);


### Tabela de Portadores
CREATE TABLE PRJ020111 (
    PORTADOR_ID  INTEGER NOT NULL,
    CODIGO       VARCHAR(3),
    DESCRICAO    VARCHAR(60),
    WEBSITE      VARCHAR(60)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020111 ADD CONSTRAINT PK_PRJ020111 PRIMARY KEY (PORTADOR_ID);


### Tabela de Situação de Cheques
CREATE TABLE PRJ020116 (
    SITUACAO_ID  INTEGER NOT NULL,
    DESCRICAO    VARCHAR(30)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020116 ADD CONSTRAINT PK_PRJ020116 PRIMARY KEY (SITUACAO_ID);


### Tabela de Operadoras de Cartões de Crédito
CREATE TABLE PRJ020224 (
    OPERADOR_ID        INTEGER NOT NULL,
    DESCRICAO          VARCHAR(50),
    QTDEDIAS           INTEGER,
    PERCTARIFAAVISTA   NUMERIC(14,2),
    PERCTARIFACREDITO  NUMERIC(14,2),
    PESSOA_ID          INTEGER,
    CONTA_ID           INTEGER,
    CONTABAIXA_ID      INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020224 ADD CONSTRAINT PK_PRJ020224 PRIMARY KEY (OPERADOR_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020224 ADD CONSTRAINT FK_PRJ001_PRJ224_PESSOA_ID FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020224 ADD CONSTRAINT FK_PRJ020057_PRJ020224 FOREIGN KEY (CONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020224 ADD CONSTRAINT FK_PRJ020057_PRJ020224_CTABAIXA FOREIGN KEY (CONTABAIXA_ID) REFERENCES PRJ020057 (CONTA_ID);


### Tabela de Classificação de Crédito
CREATE TABLE PRJ020325 (
    CLASSIFICACAOCREDITO_ID  INTEGER NOT NULL,
    DESCRICAO                VARCHAR(100)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020325 ADD CONSTRAINT PK_PRJ020325 PRIMARY KEY (CLASSIFICACAOCREDITO_ID);


### Tabela de Relacionamento Condição de Pagamento x Forma de Pagamento
CREATE TABLE PRJ020067 (
    CONDPGTO_ID  INTEGER NOT NULL,
    FRMPGTO_ID   INTEGER NOT NULL
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020067 ADD CONSTRAINT PK_PRJ020067 PRIMARY KEY (CONDPGTO_ID, FRMPGTO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020067 ADD CONSTRAINT FK_PRJ020065_PRJ020067 FOREIGN KEY (CONDPGTO_ID) REFERENCES PRJ020065 (CONDPGTO_ID);
ALTER TABLE PRJ020067 ADD CONSTRAINT FK_PRJ020066_PRJ020067 FOREIGN KEY (FRMPGTO_ID) REFERENCES PRJ020066 (FRMPGTO_ID);


### Tabela de Detalhe da Condição de Pagamento
CREATE TABLE PRJ020122 (
    SEQUENCIA_ID  INTEGER NOT NULL,
    CONDPGTO_ID   INTEGER NOT NULL,
    DESCRICAO     VARCHAR(20),
    PERCPARCELA   NUMERIC(14,2),
    NUMERODIAS    INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020122 ADD CONSTRAINT PK_PRJ020122 PRIMARY KEY (SEQUENCIA_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020122 ADD CONSTRAINT FK_PRJ020065_PRJ020122 FOREIGN KEY (CONDPGTO_ID) REFERENCES PRJ020065 (CONDPGTO_ID) ON DELETE CASCADE;


### Tabela de registro de histório de pagamento/recebimento financeiro
CREATE TABLE PRJ020118 (
    SEQUENCIA_ID            INTEGER NOT NULL,
    DOCUMENTO_ID            INTEGER NOT NULL,
    DATAVCTO                DATE,
    DATAPGTO                DATE,
    VLRPRINCIPAL            NUMERIC(18,8),
    PERCMULTA               NUMERIC(18,8),
    VLRMULTA                NUMERIC(18,8),
    PERCJUROS               NUMERIC(18,8),
    VLRJUROS                NUMERIC(18,8),
    VLROUTROSACRESCIMOS     NUMERIC(18,8),
    VLRSUBTOTAL             NUMERIC(18,8),
    PERCDESCONTO            NUMERIC(18,8),
    VLRDESCONTO             NUMERIC(18,8),
    VLRTOTAL                NUMERIC(18,8),
    VLRPAGO                 NUMERIC(18,8),
    VLRSALDO                NUMERIC(18,8),
    FRMPGTO_ID              INTEGER,
    CONTABAIXA_ID           INTEGER,
    HISTORICO_ID            INTEGER,
    SEQLCTOCONTABIL         INTEGER,
    CONTARECEITADESPESA_ID  INTEGER,
    USUARIO_ID              INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020118 ADD CONSTRAINT PK_PRJ020118 PRIMARY KEY (SEQUENCIA_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020118 ADD CONSTRAINT FK_PRJ020057_PRJ020118CTABAIXA FOREIGN KEY (CONTABAIXA_ID) REFERENCES PRJ020057 (CONTA_ID) ON DELETE SET NULL;
ALTER TABLE PRJ020118 ADD CONSTRAINT FK_PRJ020057_PRJ020118RCTADPZA FOREIGN KEY (CONTARECEITADESPESA_ID) REFERENCES PRJ020057 (CONTA_ID) ON DELETE SET NULL;
ALTER TABLE PRJ020118 ADD CONSTRAINT FK_PRJ020058_PRJ020118 FOREIGN KEY (HISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020118 ADD CONSTRAINT FK_PRJ020066_PRJ020118 FOREIGN KEY (FRMPGTO_ID) REFERENCES PRJ020066 (FRMPGTO_ID);
ALTER TABLE PRJ020118 ADD CONSTRAINT FK_PRJ020108_PRJ020118 FOREIGN KEY (DOCUMENTO_ID) REFERENCES PRJ020108 (DOCUMENTO_ID);


### Tabela de configurações De movimentação de Produtos
CREATE TABLE PRJ020204 (
    PESSOA_ID                     INTEGER NOT NULL,
    ESTOQUENEGATIVO               LOGICO /* LOGICO = CHAR(1) */,
    MOVTIPOCDBEM                  VARCHAR(20),
    PATHDBFILIALMATRIZ            VARCHAR(255),
    UTILIZARFAIXADESCTABPRECOVDA  LOGICO /* LOGICO = CHAR(1) */,
    FAIXADESC1                    NUMERIC(14,2),
    FAIXADESC2                    NUMERIC(14,2),
    FAIXADESC3                    NUMERIC(14,2),
    FAIXADESC4                    NUMERIC(14,2),
    RESERVARESTOQUE               LOGICO /* LOGICO = CHAR(1) */
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020204 ADD CONSTRAINT PK_PRJ020204 PRIMARY KEY (PESSOA_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020204 ADD CONSTRAINT FK_PRJ020001_PRJ020204 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);


### Tabela de configuração de enquadramento Fiscal da empresa
CREATE TABLE PRJ020184 (
    PESSOA_ID                     INTEGER NOT NULL,
    OPTANTEREGIMESIMPLES          LOGICO /* LOGICO = CHAR(1) */,
    PERCALIQUOTASIMPLES           INTEGER,
    OPTANTEREGIMESIMPLESNACIONAL  LOGICO /* LOGICO = CHAR(1) */,
    PERCCOFINS                    NUMERIC(14,2),
    PERCCSLL                      NUMERIC(14,2),
    PERCPIS                       NUMERIC(14,2),
    PERCIRPJ                      NUMERIC(14,2),
    PERCISS                       NUMERIC(14,2),
    NFECODIGOREGIMETRIBUTARIO     CHAR(1)
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020184 ADD CONSTRAINT PK_PRJ020184 PRIMARY KEY (PESSOA_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020184 ADD CONSTRAINT FK_PRJ020001_PRJ020184 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);


### Tabela de configuração de PDV - Processos de venda automatizados
CREATE TABLE PRJ020150 (
    PROCESSO_ID         INTEGER NOT NULL,
    DESCRICAO           VARCHAR(30),
    TPMOV_ID            INTEGER,
    NTZOP_ID            INTEGER,
    FRMPGTO_ID          INTEGER,
    CONDPGTO_ID         INTEGER,
    CONDPGTOPADRAO      LOGICO /* LOGICO = CHAR(1) */,
    CLIENTEPADRAO       LOGICO /* LOGICO = CHAR(1) */,
    TITULAR_ID          INTEGER,
    DEPOSITO_ID         INTEGER,
    CAIXA_ID            INTEGER,
    PESSOA_ID           INTEGER,
    TPCODIGOPRODUTO     VARCHAR(15),
    PROCESSOINVERSO_ID  INTEGER,
    TABELA_ID           INTEGER,
    EMITIRDOCFISCAL     LOGICO /* LOGICO = CHAR(1) */,
    CENTROCUSTO_ID      INTEGER
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020150 ADD CONSTRAINT PK_PRJ020150 PRIMARY KEY (PROCESSO_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020001_PRJ020150_PESSOA FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020001_PRJ020150_TITULAR FOREIGN KEY (TITULAR_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020062_PRJ020150 FOREIGN KEY (NTZOP_ID) REFERENCES PRJ020062 (NTZOP_ID);
ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020064_PRJ020150 FOREIGN KEY (TPMOV_ID) REFERENCES PRJ020064 (TPMOV_ID);
ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020065_PRJ020150 FOREIGN KEY (CONDPGTO_ID) REFERENCES PRJ020065 (CONDPGTO_ID);
ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020066_PRJ020150 FOREIGN KEY (FRMPGTO_ID) REFERENCES PRJ020066 (FRMPGTO_ID);
ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020076_PRJ020150 FOREIGN KEY (TABELA_ID) REFERENCES PRJ020076 (TABELA_ID);
ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020082_PRJ020150 FOREIGN KEY (DEPOSITO_ID) REFERENCES PRJ020082 (DEPOSITO_ID);
ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020114_PRJ020150 FOREIGN KEY (CAIXA_ID) REFERENCES PRJ020114 (CAIXA_ID);
ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020150_PRJ020150 FOREIGN KEY (PROCESSOINVERSO_ID) REFERENCES PRJ020150 (PROCESSO_ID) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE PRJ020150 ADD CONSTRAINT FK_PRJ020191_PRJ020150 FOREIGN KEY (CENTROCUSTO_ID) REFERENCES PRJ020191 (CENTROCUSTO_ID);


### Tabela de Configuração Financeira x Contábil

CREATE TABLE PRJ020187 (
    PESSOA_ID                      INTEGER NOT NULL,
    PGTOMULTACONTA_ID              INTEGER,
    PGTOJUROSCONTA_ID              INTEGER,
    DESCRECEBIDOCONTA_ID           INTEGER,
    RCBTOMULTACONTA_ID             INTEGER,
    RCBTOJUROSCONTA_ID             INTEGER,
    DESCCONCEDIDOCONTA_ID          INTEGER,
    PGTOMULTAHISTORICO_ID          INTEGER,
    PGTOJUROSHISTORICO_ID          INTEGER,
    DESCRECEBIDOHISTORICO_ID       INTEGER,
    RCBTOMULTAHISTORICO_ID         INTEGER,
    RCBTOJUROSHISTORICO_ID         INTEGER,
    DESCCONCEDIDOHISTORICO_ID      INTEGER,
    PERCMULTASOBRETITULOS          NUMERIC(14,2),
    PERCJUROSSOBRETITULOS          NUMERIC(14,2),
    CHQDEPOSITOHISTORICO_ID        INTEGER,
    RCBTOBAIXAHISTORICO_ID         INTEGER,
    CRDCLIENTECONTA_ID             INTEGER,
    CRDFORNECEDORCONTA_ID          INTEGER,
    CRDCLIENTEHISTORICO_ID         INTEGER,
    CRDCLIENTEHISTORICOBAIXA_ID    INTEGER,
    CRDFORNECEDORHISTORICO_ID      INTEGER,
    SUBSTCHEQUEHITORICO_ID         INTEGER,
    DEVCHEQUEHISTORICO_ID          INTEGER,
    INTEGRARFINANCHISTORICO_ID     INTEGER,
    INTEGRARFINANCEIROCONTABIL     LOGICO /* LOGICO = CHAR(1) */,
    INTEGRARFINANCEIROCAIXA        LOGICO /* LOGICO = CHAR(1) */,
    HABILITARCARENCIADESCONTO      LOGICO /* LOGICO = CHAR(1) */,
    QTDEDIASCARENCIA               INTEGER,
    HABILITARREDUCAODESCONTO       LOGICO /* LOGICO = CHAR(1) */,
    PRCREDUCAODESCONTO             NUMERIC(18,8),
    QTDEDIASREDUCAODESCONTO        INTEGER,
    RCBTOTAXACARTEIRACONTA_ID      INTEGER,
    PGTOTAXACARTEIRACONTA_ID       INTEGER,
    RCBTOTAXACARTEIRAHISTORICO_ID  INTEGER,
    PGTOTAXACARTEIRAHISTORICO_ID   INTEGER,
    RCBTOCTACORRENTEHISTORICO_ID   INTEGER,
    RCBTOBAIXACHQHISTORICO_ID      INTEGER,
    CHQPGTOTERCEIROSHISTORICO_ID   INTEGER,
    CHQPGTOTERCEIROSCONTA_ID       INTEGER,
    CALCULARBAIXAMULTIPLA          LOGICO /* LOGICO = CHAR(1) */,
    NTZCOMPRAID                    VARCHAR(10),
    VALIDARCONTA5GRAU              LOGICO /* LOGICO = CHAR(1) */
);



/******************************************************************************/
/****                             Primary keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020187 ADD CONSTRAINT PK_PRJ020187 PRIMARY KEY (PESSOA_ID);


/******************************************************************************/
/****                             Foreign keys                             ****/
/******************************************************************************/

ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ020001_PRJ020187 FOREIGN KEY (PESSOA_ID) REFERENCES PRJ020001 (PESSOA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PR187_CRDCLI_CTA FOREIGN KEY (CRDCLIENTECONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PRJ187_CHQPGTOTERCEIR FOREIGN KEY (CHQPGTOTERCEIROSCONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PRJ187_CRDFRN_CTA FOREIGN KEY (CRDFORNECEDORCONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PRJ187_DESCCONCEDIDO FOREIGN KEY (DESCCONCEDIDOCONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PRJ187_DESCRECEBIDO FOREIGN KEY (DESCRECEBIDOCONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PRJ187_PGTOJUROS FOREIGN KEY (PGTOJUROSCONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PRJ187_PGTOMULTA FOREIGN KEY (PGTOMULTACONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PRJ187_PGTOTAXACARTEI FOREIGN KEY (PGTOTAXACARTEIRACONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PRJ187_RCBTOJUROS FOREIGN KEY (RCBTOJUROSCONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PRJ187_RCBTOMULTA FOREIGN KEY (RCBTOMULTACONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ057_PRJ187_RCBTOTAXACART FOREIGN KEY (RCBTOTAXACARTEIRACONTA_ID) REFERENCES PRJ020057 (CONTA_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_CHQDEPOSITO FOREIGN KEY (CHQDEPOSITOHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_CHQPGTOTERCEIR FOREIGN KEY (CHQPGTOTERCEIROSHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_CRDCLI_HST FOREIGN KEY (CRDCLIENTEHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_CRDFRN_HST FOREIGN KEY (CRDFORNECEDORHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_DESCCONCEDIDO FOREIGN KEY (DESCCONCEDIDOHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_DESCRECEBIDO FOREIGN KEY (DESCRECEBIDOHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_DEVCHEQUE FOREIGN KEY (DEVCHEQUEHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_INTEGRARFINANC FOREIGN KEY (INTEGRARFINANCHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_PGTOJUROS FOREIGN KEY (PGTOJUROSHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_PGTOMULTA FOREIGN KEY (PGTOMULTAHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_PGTOTAXACARTEI FOREIGN KEY (PGTOTAXACARTEIRAHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_RCBTOBAIXA FOREIGN KEY (RCBTOBAIXAHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_RCBTOBAIXACHQ FOREIGN KEY (RCBTOBAIXACHQHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_RCBTOCTACORREN FOREIGN KEY (RCBTOCTACORRENTEHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_RCBTOJUROS FOREIGN KEY (RCBTOJUROSHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_RCBTOMULTA FOREIGN KEY (RCBTOMULTAHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_RCBTOTAXACARTE FOREIGN KEY (RCBTOTAXACARTEIRAHISTORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID)
  USING INDEX FK_PRJ057_PRJ187_RCBTOTAXACARTE;
ALTER TABLE PRJ020187 ADD CONSTRAINT FK_PRJ058_PRJ187_SUBSTCHEQUE FOREIGN KEY (SUBSTCHEQUEHITORICO_ID) REFERENCES PRJ020058 (HISTORICO_ID);
