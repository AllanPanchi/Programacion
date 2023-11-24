from tkinter import*
from tkinter import messagebox
from tkcalendar import* 

def validarAnio():
    año = año_ingresado.get()
    if año.isdigit() == False:
        messagebox.showerror("Error", "Ingrese un año valido")
    elif int(año) < 0:
        messagebox.showerror("Error", "Ingrese un año valido")
    elif int(año) > 9999:
        messagebox.showerror("Error", "Ingrese un año valido")
    else:
        mostrarCalendario()

def mostrarCalendario():
    gui = Tk()
    gui.title("Calendario")
    gui.geometry("500x500")
    boton3 = Button(gui, text = "Regresar", command = gui.destroy)
    año = int(año_ingresado.get())
    cal = Calendar(gui, selectmode="day", year = año, month = 1)
    cal.pack(pady = 20, fill = "both", expand = 1)
    boton3.pack(pady = 20)
    gui.mainloop()

gui1 = Tk()
gui1.title("Calendario")
gui1.geometry("500x250")
gui1.resizable(0,0)
titulo1 = Label(gui1, text = "CALENDARIO", font = "Times 20 bold")
subtitulo1 = Label(gui1, text = "Ingrese el año: ", font = "Times 16")
año_ingresado = Entry(gui1, width = "20")
boton1 = Button(gui1, text = "Mostrar Calendario del año", command = validarAnio)
boton2 = Button(gui1, text = "Salir", command = exit)
titulo1.place(x = 150, y = 50)
subtitulo1.place(x = 190, y = 80)
año_ingresado.place(x = 190, y = 110)
boton1.place(x = 170, y = 140)
boton2.place(x = 225, y = 170)
gui1.mainloop()
