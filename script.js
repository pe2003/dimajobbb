let users = [];
let votes = [];

function register() {
    const role = document.getElementById('role').value;
    const surname = document.getElementById('surname').value;
    const name = document.getElementById('name').value;
    const id = Date.now(); // Простой способ генерации уникального ID

    if (!role || !surname || !name) {
        alert('Заполните все поля!');
        return;
    }

    // Проверка на дубликат
    if (users.some(user => user.surname === surname && user.name === name)) {
        alert('Пользователь уже зарегистрирован!');
        return;
    }

    const user = { id, role, surname, name, hasVoted: false };
    users.push(user);

    document.getElementById('registration').style.display = 'none';
    document.getElementById('voting').style.display = 'block';
    document.getElementById('userInfo').textContent = `${role === 'cook' ? 'Повар' : 'Официант'} ${surname} ${name}`;

    updateSelectLists();
}

function updateSelectLists() {
    const waiterList = document.getElementById('waiterList');
    const cookList = document.getElementById('cookList');

    waiterList.innerHTML = '<option value="">Выберите официанта</option>';
    cookList.innerHTML = '<option value="">Выберите повара</option>';

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.surname} ${user.name}`;
        
        if (user.role === 'waiter') {
            waiterList.appendChild(option);
        } else {
            cookList.appendChild(option);
        }
    });
}

function vote(targetRole, voteType) {
    const currentUser = users[users.length - 1]; // Последний зарегистрированный пользователь
    const targetList = targetRole === 'waiter' ? 'waiterList' : 'cookList';
    const targetId = document.getElementById(targetList).value;

    if (!targetId) {
        alert('Выберите получателя голоса!');
        return;
    }

    if (currentUser.hasVoted) {
        alert('Вы уже проголосовали!');
        return;
    }

    votes.push({
        from: currentUser.id,
        to: targetId,
        type: voteType,
        targetRole: targetRole
    });

    updateResults();
}

function updateResults() {
    const resultsDisplay = document.getElementById('resultsDisplay');
    resultsDisplay.innerHTML = '';

    users.forEach(user => {
        const userVotes = votes.filter(vote => vote.to === user.id);
        const stars = userVotes.filter(v => v.type === 'star').length;
        const pigs = userVotes.filter(v => v.type === 'pig').length;

        if (userVotes.length > 0) {
            const div = document.createElement('div');
            div.textContent = `${user.role === 'cook' ? 'Повар' : 'Официант'} ${user.surname} ${user.name}: ★${stars} 🐷${pigs}`;
            resultsDisplay.appendChild(div);
        }
    });
}
