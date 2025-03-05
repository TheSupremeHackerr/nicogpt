const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware para parsear datos JSON
app.use(express.json());

// Tu token de la API de Hugging Face
const API_TOKEN = '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'; // Asegúrate de reemplazarlo con tu token real
const MODEL_NAME = 'deepseek-ai/Janus-Pro-7B'; // Reemplázalo con el nombre de tu modelo en Hugging Face

// Ruta para obtener la respuesta del modelo NicoGPT
app.post('/get-response', async (req, res) => {
  const userInput = req.body.input;

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
      { inputs: userInput },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    // Responder al frontend con el texto generado
    res.json({ response: response.data[0].generated_text });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la solicitud');
  }
});

// Servir archivos estáticos (como el index.html)
app.use(express.static('public'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
