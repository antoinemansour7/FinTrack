const OpenAI = require('openai');
const express = require('express');
const router = express.Router();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Using temporary key for testing
});

router.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are the FinTrack assistant. Your role is to help users manage their finances by answering questions about financial tracking, budgeting, and app usage.' },
                { role: 'user', content: message }
               
            ],
        });

        const reply = response.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error('Error communicating with ChatGPT:', error);
        res.status(500).json({ error: 'Failed to get a response from ChatGPT.' });
    }
});

module.exports = router;

