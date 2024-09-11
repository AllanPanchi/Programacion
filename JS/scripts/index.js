function iniciar(){
    let numero1 = parseInt(document.getElementById("numero-menor").value);
    let numero2 = parseInt(document.getElementById("numero-mayor").value);
    let numeroAzar = parseInt(document.getElementById("numero-aleatorio").value);

    validarDatos(numero1, numero2, numeroAzar);
    generarNumeros(numero1, numero2);
}

function validarDatos(numero1, numero2, numeroAzar){
    console.log(numero1, numero2, numeroAzar);
    let columnas = 5;
    if(numero1 >= numero2 || isNaN(numero1) || isNaN(numero2) || isNaN(numeroAzar) || numeroAzar >= numero2){
        alert("NUMERO VACIOS O NO CORRECTOS");
    }else{
        let numeroGen = generarNumeros(numeroAzar, numero1, numero2);
        let contenido = '<p>' + numeroGen.join(', ') + '</p>';
    
        document.getElementById('numeros-pantalla').innerHTML = contenido;
        generarTabla(numero1, numero2, numeroGen, columnas)
    }
}

function generarNumeros(numeroAzar, numero1, numero2){
    let numeros = [];

    for(let i = 1; i <= numeroAzar; i++){
        let numero = Math.floor(Math.random() * (numero2 - numero1 + 1)) + numero1;
        numeros.push(numero);
    }
    console.log(numeros);
    return numeros;
}

function generarTabla(numero1, numero2, numeroGen, columnas){
    let tabla = document.createElement("table");
    let tbody = document.createElement("tbody");
    let numFilas = calcularFilas(numero1, numero2);
    let contador = numero1;
    for (let i = 0; i < numFilas; i++){
        let filas = document.createElement("tr");
        for(let j = 0; j < columnas; j++){
            let celda = document.createElement("td");
            if(numeroGen.includes(contador)){
                celda.style.backgroundColor = "aqua";
            }
            let hola = "como_estás";
            if(contador < numero2){
                celda.textContent = contador++;
            }else{
                celda.textContent = "";
            }
            filas.appendChild(celda);
        }
        tbody.appendChild(filas);
    }
    tabla.appendChild(tbody);
    document.getElementById("tabla").appendChild(tabla);
}

function calcularFilas(numero1, numero2){
    let numFilas = numero2 - numero1;
    numFilas = Math.ceil(numFilas / 5);
    console.log(numFilas);
    return numFilas;
}