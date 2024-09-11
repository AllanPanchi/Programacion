const fs = require('fs')

// var linea = fs.readFileSync('./data/1.txt').toString()


// fs.writeFileSync('./data/2.txt', 'contenido nuevo ', {
//     flag: 'a'
// })

// console.log(linea)

fs.readFile('./data/3.txt', (err, res) => {
    if(err){
        console.log(err)
    }else{
        console.log(res.toString())
    }
})