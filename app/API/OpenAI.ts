import axios from 'axios';

const SECRET_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function getMessage(
  chatMessage: string
): Promise<string | undefined> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Respond in a casual tone, using all lowercase letters. Keep responses brief, ideally 1-2 sentences. Mix in follow-up questions and suggestions to engage the user when appropriate.',
          },
          {
            role: 'user',
            content: chatMessage,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      return response.data.choices[0].message.content;
    } else {
      console.error('Unexpected response format:', response);
      return 'Sorry, something went wrong. Please try again later.';
    }
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error);
    return 'Sorry, I am having trouble processing your request.';
  }
}
