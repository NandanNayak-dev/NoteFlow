# NoteFlow ? — Frictionless, URL-First Note-Taking Web App

A modern, production-ready, URL-first note-taking application built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js) and styled with **Tailwind CSS**. 

Any unique URL path is an instant, live note with zero sign-up friction, real-time debounced auto-saving, rich formatting, dark/light modes, QR code sharing, and MongoDB TTL auto-destruction.

---

## ? Features

- **?? URL-First Architecture:** Every unique URL slug corresponds to a distinct note (e.g., `yourdomain.com/meeting-notes` or `yourdomain.com/daily-todo`).
- **? Zero-Friction Instant Note Creation:** Navigating to any unused slug immediately creates and opens a fresh, editable note in MongoDB without requiring any registration or login.
- **?? Debounced Cloud Auto-Save:** Automatically persists edits to the cloud **1.5 seconds** after the user stops typing, complete with visual state badges (`Saved`, `Saving...`, `Unsaved`, `Save Error`).
- **?? TipTap Rich Text Editor:** Fully featured editor supporting Headings (H1, H2), Bold, Italic, Strikethrough, Bullet Lists, Numbered Lists, Interactive Task Checklists, Code Blocks, Blockquotes, and Undo/Redo.
- **?? Dark Mode & Light Mode:** Seamless, animated theme toggle with persistent user preferences stored in `localStorage`.
- **?? QR Code Generator:** Instantly generate, scan, or download high-contrast PNG QR codes of any note to open on mobile cameras.
- **? Self-Destruct Timer (TTL Auto-Expiry):** Optional expiration settings (1 hour, 24 hours, 7 days, 30 days) powered by native MongoDB background TTL indexes.
- **?? Real-Time Metadata:** Live word count, character count, and browser-local recent notes history.

---

## ??? Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS (Dark/Light mode support)
- **Editor:** TipTap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-task-list`)
- **Icons:** Lucide React
- **QR Code:** `qrcode.react`
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose (with automated TTL expiration indexes)
- **CORS & Middleware:** `cors`, `dotenv`, `express.json`

---

## ?? Project Directory Structure

```text
NoteFlow/
+-- backend/
¦   +-- models/
¦   ¦   +-- Note.js             # Mongoose schema with TTL index & timestamps
¦   +-- routes/
¦   ¦   +-- noteRoutes.js       # REST endpoints (GET, PUT, auto-creation)
¦   +-- .env.example            # Environment variables template
¦   +-- package.json            # Backend dependencies
¦   +-- server.js               # Express server & production static file serving
¦
+-- frontend/
¦   +-- src/
¦   ¦   +-- components/
¦   ¦   ¦   +-- EditorToolbar.jsx   # Rich text formatting buttons
¦   ¦   ¦   +-- QRCodeModal.jsx     # Scannable & downloadable QR code modal
¦   ¦   ¦   +-- SettingsModal.jsx   # Note auto-destruction (TTL) modal
¦   ¦   ¦   +-- ThemeToggle.jsx     # Sun/Moon dark-light mode switch
¦   ¦   +-- context/
¦   ¦   ¦   +-- ThemeContext.jsx    # Persistent theme state manager
¦   ¦   +-- pages/
¦   ¦   ¦   +-- Home.jsx            # Landing page with custom slug input & quick generator
¦   ¦   ¦   +-- NoteEditor.jsx      # Dynamic note editor with 1.5s debounced auto-save
¦   ¦   +-- services/
¦   ¦   ¦   +-- api.js              # Environment-aware backend API client
¦   ¦   +-- App.jsx                 # Client-side routing (/, /:slug)
¦   ¦   +-- index.css               # Tailwind CSS & TipTap typography
¦   ¦   +-- main.jsx                # DOM mounting
¦   +-- index.html              # HTML shell with Google Inter font
¦   +-- package.json            # Frontend dependencies
¦   +-- tailwind.config.js      # Tailwind configuration
¦   +-- vite.config.js          # Vite config with API proxying
¦
+-- .gitignore                  # Strict Git rules protecting .env and node_modules
+-- package.json                # Root deployment script (Render / Railway / Heroku)
+-- README.md                   # Project documentation
```

---

## ?? Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas cluster)

### 2. Clone the Repository
```bash
git clone https://github.com/NandanNayak-dev/NoteFlow.git
cd NoteFlow
```

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/noteflow
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
# Server running on http://localhost:5000
```

### 4. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:5173
```

---

## ?? Production Deployment (Render)

This project is configured as a single unified service:

1. Push your repository to GitHub.
2. In **[Render.com](https://render.com/)**, create a **New Web Service** and select your repository.
3. Configure the build parameters:
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Set Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
5. Click **Deploy Web Service**. Render will install all dependencies, build the React frontend, and serve it via Express.

---

## ?? License

This project is open-source and available under the [MIT License](LICENSE).
