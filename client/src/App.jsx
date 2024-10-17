import { useState, useEffect } from 'react';
import BlogForm from './components/BlogForm.jsx';
import BlogList from './components/BlogList.jsx';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'system';
  })
  const [sortBy, setSortBy] = useState('desc');
  const [sortOrder, setSortOrder] = useState('createdAt');

  // Get dark or light theme from local storage if it exists
  useEffect(() => {
    const root = document.documentElement;

    // Remove/reset theme classes
    root.classList.remove('light', 'dark');

    // If the theme is selected, set the theme class
    if (theme === 'light') {
      root.classList.add('light');
    } else if (theme === 'dark') {
      root.classList.add('dark');
    }

    // If theme is not set, 'system' then will be used (relies on prefer-color-scheme)
    // Save the user's preference in localStorage so it persists across sessions
    localStorage.setItem('theme', theme);
  }, [theme])

  const fetchBlogs = async (sort = 'createdAt', order = 'desc') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blogs/?sort=${sort}&order=${order}`);
      if (!response.ok) {
        throw new Error('Server response not ok. ');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      console.error('Error fetching blogs: ', err);
      setError('Unable to get blogs list. Please try agian later.');
    } finally {
      setLoading(false);
    }
  }

  // Get the initial list of blogs from the DB
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Update list sorted on server side when sort order changes
  useEffect(() => {
    fetchBlogs(sortBy, sortOrder);
  }, [sortBy, sortOrder]);

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

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    })
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <FaMoon />;
    if (theme === 'dark') return <FaDesktop />;
    return <FaSun />;
  }

  const setThemeTitle = () => {
    if (theme === 'light') return 'Switch to Dark Mode';
    if (theme === 'dark') return 'Use System Theme';
    return 'Switch to Light Mode';
  }

  return (
    <div>
      <h1>AI Blog Generator</h1>
      <button className="theme-switcher" onClick={toggleTheme} title={setThemeTitle()} aria-label="Toggle color theme">
        {getThemeIcon()}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <BlogForm onCreate={handleCreateBlog} />
      <h2>Generated Blogs</h2>
      <label>
        Sort By:
        <select className="dropdown" onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Create Date</option>
          <option value="author">Author</option>
          <option value="title">Title</option>
        </select>
      </label>
      <label>
        Sort Order:
        <select className="dropdown" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </label>
      { loading ? (
        <>
          <div className="loading-indicator"></div>
          <div className="centered">Loading...</div>
        </>
        ) : (
          <BlogList blogs={blogs} />
        )}

    </div>
  )
}

export default App;
