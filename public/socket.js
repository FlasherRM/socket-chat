// Открытие и закрытие модального окна
const modalOverlay = document.getElementById('modalOverlay');
const nameButton = document.getElementById('nameButton')
const socket = io();

nameButton.addEventListener('click', () => {
    openModal();
})

function openModal() {
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

function handleKeyPress(event) {
    if (event.keyCode === 13) { // Код клавиши Enter
        sendMessage();
    }
}

// Функция отправки сообщения
function sendMessage() {
    const messageInput = document.querySelector('.chat-input input[type="text"]');
    const message = messageInput.value.trim();

    if(!localStorage.getItem('name')) {
        openModal();
        return;
    }

    if(message !== '') {
        socket.emit('sendMessage', {message, name: localStorage.getItem('name')})

        messageInput.value = '';
    }


    //
    // if (message !== '') {
    //     const chatMessages = document.querySelector('.chat-messages');
    //     const chatMessage = document.createElement('div');
    //     chatMessage.classList.add('chat-message');
    //     chatMessage.innerHTML = `
    //   <img src="avatar.jpg" alt="Avatar">
    //   <div class="message-content">
    //     <h3>Your Name</h3>
    //     <p>${message}</p>
    //   </div>
    // `;
    //     chatMessages.appendChild(chatMessage);
    //
    //     // Очистка поля ввода
    //     messageInput.value = '';
    // }
}

// Функция отправки имени из модального окна
function submitName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();

    if (name !== '') {
        // Действия по отправке имени
        localStorage.setItem('name', name)
        console.log('Name:', name);
        closeModal();
    }
}

function addMessage(name, text) {
    const chatMessages = document.querySelector('.chat-messages');
    const chatMessage = document.createElement('div');
    chatMessage.classList.add('chat-message');
    chatMessage.innerHTML = `
    <img src="images/man.png" alt="Avatar">
    <div class="message-content">
      <h3>${name}</h3>
      <p>${text}</p>
    </div>
  `;
    chatMessages.appendChild(chatMessage);
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    notificationText.textContent = message;
    notification.classList.remove('hide');

    setTimeout(() => {
        notification.classList.add('hide');
    }, 3000);
}


socket.on('newMessage', (data) => {
    addMessage(data.name, data.message)
})

socket.on('errorSendingMessage', (error) => {
    showNotification(error)
})
