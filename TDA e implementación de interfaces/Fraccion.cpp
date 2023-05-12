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

#include "Fraccion.h"
#include <iostream>

using namespace std;

void Fraccion::validarDenominador()
{
   if(denominador == 0)
   {
      cout << "ERROR! Un denominador nunca puede ser 0, lo cambiaremos por 1\n";
      denominador = 1;
   }
}

////////////////////////////////////////////////////////////////////////
// Name:       Fraccion::getNumerador()
// Purpose:    Implementation of Fraccion::getNumerador()
// Return:     float
////////////////////////////////////////////////////////////////////////

float Fraccion::getNumerador(void)
{
   return numerador;
}

////////////////////////////////////////////////////////////////////////
// Name:       Fraccion::setNumerador(float newNumerador)
// Purpose:    Implementation of Fraccion::setNumerador()
// Parameters:
// - newNumerador
// Return:     void
////////////////////////////////////////////////////////////////////////

void Fraccion::setNumerador(float newNumerador)
{
   numerador = newNumerador;
}

////////////////////////////////////////////////////////////////////////
// Name:       Fraccion::getDenominador()
// Purpose:    Implementation of Fraccion::getDenominador()
// Return:     float
////////////////////////////////////////////////////////////////////////

float Fraccion::getDenominador(void)
{
   return denominador;
}

////////////////////////////////////////////////////////////////////////
// Name:       Fraccion::setDenominador(float newDenominador)
// Purpose:    Implementation of Fraccion::setDenominador()
// Parameters:
// - newDenominador
// Return:     void
////////////////////////////////////////////////////////////////////////

void Fraccion::setDenominador(float newDenominador)
{
   denominador = newDenominador;
}

////////////////////////////////////////////////////////////////////////
// Name:       Fraccion::Fraccion()
// Purpose:    Implementation of Fraccion::Fraccion()
// Return:
////////////////////////////////////////////////////////////////////////

Fraccion::Fraccion()
{
}

////////////////////////////////////////////////////////////////////////
// Name:       Fraccion::Fraccion(float num, float den)
// Purpose:    Implementation of Fraccion::Fraccion()
// Parameters:
// - num
// - den
// Return:
////////////////////////////////////////////////////////////////////////

Fraccion::Fraccion(float num, float den)
{
   numerador = num;
   denominador = den;
   validarDenominador();
}

////////////////////////////////////////////////////////////////////////
// Name:       Fraccion::~Fraccion()
// Purpose:    Implementation of Fraccion::~Fraccion()
// Return:
////////////////////////////////////////////////////////////////////////

Fraccion::~Fraccion()
{
   // TODO : implement
}

////////////////////////////////////////////////////////////////////////
// Name:       Fraccion::proceso(Fraccion object1, Fraccion object2)
// Purpose:    Implementation of Fraccion::proceso()
// Parameters:
// - object1
// - object2
// Return:     Fraccion
////////////////////////////////////////////////////////////////////////

Fraccion Fraccion::proceso(Fraccion object1, Fraccion object2)
{
   float a, b, c, d;
   a = object1.getNumerador();
   b = object1.getDenominador();
   c = object2.getNumerador();
   d = object2.getDenominador();

   float numerador = (a*d)+(c*b);
   float denominador = b+d;
   Fraccion fraccion(numerador, denominador);
   return fraccion;
}

void Fraccion::toString()
{
   cout << numerador << "/" << denominador << endl;
}
