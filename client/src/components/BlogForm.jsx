import { useState } from 'react';

export default function BlogForm ({ onCreate }) {
  const [form, setForm] = useState({ topic: '', author: ''});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreate(form);
      setForm({ topic: '', author: ''});
    } catch (err) {
      console.error('Error creating blog: ', err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Blog Topic"
        value={form.topic}
        onChange={(e) => setForm({ ...form, topic: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Author"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
        required
      />
      <button type="submit">Generate Blog</button>
    </form>
  )
}