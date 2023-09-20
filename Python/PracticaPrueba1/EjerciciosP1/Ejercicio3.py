# Diseña un programa en Python que solicite al usuario ingresar dos conjuntos y
# muestre por pantalla si el primero es un subconjunto del segundo.
import os
import time

def limpiar():
    print("limpiando...")
    time.sleep(10)
    os.system("cls")
    print("limpiado")


def obtener_conjunto():
    conjunto = set()
    elementos = input("Ingrese los elementos del conjunto: ")
    elementos_lista = elementos.split()

    for elemento in elementos_lista:
        conjunto.add(elemento)

    return conjunto

def obtener_subconjunto(lista1, lista2):
    return lista1.issubset(lista2)

print("Elementos de la lista 1")
lista1 = obtener_conjunto()
print("Elementos de la lista 2")
lista2 = obtener_conjunto()

if obtener_subconjunto(lista1, lista2):
    print("Es un subconjunto")
else:
    print("No es un subconjunto")

limpiar()