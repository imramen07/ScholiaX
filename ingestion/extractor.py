from ocr import extract_text
from ingestion.loader import load_pdf

def ext_pages(name, data):
    pages = load_pdf(name, data)

    if not pages or len(str(pages[0]).strip()) < 20:
        print(f"OCR fallback {name}")

        text = extract_text(name)

        pages = [{"page": 1, "text": text}]
    return pages