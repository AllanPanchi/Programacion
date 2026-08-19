'use strict'

console.log("Tarea1")

setTimeout( () => {
    console.log("Tarea2")
}, 0)

Promise.resolve().then( () => {
    console.log("Microtarea1")
})

console.log('Tarea3')

Promise.resolve().then( () => {
    console.log("Microtarea2")
})

async function mostrarMensaje(){
    const mensaje = await "HOLA MUNDO MOSTRANDO ASYNC"
    console.log(mensaje)
}

mostrarMensaje()
