/*
UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE
Materia: Estructura de Datos
NRC: 9686
Integrantes: Allan Panchi
             Alex Trejo
			    Sebastian Verdugo
			    Alejandro Andrade
Fecha de inicio: 04/05/2023
Fecha de modificacion: 12/05/2023

Realizar 4 operaciones en una interface que incluyan datos abstractos
*/
#include "InterfaceOperaciones.h"

using namespace std;

class Operaciones : public InterfaceOperaciones
{
public:

   float validarDenominador(float den)
   {
      if(den == 0)
      {
         cout << "El 0 no esta permitido en el denominador, se le cambiara por 1";
         den = 1;
      }
      return den;
   }

   void operacion(float flotante, Fraccion fraccion) override
   {
      flotante = fraccion.getDenominador() - flotante + (flotante * fraccion.getNumerador());
   }

   float operacion(Fraccion fraccion1, Fraccion fraccion2) override
   {
      return fraccion1.getNumerador()*fraccion2.getNumerador();
   }

   Fraccion operacion(float flotante1, float flotante2) override
   {
      Fraccion fraccion(flotante1 * flotante2, flotante1 - flotante2);
      fraccion.setDenominador(validarDenominador(fraccion.getDenominador()));
      return fraccion;
   }

   float operacion(float flotante1, float flotante2, float flotante) override
   {
      return flotante1 * flotante2 * flotante - flotante1;
   }

};
