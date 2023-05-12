/*
UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE
Materia: Estructura de Datos
NRC: 9686
Integrantes: Allan Panchi
             Alex Trejo
			    Sebastian Verdugo
			    Alejandro Andrade
Fecha de inicio: 04/05/2023
Fecha de modificación: 09/05/2023

Crear 4 operaciones en una interface que incluyan datos abstractos
*/
#ifndef INTERFACEOPERACIONES_H_INCLUDED
#define INTERFACEOPERACIONES_H_INCLUDED

#include "Fraccion.h"

class InterfaceOperaciones
{
public:
   virtual float operacion1(Fraccion fraccion1, Fraccion fraccion2)=0;
   virtual Fraccion operacion2(Fraccion fraccion1, Fraccion fraccion2)=0;
   virtual Fraccion operacion3(float flotante1, float flotante2)=0;
   virtual float operacion4(float flotante1, float flotante2)=0;

protected:
private:

};

#endif // INTERFACEOPERACIONES_H_INCLUDED
