import { useState, useEffect } from 'react';
import BlogForm from './components/BlogForm.jsx';
import BlogList from './components/BlogList.jsx';
import './App.css';

function App() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = response.json();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs: ', err);
      }
    };

    fetchBlogs();
  })

  const handleCreateBlog = async (form) => {
    try {
      const response = await fetch ('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const newBlog = await response.json();
      setBlogs([...blogs, newBlog]);
    } catch (err) {
      console.error('Error creating blog: ', err);
    }
  }

  return (
    <div>
      <h1>AI Blog Generator</h1>
      <BlogForm onCreate={handleCreateBlog} />
      <BlogList blogs={blogs} />
    </div>
  )
}

export default App;
