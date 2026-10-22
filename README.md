# Notex — URL-First Note-Taking Web Application

A production-ready, URL-first note-taking web application built with the **MERN** stack (MongoDB, Express, React, Node.js) and styled with **Tailwind CSS**.

---

## ⚡ Core Concepts

- **URL-First Notes:** Every unique path/slug corresponds to a note (`domain.com/:slug`).
- **Zero Friction:** Visiting any slug that doesn't yet exist automatically instantiates a new note in MongoDB. No login, signups, or setup required.
- **Debounced Auto-Save:** Automatically persists editor changes to MongoDB 1.5 seconds after typing ceases, with active visual status badges (`Saved`, `Saving...`, `Unsaved`, `Error`).
- **Rich Text Experience:** TipTap-powered editor with Headings, Bold, Italic, Strikethrough, Bullet Lists, Numbered Lists, Task Checklists, Code Blocks, Blockquotes, and Undo/Redo.
- **Dark Mode & Light Mode:** Seamless theme toggle with persistent preferences saved to `localStorage`.
- **QR Code Generator:** Instant high-contrast QR code for phone camera scanning and 1-click PNG downloads.
- **Auto-Expiration (TTL):** Optional self-destruct timers (1 hour, 24 hours, 7 days, 30 days) powered by MongoDB background TTL indexes.

---

## 🚀 Deployment Guide (e.g. Render / Railway)

### 1. Configure MongoDB Atlas Connection String
Add your database name (e.g., `notex`) and query parameters:

```env
MONGODB_URI=mongodb+srv://<username>:<YOUR_PASSWORD>@cluster0.example.mongodb.net/notex?retryWrites=true&w=majority
NODE_ENV=production
```

> **Important:** Remember to replace `<YOUR_PASSWORD>` with your actual MongoDB user password. If your password contains special characters (like `@`, `#`, `%`), URL-encode them.

### 2. Deploy to Render (Recommended - Free Web Service)
1. Push this repository to GitHub.
2. Go to [render.com](https://render.com) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `MONGODB_URI` = `mongodb+srv://<username>:<YOUR_PASSWORD>@cluster0.example.mongodb.net/notex?retryWrites=true&w=majority`
   - `NODE_ENV` = `production`
6. Click **Deploy Web Service**. Render will automatically install dependencies, compile the React Vite bundle, and host both the frontend and backend on your live domain!

---

## 💻 Local Development

### 1. Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.
