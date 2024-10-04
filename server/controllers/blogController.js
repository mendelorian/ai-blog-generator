import Blog from '../models/Blog.js';
import axios from 'axios';
// import OpenAi from 'openai';

export const createBlog = async (req, res) => {
  const { topic, author } = req.body;
  console.log('Request Body:', req.body);
  // call the openAI API
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          {
            'role': 'system',
            'content': [
              {
                'type': 'text',
                'text': 'Be concise and to the point but insightful. Assume user already knows the basics',
              }
            ]
          },
          {
            'role':'user',
            'content': [
              {
                'type': 'text',
                'text': `Write a very short blog about ${topic}. Limit to 300 tokens`
              }
            ]
          },
        ],
        temperature: 1,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
          'type': 'text',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        }
      }
    );

    console.log('response.data: ', response.data.choices[0].message);
    const newBlog = new Blog({
      title: topic,
      content: response.data.choices[0].message.content,
      author: author,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error while executing openAI API');
  }
}

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({message: 'Error fetching blogs', err})
  }
}