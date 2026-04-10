# <💻Laptop Predictor>

## Description

A static web that powered by a machine learning model that enables you to predict or estimate a laptop’s price based on the specs you input (RAM, Brand, CPU, Storage, etc…). Built with a Python FastAPI backend (scikit-learn) and a React + Vite frontend.

## 📝 Setup Installation

1. Clone the repo and go inside the main project folder
2. Create & activate venv

```text
uv venv
# Linux: source .venv/bin/activate  
# Windows: .venv\Scripts\activate
```

3. Install dependencies

```text
uv pip install -r requirements.txt
```

4. Run API server

```text
uvicorn api:app --reload
```

5. Run the frontend web

```text
cd website
npm install
npm run dev
```

## ✨ Features

- Real-time price prediction from user input
- Dropdown menus populated from training data to prevent invalid entries
- Responsive, modern UI with clean design
- Pre-trained Random Forest model with optimized hyperparameters

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, scikit-learn, pandas, joblib
- **Frontend**: React, Vite, Vanilla CSS
- **ML Model**: RandomForestRegressor (tuned via RandomizedSearchCV)
- **Data**: Laptop specifications dataset (features: Category, OS, CPU Tier, GPU Type, RAM, Screen Size, Storage, Weight)

## 📁 Architecture

```architecture
your-folder-name/
├── __pycache__/
├── .venv
├── screenshots/
├── website/
│   ├── node_modules
│   ├── public/
│   │   └── dropdowns.json
│   ├── src/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
├── api.py
├── dropdowns.json
├── encoder.pkl
├── laptop_test.csv
├── laptop_train.csv
├── model.pkl
├── requirements.txt
└── train_model.ipynb
```

<!-- -->
