#Escribe un programa en Python que determine la intersección de dos conjuntos
#ingresados por el usuario. Muestra el resultado por pantalla
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

def obtener_intersección(lista1, lista2):
    return lista1.intersection(lista2)

print("Ingrese los elementos del primer conjunto:")
lista1 = obtener_conjunto()

print("\nIngrese los elementos del segundo conjunto:")
lista2 = obtener_conjunto()

print("\nLa intersección de los conjuntos es:", obtener_intersección(lista1, lista2))

limpiar()