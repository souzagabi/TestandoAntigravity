# Servidor de Relatórios - Documentação Técnica

## Visão Geral

Este documento descreve a arquitetura e implementação do servidor de relatórios baseado em Lazarus/FPC, Horse e FastReport para integração com a aplicação web.

## Arquitetura

```
Frontend (React) 
   ↓↑ 
Backend Node.js (API Principal)
   ↓↑ 
Servidor de Relatórios (Lazarus/FPC + Horse + FastReport)
   ↓
Banco de Dados
```

## Requisitos Técnicos

- **Lazarus 2.2.6** ou superior
- **Free Pascal 3.2.2** ou superior
- **Horse** (framework web para FPC)
- **FastReport** (versão compatível com FPC)
- **ZeosLib** (para conexão com banco de dados)

## Estrutura de Pastas

```
servidor-relatorios/
├── relatorios/          # Arquivos .fr3 dos relatórios
├── src/
│   ├── ServerModule.pas  # Configuração do servidor Horse
│   ├── Controllers/      # Controladores para cada tipo de relatório
│   └── Services/         # Lógica de negócios
├── lib/                  # Dependências
└── servidor_relatorios.lpr  # Ponto de entrada
```

## Configuração do Projeto

1. **Dependências do Projeto**
   - Horse
   - Horse.Jhonson (para JSON)
   - Horse.CORS
   - FastReport
   - Zeos (ou outro conector de banco de dados)

2. **Arquivo de Configuração (ServerModule.pas)**

```pascal
unit ServerModule;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Horse, Horse.Jhonson, Horse.CORS, fpjson, jsonparser;

procedure StartServer(APort: Integer);
procedure StopServer;

implementation

procedure StartServer(APort: Integer);
begin
  // Configurar middlewares
  THorse.Use(Jhonson);
  THorse.Use(CORS);
  
  // Rotas de exemplo
  THorse.Get('/ping',
    procedure(Req: THorseRequest; Res: THorseResponse; Next: TNextProc)
    begin
      Res.Send('pong');
    end);
  
  // Iniciar servidor
  THorse.Listen(APort);
  WriteLn(Format('Servidor rodando na porta %d', [APort]));
end;

procedure StopServer;
begin
  THorse.StopListen;
end;

end.
```

## Implementação de um Relatório

1. **Criar Controlador**

```pascal
unit Controllers.RelatorioContabil;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Horse, fpjson, jsonparser, frxClass, frxDBSet, ZConnection, DB;

procedure Registry;
procedure GetRelatorio(Req: THorseRequest; Res: THorseResponse);

implementation

procedure Registry;
begin
  THorse.Get('/relatorios/contabil/:nome', @GetRelatorio);
end;

procedure GetRelatorio(Req: THorseRequest; Res: THorseResponse);
var
  LReport: TfrxReport;
  LStream: TMemoryStream;
  LParams: TJSONObject;
  LQuery: TZQuery;
  LConnection: TZConnection;
begin
  LReport := TfrxReport.Create(nil);
  LStream := TMemoryStream.Create;
  LQuery := TZQuery.Create(nil);
  LConnection := TZConnection.Create(nil);
  
  try
    // Configurar conexão com o banco de dados
    LConnection.Protocol := 'postgresql';
    LConnection.HostName := 'localhost';
    LConnection.Database := 'seu_banco';
    LConnection.User := 'usuario';
    LConnection.Password := 'senha';
    LConnection.Connect;
    
    LQuery.Connection := LConnection;
    
    // Carregar relatório
    LReport.LoadFromFile(ExtractFilePath(ParamStr(0)) + 
      'relatorios/' + Req.Params['nome'] + '.fr3');
    
    // Processar parâmetros
    if Req.Query.ContentType = 'application/json' then
    begin
      LParams := GetJSON(Req.Body) as TJSONObject;
      try
        // Configurar parâmetros do relatório
        LReport.Variables['param1'] := LParams.Get('param1');
        // Adicionar mais parâmetros conforme necessário
      finally
        LParams.Free;
      end;
    end;
    
    // Preparar relatório
    LReport.PrepareReport;
    
    // Exportar para PDF
    LReport.Export(TfrxPDFExport, LStream);
    LStream.Position := 0;
    
    // Enviar resposta
    Res.ContentType('application/pdf');
    Res.Send(LStream);
    
  finally
    LReport.Free;
    LStream.Free;
    LQuery.Free;
    LConnection.Free;
  end;
end;

end.
```

## Integração com o Backend Node.js

```typescript
// services/relatorioService.ts
import axios from 'axios';

const RELATORIOS_API = 'http://localhost:9001';

export const gerarRelatorio = async (nomeRelatorio: string, parametros: any) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${RELATORIOS_API}/relatorios/contabil/${nomeRelatorio}`,
      params: parametros,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf'
      }
    });

    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  }
};

// Exemplo de uso em um controller
/*
const pdfBuffer = await gerarRelatorio('balancete', {
  dataInicio: '2023-01-01',
  dataFim: '2023-12-31',
  empresaId: 1
});
*/
```

## Segurança

1. **Autenticação**
   - Implementar autenticação JWT
   - Validar tokens nas requisições
   - Restringir acesso por IP

2. **Validação**
   - Validar todos os parâmetros de entrada
   - Sanitizar strings para evitar injeção SQL
   - Limitar o tamanho dos parâmetros

## Implantação

1. **Ambiente de Desenvolvimento**
   - Rodar diretamente do Lazarus
   - Configurar para reiniciar em caso de falha

2. **Produção**
   - Compilar para Windows Service
   - Usar Nginx como proxy reverso
   - Configurar logrotate para os logs

## Monitoramento

1. **Logs**
   - Registrar todas as requisições
   - Monitorar erros e exceções
   - Manter histórico de execução

2. **Métricas**
   - Tempo de resposta
   - Uso de memória
   - Número de requisições simultâneas

## Manutenção

1. **Atualizações**
   - Manter o FastReport atualizado
   - Aplicar patches de segurança
   - Fazer backup dos relatórios

2. **Backup**
   - Backup diário dos arquivos .fr3
   - Backup da estrutura do banco de dados
   - Plano de recuperação de desastres

## Próximos Passos

1. Configurar ambiente de desenvolvimento
2. Criar repositório para os relatórios
3. Implementar autenticação
4. Desenvolver relatórios de teste
5. Configurar pipeline de CI/CD

## Suporte

Em caso de problemas, entre em contato com a equipe de desenvolvimento fornecendo:
- Nome do relatório
- Parâmetros utilizados
- Mensagem de erro
- Logs do servidor

---
*Última atualização: 23/05/2025*
