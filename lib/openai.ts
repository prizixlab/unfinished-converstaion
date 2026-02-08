const openAiKey = process.env.OPENAI_API_KEY;

if (!openAiKey) {
  throw new Error('OPENAI_API_KEY is not set');
}

export async function generateResponse(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a calm, restrained writing assistant for a ritual response. Follow the content rules precisely.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 1200
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${errorText}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };

  return data.choices[0]?.message?.content?.trim() ?? '';
}
