export default function BlogList ({ blogs }) {
  return (
    <div>
      <h2>Generated Blogs</h2>
      <ul>
        {blogs.map((blog, index) =>
          <li key={index}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <p>Author: {blog.author}</p>
          </li>
        )}
      </ul>
    </div>
  )
}