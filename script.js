const chatBox = document.getElementById("chat");
const userInput = document.getElementById("userInput");

const HF_TOKEN = "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"; // Tu token de Hugging Face

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        appendMessage(message, 'user'); // Mostrar mensaje del usuario
        userInput.value = ''; // Limpiar el campo de texto
        getAIResponse(message); // Enviar mensaje a la IA
    }
}

function appendMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.classList.add(sender);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Desplazar la vista hacia el mensaje más reciente
}

async function getAIResponse(userMessage) {
    appendMessage('NicoGPT: Estoy pensando...', 'ai');

    // Enviar solicitud a la API de Hugging Face
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${HF_TOKEN}`
        },
        body: JSON.stringify({
            inputs: userMessage
        })
    });

    const data = await response.json();
    const aiMessage = data[0]?.generated_text || "Lo siento, algo salió mal.";

    appendMessage(aiMessage, 'ai'); // Mostrar mensaje de la IA
}
