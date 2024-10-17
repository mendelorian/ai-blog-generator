import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import '../styles/BlogList.css';

export default function BlogList ({ blogs }) {
  return (
    <div>
      <ul className="blog-list">
        {blogs.map((blog) =>
          <li key={blog._id} className="blog-list-item">
            <h3 className="blog-title"><strong>Topic:</strong> {blog.title}</h3>
            <p className="blog-metadata">
              <strong>Author:</strong> {blog.author} |{' '}
              <strong>Created At:</strong> {new Date(blog.createdAt).toLocaleString()}
            </p>
            <div className="blog-content">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    }).isRequired,
  )
}