from rank_bm25 import BM25Okapi
from utils.deduplication import deduplicate_docs
import re
import pickle

class BM25Store:

    def save(self, path):
        with open(path, "wb") as f:
            pickle.dump(self.docs, f)
    
    @staticmethod
    def load(path):
        with open(path, "rb") as f:
            docs = pickle.load(f)
        return BM25Store(docs)

    @staticmethod
    def tokenize(txt):
        return re.findall(r'\b\w+\b', txt.lower())

    def __init__(self, docs):
        self.docs = deduplicate_docs(docs)
        self.corpus = [self.tokenize(doc.page_content) for doc in self.docs]
        self.bm25 = BM25Okapi(self.corpus)
    
    def search(self, query, k = 5):
        tokenized_query = self.tokenize(query)
        scores = self.bm25.get_scores(tokenized_query)

        ranked = sorted(
            zip(self.docs, scores),
            key = lambda x: x[1],
            reverse = True
        )

        return [doc for doc, _ in ranked[:k]]