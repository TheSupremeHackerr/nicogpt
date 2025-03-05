const chatBox = document.getElementById("chat");
const userInput = document.getElementById("userInput");

const HF_TOKEN = "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"; // Tu token de Hugging Face

let previousMessages = []; // Para mantener el contexto de la conversación

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

    // Mantener el historial de la conversación para que el modelo tenga contexto
    previousMessages.push(`Usuario: ${userMessage}`);

    // Concatenar los mensajes anteriores para enviar un contexto más completo
    const context = previousMessages.join("\n");

    // Enviar solicitud a la API de Hugging Face usando DialoGPT
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HF_TOKEN}`
            },
            body: JSON.stringify({
                inputs: context // Enviamos todo el historial para dar contexto
            })
        });

        const data = await response.json();

        if (data && data[0]) {
            let aiMessage = data[0].generated_text || "Lo siento, algo salió mal.";

            // Limitar la longitud de la respuesta
            aiMessage = aiMessage.length > 200 ? aiMessage.substring(0, 200) + "..." : aiMessage;

            // Evitar respuestas repetidas
            if (previousMessages[previousMessages.length - 1] === aiMessage) {
                aiMessage = "Lo siento, parece que estoy repitiendo. ¿Cómo puedo ayudarte de otra manera?";
            }

            previousMessages.push(`IA: ${aiMessage}`); // Añadir la respuesta de la IA al contexto

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

