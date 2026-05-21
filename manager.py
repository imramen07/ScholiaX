import hashlib
import os

from ingestion.loader import load_pdf
from ingestion.splitter import split_docs

from retrieval.bm25_store import BM25Store

from utils.hashing import hash_files
from utils.ensure_gpu import ensure_gpu

from vectorstore.faiss_store import (load_index, create_index)

def loadsource(uploaded_files, embeddings):
    file_data = [
        (f.name, f.read()) for f in uploaded_files
    ]
    file_hashes = hash_files(
        file_data
    )
    sid = hashlib.sha256(
        "".join(
            sorted(
                file_hashes.values()
            )
        ).encode()
    ).hexdigest()

    index_dir = f"userdata/faiss_index_{sid}"

    #cache yes
    if os.path.exists(index_dir):
        db = load_index(embeddings, index_dir)
        bm25 = BM25Store.load(f"{index_dir}/bm25.pkl")

        return(ensure_gpu(db), bm25, sid)

    #cache create
    all_pages = []
    
    for name, data in file_data:
        all_pages.extend(load_pdf(name, data))

    chunks = split_docs(all_pages)
    db = create_index(chunks, embeddings, index_dir)
    bm25 = BM25Store(chunks)
    bm25.save(f"{index_dir}/bm25.pkl")

    return (ensure_gpu(db), bm25, sid)