const http = require('http')

const port = 5000

http.createServer( (req, res) => {
    console.log(req.url)

    if(req.url === '/about'){
        res.write('ACERCA DE: ')
        return res.end()
    }

    res.write("hola mundo")
    res.end()
}).listen(port)

console.log(`Servidor escuchando en el puerto: ${port}`)