
// Chat Widget Logic
const chatBox = document.getElementById('chatBox');
const toggleChat = document.getElementById('toggleChat');
const closeChat = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');
const chatMessages = document.getElementById('chatMessages');

if (toggleChat) {
    toggleChat.addEventListener('click', () => {
        chatBox.classList.add('active');
        toggleChat.style.display = 'none'; // Hide button when open
        chatInput.focus();
    });
}

if (closeChat) {
    closeChat.addEventListener('click', () => {
        chatBox.classList.remove('active');
        setTimeout(() => {
            toggleChat.style.display = 'flex'; // Show button when closed
        }, 300);
    });
}

// Send Message Logic
async function sendUserMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Add User Message
    addMessage(text, 'user-message');
    chatInput.value = '';

    // 2. Show Loading
    const loadingId = addMessage('...', 'bot-message', true);

    try {
        // 3. Call Local API
        // NOTE: This talks to chatbot_service.py running on localhost:5000
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        // 4. Update with Bot Reply
        updateMessage(loadingId, data.reply || "Maaf, tidak ada respon.");

    } catch (error) {
        console.error('Chat Error:', error);
        updateMessage(loadingId, "Gagal terhubung ke AI Server. Pastikan chatbot_service.py berjalan.");
    }
}

function addMessage(text, className, isLoading = false) {
    const div = document.createElement('div');
    div.classList.add('message', className);
    div.textContent = text;
    if (isLoading) div.id = 'msg-' + Date.now();

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div.id;
}

function updateMessage(id, newText) {
    const msgDiv = document.getElementById(id);
    if (msgDiv) {
        msgDiv.textContent = newText;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

if (sendMessage) {
    sendMessage.addEventListener('click', sendUserMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendUserMessage();
    });
}
