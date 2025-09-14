# SIH Bhoomipath

Live Deployment: [sih-bhoomipath.vercel.app](https://sih-bhoomipath.vercel.app)

## 🚀 Getting Started Locally

Follow these steps to run the project locally on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/AnuragGupta181/sih_bhoomipath.git
```

### 2. Navigate to project folder

```bash
cd sih_bhoomipath
```

---

## 🖥️ Frontend (React + Vite)

### Run with Bun

```bash
cd frontend
bun dev
```

### Or run with npm

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on a Vite port.

---

## ⚙️ Backend (Flask)

### Option A: Run directly

```bash
cd backend
python server.py
```

### Option B: Create virtual environment (recommended)

```bash
cd backend
python -m venv myenv
myenv\Scripts\activate   # On Windows
source myenv/bin/activate # On macOS/Linux

pip install -r requirements.txt
python server.py
```

The backend will start on [http://localhost:5000](http://localhost:5000).

---

## ✅ Summary

* **Frontend:** `cd frontend && bun dev` or `npm run dev`
* **Backend:** `cd backend && python server.py` (with or without venv)

Both frontend and backend should now be running locally.