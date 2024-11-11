import { useState, useEffect, useCallback, useMemo } from 'react';
import BlogForm from './components/BlogForm.jsx';
import BlogList from './components/BlogList.jsx';
import { FaSun, FaMoon } from 'react-icons/fa';
import { debounce } from 'lodash';

// Constants
const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

const SORT_OPTIONS = {
  CREATED_AT: 'createdAt',
  AUTHOR: 'author',
  TITLE: 'title',
};

const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
};

function App() {
  // State management
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || THEME_OPTIONS.SYSTEM);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.CREATED_AT);
  const [sortOrder, setSortOrder] = useState(SORT_ORDERS.DESC);
  const [authorFilter, setAuthorFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [systemThemeDisplay, setSystemThemeDisplay] = useState('Use System Theme');

  // Utility functions
  const getSystemTheme = useCallback(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_OPTIONS.DARK
      : THEME_OPTIONS.LIGHT
    , []);

  const updateRootTheme = useCallback((newTheme) => {
    const root = document.documentElement;
    root.classList.remove(THEME_OPTIONS.LIGHT, THEME_OPTIONS.DARK);
    root.classList.add(newTheme);
  }, []);

  // Theme management
  // Set initial theme based on system preference
  useEffect(() => {
    if (theme === THEME_OPTIONS.SYSTEM) {
      updateRootTheme(getSystemTheme());
    } else {
      updateRootTheme(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, getSystemTheme, updateRootTheme]);

  // System theme change listener
  // This will allow the manual theme change button to change accordingly
  useEffect(() => {
    if (theme === THEME_OPTIONS.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark');
      const handleThemeChange = () => updateRootTheme(getSystemTheme());

      mediaQuery.addEventListener('change', handleThemeChange);
      return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }
  }, [theme, getSystemTheme, updateRootTheme]);

  // API Call
  const fetchBlogs = useCallback(async (options = {}) => {
    const {
      sort = sortBy,
      order = sortOrder,
      author = authorFilter,
      page = currentPage,
    } = options;

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        sort,
        order,
        author,
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
  }, [sortBy, sortOrder, authorFilter, currentPage]);

  // Initial fetch
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Debounce author filter fetch to reduce network calls
  const debouncedFetchBlogs = useMemo(
    () => debounce((options) => {
      fetchBlogs(options)
    }, 300),
    [fetchBlogs]
  );

  useEffect(() => {
    if (authorFilter !== '') {
      debouncedFetchBlogs({author: authorFilter, page: 1});
      return () => debouncedFetchBlogs.cancel();
    }
  }, [authorFilter, debouncedFetchBlogs]);

  // Sort and page changes
  useEffect(() => {
    fetchBlogs();
  }, [sortBy, sortOrder, currentPage, fetchBlogs]);

  // Event handlers
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
    setTheme((prevTheme) =>
      prevTheme === THEME_OPTIONS.LIGHT
      ? THEME_OPTIONS.DARK
      : THEME_OPTIONS.LIGHT
    );
  }

  const setSystemTheme = () => {
    setTheme(THEME_OPTIONS.SYSTEM);
    setSystemThemeDisplay('Theme is now set to match your system preferences');

    const button = document.querySelector('.system-theme-button');
    if (button) {
      button.style.backgroundColor = '#007bff';
      button.style.transition = 'background-color 0.75s ease';

      setTimeout(() => {
        button.style.backgroundColor = 'transparent';
        setSystemThemeDisplay('Use System Theme');
      }, 2000);
    }
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  const handleFilterChange = (e) => {
    setAuthorFilter(e.target.value);
    setCurrentPage(1);
  }

  // UI Components
  const ThemeIcon = () => {
    return theme === THEME_OPTIONS.LIGHT ? <FaMoon /> : <FaSun />;
  }

  const themeTitle = () => {
    return theme === THEME_OPTIONS.LIGHT ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  }

  const PaginationControls = ({ position = 'top' }) => (
    <div className={`page-controls-${position}`}>
      {currentPage > 1 && (
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={loading || currentPage <= 1}
        >
          Previous
        </button>
      )}
      <div className="page-info">
        Page {currentPage} / {totalPages}
      </div>
      {currentPage < totalPages && (
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={loading || currentPage >= totalPages}
          >
          Next
        </button>
      )}
    </div>
  );

  return (
    <div>
      <h1>AI Blog Generator</h1>
      <button className="system-theme-button" onClick={setSystemTheme}>
        {systemThemeDisplay}
      </button>
      <button
        className="theme-switcher"
        onClick={toggleTheme}
        title={themeTitle()}
        aria-label="Toggle color theme"
        aria-live="polite"
      >
        <ThemeIcon />
      </button>

      {error && <p style={{color: 'red'}}>{error}</p>}

      <BlogForm onCreate={handleCreateBlog} />

      <div className="header-container">
        <h2>Generated Blogs</h2>
        <PaginationControls position="top" />

      </div>
      <div className="sort-and-filter">
        <label>
          Sort By:
          <select className="dropdown" onChange={(e) => setSortBy(e.target.value)}>
            <option value={SORT_OPTIONS.CREATED_AT}>Create Date</option>
            <option value={SORT_OPTIONS.AUTHOR}>Author</option>
            <option value={SORT_OPTIONS.TITLE}>Title</option>
          </select>
        </label>
        <label>
          Sort Order:
          <select className="dropdown" onChange={(e) => setSortOrder(e.target.value)}>
            <option value={SORT_ORDERS.DESC}>Descending</option>
            <option value={SORT_ORDERS.ASC}>Ascending</option>
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
            <PaginationControls position="bottom" />
          </>
        )}

    </div>
  )
}

export default App;
