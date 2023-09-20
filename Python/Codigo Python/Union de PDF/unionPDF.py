import PyPDF2 as pdf
import sys

archivos = sys.argv[2:]

nombrePDF = sys.argv[1]

pdfFinal = pdf.PdfMerger()

for i in archivos:
    pdfFinal.append(i)

pdfFinal.write(nombrePDF)
pdfFinal.close()

