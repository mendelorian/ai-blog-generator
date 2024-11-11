import { useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import '../styles/BlogItem.css';
import { FaRegCopy  } from 'react-icons/fa';
import { IoCheckmark } from 'react-icons/io5';

export default function BlogItem({ blog }) {
  const [ copyDisplay, setCopyDisplay ] = useState({icon: <FaRegCopy />, text: 'Copy Markdown'});

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(blog.content)
      .then(() => {
        setCopyDisplay({icon: <IoCheckmark />, text: 'Copied!'});
        setTimeout(() => {
          setCopyDisplay({icon: <FaRegCopy />, text: 'Copy Markdown'});
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        setCopyDisplay('Failed to Copy');
        setTimeout(() => {
          setCopyDisplay({icon: <FaRegCopy />, text: 'Copy Markdown'});
        }, 2000);
      })
  }

  return (
    <div className="blog-item">
      <h3 className="blog-title">{blog.title}</h3>
      <p className="blog-metadata">
        <strong>Author:</strong> {blog.author} |{' '}
        <strong>Created At:</strong> {new Date(blog.createdAt).toLocaleString()}
      </p>
      <div className="blog-content">
        <button onClick={handleCopyMarkdown} className="copy-button" title="Copy">
          {copyDisplay.icon} {copyDisplay.text}
        </button>
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>
    </div>
  )
}

BlogItem.propTypes = {
  blog: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    }).isRequired,
}