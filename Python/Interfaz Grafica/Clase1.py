from tkinter import*
from tkinter import filedialog
import pyautogui

pagina = Tk()

def abrir_explorador_de_archivos():
    ruta = filedialog.askopenfilename(title = "MIRA LOS PDF")
    texto02 = Label(pagina, text = ruta)
    texto02.pack()


pagina.title("Mi primera ventana")

pagina.geometry("400x200")

pagina.iconbitmap("D:\\Allan\\Programacion\\Python\\Interfaz Grafica\\1.ico")

texto = "hola mundo"

pagina.resizable(1,1)

texto01 = Label(pagina, text = texto)

texto01.pack(fill = X, expand = 1)

boton1 = Button(pagina, text = "Agregar", command = abrir_explorador_de_archivos)


pagina.mainloop()
