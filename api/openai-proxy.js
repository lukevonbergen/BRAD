/**
 * OpenAI API Proxy - Vercel Serverless Function
 *
 * This function securely proxies requests to OpenAI's API, keeping your API key hidden.
 * It receives user messages, calendar data, and tube status, then sends them to GPT
 * with a British personality prompt.
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get OpenAI API key from environment variables
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not configured');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const { message, calendarEvents, tubeStatus, chatHistory } = req.body;

        // Build context for GPT
        let systemPrompt = `You are DASH (Digital Assistant for Scheduling and Home), a helpful British personal assistant similar to JARVIS from Iron Man.

Your personality:
- Witty, sophisticated, and occasionally humorous
- Use British English (colour, not color; whilst, not while; etc.)
- Be concise but friendly
- Adapt your tone to the question (professional for work, casual for personal)
- When appropriate, add a touch of dry British humour

Current date and time: ${new Date().toLocaleString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London'
})}
`;

        // Add calendar context if available
        if (calendarEvents && calendarEvents.length > 0) {
            systemPrompt += `\n\nUser's upcoming calendar events:\n`;
            calendarEvents.forEach(event => {
                const start = event.start.dateTime || event.start.date;
                const end = event.end.dateTime || event.end.date;
                systemPrompt += `- ${event.summary} (${start} to ${end})`;
                if (event.location) systemPrompt += ` at ${event.location}`;
                systemPrompt += '\n';
            });
        } else if (calendarEvents !== null) {
            systemPrompt += '\n\nNote: Calendar is connected but no upcoming events found.';
        } else {
            systemPrompt += '\n\nNote: Calendar not connected. If asked about schedule, politely suggest connecting the calendar.';
        }

        // Add tube status context if available
        if (tubeStatus && tubeStatus.length > 0) {
            systemPrompt += `\n\nCurrent TfL London Underground status:\n`;
            tubeStatus.forEach(line => {
                systemPrompt += `- ${line.name}: ${line.status}`;
                if (line.reason) systemPrompt += ` (${line.reason})`;
                systemPrompt += '\n';
            });
        }

        systemPrompt += `\n\nWhen answering:
- For calendar queries, search through the events and provide relevant information
- For tube status queries, use the current status data provided
- Format your responses clearly and concisely
- Use natural language, not just lists (unless specifically asked for a list)
- If you don't have the information needed, be honest about it`;

        // Build messages array for GPT
        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        // Add chat history for context
        if (chatHistory && chatHistory.length > 0) {
            messages.push(...chatHistory);
        }

        // Add current message
        messages.push({ role: 'user', content: message });

        // Call OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4', // or 'gpt-3.5-turbo' for faster/cheaper responses
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json();
            console.error('OpenAI API error:', errorData);
            throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await openaiResponse.json();
        const assistantResponse = data.choices[0].message.content;

        return res.status(200).json({
            response: assistantResponse
        });

    } catch (error) {
        console.error('Error in openai-proxy:', error);
        return res.status(500).json({
            error: 'Failed to process request',
            details: error.message
        });
    }
}
