# Manual do Sistema - Essenza Clinic

## 1. Visão Geral
O projeto "Essenza Clinic" é uma API backend em ASP.NET Core Minimal API que atende uma clínica de estética. O sistema gerencia clientes, profissionais, procedimentos e agendamentos, com autenticação básica e dashboards de indicadores.

## 2. Arquitetura
- Backend: ASP.NET Core 10.0 (Minimal API)
- Banco de dados: PostgreSQL via Entity Framework Core
- Camada de dados: `data/AppDbContext.cs`
- Rotas: `Endpoints/ClinicaEndpoints.cs`
- Modelos: `Models/Cliente.cs`, `Models/Profissional.cs`, `Models/Procedimento.cs`, `Models/Agendamento.cs`

## 3. Requisitos
- .NET 10 SDK instalado
- PostgreSQL configurado e disponível
- Conexão definida em `appsettings.json` / `appsettings.Development.json`

## 4. Configuração e execução
1. Abra o terminal na pasta do projeto:
   ```powershell
   cd "c:\Users\sampa\Downloads\pim\projeto x"
   ```
2. Execute a aplicação:
   ```powershell
   dotnet run
   ```
3. Se estiver em ambiente de desenvolvimento, a API expõe a documentação OpenAPI/Swagger automaticamente.

## 5. Comportamento do backend
### 5.1 Configuração
- `Program.cs` registra CORS com política `FrontEndPolicy` permitindo qualquer origem, cabeçalho e método.
- `Program.cs` registra o contexto de dados `AppDbContext` usando `UseNpgsql`.
- A aplicação mapeia rotas definidas em `MapClinicaEndpoints()`.

### 5.2 Dados inicializados
`AppDbContext.OnModelCreating()` adiciona dados iniciais:
- Profissionais:
  - Dra. Ana Beatriz — Estética facial
  - Dr. Carlos Mendes — Biomedicina estética
  - Dra. Fernanda Lima — Fisioterapia dermato-funcional
- Procedimentos:
  - Limpeza de Pele
  - Toxina Botulínica (Botox)
  - Drenagem Linfática
  - Harmonização Facial

## 6. Endpoints da API
### 6.1 Raiz
- `GET /`
  - Retorna: `API da Clinica de Estetica em funcionamento.`

### 6.2 Clientes
- `GET /clientes`
  - Retorna lista de clientes ordenada por nome.

- `GET /clientes/buscar?email={email}`
  - Busca cliente por e-mail.
  - Retorna cliente com agendamentos, incluindo profissional e procedimento.

- `GET /clientes/{id}`
  - Busca cliente por ID.

- `POST /clientes`
  - Cria cliente.
  - Corpo esperado:
    ```json
    {
      "nome": "Nome Cliente",
      "telefone": "(62) 99999-9999",
      "email": "cliente@exemplo.com",
      "senha": "senha123",
      "dataNascimento": "1990-01-01",
      "observacoes": "Observações opcionais"
    }
    ```
  - Regras:
    - Senha mínima de 4 caracteres
    - A senha é armazenada como hash SHA-256

- `PUT /clientes/{id}`
  - Atualiza cliente existente.
  - Corpo esperado: objeto `Cliente` completo.
  - A senha só é atualizada se `SenhaHash` estiver preenchido.

- `DELETE /clientes/{id}`
  - Remove cliente por ID.

### 6.3 Autenticação
- `POST /auth/login`
  - Realiza login para cliente ou administrador.
  - Corpo esperado:
    ```json
    {
      "email": "usuario@exemplo.com",
      "senha": "senha123"
    }
    ```
  - Retorna dados do cliente com agendamentos, ou `admin` se for usuário administrativo.

- `POST /clientes/login`
  - Realiza login apenas para clientes.
  - Corpo igual a `/auth/login`.
  - Retorna dados do cliente com seus agendamentos.

#### Login administrativo
- E-mail: `admin@essenza.com`
- Senha: `Admin123`

### 6.4 Procedimentos
- `GET /procedimentos`
  - Retorna lista de procedimentos ativos ordenados por nome.

- `POST /procedimentos`
  - Cria um procedimento.
  - Corpo esperado: objeto `Procedimento`.

### 6.5 Profissionais
- `GET /profissionais`
  - Retorna lista de profissionais ativos ordenados por nome.

- `POST /profissionais`
  - Cria um profissional.
  - Corpo esperado: objeto `Profissional`.

### 6.6 Agendamentos
- `GET /agendamentos`
  - Retorna lista de agendamentos com cliente, profissional e procedimento.

- `POST /agendamentos`
  - Cria um agendamento.
  - Corpo esperado: objeto `Agendamento`.

### 6.7 Indicadores
- `GET /indicadores`
  - Retorna dados agregados:
    - Total de clientes
    - Total de agendamentos
    - Total de procedimentos ativos
    - Total de profissionais ativos
    - Procedimento mais procurado
    - Próximos 5 agendamentos

## 7. Modelos de dados
### 7.1 Cliente
- `Id` (int)
- `Nome` (string)
- `Telefone` (string)
- `Email` (string)
- `SenhaHash` (string)
- `DataNascimento` (DateOnly)
- `Observacoes` (string?)
- `Agendamentos` (lista)

### 7.2 Profissional
- `Id` (int)
- `Nome` (string)
- `Especialidade` (string)
- `Telefone` (string)
- `Ativo` (bool)
- `Agendamentos` (lista)

### 7.3 Procedimento
- `Id` (int)
- `Nome` (string)
- `Descricao` (string)
- `Preco` (decimal)
- `DuracaoMinutos` (int)
- `Ativo` (bool)
- `Agendamentos` (lista)

### 7.4 Agendamento
- `Id` (int)
- `DataHora` (DateTime)
- `Status` (string)
- `Observacoes` (string?)
- `ClienteId` (int)
- `ProfissionalId` (int)
- `ProcedimentoId` (int)

## 8. Banco de dados
Tabelas principais:
- `Clientes`
- `Profissionais`
- `Procedimentos`
- `Agendamentos`
- `__EFMigrationsHistory`

## 9. Fluxo de uso
1. Registrar cliente via `POST /clientes`.
2. Criar agendamento via `POST /agendamentos`.
3. Autenticar cliente via `POST /clientes/login` ou `/auth/login`.
4. Consultar dados de cliente com seus agendamentos.
5. Consultar painel com `GET /indicadores`.

## 10. Observações importantes
- A API usa HTTPS redirection, portanto o front-end deve consumir via HTTPS em produção.
- O hash de senha usa SHA-256. Não há salt configurado no código atual.
- A rota `/clientes/buscar` utiliza o e-mail para buscar cliente e seus agendamentos.

## 11. Como testar rapidamente
- `GET /procedimentos`
- `GET /profissionais`
- `POST /clientes` para criar cliente
- `POST /auth/login` para efetuar login
- `POST /agendamentos` para agendar
- `GET /indicadores` para painel de métricas

---
Manual criado com base no código e nas rotas atuais do projeto Essenza Clinic.