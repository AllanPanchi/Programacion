# Implementa una función en Python que reciba una lista de conjuntos y devuelva el
# conjunto potencia de dicha lista. Prueba la función con conjuntos de tu elección
import os
import time

def limpiar():
    print("limpiando...")
    time.sleep(10)
    os.system("cls")
    print("limpiado")

def conjunto_potencia(lista_conjuntos):
    conjunto_potencia = {frozenset()}  

    for conjunto in lista_conjuntos:
        conjunto_potencia_actualizado = set()
        for subconjunto in conjunto_potencia:
            for elemento in conjunto:
                nuevo_subconjunto = subconjunto.union({elemento})
                conjunto_potencia_actualizado.add(nuevo_subconjunto)
        conjunto_potencia.update(conjunto_potencia_actualizado)

    return conjunto_potencia

# Ejemplo de uso
conjuntos = [{1, 2}, {1, 2}, {9}]
resultado = conjunto_potencia(conjuntos)
print("Conjunto potencia:", resultado)

limpiar()
