import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { resume, jobDescription } = req.body;
  if (!resume || !jobDescription) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Use Groq AI directly
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume tailoring specialist. Create professional, ATS-optimized resumes in clean HTML format.'
          },
          {
            role: 'user',
            content: `Please tailor this resume for the specific job:\n\nRESUME CONTENT: ${resume}\n\nJOB DESCRIPTION: ${jobDescription}\n\nCreate a tailored resume in clean HTML format with:\n- Professional summary highlighting relevant experience\n- Skills section with job-relevant keywords\n- Experience section emphasizing matching qualifications\n- Clean, ATS-friendly formatting\n- Use proper HTML tags like <h2>, <h3>, <p>, <ul>, <li>`
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    console.log('Groq API response status:', response.status);
    let data;
    try {
      data = await response.json();
      console.log('Groq API response body:', data);
    } catch (jsonError) {
      console.error('Failed to parse Groq API response as JSON:', jsonError);
      throw new Error('Invalid JSON from Groq API');
    }

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} - ${JSON.stringify(data)}`);
    }

    const tailoredResume = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!tailoredResume) {
      console.error('Groq API did not return tailored resume content:', data);
      throw new Error('No tailored resume content in Groq API response');
    }

    return res.status(200).json({ tailored: tailoredResume });
  } catch (error) {
    console.error('Error tailoring resume:', error);
    return res.status(500).json({ error: 'Failed to tailor resume with AI.' });
  }
} 