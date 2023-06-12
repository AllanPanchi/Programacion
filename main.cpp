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
#include "ListaProducto.cpp"
#include "FuncionesMenu.h"
#include "ValDatos.h"
#include <iostream>
#include <chrono>
#include <thread>
#include <fstream>
#include <stdlib.h>

int main(int argc, char const *argv[]){
    
    bool continuar = true;
    int opcion;
    ListaProducto lista, listaDeBusquedaPorAnio;
    Nodo<Producto> *nodoTm = NULL;
    Producto producto1;
    int codigo, fecha;

    while(continuar){
        
        std::cout << "Menu de opciones" << std::endl;
        std::cout << "1. Insertar Producto" << std::endl;
        std::cout << "2. Eliminar Producto" << std::endl;
        std::cout << "3. Buscar Producto por codigo" << std::endl;
        std::cout << "4. Mostrar Producto" << std::endl;
        std::cout << "5. Actualizar Producto" << std::endl;
        std::cout << "6. Buscar Producto por anio de elaboracion" << std::endl;
        std::cout << "7. Salir" << std::endl;
        std::cout << "Ingrese la opcion: " << std::endl;
        opcion = ValidarDatos::validarEnteroMenu();

        switch(opcion)
        {
            case 1:
            
                lista.vaciarLista();
                cargarDatosDesdeArchivo("Productos.txt", lista);
                system("cls");
                producto1 = FuncionesMenu::insertarProducto();
                lista.insertar(producto1);
                std::cout << "El producto ha sido añadido" << std::endl;
                sobreescribirArchivo("Productos.txt", lista);
                
                break;
            
            case 2:

                system("cls");
                lista.vaciarLista();
                cargarDatosDesdeArchivo("Productos.txt", lista);
                lista.mostrar();
                system("cls");

                if (lista.listaVacia()){
                    std::cout << "No hay productos en la lista" << std::endl;
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                    break;
                }

                std::cout << "Ingrese el codigo del producto a eliminar: ";
                codigo = ValidarDatos::validarEntero();
                nodoTm = lista.buscar(codigo);

                lista.mostrar();

                if (nodoTm == NULL)
                {
                    std::cout << "El producto no existe" << std::endl;
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                    system("cls");
                } else {
                    lista.eliminar(codigo);
                    std::cout << "El producto " << codigo << " se ha sido eliminado" << std::endl;
                    lista.mostrar();
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                    system("cls");
                    sobreescribirArchivo("Productos.txt", lista);
                }

                break;

            case 3:
                
                system("cls");
                lista.vaciarLista();
                cargarDatosDesdeArchivo("Productos.txt", lista);
                lista.mostrar();
                system("cls");

                if (lista.listaVacia()){
                    std::cout << "No hay productos en la lista" << std::endl;
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                    break;
                }

                std::cout << "Ingrese el codigo del producto a buscar: ";
                codigo = ValidarDatos::validarEntero();
                nodoTm = lista.buscar(codigo);
                if (nodoTm == NULL)
                {
                    std::cout << "El producto no existe" << std::endl;
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                } else {
                    std::cout << "El producto es: " << std::endl;
                    nodoTm->getProducto().toString();
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                }
                
                
                system("cls");
                break;
                
            case 4:
                
                system("cls");
                lista.vaciarLista();
                cargarDatosDesdeArchivo("Productos.txt", lista);
                lista.mostrar();

                if (lista.listaVacia()){
                    std::cout << "No hay productos en la lista" << std::endl;
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                    break;
                }

                system("cls");
                if (lista.size() == 0)
                {
                    std::cout << "No hay productos en la lista" << std::endl;
                } else {
                    std::cout << "Los productos son: " << std::endl;
                    lista.mostrar();
                }

                break;
            
            case 5:
                system("cls");
                lista.vaciarLista();
                cargarDatosDesdeArchivo("Productos.txt", lista);
                lista.mostrar();
                system("cls");

                if (lista.listaVacia()){
                    std::cout << "No hay productos en la lista" << std::endl;
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                    break;
                }

                std::cout << "Ingrese el codigo del producto a actualizar:\t";
                codigo = ValidarDatos::validarEntero();
                nodoTm = lista.buscar(codigo);
                if (nodoTm == NULL)
                {
                    std::cout << "El producto no existe" << std::endl;
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                    system("cls");
                } else {
                    lista.actualizar(nodoTm);
                    lista.mostrar();
                    system("cls");
                    sobreescribirArchivo("Productos.txt", lista);
                }

                break;
            
            case 6:

                system("cls");
                lista.vaciarLista();
                listaDeBusquedaPorAnio.vaciarLista();
                cargarDatosDesdeArchivo("Productos.txt", lista);
                lista.mostrar();
                system("cls");

                if (lista.listaVacia()){
                    std::cout << "No hay productos en la lista" << std::endl;
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                    break;
                }
                
                std::cout << "Ingrese la anio de elaboracion del producto a buscar: ";
                fecha = ValidarDatos::validarEntero();
                while (fecha < 1000 || fecha > 9999)
                {
                    std::cout << "Ingrese un anio valido: ";
                    fecha = ValidarDatos::validarEntero();
                }
                listaDeBusquedaPorAnio =  lista.buscarPorAnioElaboracion(fecha);
                if (listaDeBusquedaPorAnio.getPrimero() == NULL)
                {
                    std::cout << "No hay productos elaborados ese anio" << std::endl;
                    std::this_thread::sleep_for(std::chrono::seconds(3));
                    system("cls");
                } else {
                    std::cout << "Los productos son: " << std::endl;
                    listaDeBusquedaPorAnio.mostrar();
                    sobreescribirArchivo("Productos buscados por anio.txt", listaDeBusquedaPorAnio);
                }
                
                break;
            case 7:
                
                system("cls");
                continuar = false;
                break;
                
            default:
                
                system("cls");
                std::cout << "Opcion no valida" << std::endl;
                std::this_thread::sleep_for(std::chrono::seconds(3));
                system("cls");
                break;
        }

    }
    
    system("pause");
    
    return 0;
}