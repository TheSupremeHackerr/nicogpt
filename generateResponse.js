const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para parsear datos JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Asegúrate de que los archivos HTML, CSS y JS estén en la carpeta public

// Tu token de la API de Hugging Face
const API_TOKEN = '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'; // Usa tu token real aquí
const MODEL_NAME = 'deepseek-ai/Janus-Pro-7B'; // Usa el nombre del modelo correcto aquí

// Ruta para obtener la respuesta del modelo
app.post('/get-response', async (req, res) => {
  const userInput = req.body.input;
  
  if (!userInput) {
    return res.status(400).json({ error: 'No se recibió entrada del usuario.' });
  }

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
    if (response.data && response.data[0] && response.data[0].generated_text) {
      res.json({ response: response.data[0].generated_text });
    } else {
      res.status(500).json({ error: 'No se generó texto.' });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
