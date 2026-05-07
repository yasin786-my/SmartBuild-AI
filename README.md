<p align="center">
  <img src="https://img.shields.io/badge/SmartBuild_AI-PC_Budget_Optimizer-00ff88?style=for-the-badge&logo=nvidia&logoColor=white" alt="SmartBuild AI" />
</p>

<h1 align="center">⚡ SmartBuild AI — PC Budget Optimizer</h1>

<p align="center">
  <strong>AI-powered PC build recommendations tailored to your budget and performance needs.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/Flask-ML_Service-000000?style=flat-square&logo=flask" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

---

## 📸 Screenshots

| Dashboard | Build Summary | Login |
|-----------|--------------|-------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Build](docs/screenshots/build-summary.png) | ![Login](docs/screenshots/login.png) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React 19)                    │
│         Vite · TypeScript · Tailwind · shadcn/ui            │
│              Zustand · TanStack Query                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP (port 5173 → 5000)
┌──────────────────────▼──────────────────────────────────────┐
│               NODE.JS GATEWAY (Express)                     │
│       JWT Auth · MongoDB · Build CRUD · Proxy               │
│                    Port 5000                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP (port 5000 → 5050)
┌──────────────────────▼──────────────────────────────────────┐
│             FLASK ML MICROSERVICE                           │
│    XGBoost/PyTorch Mock · Component DB · Budget Allocator   │
│          Currency Conversion · Pydantic                     │
│                    Port 5050                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query |
| **Backend Gateway** | Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs |
| **ML Service** | Python 3.10+, Flask, Pydantic, NumPy |
| **Auth** | JWT + Google & GitHub OAuth placeholders |
| **Charts** | Recharts (pie chart for budget allocation) |
| **PDF Export** | html2canvas + jsPDF |

---

## ✨ Features

- 🎚️ **Interactive Budget Slider** — Set your budget in INR (default) with real-time updates
- 🎮 **Performance Tier Cards** — Gaming, Workstation, Content Creation, Office
- 💱 **Multi-Currency Support** — INR (default), USD, EUR, GBP with `Intl.NumberFormat`
- 🤖 **AI-Powered Recommendations** — Component selection via ML mock (CPU, GPU, RAM, Storage, Motherboard, PSU, Case, Cooler)
- 📊 **Budget Allocation Pie Chart** — Visual breakdown of cost distribution
- 🔐 **JWT Authentication** — Login, Signup, Google & GitHub OAuth placeholders
- 💾 **Save & Manage Builds** — Full CRUD with build history
- 📄 **Export as PDF** — Download build configs as styled PDFs
- 🌙 **Dark Futuristic UI** — Animated tech circuitry background with glassmorphism
- 📱 **Responsive Mobile-First** — Works beautifully on all devices

---

## 📋 Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | ≥ 18.x | `node --version` |
| **npm** | ≥ 9.x | `npm --version` |
| **Python** | ≥ 3.10 | `python --version` |
| **pip** | ≥ 22.x | `pip --version` |
| **MongoDB** | ≥ 6.x | `mongod --version` |

> **Note:** MongoDB must be running locally on `mongodb://localhost:27017` or provide a connection string via `.env`.

---

## 📁 Project Structure

```
smartbuild-ai/
├── README.md
├── frontend/                    # React 19 + Vite + TypeScript
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── vite-env.d.ts
│       ├── components/
│       │   ├── ui/              # shadcn/ui components
│       │   ├── layout/          # Sidebar, Navbar, AnimatedBg
│       │   ├── auth/            # Login, Signup forms
│       │   ├── dashboard/       # BudgetSlider, TierCards, BuildSummary
│       │   └── build/           # PieChart, ComponentCard, PdfExport
│       ├── pages/
│       │   ├── DashboardPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── SignupPage.tsx
│       │   ├── HistoryPage.tsx
│       │   └── SettingsPage.tsx
│       ├── store/
│       │   └── useStore.ts      # Zustand store
│       ├── hooks/
│       │   └── useApi.ts        # TanStack Query hooks
│       ├── lib/
│       │   ├── api.ts           # Axios instance
│       │   ├── currency.ts      # Currency formatting utilities
│       │   └── utils.ts         # CN helper
│       └── types/
│           └── index.ts         # TypeScript interfaces
├── backend/                     # Node.js + Express Gateway
│   ├── package.json
│   ├── .env.example
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Build.js
│   └── routes/
│       ├── auth.js
│       ├── builds.js
│       └── ml.js                # Proxy to Flask ML service
└── ml-service/                  # Flask ML Microservice
    ├── requirements.txt
    ├── .env.example
    ├── app.py
    └── models/
        ├── __init__.py
        ├── components_db.py     # Mock component database
        ├── budget_allocator.py  # Budget allocation logic per tier
        └── currency.py          # Currency conversion logic
```

---

## ⚙️ Setup Instructions

### 1. Clone / Unzip the Project

```bash
# If you downloaded the zip
unzip smartbuild-ai.zip
cd smartbuild-ai
```

---

### 2. Flask ML Microservice (Port 5050)

```bash
# Navigate to ml-service
cd ml-service

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (macOS/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env

# Start the Flask server
python app.py
```

> ✅ ML Service running at `http://localhost:5050`

---

### 3. Node.js Backend Gateway (Port 5000)

```bash
# Open a new terminal
cd backend

# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env and set your JWT_SECRET and MongoDB URI

# Start the server
npm run dev
```

> ✅ Backend API running at `http://localhost:5000`

---

### 4. React Frontend (Port 5173)

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start development server
npm run dev
```

> ✅ Frontend running at `http://localhost:5173`

---

## 🔐 Environment Variables

### `backend/.env.example`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartbuild
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:5050
```

### `ml-service/.env.example`

```env
FLASK_PORT=5050
FLASK_ENV=development
```

### `frontend/.env.example`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 API Endpoints

### Backend Gateway (`:5000`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login & get JWT | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/builds` | Save a build | ✅ |
| GET | `/api/builds` | Get user's builds | ✅ |
| GET | `/api/builds/:id` | Get single build | ✅ |
| DELETE | `/api/builds/:id` | Delete a build | ✅ |
| POST | `/api/ml/optimize` | Get AI recommendation (proxied) | ✅ |

### Flask ML Service (`:5050`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/optimize` | Generate optimized build |
| GET | `/api/components` | List all components |
| GET | `/api/currencies` | Supported currencies + rates |

---

## 📦 How to Create the ZIP File

1. Make sure all three folders (`frontend/`, `backend/`, `ml-service/`) and `README.md` are in one parent folder called `smartbuild-ai/`.

2. **Windows (PowerShell):**
   ```powershell
   Compress-Archive -Path smartbuild-ai\* -DestinationPath smartbuild-ai.zip
   ```

3. **macOS / Linux:**
   ```bash
   zip -r smartbuild-ai.zip smartbuild-ai/
   ```

4. Share the `smartbuild-ai.zip` — the recipient just unzips, follows the setup instructions above, and they're running! 🚀

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the SmartBuild AI Team<br/>
  <sub>Open-source PC budget optimization powered by AI</sub>
</p>
