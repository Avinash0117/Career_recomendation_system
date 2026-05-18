# CareerPath.AI – Project Overview

This document explains **what** the project is, **how** it works, **what** we used, **why** we used it, and **how** everything fits together.

---

## 1. What Is This Project?

**CareerPath.AI** is a full-stack web application that recommends careers to users based on their **skills**, **interests**, **education**, **projects**, and **experience**. It:

- Lets users fill a profile form (name, phone, college, year, skills, interests, projects, experience).
- Sends that profile to a backend API.
- Uses a **dataset** of candidate profiles and recommended careers plus **TF-IDF** and **skill-overlap logic** to rank and return **top 5 career recommendations**.
- Shows each recommendation with a **match score**, **matched skills**, **skills to develop**, and **aligned interests**.
- Ensures **diversity** (e.g. not all 5 are front-end roles) so users see a mix of career types (front-end, backend, data, full-stack, ML, etc.).

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER (User)                                                  │
└───────────────────────────┬───────────────────────────────────┘
                             │
                             │  HTTP (JSON)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (React + Vite)                                         │
│  - Navbar, Hero, How it Works, Form, Results, Modal              │
│  - Axios calls POST /recommend with user profile                 │
└───────────────────────────┬───────────────────────────────────┘
                             │
                             │  POST /recommend  (JSON body)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (FastAPI + Uvicorn)                                     │
│  - main.py: CORS, routes, Pydantic model                         │
│  - ranking_model.py: load dataset, TF-IDF, scoring, diversity    │
│  - nlp_utils.py: text cleaning for TF-IDF                        │
└───────────────────────────┬───────────────────────────────────┘
                             │
                             │  reads CSV, computes scores
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  DATASET (dataset.csv)                                            │
│  Columns: CandidateID, Name, Age, Education, Skills, Interests,   │
│           Recommended_Career, Recommendation_Score                │
└─────────────────────────────────────────────────────────────────┘
```

- **Frontend**: React SPA served by Vite (dev) or built static files. Runs on a port (e.g. 5173/5174).
- **Backend**: FastAPI app run by Uvicorn. Listens on `http://127.0.0.1:8000`.
- **Data**: Recommendations are derived from `dataset.csv` plus the user’s input; no separate database.

---

## 3. Technology Stack – What We Used and Why

### 3.1 Frontend

| Technology | What it is | Why we use it |
|------------|------------|----------------|
| **React 18** | UI library (components, state, hooks) | Standard, component-based UI; good for form + dynamic results. |
| **Vite** | Build tool and dev server | Fast HMR, simple config, modern ESM. |
| **Tailwind CSS v4** | Utility-first CSS | Quick styling without custom CSS files; `@tailwindcss/vite` integrates with Vite. |
| **Framer Motion** | Animation library | Smooth animations (hero, cards, modal) and `AnimatePresence` for enter/exit. |
| **Lucide React** | Icon set | Consistent, tree-shakeable icons (User, Sparkles, BookOpen, etc.). |
| **Axios** | HTTP client | Simple API for `POST /recommend` and reading `response.data.recommendations`. |

**How they work together:**  
`index.html` loads `main.jsx` → `main.jsx` renders `<App />` and imports `index.css`. `App.jsx` composes `Navbar`, form, results grid, and `JobDetailModal`. Tailwind (via `@tailwindcss/vite`) compiles utility classes; Framer Motion wraps elements for animations; Axios sends the form data to the backend and stores the returned list in state so the UI re-renders with recommendations.

### 3.2 Backend

| Technology | What it is | Why we use it |
|------------|------------|----------------|
| **FastAPI** | Async Python web framework | Automatic OpenAPI docs, validation, and fast to write. |
| **Uvicorn** | ASGI server | Runs the FastAPI app; supports `--reload` during development. |
| **Pydantic** | Data validation | `UserProfile` model validates request body and gives typed fields. |
| **Pandas** | Data manipulation | Load and work with `dataset.csv` (rows = candidate profiles → career). |
| **NumPy** | Numerical arrays | Store scores (overlap, cosine, etc.) and sort indices. |
| **scikit-learn** | ML utilities | `TfidfVectorizer` and `cosine_similarity` for text-based similarity. |
| **NLTK** | NLP utilities | Tokenization, stopwords, lemmatization in `nlp_utils.py` for cleaning text before TF-IDF. |

**How they work together:**  
Uvicorn runs `main:app`. On `POST /recommend`, FastAPI parses the body into `UserProfile`, then calls `ranker.recommend(...)`. The ranker uses Pandas to read the dataset, NLTK (via `nlp_utils`) to clean text, scikit-learn to build TF-IDF and cosine similarity, and custom logic to compute per-job overlap, user utilization, and diversity. The result is a list of recommendation objects returned as JSON.

### 3.3 Dataset

| Item | What it is | Why it matters |
|------|------------|----------------|
| **dataset.csv** | CSV with candidate profiles and recommended careers | Each row = one “ideal” profile for a career. We match the **user** to these rows and return the **Recommended_Career** (and related fields) for the best matches. |

**Columns:**

- `CandidateID`, `Name`, `Age`, `Education` – metadata.
- `Skills` – semicolon-separated (e.g. `Python;Data Analysis;Machine Learning`).
- `Interests` – semicolon-separated (e.g. `Technology;Data Science`).
- `Recommended_Career` – job title (e.g. Data Scientist, Front-end Developer).
- `Recommendation_Score` – quality score in [0, 1] for that career in the dataset.

The backend normalizes column names (lowercase, spaces → underscores) and uses `Skills` and `Interests` for matching and for building the TF-IDF matrix.

---

## 4. Components – What Exists and What They Do

### 4.1 Frontend Components

| Component | File | Purpose |
|-----------|------|--------|
| **App** | `src/App.jsx` | Root: state (formData, results, error, selectedJob), form submit handler, layout (hero, “How it Works”, form, results grid, modal). Calls API and passes data to children. |
| **Navbar** | `src/components/Navbar.jsx` | Fixed top bar: logo, “How it Works”, “About Us”, “GitHub”, “Get Started”. Scrolls to `#how-it-works`, `#about`, `#get-started`; GitHub opens an external URL. |
| **RecommendationCard** | `src/components/RecommendationCard.jsx` | One card per recommendation: career name, match score, progress bar, matched skills, skills to develop, aligned interests, “View career details” button. Uses Framer Motion for entrance. |
| **JobDetailModal** | `src/components/JobDetailModal.jsx` | Full-screen overlay for one job: required skills (you have / to develop), aligned interests, “Copy to clipboard”, “Start learning path” (opens Coursera search). |

**What makes them work:**  
React state in `App` holds `results` and `selectedJob`. When the API returns, `App` maps over `results` and renders a `RecommendationCard` for each; clicking a card sets `selectedJob`, so `JobDetailModal` receives that job and shows details. Navbar uses `document.getElementById(...).scrollIntoView({ behavior: 'smooth' })` and an `<a>` for GitHub.

### 4.2 Backend “Components” (Modules)

| Module | File | Purpose |
|--------|------|--------|
| **API & routes** | `main.py` | Defines FastAPI app, CORS, `UserProfile` (Pydantic), `GET /` and `POST /recommend`. Calls `ranker.recommend(...)` and returns `{ recommendations }` or “No direct matches”. |
| **Ranking engine** | `ranking_model.py` | Loads `dataset.csv`, builds TF-IDF on skills+interests, parses user skills (with synonyms and normalization), computes per-job overlap and user utilization, applies diversity (max 2 per career category), returns top 5 with `matched_skills`, `skills_to_develop`, `matched_interests`, `match_score`. |
| **NLP helpers** | `nlp_utils.py` | Downloads NLTK data; provides `clean_text()` (lowercase, keep tech tokens like C++, tokenize, remove stopwords, lemmatize) for TF-IDF input. |

**What makes them work:**  
`main.py` imports `ranker` (singleton `CareerRanker()`). On first request (or at import), the ranker loads the CSV and fits the TF-IDF vectorizer. Each `/recommend` request runs the full pipeline: parse user input → expand synonyms → compute scores → apply diversity → build response list.

---

## 5. How a Recommendation Request Works (End to End)

1. **User** fills the form (name, skills, interests, etc.) and clicks “Find Career Path”.
2. **App.jsx** validates (name, skills, interests required), sets loading, then `axios.post('/recommend', formData)` with base URL `http://127.0.0.1:8000`.
3. **FastAPI** receives the body, validates it with `UserProfile`, and calls `ranker.recommend(user_skills=..., user_interests=..., user_projects=..., user_experience=...)`.
4. **ranking_model.py**:
   - Parses user skills/interests (split on `,`, `;`, “ and ”, etc.) and normalizes (e.g. “javascript(js)” → javascript + js, “java script” → javascript).
   - Expands synonyms (e.g. dbms → sql, database, data warehousing) into `user_effective_skills`.
   - For each row in the dataset:
     - Gets job skills/interests as lists.
     - Computes **matched_skills** (job skills in user_effective_skills) and **skills_to_develop** (rest).
     - Computes **matched_interests**.
     - Computes **overlap_score** (e.g. 0.7 × skill_overlap + 0.3 × interest_overlap) and **user_utilization** (how many of the user’s skills this job uses).
   - Builds **TF-IDF** on dataset “skills + interests” (cleaned with `nlp_utils.clean_text`), then **cosine_similarity** between user text and each row.
   - **Final score** = 0.35×overlap + 0.20×user_utilization + 0.30×cosine + 0.15×dataset_score.
   - Sorts by score, then applies **diversity**: at most 2 per category (frontend, backend, data, fullstack, ml, devops, other). Fills up to 5 recommendations; if fewer than 5 after diversity, fills remaining by score.
5. **main.py** returns `{ "recommendations": [ {...}, ... ] }` (each item has `recommended_career`, `match_score`, `matched_skills`, `skills_to_develop`, `matched_interests`, etc.).
6. **App.jsx** sets `results = response.data.recommendations` and clears loading/error.
7. **UI** re-renders: hero + form on the left, result cards on the right (or full width on small screens). Each card shows different matched skills and skills to develop because they are computed **per job** in the backend.
8. Clicking “View career details” sets `selectedJob`; **JobDetailModal** shows that job’s details and the working buttons (copy, learning path).

---

## 6. What Makes Each Part “Work”

- **Frontend shows correct data:** Axios response is stored in React state; components receive `job` or `results` as props and render `job.recommended_career`, `job.matched_skills`, etc.
- **Different skills to develop per job:** Backend builds `row_matched_skills` and `row_skills_to_develop` **per row** (per job) and attaches them to each recommendation object; the frontend does not reuse one list for all cards.
- **Scores and diversity:** Final score combines overlap, user utilization, cosine, and dataset score. Diversity uses a simple category label (e.g. “Front-end Developer” → frontend) and caps at 2 per category so the top 5 are mixed (e.g. front-end + Python/backend + data).
- **Synonyms and parsing:** Same user input is matched to dataset terms like “SQL” and “Data Warehousing” when the user types “dbms”; “javascript(js)” and “java script” both contribute to matching “JavaScript” in the dataset.
- **Buttons work:** Navbar uses `scrollTo(id)` and `<a href={GITHUB_URL}>`; modal uses `navigator.clipboard.writeText(...)` and `window.open(...)` for learning path.

---

## 7. File Structure (Summary)

```
career-recommendation-system/
├── frontend/
│   ├── index.html              # Entry HTML, mounts root
│   ├── package.json             # React, Vite, Tailwind, Framer Motion, Axios, Lucide
│   ├── vite.config.js           # Vite + React + Tailwind plugins
│   ├── postcss.config.js        # Autoprefixer (Tailwind via Vite plugin)
│   ├── src/
│   │   ├── main.jsx             # React root, renders App
│   │   ├── App.jsx              # Main layout, form, API call, results, modal
│   │   ├── index.css            # Tailwind import, global/glass styles
│   │   └── components/
│   │       ├── Navbar.jsx       # Top bar + scroll/GitHub/Get Started
│   │       ├── RecommendationCard.jsx   # One recommendation card
│   │       └── JobDetailModal.jsx       # Job detail overlay + actions
│   └── ...
├── backend/
│   ├── main.py                  # FastAPI app, CORS, / and /recommend
│   ├── ranking_model.py         # Dataset load, TF-IDF, scoring, diversity
│   ├── nlp_utils.py             # NLTK text cleaning for TF-IDF
│   ├── dataset.csv              # Candidate profiles → careers
│   └── requirements.txt         # fastapi, uvicorn, pandas, numpy, nltk, scikit-learn, python-multipart
└── PROJECT_OVERVIEW.md          # This file
```

---

## 8. Quick Reference

| Goal | Where it happens |
|------|------------------|
| User submits profile | `App.jsx` → `handleSearch` → `axios.post('/recommend', formData)` |
| API validates and calls ranker | `main.py` → `recommend_job(user)` → `ranker.recommend(...)` |
| Parse skills (e.g. “javascript(js)”) | `ranking_model.py` → `_parse_skills_set`, `_normalize_skill_token` |
| Synonyms (e.g. dbms → sql) | `ranking_model.py` → `SKILL_SYNONYMS`, `_user_effective_skills` |
| Per-job matched / to-develop | `ranking_model.py` → `_match_skills_and_to_develop` per row |
| TF-IDF + cosine | `ranking_model.py` → `TfidfVectorizer`, `cosine_similarity` (sklearn) |
| Text cleaning for TF-IDF | `nlp_utils.py` → `clean_text` (NLTK tokenize, stopwords, lemmatize) |
| Diversity (max 2 per type) | `ranking_model.py` → `_career_category`, `category_counts`, `max_per_category` |
| Show results | `App.jsx` → `results.map` → `RecommendationCard`; click → `setSelectedJob` → `JobDetailModal` |
| How it Works / About / Get Started | `Navbar.jsx` → `scrollTo('how-it-works' | 'about' | 'get-started')` |
| GitHub button | `Navbar.jsx` → `<a href={GITHUB_URL}>` |
| Start learning path | `JobDetailModal.jsx` → `window.open(Coursera search URL)` |
| Copy to clipboard | `JobDetailModal.jsx` → `navigator.clipboard.writeText(...)` |

---

This is the full picture of the project: components, technologies, data flow, and how each part is used and why.
