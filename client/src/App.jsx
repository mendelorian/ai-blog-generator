import { useState, useEffect } from 'react';
import BlogForm from './components/BlogForm.jsx';
import BlogList from './components/BlogList.jsx';
import { FaSun, FaMoon } from 'react-icons/fa';
import { debounce } from 'lodash';

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
  const [authorFilter, setAuthorFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [systemThemeDisplay, setSystemThemeDisplay] = useState('Use System Theme');

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Set initial theme based on system preference
  useEffect(() => {
    if (theme === 'system') {
      const systemTheme = getSystemTheme();
      setTheme(systemTheme);
    }
  }, []);

  // Listen for system theme changes if 'system' theme is selected
  // This will allow the manual theme change button to change accordingly
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark');
      const handleThemeChange = () => {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleThemeChange);
      return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }
  })

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

    // If theme is not set, 'system' then will be used
    // Save the user's preference in localStorage so it persists across sessions
    localStorage.setItem('theme', theme);
  }, [theme])

  const fetchBlogs = async (sort = 'createdAt', order = 'desc', author = '', page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        sort: sortBy,
        order: sortOrder,
        author: authorFilter,
        page: page.toString(),
      }).toString();

      const response = await fetch(`/api/blogs/?${queryParams}`);
      if (!response.ok) {
        throw new Error('Server response not ok. ');
      }

      const data = await response.json();
      setBlogs(data.blogs);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching blogs: ', err);
      setError('Unable to get blogs list. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  // Get the initial list of blogs from the DB
  useEffect(() => {
    fetchBlogs();
  }, []);

  // debounce fetching of blogs to reduce network calls
  const debouncedFetchBlogs = debounce(() => {
    fetchBlogs(sortBy, sortOrder, authorFilter, currentPage);
  }, 300);

  // Update list sorted on server side when sorting or filtering
  useEffect(() => {
    if (authorFilter) {
      debouncedFetchBlogs();
    } else {
      fetchBlogs(sortBy, sortOrder, authorFilter, currentPage);
    }
    return () => debouncedFetchBlogs.cancel();
  }, [sortBy, sortOrder, authorFilter, currentPage]);

  const handleCreateBlog = async (form) => {
    try {
      const response = await fetch ('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Failed to create blog');
      }

      const newBlog = await response.json();
      setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
    } catch (err) {
      console.error('Error creating blog: ', err);
      setError('Failed to create blog.  Please try again.');
    }
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'light') return 'dark';
      // if (prevTheme === 'dark') return 'system';
      return 'light';
    })
  }

  const toggleSystemTheme = () => {
    const systemTheme = getSystemTheme();
    setTheme(systemTheme);
    setSystemThemeDisplay('Theme is now set to match your system preferences');
    const button = document.querySelector('.system-theme-button');
    button.style.backgroundColor = '#007bff';
    button.style.transition = 'background-color 0.75s ease';
    setTimeout(() => {
      button.style.backgroundColor = 'transparent';
      setSystemThemeDisplay('Use System Theme');
    }, 2000);
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <FaMoon />;
    // if (theme === 'dark') return <FaDesktop />;
    return <FaSun />;
  }

  const setThemeTitle = () => {
    if (theme === 'light') return 'Switch to Dark Mode';
    // if (theme === 'dark') return 'Use System Theme';
    return 'Switch to Light Mode';
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  const handleFilterChange = (e) => {
    setAuthorFilter(() => e.target.value);
    setCurrentPage(1);
  }

  return (
    <div>
      <h1>AI Blog Generator</h1>
      <button className="system-theme-button" onClick={toggleSystemTheme}>
        {systemThemeDisplay}
      </button>
      <button
        className="theme-switcher"
        onClick={toggleTheme}
        title={setThemeTitle()}
        aria-label="Toggle color theme"
        aria-live="polite"
      >
        {getThemeIcon()}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <BlogForm onCreate={handleCreateBlog} />
      <div className="header-container">
        <h2>Generated Blogs</h2>
        <div className="page-controls">
          {
            currentPage > 1 ?
            <button
              className="page-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={loading || currentPage <= 1}
              >
              Previous Page
            </button> :
            <></>
          }
          <div className="page-info">
            Page {currentPage} / {totalPages}
          </div>
          {
            totalPages > 1 ?
            <button
              className="page-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={loading || currentPage >= totalPages}
              >
              Next Page
            </button> :
            <></>
          }
        </div>

      </div>
      <div className="sort-and-filter">
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
        <label>
          Filter by Author:
          <input
            type="text"
            value={authorFilter}
            onChange={handleFilterChange}
            placeholder="Author name"
            className="filter-field"
          />
        </label>
      </div>
      { loading ? (
        <>
          <div className="loading-indicator"></div>
          <div className="centered">Loading...</div>
        </>
        ) : (
          <>
            <BlogList blogs={blogs} />
            <div className="pagination">
              {
                currentPage > 1 ?
                <button className="page-button" onClick={() => handlePageChange(currentPage - 1)} disabled={loading || currentPage <= 1}>
                  Previous
                </button> :
                <></>
              }
              <span>
                Page {currentPage} of {totalPages}
              </span>
              {
                totalPages > 1 ?
                <button className="page-button" onClick={() => handlePageChange(currentPage + 1)} disabled={loading || currentPage >= totalPages}>
                  Next
                </button> :
                <></>
              }
            </div>
          </>
        )}

    </div>
  )
}

export default App;
