export async function callGroq(model, prompt, apiKey) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
            max_tokens: 300
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || 'Groq API error');
    }
    return data.choices[0].message.content;
}