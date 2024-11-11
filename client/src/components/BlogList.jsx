import PropTypes from 'prop-types';
import BlogItem from './BlogItem.jsx';
// import ReactMarkdown from 'react-markdown';
import '../styles/BlogList.css';

export default function BlogList ({ blogs }) {
  return (
    <div>
      <ul className="blog-list">
        {blogs.length > 0 ?
          blogs.map((blog) =>
            <BlogItem key={blog._id} blog={blog} />) :
          <p style={{display: 'flex', justifyContent: 'center', padding: '35px'}}>No results found.</p>
      }
      </ul>
    </div>
  )
}

BlogList.propTypes = {
  blogs: PropTypes.array
}