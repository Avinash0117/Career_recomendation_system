"""
Career recommendation engine using the dataset.
- Accurate skill parsing (handles "and", commas, semicolons).
- Synonym expansion (e.g. DBMS <-> SQL, TensorFlow <-> Deep Learning).
- Per-job matched_skills, skills_to_develop, matched_interests (each recommendation gets its own lists).
- Ranking by explicit skill overlap first, then cosine similarity, so Python+TensorFlow+DBMS -> ML/Data roles.
"""
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nlp_utils import nlp_processor
import os
import re

_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DATASET_PATH = os.path.join(_BACKEND_DIR, "dataset.csv")

# Normalize for matching: lowercase, strip, collapse spaces
def _norm(s):
    if not s:
        return ""
    return " ".join(str(s).lower().strip().split())


def _normalize_skill_token(t):
    """Normalize a single skill token: handle 'javascript(js)' -> 'javascript', 'java script' -> 'javascript', 'c++' etc."""
    t = _norm(t)
    if not t:
        return None
    # Strip parenthetical suffixes for matching: "javascript(js)" -> "javascript", "js"
    m = re.match(r"^(.+?)\s*\(([^)]+)\)\s*$", t)
    if m:
        main, alt = _norm(m.group(1)), _norm(m.group(2))
        # Return both as separate tokens via caller handling
        return (main, alt) if main != alt else (main,)
    # Normalize common variants
    if t in ("java script", "javascript", "js"):
        return ("javascript",)
    if t == "c++":
        return ("c++",)
    return (t,)


def _parse_skills_set(text):
    """
    Parse skills/interests into a set of normalized tokens.
    Splits on: comma, semicolon, pipe, " and ", " & ", newline.
    Handles: "javascript(js)" -> javascript, js; "java script" -> javascript; "c++" -> c++.
    """
    if not isinstance(text, str) or not text.strip():
        return set()
    text = _norm(text)
    tokens = re.split(r"[;,|\n]+|\s+and\s+|\s*&\s*", text)
    out = set()
    for t in tokens:
        normalized = _normalize_skill_token(t)
        if normalized:
            for n in normalized:
                if n:
                    out.add(n)
    return out


# Synonyms: user skill (key) -> set of terms that count as "user has this" for matching job skills.
SKILL_SYNONYMS = {
    "dbms": {"dbms", "sql", "database", "data warehousing", "etl", "data"},
    "sql": {"sql", "dbms", "database", "data warehousing", "etl"},
    "database": {"database", "dbms", "sql", "data warehousing"},
    "data warehousing": {"data warehousing", "dbms", "sql", "etl"},
    "etl": {"etl", "sql", "dbms", "data warehousing"},
    "tensorflow": {"tensorflow", "tensor flow", "deep learning", "ml", "machine learning"},
    "tensor flow": {"tensorflow", "tensor flow", "deep learning", "ml", "machine learning"},
    "deep learning": {"deep learning", "tensorflow", "ml", "machine learning"},
    "machine learning": {"machine learning", "ml", "tensorflow", "deep learning"},
    "ml": {"ml", "machine learning", "tensorflow", "deep learning"},
    "python": {"python"},
    "javascript": {"javascript", "js"},
    "js": {"javascript", "js"},
    "html": {"html"},
    "css": {"css"},
    "web development": {"web development", "javascript", "html", "css"},
    "data analysis": {"data analysis", "analytics", "sql", "python"},
    "nlp": {"nlp", "natural language processing", "machine learning"},
    "natural language processing": {"nlp", "natural language processing", "machine learning"},
    "c++": {"c++"},
}


def _user_effective_skills(user_skills_set):
    """Expand user skills with synonyms so we can match job skills like SQL when user said DBMS."""
    out = set()
    for u in user_skills_set:
        un = _norm(u)
        out.add(un)
        out.update(SKILL_SYNONYMS.get(un, set()))
    return out


def _match_skills_and_to_develop(user_skills_set, job_skills_list, user_effective_skills_set):
    """
    For one job: which of job_skills_list the user has (matched) vs must develop (to_develop).
    user_effective_skills_set already includes synonym expansion (e.g. dbms -> sql, data warehousing).
    """
    matched = []
    to_develop = []
    for j in job_skills_list:
        jn = _norm(j)
        if jn in user_effective_skills_set:
            matched.append(j)
        else:
            to_develop.append(j)
    return matched, to_develop


def _match_interests(user_interests_set, job_interests_list):
    """Which job interests align with user interests (normalized overlap)."""
    user_norm = {_norm(i) for i in user_interests_set}
    matched = []
    for j in job_interests_list:
        if _norm(j) in user_norm:
            matched.append(j)
    return matched


def _job_skills_and_interests_lists(row):
    """Get job skills and interests as lists (original strings for display) from a dataframe row."""
    skills_str = row.get("skills") or ""
    interests_str = row.get("interests") or ""
    skills_list = [s.strip() for s in re.split(r"[;,|\n]+", skills_str) if s.strip()]
    interests_list = [s.strip() for s in re.split(r"[;,|\n]+", interests_str) if s.strip()]
    return skills_list, interests_list


class CareerRanker:
    def __init__(self, dataset_path=None):
        self.dataset_path = dataset_path or DEFAULT_DATASET_PATH
        self.df = None
        self.vectorizer = None
        self.tfidf_matrix = None
        self.is_ready = False

        if os.path.exists(self.dataset_path):
            self.train_pipeline()

    def train_pipeline(self):
        print("Loading dataset and building recommendation model...")

        self.df = pd.read_csv(self.dataset_path)
        self.df.columns = self.df.columns.str.strip().str.replace(" ", "_").str.lower()

        self.df["combined_features"] = (
            self.df["skills"].fillna("") + " " + self.df["interests"].fillna("")
        )
        self.df["clean_text"] = self.df["combined_features"].apply(nlp_processor.clean_text)

        self.vectorizer = TfidfVectorizer(max_features=5000)
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df["clean_text"]).toarray()

        self.is_ready = True
        print("Ranking model ready (dataset-based + TF-IDF).")

    def recommend(self, user_skills, user_interests, user_projects="", user_experience=""):
        if not self.is_ready:
            return []

        user_text = f"{user_skills} {user_interests} {user_projects} {user_experience}"
        clean_query = nlp_processor.clean_text(user_text)
        query_vector = self.vectorizer.transform([clean_query]).toarray()

        cosine_sim = cosine_similarity(query_vector, self.tfidf_matrix).flatten()
        dataset_scores = self.df["recommendation_score"].values

        user_skills_set = _parse_skills_set(user_skills)
        user_interests_set = _parse_skills_set(user_interests)
        user_effective_skills = _user_effective_skills(user_skills_set)

        # Build per-row: overlap score, matched_skills, skills_to_develop, matched_interests
        n = len(self.df)
        overlap_scores = np.zeros(n)
        row_matched_skills = []
        row_skills_to_develop = []
        row_matched_interests = []
        row_skills_list = []
        row_interests_list = []

        for idx in range(n):
            row = self.df.iloc[idx]
            job_skills_list, job_interests_list = _job_skills_and_interests_lists(row)
            job_skills_set = set(_norm(s) for s in job_skills_list)
            job_interests_set = set(_norm(i) for i in job_interests_list)

            matched_skills, skills_to_develop = _match_skills_and_to_develop(
                user_skills_set, job_skills_list, user_effective_skills
            )
            matched_interests = _match_interests(user_interests_set, job_interests_list)

            row_matched_skills.append(matched_skills)
            row_skills_to_develop.append(skills_to_develop)
            row_matched_interests.append(matched_interests)
            row_skills_list.append(job_skills_list)
            row_interests_list.append(job_interests_list)

            num_job_skills = max(1, len(job_skills_set))
            num_job_interests = max(1, len(job_interests_set))
            skill_overlap = len(matched_skills) / num_job_skills
            interest_overlap = len(matched_interests) / num_job_interests
            overlap_scores[idx] = 0.7 * skill_overlap + 0.3 * interest_overlap

        num_user_skills = max(1, len(user_skills_set))
        user_utilization = np.array([
            len(row_matched_skills[i]) / num_user_skills for i in range(n)
        ])

        # Rank: overlap + how many of user's skills this job uses (so Python jobs rank when user has Python)
        final_scores = (
            0.35 * overlap_scores
            + 0.20 * user_utilization
            + 0.30 * cosine_sim
            + 0.15 * dataset_scores
        )

        results_indices = np.argsort(final_scores)[::-1]

        # Diversity: ensure mix of career types (frontend, backend, data, fullstack, etc.)
        def _career_category(career_name):
            c = (career_name or "").lower()
            if "front" in c or "frontend" in c or "front-end" in c:
                return "frontend"
            if "back" in c or "software engineer" in c or "software developer" in c:
                return "backend"
            if "data analyst" in c or "data scientist" in c or "data engineer" in c or "business analyst" in c:
                return "data"
            if "full stack" in c or "fullstack" in c:
                return "fullstack"
            if "machine learning" in c or "ml engineer" in c or "ai " in c or "deep learning" in c or "nlp" in c or "researcher" in c or "research scientist" in c:
                return "ml"
            if "devops" in c or "cloud" in c:
                return "devops"
            if "project manager" in c or "marketing" in c or "ux " in c or "designer" in c:
                return "other"
            return "other"

        seen_careers = set()
        category_counts = {}
        max_per_category = 2
        recommendations = []
        candidate_indices = list(results_indices)

        def add_recommendation(idx):
            row = self.df.iloc[idx]
            career = row.get("recommended_career", "")
            if career in seen_careers:
                return False
            seen_careers.add(career)
            matched_skills = list(row_matched_skills[idx])
            skills_to_develop = list(row_skills_to_develop[idx])
            matched_interests = list(row_matched_interests[idx])
            required_skills = list(row_skills_list[idx])
            overlap_val = float(overlap_scores[idx])
            util_val = float(user_utilization[idx])
            cos_val = float(cosine_sim[idx])
            ds_val = float(dataset_scores[idx])
            match_score = min(100.0, max(0.0, round(100 * (0.35 * overlap_val + 0.20 * util_val + 0.30 * cos_val + 0.15 * ds_val), 2)))
            rec = row.to_dict()
            rec["recommended_career"] = career
            rec["match_score"] = match_score
            rec["cosine_score"] = round(cos_val, 4)
            rec["matched_skills"] = matched_skills
            rec["matched_interests"] = matched_interests
            rec["skills_to_develop"] = skills_to_develop
            rec["required_skills"] = required_skills
            recommendations.append(rec)
            return True

        for idx in candidate_indices:
            if cosine_sim[idx] <= 0.0 and overlap_scores[idx] <= 0.0:
                continue
            row = self.df.iloc[idx]
            career = row.get("recommended_career", "")
            if career in seen_careers:
                continue
            cat = _career_category(career)
            if category_counts.get(cat, 0) >= max_per_category:
                continue
            category_counts[cat] = category_counts.get(cat, 0) + 1
            if add_recommendation(idx):
                if len(recommendations) >= 5:
                    return recommendations
            else:
                category_counts[cat] -= 1

        # If diversity left us with fewer than 5, fill from remaining by score
        for idx in candidate_indices:
            if len(recommendations) >= 5:
                break
            add_recommendation(idx)

        return recommendations


ranker = CareerRanker()
