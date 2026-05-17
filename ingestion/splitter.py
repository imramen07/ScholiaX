from langchain_text_splitters import RecursiveCharacterTextSplitter
from config.settings import CHUNK_SIZE, CHUNK_OVERLAP
import re

def cleantxt(txt):
    txt = re.sub(r'\s+', ' ', txt)
    return txt.strip()

def split_to_sent(txt):
    if "." in txt or "?" in txt or "!" in txt:
        return re.split(r'(?<=[.!?]) +', txt)

    return re.split(r'\n+|\s{2,}', txt)

def makechunks(txt):
    txt = cleantxt(txt)
    sent = split_to_sent(txt)

    chunks = []
    thischunk = ""

    for s in sent:
        s = s.strip()
        if not s:
            continue

        if len(thischunk) + len(s) < CHUNK_SIZE:
            thischunk += " " + s

        else:
            if thischunk.strip():
                chunks.append(thischunk.strip())
            thischunk = s
    
    if thischunk.strip():
        chunks.append(thischunk.strip())
    
    return chunks

def overlap(chunks):
    fchunks = []

    for i, c in enumerate(chunks):

        if i > 0:
            ptail = chunks[i-1].split()
            tail = " ".join(ptail[-(CHUNK_OVERLAP // 5):])
            c = tail + " " + c

        fchunks.append(c.strip())
    return fchunks

def split_docs(pages):
    ftxt = ""
    for p in pages:
        if isinstance(p, dict):
            ftxt += p.get("text", "") + " "
        
        else:
            ftxt += str(p) + " "

    chunks = makechunks(ftxt)
    chunks = overlap(chunks)
    return chunks