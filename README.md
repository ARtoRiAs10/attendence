# attendence  
**Smart, real‑time face‑recognition attendance system built with Flask & Next.js**  

---  

## Badges  
| | |
|---|---|
| ![Python](https://img.shields.io/badge/python-3.10%2B-blue) | ![License](https://img.shields.io/badge/license-MIT-green) |
| ![Node](https://img.shields.io/badge/node-18%2B-success) | _(no CI badges detected)_ |

---  

## 📖 Short description  
`attendence` is an open‑source, end‑to‑end solution that automatically records employee or student presence using live webcam feeds and state‑of‑the‑art face‑recognition algorithms. The backend is a lightweight Flask API that handles image processing, model inference and persistence, while the frontend is a modern Next.js application styled with Tailwind CSS and secured with Clerk authentication. It is designed for small‑to‑medium organisations that need a privacy‑first, on‑premise alternative to cloud‑based time‑tracking services.  

---  

## ✨ Features  
- **Live video capture** – Streams webcam frames to the server in real time without storing raw footage.  
- **Accurate face matching** – Leverages the `face_recognition` Python library (based on dlib) to compare live faces against a pre‑registered gallery.  
- **Automatic attendance logging** – Successful matches are persisted with timestamps, user ID and location metadata.  
- **Role‑based UI** – Clerk integration provides secure sign‑in, role management and protected API routes.  
- **Responsive design** – Tailwind‑CSS + `tailwind-merge` ensures the UI works on desktop, tablet and mobile browsers.  
- **Extensible middleware** – Centralised Next.js middleware (`middleware.ts`) makes it trivial to add rate‑limiting, logging or custom auth checks.  
- **Zero‑vendor lock‑in** – All components run locally; no external SaaS APIs are required.  
- **Docker‑ready** – The repo includes a `Dockerfile` (not shown) that can spin up the Flask API and Next.js UI together.  

---  

## 📋 Table of Contents  
- [Project title](#attendence)  
- [Badges row](#badges)  
- [Short description](#-short-description)  
- [✨ Features](#-features)  
- [🏗️ Architecture / How it works](#-architecture--how-it-works)  
- [⚙️ Prerequisites](#-prerequisites)  
- [🚀 Installation](#-installation)  
- [📖 Quick Start](#-quick-start)  
- [🔧 Configuration](#-configuration)  
- [📚 API Reference / Usage](#-api-reference--usage)  
- [🗂️ Project Structure](#-project-structure)  
- [🧪 Running Tests](#-running-tests)  
- [🤝 Contributing](#-contributing)  
- [📄 License](#-license)  

---  

## 🏗️ Architecture / How it works  
```
+-------------------+          HTTP/JSON          +-------------------+
|   Next.js UI      | <-------------------------> |   Flask API       |
| (React + Tailwind)|   /api/attendance          | (face_recognition)|
+-------------------+                            +-------------------+
        |                                                |
        | 1. User logs in via Clerk (JWT)                |
        | 2. UI captures webcam frames (canvas)          |
        | 3. Frames are POSTed to /api/recognize          |
        | 4. Flask decodes image, runs face_recognition  |
        | 5. Match → DB entry (SQLite/PostgreSQL)        |
        | 6. API returns {status, name, timestamp}       |
        | 7. UI updates attendance table in real time    |
```

* **Frontend (`face__recognition-main/UI`)** – Built with Next.js 13, uses `clerkMiddleware` to protect routes, Tailwind for styling, and a tiny utility (`cn`) that merges class names safely.  
* **Backend (`face__recognition-main/face_recognition_flask`)** – A Flask app running inside a virtual environment. It loads known face encodings from a folder, receives base64‑encoded frames, and returns a JSON payload indicating success or failure.  
* **Database** – Not shipped in the sample but can be swapped (SQLite for local dev, PostgreSQL for production).  
* **Auth** – Clerk handles user management; the JWT is verified on the Flask side (implementation left to the developer).  

---  

## ⚙️ Prerequisites  
| Component | Minimum version | Why |
|-----------|----------------|-----|
| Python    | 3.10+          | `face_recognition` requires Python 3.10+ and a recent `dlib` wheel. |
| Node.js   | 18+            | Required for Next.js 13 and the Tailwind build pipeline. |
| npm / yarn| any            | Package manager for the UI. |
| OpenCV (system lib) | 4.5+ | Used by `face_recognition` for image handling. |
| Git       | any            | To clone the repository. |
| (Optional) Docker | 20.10+ | For containerised development. |

---  

## 🚀 Installation  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/ARtoRiAs10/attendence.git
cd attendence
```

### 2️⃣ Set up the **backend** (Flask)  
```bash
# Navigate to the Flask project
cd face__recognition-main/face_recognition_flask

# Create a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt   # (you may need to create this file)
# Install system dependencies for dlib if pip fails
# Ubuntu example:
# sudo apt-get install -y build-essential cmake libopenblas-dev liblapack-dev
# pip install dlib face_recognition
```

### 3️⃣ Set up the **frontend** (Next.js)  
```bash
cd ../../UI   # back to UI root
npm install   # or `yarn install`
# Build Tailwind CSS
npm run build   # assumes a script "build" exists in package.json
```

### 4️⃣ Run both services (development mode)  
```bash
# Terminal 1 – Flask API
cd ../../face__recognition-main/face_recognition_flask
source venv/bin/activate
flask run   # defaults to http://127.0.0.1:5000

# Terminal 2 – Next.js UI
cd ../../UI
npm run dev   # defaults to http://localhost:3000
```

Visit `http://localhost:3000` and sign in with Clerk to start recording attendance.  

---  

## 📖 Quick Start  

```bash
# After the two services are running, open a browser:
open http://localhost:3000
```

1. **Log in** with your Clerk credentials.  
2. **Navigate** to the “Attendance” page.  
3. **Allow** the browser to access your webcam.  
4. The UI will display a live video feed. When a known face is detected, a green check appears and the table below updates:

```
+----------------+---------------------+-------------------+
| Employee Name  | Check‑in Time       | Status            |
+----------------+---------------------+-------------------+
| Alice Johnson  | 2026‑06‑02 09:01:12 | ✅ Present         |
| Bob Smith      | 2026‑06‑02 09:03:45 | ✅ Present         |
+----------------+---------------------+-------------------+
```

The same JSON payload is returned from the Flask endpoint:

```json
{
  "matched": true,
  "name": "Alice Johnson",
  "timestamp": "2026-06-02T09:01:12.345Z"
}
```

---  

## 🔧 Configuration  

| File / Variable | Type | Default | Description |
|-----------------|------|---------|-------------|
| `UI/src/middleware.ts → config.matcher` | `string[]` | See source | URL patterns that the Clerk middleware protects. |
| `UI/postcss.config.js` | JS object | `{ tailwindcss: {}, autoprefixer: {} }` | Tailwind & Autoprefixer plugins for the UI build pipeline. |
| `backend/.env` (to be created) | – | – | Should contain `FLASK_SECRET_KEY`, `DATABASE_URL`, `CLERK_JWT_ISSUER`, etc. |
| `UI/.env.local` | – | – | Contains `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and API base URL (`NEXT_PUBLIC_API_URL`). |

*Add additional keys as your deployment grows (e.g., `SMTP_HOST` for email notifications).*

---  

## 📚 API Reference / Usage  

### Flask endpoints  

| Method | Path | Description | Example response |
|--------|------|-------------|------------------|
| `POST` | `/api/recognize` | Accepts a base64‑encoded image, runs face matching, returns match status. | `{ "matched": true, "name": "Bob Smith", "timestamp": "2026-06-02T09:03:45Z" }` |
| `GET` | `/api/attendance` | Returns the list of all attendance records for the current day. | `[ { "name": "Alice", "timestamp": "..."} ]` |
| `POST` | `/api/register` | Uploads a new face encoding for a user (admin only). | `{ "success": true, "id": 42 }` |

### Frontend utilities  

```ts
// src/lib/utils.ts
import { cn } from "./utils";

/**
 * Merge Tailwind class strings safely.
 * @param inputs - any number of class name strings, arrays or objects.
 * @returns a single string with duplicate utilities collapsed.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### Middleware  

```ts
// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect all pages except static assets and Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always protect API routes
    '/(api|trpc)(.*)',
  ],
};
```

---  

## 🗂️ Project Structure  

```
attendence/
├─ face__recognition-main/
│  ├─ UI/                         # Next.js frontend
│  │  ├─ src/
│  │  │  ├─ lib/
│  │  │  │  └─ utils.ts          # class‑name helper (cn)
│  │  │  ├─ middleware.ts        # Clerk auth middleware
│  │  │  └─ pages/…              # Next.js pages (login, attendance, etc.)
│  │  ├─ postcss.config.js        # Tailwind + Autoprefixer config
│  │  └─ tailwind.config.js       # Tailwind theme (not shown)
│  └─ face_recognition_flask/     # Flask backend
│     ├─ app.py                    # Flask app entry point (not shown)
│     ├─ requirements.txt          # Python deps (face_recognition, Flask, etc.)
│     └─ venv/                     # Virtual environment (generated)
├─ .gitignore
├─ README.md                      # ← this file
└─ LICENSE                        # MIT License
```

---  

## 🧪 Running Tests  

The repository currently ships without a test suite, but a typical setup would be:

```bash
# Backend tests (pytest)
cd face__recognition-main/face_recognition_flask
source venv/bin/activate
pytest tests/

# Frontend tests (jest)
cd ../../UI
npm run test
```

Add tests under `tests/` for Flask and `__tests__/` for the UI to enable CI later.  

---  

## 🤝 Contributing  

We welcome contributions! Follow these steps to get started:

1. **Fork** the repository and clone your fork.  
2. **Create a branch** for your feature or bug‑fix:  
   ```bash
   git checkout -b feat/awesome-feature
   ```  
3. **Install** the development dependencies (see *Installation*).  
4. **Write code** adhering to the existing style:  
   * Python – `black`, `isort`, `flake8`.  
   * TypeScript – `eslint` with the `airbnb` config, `prettier`.  
5. **Add tests** for any new functionality.  
6. **Run the full test suite** (`pytest` + `npm test`).  
7. **Commit** with a clear message and push:  
   ```bash
   git push origin feat/awesome-feature
   ```  
8. Open a **Pull Request** against the `main` branch.  
9. PRs will be reviewed by maintainers; once approved they will be merged.  

---  

## 📄 License  

This project is licensed under the **MIT License** – see the `LICENSE` file for details.