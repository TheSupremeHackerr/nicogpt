const axios = require('axios');

const API_TOKEN = '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'; // Tu token real de Hugging Face
const MODEL_NAME = 'deepseek-ai/Janus-Pro-7B'; // El modelo que estás utilizando

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'No se recibió entrada del usuario.' });
    }

    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
        { inputs: input },
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      if (response.data && response.data[0] && response.data[0].generated_text) {
        return res.status(200).json({ response: response.data[0].generated_text });
      } else {
        return res.status(500).json({ error: 'Error al generar texto.' });
      }
    } catch (error) {
      console.error('Error al procesar la solicitud', error);
      return res.status(500).json({ error: 'Hubo un error al comunicarse con la API de Hugging Face.' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }
};
