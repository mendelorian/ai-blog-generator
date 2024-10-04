import { useState, useEffect } from 'react';
import BlogForm from './components/BlogForm.jsx';
import BlogList from './components/BlogList.jsx';
import './App.css';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs: ', err);
      }
    };

    fetchBlogs();
  }, []);

  const handleCreateBlog = async (form) => {
    try {
      const response = await fetch ('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      await console.log(response);
      if (!response.ok) {
        throw new Error('Failed to create blog');
      }
      const newBlog = await response.json();
      setBlogs([newBlog, ...blogs]);
    } catch (err) {
      console.error('Error creating blog: ', err);
      setError('Failed to create blog.  Please try again.');
    }
  }

  return (
    <div>
      <h1>AI Blog Generator</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <BlogForm onCreate={handleCreateBlog} />
      <BlogList blogs={blogs} />
    </div>
  )
}

export default App;
