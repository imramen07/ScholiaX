import torch

CHUNK_SIZE = 1200
CHUNK_OVERLAP = 150

EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"
LLM_MODEL = "llama3"
RERANK_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"

TOP_K = 5
FETCH_K = 10

device = "cuda" if torch.cuda.is_available() else "cpu"