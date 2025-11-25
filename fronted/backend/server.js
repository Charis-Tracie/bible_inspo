const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'your-api-key-here';

// Endpoint to get Bible verse based on mood
app.post('/api/verse', async (req, res) => {
    try {
        const { mood } = req.body;

        if (!mood) {
            return res.status(400).json({ 
                success: false, 
                error: 'Mood is required' 
            });
        }

        // Call Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [
                    {
                        role: 'user',
                        content: `I'm feeling ${mood}. Please share a comforting and appropriate Bible verse for this emotion. Format your response as JSON with the following structure:
{
  "verse": "The exact verse text",
  "reference": "Book Chapter:Verse",
  "message": "A brief personal message of encouragement (2-3 sentences)"
}

Choose a verse that truly speaks to this emotion and provide genuine comfort and encouragement.`
                    }
                ]
            })
        });

        const data = await response.json();
        
        // Extract text from Claude's response
        const textContent = data.content.find(item => item.type === 'text')?.text || '';
        
        // Clean and parse JSON
        const cleanText = textContent.replace(/```json\n?|\n?```/g, '').trim();
        const verseData = JSON.parse(cleanText);

        res.json({
            success: true,
            verse: verseData
        });

    } catch (error) {
        console.error('Error:', error);
        
        // Return fallback verse
        res.json({
            success: true,
            verse: {
                verse: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
                reference: "Psalm 34:18",
                message: "Remember Lucky, you are deeply loved and never alone. God is with you in every moment."
            }
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', message: 'Bible Verse API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/verse`);
});