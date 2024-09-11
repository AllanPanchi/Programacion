const fs = require('fs')

const  getText = (pathFIle) => {
    return new Promise( (res, rej) => {    
        fs.readFile(pathFIle, 'utf-8', (err, data) => {
            if(err){
                rej('Error: ', err)
            }
        
            res(data)
        })
    })
}

getText('./data/1.txt')
    .then((result) => console.log(result))
    .then(() => getText('./data/2.txt'))
    .then((res) => console.log(res))
    .catch((error) => console.log(error))