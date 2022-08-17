
const { Sequelize, belongsToMany,hasOne} = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config()
/* const {
  DB_USER, DB_PASS, DB_HOST,
} = process.env;


const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}/back`,{
  logging: false,

}) */

const {
  DATABASE_URL,
  } = process.env;


const sequelize = new Sequelize(DATABASE_URL,{
    logging: false,
    native : false ,
    dialectOptions: {
      ssl: {
        require:true, 
        rejectUnauthorized:false
      }
    }

})


const basename = path.basename(__filename);
const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

  // Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));

  
  
    // Para relacionarlos hacemos un destructuring
const { periodo, periodoEpoca } = sequelize.models;


// Aca vendrian las relaciones
//periodo.hasMany(periodoEpoca);
// periodo.hasOne(periodoEpoca);
// periodoEpoca.belongsTo(periodo);

module.exports = {
    conn:sequelize
}
