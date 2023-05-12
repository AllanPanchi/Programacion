/*
UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE
Materia: Estructura de Datos
NRC: 9686
Integrantes: Alex Trejo
			 Allan Panchi
			 Sebastian Verdugo
			 Alejandro Andrade
Fecha de inicio: 04/05/2023
Fecha de modificaci�n: 09/05/2023

Realizar 4 operaciones en una interface que incluyan datos abstractos
*/

#include <iostream>
#include "Fraccion.cpp"
#include "InterfaceOperaciones.cpp"

using namespace std;

int main(int argc, char const *argv[])
{
	Fraccion fraccion;
	Fraccion obj1(2.22, 0.44);
	Fraccion obj2(4.00, 3.44);
	fraccion = fraccion.proceso(obj1, obj2);
	fraccion.toString();

	obj1.toString();
	obj2.toString();

	InterfaceOperaciones* op = new Operaciones();

	cout << "Operacion 1: "<< op->operacion1(obj1, obj2);
	cout << "\nOperacion 2: ";
	op->operacion2(obj1, obj2).toString();
	cout << "Operacion 3: ";
	op->operacion3(-3.9F, -3.9F).toString();
	cout << "Operacion 4: "<< op->operacion4(2.3, 4.1);

	system("pause");

	return 0;
	
}
