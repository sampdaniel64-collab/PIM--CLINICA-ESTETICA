const API_URL = 'http://localhost:5063';

const form = document.querySelector('#form-agendamento');
const statusMessage = document.querySelector('#agendamento-status');

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `form-status ${type}`;
}

async function createCliente() {
    const response = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: document.querySelector('#cliente-nome').value,
            telefone: document.querySelector('#cliente-telefone').value,
            email: document.querySelector('#cliente-email').value,
            senha: document.querySelector('#cliente-senha').value,
            dataNascimento: '2000-01-01',
            observacoes: 'Cliente cadastrado pelo formulario do site.'
        })
    });

    if (!response.ok) {
        throw new Error('Nao foi possivel cadastrar o cliente.');
    }

    return response.json();
}

async function createAgendamento(clienteId) {
    const data = document.querySelector('#agendamento-data').value;
    const hora = document.querySelector('#agendamento-hora').value;

    const response = await fetch(`${API_URL}/agendamentos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dataHora: `${data}T${hora}:00`,
            status: 'Agendado',
            observacoes: 'Pre-reserva solicitada pelo site.',
            clienteId,
            profissionalId: Number(document.querySelector('#profissional-id').value),
            procedimentoId: Number(document.querySelector('#procedimento-id').value)
        })
    });

    if (!response.ok) {
        throw new Error('Nao foi possivel criar o agendamento.');
    }

    return response.json();
}

form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Enviando...';
    showStatus('Enviando sua reserva...', '');

    try {
        const cliente = await createCliente();
        await createAgendamento(cliente.id);

        form.reset();
        showStatus('Reserva solicitada com sucesso!', 'sucesso');
    } catch (error) {
        showStatus(error.message, 'erro');
    } finally {
        button.disabled = false;
        button.textContent = 'Solicitar reserva';
    }
});
