const API_URL = 'http://localhost:5063';

const loginForm = document.querySelector('#form-login-cliente');
const loginBox = document.querySelector('.login-box');
const painelCliente = document.querySelector('.painel-cliente');
const loginStatus = document.querySelector('#login-status');
const saudacao = document.querySelector('#cliente-saudacao');
const listaAgendamentos = document.querySelector('#lista-agendamentos');

function showLoginStatus(message, type) {
    loginStatus.textContent = message;
    loginStatus.className = `form-status ${type}`;
}

function formatDateTime(value) {
    const date = new Date(value);

    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderAgendamentos(agendamentos) {
    listaAgendamentos.innerHTML = '';

    if (!agendamentos.length) {
        const item = document.createElement('li');
        item.textContent = 'Nenhum agendamento encontrado.';
        listaAgendamentos.appendChild(item);
        return;
    }

    agendamentos.forEach((agendamento) => {
        const item = document.createElement('li');
        const procedimento = agendamento.procedimento?.nome ?? 'Procedimento';
        const profissional = agendamento.profissional?.nome ?? 'Profissional';
        const status = agendamento.status ?? 'Agendado';

        item.textContent = `${procedimento} - ${formatDateTime(agendamento.dataHora)} - ${profissional} - ${status}`;
        listaAgendamentos.appendChild(item);
    });
}

loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#login-email').value;
    const senha = document.querySelector('#login-senha').value;
    const button = loginForm.querySelector('button[type="submit"]');

    button.disabled = true;
    button.textContent = 'Entrando...';
    showLoginStatus('Buscando seus dados...', '');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                senha
            })
        });

        if (response.status === 401) {
            throw new Error('E-mail ou senha incorretos.');
        }

        if (!response.ok) {
            throw new Error('Não foi possível carregar a área do cliente.');
        }

        const usuario = await response.json();

        if (usuario.tipo === 'admin') {
            sessionStorage.setItem('essenzaAdmin', 'true');
            sessionStorage.setItem('essenzaAdminNome', usuario.nome);
            window.location.href = 'admin.html';
            return;
        }

        saudacao.textContent = `Olá, ${usuario.nome}`;
        renderAgendamentos(usuario.agendamentos ?? []);

        loginBox.style.display = 'none';
        painelCliente.style.display = 'block';
    } catch (error) {
        showLoginStatus(error.message, 'erro');
    } finally {
        button.disabled = false;
        button.textContent = 'Entrar';
    }
});
