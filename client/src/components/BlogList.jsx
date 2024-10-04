import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

export default function BlogList ({ blogs }) {
  return (
    <div>
      <h2>Generated Blogs</h2>
      <ul>
        {blogs.map((blog) =>
          <li key={blog._id}>
            <h3>{blog.title}</h3>
            <p>
              <strong>Created At:</strong> {new Date(blog.createdAt).toLocaleString()}</p>
            <ReactMarkdown>{blog.content}</ReactMarkdown>
            <p><strong>Author:</strong> {blog.author}</p>
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