# Documenta??o Completa do Projeto Essenza Clinic

## Vis?o geral
O Essenza Clinic ? um sistema web integrado para uma cl?nica de est?tica fict?cia. Ele possui front-end em HTML/CSS/JavaScript, backend em ASP.NET Core Minimal API com C#, PostgreSQL com Entity Framework Core, ?rea do cliente, login com senha, login administrativo e painel com indicadores.

## Pastas do projeto
- Backend: `C:\Users\phabl\OneDrive\Desktop\projeto x`
- Front-end: `C:\Users\phabl\OneDrive\pessoal\Site PIM (1)\Site PIM\Site`

## Como rodar
```powershell
cd "C:\Users\phabl\OneDrive\Desktop\projeto x"
dotnet run
```
Mantenha o terminal aberto. A API roda em `http://localhost:5063`.

## Fluxo principal
1. Cliente abre `index.html`.
2. Preenche pr?-reserva com nome, WhatsApp, e-mail, senha, procedimento, profissional, data e hora.
3. Front chama `POST /clientes`.
4. Backend salva cliente com `SenhaHash`.
5. Front chama `POST /agendamentos`.
6. Backend salva agendamento no PostgreSQL.
7. Cliente entra em `area-cliente.html` com e-mail e senha.
8. Backend valida em `POST /auth/login`.
9. Se for cliente, mostra os agendamentos.
10. Se for administrador, redireciona para `admin.html`.

## Login administrativo
- E-mail: `admin@essenza.com`
- Senha: `Admin123`

## Principais p?ginas
- `index.html`: p?gina inicial e pr?-reserva.
- `area-cliente.html`: login ?nico de cliente/admin.
- `admin.html`: painel administrativo.
- `servicos.html`: servi?os.
- `sobre.html`: institucional.
- `contato.html`: contato.

## Principais scripts
- `js/agendamento.js`: cadastra cliente e agendamento.
- `js/area-cliente.js`: realiza login e decide cliente/admin.
- `js/admin.js`: carrega indicadores e tabelas administrativas.

## Backend
- `Program.cs`: configura API, CORS e banco.
- `Endpoints/ClinicaEndpoints.cs`: rotas da API.
- `data/AppDbContext.cs`: configura??o do EF Core.
- `Models`: classes de dom?nio.
- `Migrations`: hist?rico do banco.

## Banco de dados
Banco: `clinica_estetica`

Tabelas:
- `Clientes`
- `Profissionais`
- `Procedimentos`
- `Agendamentos`
- `__EFMigrationsHistory`

## Rotas principais
- `GET /procedimentos`
- `GET /profissionais`
- `GET /clientes`
- `POST /clientes`
- `POST /auth/login`
- `GET /agendamentos`
- `POST /agendamentos`
- `GET /indicadores`

## Testes r?pidos
1. API: abrir `http://localhost:5063/procedimentos`.
2. Pr?-reserva: abrir `index.html`, cadastrar cliente e agendamento.
3. Cliente: abrir `area-cliente.html`, entrar com e-mail/senha da pr?-reserva.
4. Admin: abrir `area-cliente.html`, entrar com `admin@essenza.com` / `Admin123`.
5. Banco: conferir no DBeaver as tabelas `Clientes` e `Agendamentos`.

## Problemas comuns
- Se o site n?o salva: verifique se `dotnet run` est? ligado.
- Se aparecer `ECONNREFUSED`: a API est? desligada.
- Se o build falhar por arquivo em uso: pare a API com `Ctrl+C`.
- Se cliente antigo n?o entra: ele foi criado antes da senha; fa?a nova pr?-reserva.
