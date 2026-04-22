# Blog Management Frontend

React + Vite + Tailwind CSS frontend for the MERN Blog Management System.

## Features

- Light-mode UI with white surfaces and blue accents
- Public blog listing with search and pagination
- Blog details page with comment section
- Shared login/register screen for both admins and authors
- Role-aware dashboard for admin and author users
- Post create/edit/delete/publish flows
- Axios integration with automatic JWT refresh handling
- Context API auth state, custom hooks, protected routes, and an auth HOC

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set the backend URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

3. Start the development server:

```bash
npm run dev
```

## Routes

- `/` public blogs page
- `/posts/:id` blog details page
- `/auth` login/register page
- `/dashboard` role-based dashboard
- `/dashboard/posts/new` create post
- `/dashboard/posts/:id/edit` edit post
