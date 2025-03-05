const chatBox = document.getElementById("chat");
const userInput = document.getElementById("userInput");

const HF_TOKEN = "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"; // Tu token de Hugging Face

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        appendMessage(`Usuario: ${message}`, 'user'); // Mostrar mensaje del usuario
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
    appendMessage('NicoGPT: Estoy pensando...', 'ai'); // Indicar que la IA está procesando

    // Enviar solicitud a la API de Hugging Face usando DialoGPT
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HF_TOKEN}`
            },
            body: JSON.stringify({
                inputs: userMessage // Enviamos solo el mensaje del usuario
            })
        });

        const data = await response.json();

        if (data && data[0]) {
            let aiMessage = data[0].generated_text || "Lo siento, algo salió mal.";

            // Limitar la longitud de la respuesta
            aiMessage = aiMessage.length > 200 ? aiMessage.substring(0, 200) + "..." : aiMessage;

            updateAIMessage(aiMessage); // Mostrar la respuesta de la IA
        } else {
            updateAIMessage("Lo siento, no pude entender tu mensaje.");
        }
    } catch (error) {
        updateAIMessage("Hubo un error al procesar tu solicitud.");
    }
}

function updateAIMessage(message) {
    const lastMessage = chatBox.lastChild;
    if (lastMessage && lastMessage.textContent === 'NicoGPT: Estoy pensando...') {
        lastMessage.textContent = message; // Reemplazar "Estoy pensando..." por el mensaje de la IA
    }
}
