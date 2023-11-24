from tkinter import *
from tkinter import messagebox

# def validarPeso():
#     peso = peso_Entrada.get()
#     if peso.isdigit() == False and float(peso) == False:
#         messagebox.showerror("Error", "Ingrese un peso valido")
#     elif float(peso) < 0:
#         messagebox.showerror("Error", "Ingrese un peso valido")
#     elif float(peso) > 350:
#         messagebox.showerror("Error", "Ingrese un peso valido")
#     else:
#         return peso

# def validarAltura():
#     altura = altura_Entrada.get()
#     if altura.isdigit() == False:
#         messagebox.showerror("Error", "Ingrese una altura valida")
#     elif int(altura) < 1:
#         messagebox.showerror("Error", "Ingrese una altura valida")
#     elif int(altura) > 250:
#         messagebox.showerror("Error", "Ingrese una altura valida")
#     else:
#         return int(altura_Entrada.get()) / 100

def reiniciarEntrada():
    peso_Entrada.delete(0, "end")
    altura_Entrada.delete(0, "end")
    var.set(None)

def calcularIMC():
    kg = int(peso_Entrada.get())
    m = int(altura_Entrada.get()) / 100
    imc = kg / (m*m)
    imc = round(imc, 1)
    IMCIndex(imc)

def IMCIndex(imc):
    if imc < 18.5:
        messagebox.showinfo("IMC", f"IMC = {imc} --> Bajo Peso")
    elif imc >= 18.5 and imc < 24.9:
        messagebox.showinfo("IMC", f"IMC = {imc} --> Peso Normal")
    elif imc >= 25 and imc < 29.9:
        messagebox.showinfo("IMC", f"IMC = {imc} --> Sobrepeso")
    elif imc >= 30 and imc < 34.9:
        messagebox.showinfo("IMC", f"IMC = {imc} --> Obesidad Grado 1")
    elif imc >= 35 and imc < 39.9:
        messagebox.showinfo("IMC", f"IMC = {imc} --> Obesidad Grado 2")
    elif imc >= 40:
        messagebox.showinfo("IMC", f"IMC = {imc} --> Obesidad Grado 3")

gui1 = Tk()
gui1.geometry("450x400")
gui1.title("Calculadora IMC")
gui1.config(bg = "grey")

var = IntVar()

frame = Frame(
    gui1, 
    padx = 10, 
    pady = 10
)
frame.pack(expand = True)

genero = Label(
    frame,
    text = "Seleccione su genero"
)
genero.grid(row = 2, column = 1)

genero_Entrada = Frame(
    frame
)
genero_Entrada.grid(row = 2, column = 2)

hombre = Radiobutton(
    genero_Entrada,
    text = "Hombre",
    variable = var,
    value = 1
)
hombre.pack(side = LEFT)

mujer = Radiobutton(
    genero_Entrada,
    text = "Mujer",
    variable = var,
    value = 2
)
mujer.pack(side = RIGHT)

peso = Label(
    frame,
    text = "Ingrese su peso (Kg)"
)
peso.grid(row = 3, column = 1)

peso_Entrada = Entry(
    frame
)
peso_Entrada.grid(row = 3, column = 2)

altura = Label(
    frame,
    text = "Ingrese su altura (cm)"
)
altura.grid(row = 4, column = 1)

altura_Entrada = Entry(
    frame
)
altura_Entrada.grid(row = 4, column = 2)

boton_Calcular = Button(
    frame,
    text = "Calcular",
    command = calcularIMC
)
boton_Calcular.grid(row = 5, column = 1)

boton_Reset = Button(
    frame,
    text = "Reset",
    command = reiniciarEntrada
)
boton_Reset.grid(row = 5, column = 2)

boton_Salir = Button(
    frame,
    text = "Salir",
    command = lambda:gui1.destroy()
)
boton_Salir.grid(row = 5, column = 3)

gui1.mainloop()




