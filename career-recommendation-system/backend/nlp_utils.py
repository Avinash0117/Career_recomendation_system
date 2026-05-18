import nltk
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer


def _find_or_download(find_path, download_name):
    """Ensure an NLTK resource exists; download quietly if missing."""
    try:
        nltk.data.find(find_path)
    except LookupError:
        nltk.download(download_name, quiet=True)


def download_nltk_resources():
    """Idempotent: punkt (classic) and punkt_tab (NLTK 3.9+) for tokenizers; corpora for NLP."""
    _find_or_download("tokenizers/punkt", "punkt")
    try:
        nltk.data.find("tokenizers/punkt_tab/english/")
    except LookupError:
        try:
            nltk.download("punkt_tab", quiet=True)
        except Exception:
            pass
    for corpus in ("stopwords", "wordnet", "omw-1.4"):
        _find_or_download(f"corpora/{corpus}", corpus)


download_nltk_resources()

class NLPProcessor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()

    def clean_text(self, text):
        """
        Preprocesses input text:
        1. Converts to lowercase
        2. Removes special characters (but KEEPS C++, C#, .NET, etc.)
        3. Tokenizes
        4. Removes stopwords
        5. Lemmatizes (reduces words to base form)
        """
        if not isinstance(text, str):
            return ""
        
        # 1. Lowercase
        text = text.lower()
        
        # 2. Smart Cleaning for Tech Terms
        # We want to keep C++, C#, .NET, Node.js, etc.
        # So we only remove characters that are strictly NOT alphanumeric OR common tech symbols (+, #, .)
        # But we must be careful not to keep punctuation at the end of sentences if it's not part of a term.
        # Strategy: Replace non-allowed chars with space
        
        # Allow: a-z, 0-9, +, #, .
        text = re.sub(r'[^a-z0-9\+\#\.]', ' ', text)
        
        # 3. Tokenize
        tokens = word_tokenize(text)
        
        # 4 & 5. Remove stopwords and Lemmatize
        cleaned_tokens = []
        for word in tokens:
            if word not in self.stop_words:
                # Handle cases where . might be left dangling (e.g. "end.")
                word = word.strip('.') 
                if word: # Only add if not empty after stripping
                    lemma = self.lemmatizer.lemmatize(word)
                    cleaned_tokens.append(lemma)
        
        # Join back into a single string
        return " ".join(cleaned_tokens)

# Singleton instance for easy import
nlp_processor = NLPProcessor()

if __name__ == "__main__":
    # Test with tricky tech terms
    samples = [
        "Python;Data Analysis;Machine Learning",
        "C++;Embedded Systems;IoT",
        "C#;.NET;Software Design",
        "React.js;Node.js;Web Development"
    ]
    
    print("--- NLP Preprocessing Test ---")
    for s in samples:
        cleaned = nlp_processor.clean_text(s)
        print(f"Original: {s}")
        print(f"Cleaned:  {cleaned}")
