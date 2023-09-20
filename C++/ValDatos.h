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
#pragma once
#include <string>
#include <random>
#include <iostream>
#include <cstdlib>
#include <conio.h>

class ValidarDatos
{
    public:

        static int validarFecha(int fecha)
        {
            fecha = ValidarDatos::validarEntero();
            while (fecha < 1000 || fecha > 9999)
            {
                std::cout << "Ingrese un anio valido: ";
                fecha = ValidarDatos::validarEntero();
            }

            return fecha;
        }

        // valida que el precio en float solo se guarde con 2 decimales
        static float validarPrecio(float precio){
            int entero = precio;
            float decimal = precio - entero;
            decimal *= 100;
            decimal = (int)decimal;
            decimal /= 100;
            precio = entero + decimal;
            return precio;
        }

        static std::string validarNombre(std::string nombre){
            nombre = ValidarDatos::validarString();
            while (nombre == "")
            {
                std::cout << "Ingrese un nombre valido: ";
                nombre = ValidarDatos::validarString();
            }
            return nombre;
        }

        static int generarCodigo(){

            // lambda para generar un numero aleatorio entre 10000 y 99999
            auto random = []() -> int {
                std::random_device rd;
                std::mt19937 gen(rd());
                std::uniform_int_distribution<int> dis(10000, 99999);

                return dis(gen);
            };

            return random();
        }

        static int validarEnteroMenu() {		
            char entrada;
            char tecla;
            while (true) {
                tecla = getch();
                
                if (tecla == '\r') {
                    std::cout << std::endl;
                    break;
                } else if (tecla == '\b') {
                    if (entrada) {
                        std::cout << "\b \b";
                        entrada = '\0';
                    }
                } else if (isdigit(tecla) && !entrada) {
                    entrada = tecla;
                    std::cout << tecla;
                }
            }
            
            if (entrada) {
                int numero = entrada - '0';
                if (numero >= 1 || numero <= 6)
                {
                    return numero;
                }
                
            } else {
                return -1;
            }
            return 1;
        }

        static int validarEntero() {		
            char *entrada = new char[30];
            char tecla;
            int i = 0;
            
            while (true) {
                tecla = getch(); 
                
                if (tecla == '\r') { 
                std::cout << std::endl;
                break;
                } else if (tecla == '\b' && i > 0) { 
                    i--;						
                    std::cout << "\b \b"; 
                    entrada[i] = 0; 
                } else if (isdigit(tecla) && i<12) {
                    entrada[i++] = tecla;
                    std::cout << tecla; 
                }
            }

            return atoi(entrada); 
        }

        static float validarFloat() {
            char *entrada = new char[30];
            char tecla;
            int i = 0;
            bool punto = false;
            int signoMenosPos = -1;
            while(true){
                tecla = getch();
                
                if (tecla == '\r') { 
                std::cout << std::endl;
                break;
                } else if (tecla == '\b' && i > 0) { 		
                    i--;						
                    std::cout << "\b \b";
                    if (entrada[i] == '.') { 
                        punto = false;
                    }
                    if (i == signoMenosPos) { 
                        signoMenosPos = -1;
                    }
                    entrada[i] = 0; 
                } else if (isdigit(tecla) && i < 15) {
                    entrada[i++] = tecla;
                    std::cout << tecla;
                } else if (tecla == '.' && !punto) {
                    entrada[i++] = tecla;
                    punto = true;
                    std::cout << tecla;
                } else if (tecla == '-' && i == 0) {
                    entrada[i++] = tecla;
                    signoMenosPos = i - 1;
                    std::cout << tecla;
                }
            }

            return atof(entrada);
        
        }

        static std::string validarString() {
            std::string entrada;
            char tecla;

            while (true) {
                
                tecla = getch();

                if (tecla == '\r') {
                    std::cout << std::endl;
                    break;
                } else if (tecla == '\b' && !entrada.empty()) {
                    entrada.pop_back();
                    std::cout << "\b \b";
                } else if (std::isalpha(tecla) && !std::isspace(tecla)) {
                    entrada += tecla;
                    std::cout << tecla;
                }
            }

            return entrada;
        }

};