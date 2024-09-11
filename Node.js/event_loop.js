const http = require('http')

const port = 3000

const server = http.createServer( (req, res) => {
    if(req.url === '/'){
        res.write('Bienvenido')
        return res.end()
    }
    if(req.url === '/about'){
        res.write('Sobre mi')
        return res.end()
    }

    res.write('no se encontro')
    res.end()
})

server.listen(port)

console.log(`Servidor corriendo en el puerto ${port}`)