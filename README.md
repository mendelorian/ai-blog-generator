# AI Blog Generator

> A web application that uses OpenAI’s API to generate concise, insightful blog posts and displays them in a user-friendly manner with sorting, filtering, and pagination capabilities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This AI Blog Generator app leverages OpenAI’s API to create short, customizable blog posts. The application allows users to:

1. **Generate** new blog entries based on a chosen topic/author.
2. **Sort** posts by date, author, or title (ascending or descending).
3. **Filter** posts by author name.
4. **Paginate** through large lists of entries.
5. **Copy** the raw Markdown content of each post with a click of a button.

---

## Features

1. **AI-Generated Blogs**
   Uses OpenAI’s API to create short, insightful blog posts.

2. **Sorting and Filtering**
   Allows sorting by `createdAt`, `author`, or `title`, and filtering by author name.

3. **Pagination**
   Efficiently handle large datasets, showing a limited number of blogs per page.

4. **Copy Markdown**
   Easily copy the raw Markdown text of each post to the clipboard for further editing.

5. **Dark and Light Theme**
   Supports system-based theming with an optional manual toggle.

---

## Tech Stack

**Client (Frontend)**
- [React](https://reactjs.org/) (with Hooks)
- [React Icons](https://react-icons.github.io/react-icons/) for UI icons

**Server (Backend)**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/) (for MongoDB interactions)
- [OpenAI API](https://platform.openai.com/docs/introduction) (for AI-driven content)

**Database**
- [MongoDB](https://www.mongodb.com/) (local)

---

## Getting Started

### Prerequisites

- **Node.js**
- **npm** or **yarn**
- A **MongoDB** instance (local or hosted)
- A valid **OpenAI API key**

### Installation

1. **Clone** this repository:
```bash
git clone https://github.com/yourusername/ai-blog-generator.git
```
2. **Navigate** into the project directory:
```bash
cd ai-blog-generator
```
3. **Install** dependencies for both server and client:
```bash
# npm install in the server directory
cd server
npm install

# npm install in the client directory
cd client
npm install
```
### Running the App Locally
1. **Set up** your environment variables (see Environment Variables).
2. **Start the server**:
```bash
# In the server folder
cd server
npm run start
```
3. **Start the React client**:
```bash
# In the client folder
cd client
npm run dev
```
4. **Start your MongoDB** after setting your environment variables
5. Open http://localhost:3000 (or with your chosen port) in your browser. You should see the AI Blog Generator app running.

---

## Usage
1. **Generating a New Blog**
- Fill in the topic and author in the form, then click **Generate**.
- The server calls the OpenAI API and returns the content, which is stored in MongoDB and displayed on the frontend.

2. **Sorting & Filtering**
- Use the dropdowns to select the sort field (`createdAt`, `author`, or `title`) and order (`asc` or `desc`).
- Type an author name in the filter input to only see blogs matching that author.

3. **Pagination**
- If there are multiple pages, use the **Next** and **Previous** buttons to navigate.
- The total pages and current page number are displayed at the bottom.

4. **Copying Markdown**
- In each blog’s content box, click the **Copy Markdown** button (top-right corner).
- The raw Markdown is copied to your clipboard.

---

## Modifying the Prompt
If you wish to customize the text or style of the prompt sent to the OpenAI API, you can update the relevant code in `blogController.js`:

```js
{
  role: 'system',
  content: 'Be concise, to the point, and insightful. Assume user already knows the basics'
},
{
  role: 'user',
  content: `Write a short blog about ${topic}. Limit to 300 tokens`
}
```

For example, you could add more context, instructions, or change the length constraints. Adjusting these prompts can significantly change the style and content of the generated blog posts.

---

## Environment Variables
Create a `.env` file in the root directory to store your credentials:

```bash
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
MONGO_URI=mongodb://localhost:27017/ai-blog-db
PORT=5000
```

**Variables**:

`OPENAI_API_KEY`: Your OpenAI API key to authenticate requests.
`MONGO_URI`: MongoDB connection string.
`PORT`: The port the server runs on (default is usually `5000` or `3001`).

---

## API Routes
| Route                   | HTTP   | Description                                                                       |
|-------------------------|--------|-----------------------------------------------------------------------------------|
| `/api/blogs`           | GET    | Retrieves blogs, supports query params: `sort`, `order`, `author`, `page`, `limit` |
| `/api/blogs`           | POST   | Creates a new blog using AI-generated content                                      |
| `/api/blogs/:id`       | GET    | *(Not yet implemented)* Retrieves a single blog by ID                                         |
| `/api/blogs/:id`       | PUT    | *(Not yet implemented)* Updates a blog                                                        |
| `/api/blogs/:id`       | DELETE | *(Not yet implemented)* Deletes a blog                                                        |


---

## Deployment
1. **Frontend Build**
- Run `npm run build` in the `client` directory to create a production build.

2. **Server Deployment**
- Deploy the server to a platform like **Heroku**, **Render**, or **AWS**.
- Ensure environment variables (`OPENAI_API_KEY`, `MONGO_URI`) are set on your hosting service.

**Serving Client and Server Together**
Serve the static build of the React app from Express by placing the build files in the server’s `public` folder or using a library like `serve-static`.

---

## Contributing
1. **Fork** the repository.
2. **Create a feature branch**: `git checkout -b feature/new-feature`.
3. **Commit** your changes: `git commit -m "Add some feature"`.
4. **Push** to the branch: `git push origin feature/new-feature`.
5. **Open a Pull Request**.

---

## License
This project is licensed under the MIT License. You’re free to use, modify, and distribute this code. If you’d like to contribute or extend it, feel free to open an issue or pull request.