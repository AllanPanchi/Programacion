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
#ifndef PRODUCTO_H
#define PRODUCTO_H


#include <iostream>
#include <string>

class Producto {
    private:

        int codigo;
        std::string nombre;
        float precio;
        int anioElaboracion;
        int anioCaducidad;

    public:
        // Producto(int codigo, std::string nombre, float precio, int anioElaboracion, int anioCaducidad);
        // Producto();
        // ~Producto();

        // void setCodigo(int codigo);
        // int getCodigo();

        // void setNombre(std::string nombre);
        // std::string getNombre();

        // void setPrecio(float precio);
        // float getPrecio();

        // void setAnioElaboracion(int);
        // int getAnioElaboracion();

        // void setAnioCaducidad(int);
        // int getAnioCaducidad();

        // void toString();
        
        Producto(int c, std::string n, float p,int aE,int aC) {
            this->codigo = c;
            this->nombre = n;
            this->precio = p;
            this->anioElaboracion = aE;
            this->anioCaducidad = aC;
        }

        Producto() : codigo(0), nombre(""), precio(0.0), anioElaboracion(0), anioCaducidad(0) {}

        ~Producto() {}

        void setCodigo(int codigo) {
            this->codigo = codigo;
        }

        int getCodigo() {
            return codigo;
        }

        void setNombre(std::string nombre) {
            this->nombre = nombre;
        }

        std::string getNombre() {
            return nombre;
        }

        void setPrecio(float precio) {
            this->precio = precio;
        }

        float getPrecio() {
            return precio;
        }

        void setAnioElaboracion(int anioElaboracion) {
            this->anioElaboracion = anioElaboracion;
        }

        int getAnioElaboracion() {
            return this->anioElaboracion;
        }

        void setAnioCaducidad(int anioCaducidad) {
            this->anioCaducidad = anioCaducidad;
        }

        int getAnioCaducidad() {
            return this->anioCaducidad;
        }

        void toString() {
            std::cout << "Codigo: " << this->codigo << std::endl;
            std::cout << "Nombre: " << this->nombre << std::endl;
            std::cout << "Precio: " << this->precio << std::endl;
            std::cout << "Anio de elaboracion: " << this->anioElaboracion << std::endl;
            std::cout << "Anio de caducidad: "<< this->anioCaducidad << std::endl;
        }
};

#endif  // PRODUCTO_H