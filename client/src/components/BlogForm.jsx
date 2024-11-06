import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import '../styles/BlogForm.css';

const LOADING_INTERVAL = 350;
const MAX_DOTS = 3;
const INITIAL_FORM_STATE = { topic: '', author: '' };

export default function BlogForm ({ onCreate }) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  // Memoize form reset
  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
  }, []);

  // Memoize field update handler
  const handleFieldChange = useCallback((field) => (e) => {
    setForm((prev) => ({...prev, [field]: e.target.value}));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onCreate(form);
      resetForm();
    } catch (err) {
      console.error('Error creating blog: ', err);
    } finally {
      setLoading(false);
    }
  }, [form, onCreate, resetForm]);

  // Loading dots effect
  useEffect(() => {
    let interval;

    if (loading) {
      interval = setInterval(() => {
        setLoadingDots((prevDots) => prevDots.length < MAX_DOTS ? prevDots + '.' : '');
      }, LOADING_INTERVAL);
    } else {
      setLoadingDots('');
    }

    return () => clearInterval(interval);
  }, [loading]);

  // Memoize button text
  const buttonText = useMemo(() => {
    return loading ? `Generating${loadingDots}` : 'Generate Blog';
  }, [loading, loadingDots]);

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Blog Topic"
        value={form.topic}
        onChange={handleFieldChange('topic')}
        required
        disabled={loading}
        className="topic-input"
      />
      <input
        type="text"
        placeholder="Author"
        value={form.author}
        onChange={handleFieldChange('author')}
        required
        disabled={loading}
        className="author-input"
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          pointerEvents: loading ? "none" : "auto",
          cursor: loading ? "not-allowed" : "pointer",
        }}
        aria-busy={loading}
      >
        {buttonText}
      </button>
    </form>
  )
}

BlogForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
}