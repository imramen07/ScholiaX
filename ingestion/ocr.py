import pytesseract
import cv2
from pdf2image import convert_from_path

pytesseract.pytesseract.tesseract_cmd = r"D:\TesseractOCR\tesseract.exe"

def ocrimg(img_path):
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)[1]

    text = pytesseract.image_to_string(gray)
    return text

def ocrpdf(pdf_path):
    pages = convert_from_path(pdf_path, dpi = 300)
    fulltxt = ""

    for p in pages:
        txt = pytesseract.image_to_string(p)
        fulltxt += txt + "\n"
    return fulltxt

def extract(file_path):
    if file_path.lower().endswith(".pdf"):
        return ocrpdf(file_path)
    else:
        return ocrimg(file_path)