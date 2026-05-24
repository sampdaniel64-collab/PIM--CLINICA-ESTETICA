# Documentação Completa — Projeto Dra. Nicolle Carvalho

## 1. Visão Geral
Este projeto é um backend em ASP.NET Core Minimal API desenvolvido como base para uma clínica de estética fictícia chamada **Dra. Nicolle Carvalho**. O sistema permite gerenciar:
- clientes;
- profissionais;
- procedimentos estéticos;
- agendamentos;
- painel administrativo com indicadores.

O backend usa PostgreSQL para persistência e Entity Framework Core para modelagem de dados. A aplicação também expõe endpoints consumíveis por um front-end ou ferramentas como Postman.

## 2. Tecnologias utilizadas
- **C# 12 / .NET 10**
- **ASP.NET Core Minimal API**
- **Entity Framework Core** com provider **Npgsql**
- **PostgreSQL** como banco de dados relacional
- **DBeaver** para visualização e inspeção do banco
- **Postman** para testes de API
- **OpenAPI** para documentação de desenvolvimento em ambiente de desenvolvimento

## 3. Estrutura do projeto
```
projeto x/
  Program.cs
  appsettings.json
  appsettings.Development.json
  projeto x.csproj
  data/
    AppDbContext.cs
  Endpoints/
    ClinicaEndpoints.cs
  Models/
    Cliente.cs
    Profissional.cs
    Procedimento.cs
    Agendamento.cs
  Migrations/
    ...
  Properties/
    launchSettings.json
  Documentacao_Projeto_Essenza_Clinic.txt
  DOCUMENTACAO_COMPLETA.md
```

### Principais arquivos
- `Program.cs` — configura serviços, CORS, OpenAPI e registra as rotas da API.
- `appsettings.json` — contém a connection string e configurações de logging.
- `data/AppDbContext.cs` — define o contexto do EF Core, mapas das entidades e dados iniciais (seed).
- `Endpoints/ClinicaEndpoints.cs` — define todos os endpoints REST da API.
- `Models/*.cs` — classes de domínio que representam as tabelas do banco.
- `Migrations/` — arquivos de migração gerados pelo EF Core para criar e atualizar o esquema do banco.
- `Properties/launchSettings.json` — configurações de execução local, URLs e ambiente.

## 4. Configuração do ambiente
### 4.1 Requisitos
- .NET 10 SDK
- PostgreSQL
- DBeaver (opcional)
- Postman (opcional)

### 4.2 Connection string
Em `appsettings.json`, a conexão com PostgreSQL está configurada assim:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=clinica_estetica;Username=postgres;Password=Nicollee1"
}
```

> Se você não quiser manter a senha no arquivo, use `appsettings.Development.json` ou variáveis de ambiente.

### 4.3 URLs de execução local
Em `Properties/launchSettings.json`, o projeto pode ser executado localmente nas URLs:
- `http://localhost:5063`
- `https://localhost:7141`

## 5. Modelagem de dados
### 5.1 Entidades
#### Cliente
- `Id` (int)
- `Nome` (string, requerido, max 120)
- `Telefone` (string, requerido, max 20)
- `Email` (string, requerido, max 120)
- `DataNascimento` (DateOnly)
- `Observacoes` (string, opcional, max 500)
- Relacionamento: `Agendamentos`

#### Profissional
- `Id` (int)
- `Nome` (string, requerido, max 120)
- `Especialidade` (string, requerido, max 100)
- `Telefone` (string, requerido, max 20)
- `Ativo` (bool)
- Relacionamento: `Agendamentos`

#### Procedimento
- `Id` (int)
- `Nome` (string, requerido, max 120)
- `Descricao` (string, requerido, max 500)
- `Preco` (decimal(10,2))
- `DuracaoMinutos` (int)
- `Ativo` (bool)
- Relacionamento: `Agendamentos`

#### Agendamento
- `Id` (int)
- `DataHora` (DateTime)
- `Status` (string, requerido, max 30)
- `Observacoes` (string, opcional, max 500)
- `ClienteId` (int)
- `Cliente` (navegação)
- `ProfissionalId` (int)
- `Profissional` (navegação)
- `ProcedimentoId` (int)
- `Procedimento` (navegação)

### 5.2 Configuração no `AppDbContext`
Em `data/AppDbContext.cs`, o método `OnModelCreating` aplica regras e configurações:
- campos obrigatórios e tamanho máximo;
- precisão do preço (`decimal(10,2)`);
- `DataHora` é mapeado como `timestamp without time zone` para evitar conversão automática de fuso horário no PostgreSQL;
- dados iniciais (`HasData`) para profissionais e procedimentos.

### 5.3 Dados iniciais (seed)
O projeto inclui os seguintes dados de inicialização:
- Profissionais:
  - Dra. Ana Beatriz — Estetica facial
  - Dr. Carlos Mendes — Biomedicina estetica
  - Dra. Fernanda Lima — Fisioterapia dermato-funcional
- Procedimentos:
  - Limpeza de Pele
  - Toxina Botulinica (Botox)
  - Drenagem Linfatica
  - Harmonizacao Facial

## 6. Banco de dados e migrações
### 6.1 Tabelas geradas
- `Clientes`
- `Profissionais`
- `Procedimentos`
- `Agendamentos`
- `__EFMigrationsHistory`

### 6.2 Comandos comuns
- Restaurar tools locais:
  ```powershell
dotnet tool restore
```
- Aplicar migrações e criar o banco:
  ```powershell
dotnet ef database update
```
- Adicionar uma nova migração:
  ```powershell
dotnet ef migrations add NomeDaMigracao
```
- Remover a última migração (antes de aplicar):
  ```powershell
dotnet ef migrations remove
```

## 7. Rotas e endpoints detalhados
### 7.1 Endpoint de status
- `GET /`
- Retorna: `API da Clinica de Estetica em funcionamento.`

### 7.2 Clientes
#### Lista todos os clientes
- `GET /clientes`
- Retorna JSON com todos os clientes ordenados por nome.

#### Buscar cliente por ID
- `GET /clientes/{id}`
- Parâmetro: `id` (int)
- Retorno: cliente ou `404 NotFound`.

#### Buscar cliente por email com agendamentos
- `GET /clientes/buscar?email=...`
- Parâmetro: `email` (string)
- Retorna: cliente com agendamentos, profissional e procedimento relacionados.
- Resposta se não encontrado: `404 NotFound`.

#### Criar cliente
- `POST /clientes`
- Body JSON:
  ```json
  {
    "nome": "Maria Silva",
    "telefone": "(62) 99999-2222",
    "email": "maria@email.com",
    "dataNascimento": "1995-04-12",
    "observacoes": "Cliente interessada em limpeza de pele."
  }
  ```
- Retorna: `201 Created` com o cliente criado.

#### Atualizar cliente
- `PUT /clientes/{id}`
- Body JSON semelhante ao do `POST`.
- Retorna: `200 OK` com cliente atualizado ou `404 NotFound`.

#### Excluir cliente
- `DELETE /clientes/{id}`
- Retorna: `204 NoContent` ou `404 NotFound`.

### 7.3 Procedimentos
#### Lista procedimentos
- `GET /procedimentos`
- Retorna JSON de todos os procedimentos ativos ordenados por nome.

#### Criar procedimento
- `POST /procedimentos`
- Body JSON com os campos do procedimento.
- Retorna: `201 Created`.

### 7.4 Profissionais
#### Lista profissionais
- `GET /profissionais`
- Retorna JSON de todos os profissionais ativos ordenados por nome.

#### Criar profissional
- `POST /profissionais`
- Body JSON com os campos do profissional.
- Retorna: `201 Created`.

### 7.5 Agendamentos
#### Lista agendamentos
- `GET /agendamentos`
- Retorna JSON com agendamentos incluindo cliente, profissional e procedimento.

#### Criar agendamento
- `POST /agendamentos`
- Body JSON:
  ```json
  {
    "dataHora": "2026-07-15T14:00:00",
    "status": "Agendado",
    "observacoes": "Primeira consulta da cliente.",
    "clienteId": 1,
    "profissionalId": 1,
    "procedimentoId": 1
  }
  ```
- Retorna: `201 Created` com o agendamento criado.

### 7.6 Indicadores para painel administrativo
- `GET /indicadores`
- Retorna um objeto JSON contendo:
  - `TotalClientes`
  - `TotalAgendamentos`
  - `TotalProcedimentos`
  - `TotalProfissionais`
  - `ProcedimentoMaisProcurado`
  - `ProximosAgendamentos`

### 7.7 Observações de implementação
- As relações de navegação são carregadas usando `.Include(...)` em `GET /agendamentos` e `GET /clientes/buscar`.
- O endpoint de indicadores agrupa agendamentos por procedimento e ordena para identificar o mais procurado.

## 8. Execução e teste
### 8.1 Passos para rodar
1. Abra PowerShell na pasta do projeto: `cd "C:\Users\phabl\OneDrive\Desktop\projeto x"`
2. Instale/restaure ferramentas locais e pacotes:
   ```powershell
dotnet tool restore
dotnet restore
```
3. Atualize o banco de dados:
   ```powershell
dotnet ef database update
```
4. Inicie a API:
   ```powershell
dotnet run
```
5. Verifique o output para as URLs de escuta, por exemplo `http://localhost:5063`.

### 8.2 Testes rápidos
- No navegador: `http://localhost:5063/` deve mostrar mensagem de status.
- `http://localhost:5063/procedimentos` deve retornar lista de procedimentos.
- `http://localhost:5063/profissionais` deve retornar lista de profissionais.
- `http://localhost:5063/clientes` deve retornar lista de clientes.
- `http://localhost:5063/agendamentos` deve retornar lista de agendamentos.
- `http://localhost:5063/indicadores` deve retornar o painel de indicadores.

### 8.3 Teste de cliente por email
- `GET /clientes/buscar?email=maria@email.com`
- Retorna cliente com seus agendamentos.

## 9. Infraestrutura de front-end (breve)
O projeto principal é o backend. Ainda assim, a documentação antiga e os arquivos de front-end demonstram como a API foi consumida em páginas estáticas.

### Páginas front-end mencionadas
- `index.html` — formulário de pré-reserva e seção de resultados.
- `area-cliente.html` — área de consulta de agendamentos por e-mail.
- `admin.html` — painel administrativo com indicadores.

### Integração
- O front-end faz requisições `GET` e `POST` para a API em `localhost:5063`.
- O endpoint `/indicadores` alimenta o painel administrativo.

## 10. Problemas conhecidos e correções aplicadas
- **Banco não aparecia no DBeaver**: era necessário criar/conectar ao banco `clinica_estetica` com o servidor `localhost` e porta `5432`.
- **`dotnet-ef` não instalado**: criar tool manifest e instalar `dotnet-ef` localmente.
- **Erro ao salvar data do agendamento**: a coluna `DataHora` estava com fuso horário e foi ajustada para `timestamp without time zone`.
- **Build bloqueado**: o processo da API estava rodando e segurava o arquivo executável; foi necessário parar o processo antes de recompilar.

## 11. Melhorias sugeridas
- Autenticação e autorização JWT para área administrativa e cliente.
- Validação de modelo mais rigorosa e tratamento de erros centralizado.
- Paginação e filtros nas listagens de clientes, agendamentos e profissionais.
- Testes automatizados (unitários e de integração).
- Dashboard administrativo mais completo e exportação de relatórios.
- Suporte a upload de imagens e histórico de antes/depois.

## 12. Como reverter alterações
Este arquivo de documentação não altera o código.
Se precisar restaurar códigos anteriores do projeto, use backups ou controle de versão Git.

## 13. Conclusão
Esta documentação cobre:
- arquitetura do backend;
- modelo de dados;
- configurações de banco;
- endpoints com exemplos;
- como rodar, testar e evoluir o projeto.

---

> O arquivo completo está salvo em `DOCUMENTACAO_COMPLETA.md`.
