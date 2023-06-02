# Crea una función en Python que reciba dos conjuntos como parámetros y devuelva
# un nuevo conjunto que contenga los elementos presentes en el primer conjunto pero
# no en el segundo. Prueba la función con conjuntos de tu elección.
import os
import time

def limpiar():
    print("limpiando...")
    time.sleep(10)
    os.system("cls")
    print("limpiado")


def mostrarElementosPrimerConjunto(lista1, lista2):
    diferencia = lista1.difference(lista2)
    return diferencia
    

lista1 = {1,2,3,4,5,6,7,8}
lista2 = {2,4,6,8,10}

print("La lista 1 es:", lista1)
print("La lista 2 es:", lista2)

print(mostrarElementosPrimerConjunto(lista1, lista2))

limpiar()