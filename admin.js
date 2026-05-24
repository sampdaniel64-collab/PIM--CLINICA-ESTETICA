const API_URL = 'http://localhost:5063';

if (sessionStorage.getItem('essenzaAdmin') !== 'true') {
    window.location.href = 'area-cliente.html';
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

function setText(id, value) {
    document.querySelector(`#${id}`).textContent = value;
}

function renderRows(tbodyId, rows, emptyMessage) {
    const tbody = document.querySelector(`#${tbodyId}`);
    tbody.innerHTML = '';

    if (!rows.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.textContent = emptyMessage;
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    rows.forEach((columns) => {
        const row = document.createElement('tr');

        columns.forEach((value) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

async function loadIndicadores() {
    const response = await fetch(`${API_URL}/indicadores`);

    if (!response.ok) {
        throw new Error('Não foi possível carregar os indicadores.');
    }

    const data = await response.json();

    setText('total-clientes', data.totalClientes);
    setText('total-agendamentos', data.totalAgendamentos);
    setText('total-procedimentos', data.totalProcedimentos);
    setText('total-profissionais', data.totalProfissionais);

    const maisProcurado = data.procedimentoMaisProcurado;
    const destaque = maisProcurado
        ? `Procedimento mais procurado: ${maisProcurado.nome} (${maisProcurado.total} agendamento(s))`
        : 'Procedimento mais procurado: ainda não há agendamentos.';

    document.querySelector('#procedimento-mais-procurado').textContent = destaque;

    renderRows(
        'tabela-proximos',
        (data.proximosAgendamentos ?? []).map((item) => [
            formatDateTime(item.dataHora),
            item.cliente,
            item.procedimento,
            item.profissional,
            item.status
        ]),
        'Nenhum agendamento futuro encontrado.'
    );
}

async function loadClientes() {
    const response = await fetch(`${API_URL}/clientes`);

    if (!response.ok) {
        throw new Error('Não foi possível carregar os clientes.');
    }

    const clientes = await response.json();

    renderRows(
        'tabela-clientes',
        clientes.map((cliente) => [
            cliente.nome,
            cliente.email,
            cliente.telefone
        ]),
        'Nenhum cliente cadastrado.'
    );
}

async function initAdmin() {
    try {
        await Promise.all([loadIndicadores(), loadClientes()]);
    } catch (error) {
        document.querySelector('#procedimento-mais-procurado').textContent = error.message;
    }
}

initAdmin();
