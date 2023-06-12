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
#include "ListaProducto.h"
#include "ValDatos.h"
#include <fstream>


    Nodo<Producto>* ListaProducto::getPrimero(){
        return this->primero;
    }

    Nodo<Producto>* ListaProducto::getActual(){
        return this->actual;
    }

    void ListaProducto::setPrimero(Nodo<Producto> *primero){
        this->primero=primero;
    }

    void ListaProducto::setActual(Nodo<Producto> *actual){
        this->actual=actual;
    }

    int ListaProducto::size(){
        int cont=0;
        Nodo<Producto> *tmp=this->primero;
        while(tmp){
            cont++;
            tmp=tmp->getSiguiente();
        }
        return cont;
    }

    bool ListaProducto::listaVacia(){
        return (this->actual==NULL);
    }

    ListaProducto::ListaProducto(){
        this->primero=NULL;
        this->actual=NULL;
    }

    void ListaProducto::insertar(Producto producto){
        Nodo<Producto>* nuevo = new Nodo(producto);
        if (this->primero == NULL) {
            this->primero = nuevo;
            this->actual = nuevo;
        }
        else {
            this->actual->setSiguiente(nuevo);
            nuevo->setAnterior(this->actual);
            this->actual = nuevo;
        }
    }
    
    void ListaProducto::eliminar(int codigo){
        Nodo<Producto> *tmp = this->primero;
        while(tmp){
            if(tmp->getProducto().getCodigo() == codigo){
                if(tmp == this->primero){
                    this->primero = tmp->getSiguiente();
                    if (this->primero) {
                        this->primero->setAnterior(nullptr);
                    }
                    delete tmp;
                }
                else{
                    tmp->anterior->siguiente = tmp->getSiguiente();
                    if (tmp->siguiente) {
                        tmp->siguiente->anterior = tmp->getAnterior();
                    }
                    delete tmp;
                }
                break;
            }
            tmp = tmp->getSiguiente(); // Actualizar el puntero tmp
        }

    }


    // Buscar un producto en la lista por medio del atrubuto codigo que es int y retornarlo
    Nodo<Producto>* ListaProducto::buscar(int codigo){
        Nodo<Producto> *tmp = this->primero;
        while(tmp){
            if(tmp->getProducto().getCodigo() == codigo){
                return tmp;
            }
            tmp = tmp->getSiguiente();
        }
        return NULL;
    }

    // Buscar todos los producto en la lista por medio del atrubuto anioElaboracion que es int y retorar una lista
    ListaProducto ListaProducto::buscarPorAnioElaboracion(int anioElaboracion){
        ListaProducto lista;
        Nodo<Producto> *tmp = this->primero;
        while(tmp){
            if(tmp->getProducto().getAnioElaboracion() == anioElaboracion){
                lista.insertar(tmp->getProducto());
            }
            tmp = tmp->getSiguiente();
        }
        return lista;
    }

    void ListaProducto::actualizar(Nodo<Producto> *actual){
        
        int fecha = 1000;
        float precio = 0.0;

        actual->getProducto().toString();
        std::cout << "Ingrese el nuevo nombre de producto:\t";
       
        actual->producto.setNombre(ValidarDatos::validarString());

        std::cout <<"Ingrese el nuevo precio:\t";
        precio = ValidarDatos::validarFloat();
        precio = ValidarDatos::validarPrecio(precio);
        actual->producto.setPrecio(precio);

        std::cout <<"Ingrese el nuevo anio de elaboracion:\t";
        fecha = ValidarDatos::validarFecha(fecha);
        actual->producto.setAnioElaboracion(fecha);
        
        std::cout <<"Ingrese el nuevo anio de vencimiento:\t";
        fecha = ValidarDatos::validarFecha(fecha);
        actual->producto.setAnioCaducidad(fecha);
        

        actual->getProducto().toString();
        
        std::cout <<"El producto ha sido actualizado" << std::endl;
    }

    // Mostrar todos los productos de la lista
    void ListaProducto::mostrar(){
        Nodo<Producto> *tmp = this->primero;
        while(tmp){
            tmp->getProducto().toString();
            std::cout << "---------------------" << std::endl;
            tmp = tmp->getSiguiente();
        }
    }

    void sobreescribirArchivo(const std::string& nombreArchivo, ListaProducto& lista) {
        std::ofstream archivo(nombreArchivo);

        if (archivo.is_open()) {
            Nodo<Producto>* temp = lista.getPrimero();
            while (temp != nullptr) {
                archivo << temp->getProducto().getCodigo() << " " << temp->getProducto().getNombre() << " " << temp->getProducto().getPrecio()
                << " " << temp->getProducto().getAnioElaboracion() << " " << temp->getProducto().getAnioCaducidad() << std::endl;
                temp = temp->getSiguiente();
            }

            archivo.close();
            std::cout << "Archivo sobrescrito exitosamente." << std::endl;
        } else {
            std::cout << "No se pudo abrir el archivo para sobrescribir." << std::endl;
        }
    }

    void cargarDatosDesdeArchivo(const std::string& nombreArchivo, ListaProducto& lista) {
        std::ifstream archivo(nombreArchivo);

        if (archivo.is_open()) {
            int codigo, anioDeElaboracion, anioDeCaducidad;
            float precio;
            std::string nombre;
            while (archivo >> codigo >> nombre >> precio >> anioDeElaboracion >> anioDeCaducidad) {
                Producto producto(codigo, nombre, precio, anioDeElaboracion, anioDeCaducidad);
                lista.insertar(producto);
            }

            archivo.close();
        } else {
            std::cout << "No se pudo abrir el archivo." << std::endl;
        }
    }

    void ListaProducto::vaciarLista() {
        Nodo<Producto>* nodoActual = this->primero;
        while (nodoActual != nullptr) {
            Nodo<Producto>* nodoSiguiente = nodoActual->getAnterior();
            delete nodoActual;
            nodoActual = nodoSiguiente;
        }
        this->primero = nullptr;
        this->actual = nullptr;
    }