const {conn} = require('./src/db')
const server = require('./src/app')
const tablaGenero = require('./src/routes/cargaGenero.js')
const tablaPeriodo = require('./src/routes/cargaPeriodo')
const tablaFilo = require('./src/routes/filo')
const tablaPartes = require('./src/routes/cargaPartes')
const tablaCuenca = require('./src/routes/cargaCuenca')
var port = process.env.PORT || 3001

conn.sync({force: false}).then(()=> {

    tablaGenero();
    tablaPeriodo();  
    tablaFilo();
    tablaPartes();
    tablaCuenca();
    server.listen(port, ()=> {
        console.log('funcionando en el puerto:' + port);
    })
})
