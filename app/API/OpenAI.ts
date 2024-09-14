import axios from 'axios';

const SECRET_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function getMessage(
  chatMessage: string
): Promise<string | undefined> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini', // You had 'gpt-4o mini', but OpenAI offers 'gpt-4' or 'gpt-3.5-turbo'
        messages: [
          {
            role: 'user',
            content: chatMessage,
          },
        ],
        max_tokens: 100, // You can limit tokens based on your needs
        temperature: 0.7, // This controls randomness; 0.7 is a balanced value
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
      return 'Sorry, something went wrong. Please try again later.'; // Fallback message
    }
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error);
    return 'Sorry, I am having trouble processing your request.'; // Error fallback
  }
}
