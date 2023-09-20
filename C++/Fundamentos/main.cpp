#include <iostream>
#include <vector>

using namespace std;

bool esNumeroPerfecto(int num) {
    int suma = 0;
    for (int i = 1; i <= num / 2; i++) {
        if (num % i == 0) {
            suma += i;
        }
    }
    return suma == num;
}

vector<int> numerosPerfectosEnArreglo(const vector<int>& arreglo) {
    vector<int> numerosPerfectos;
    for (int num : arreglo) {
        if (esNumeroPerfecto(num)) {
            numerosPerfectos.push_back(num);
        }
    }
    return numerosPerfectos;
}

int main() {
    vector<int> arreglo = {6, 28, 12, 496, 8, 15, 1};
    vector<int> numerosPerfectos = numerosPerfectosEnArreglo(arreglo);

    cout << "Números perfectos encontrados: ";
    for (int num : numerosPerfectos) {
        cout << num << " ";
    }
    cout << endl;

    return 0;
}
