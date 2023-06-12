/*
UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE
Materia: Estructura de Datos
NRC: 9686
Integrantes:    Alejandro Andrade
                Allan Panchi
                Alex Trejo 
                Sebastian Verdugo
Fecha de inicio: 02/05/2023
Fecha de modificación: 08/06/2023

Proyecto sobre registros utlizando listas doblemente enlazadas
*/
#include "Nodo.h"

template <typename T>
Nodo<T>::Nodo(T product, Nodo<T> *sig, Nodo<T> *ant){
    this->producto = product;
    this->siguiente = sig;
    this->anterior = ant;
}

template <typename T>
void Nodo<T>::setProducto(T product){
	this->producto = product;
}

template <typename T>
T Nodo<T>::getProducto(){
	return this->producto;
}

template <typename T>
void Nodo<T>::setSiguiente(Nodo<T> *sig){
	this->siguiente=sig;
}

template <typename T>
Nodo<T>* Nodo<T>::getSiguiente(){
	return this->siguiente;
}

template <typename T>
void Nodo<T>::setAnterior(Nodo<T> *ant){
    this->anterior=ant;
}

template <typename T>
Nodo<T>* Nodo<T>::getAnterior(){
    return this->anterior;
}