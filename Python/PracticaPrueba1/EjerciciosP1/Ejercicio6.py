#  Realiza la operación de unión de dos conjuntos utilizando una lista en Python.
# Muestra el resultado por pantalla.
import time
import os

def limpiar():
    print("limpiando...")
    time.sleep(10)
    os.system("cls")
    print("limpiado")

def union_conjuntos(lista1, lista2):
    conjunto_union = lista1.copy()

    conjunto_union.extend(lista2)  

    resultado = set(conjunto_union)
    return resultado

conjunto1 = [1, 2, 3]
conjunto2 = [3, 4, 5]

print("Unión de los conjuntos:", union_conjuntos(conjunto1, conjunto2))

limpiar()