const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
    module.exports= (sequelize)=> {
        sequelize.define('prestamo', {
          id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey:true,
            },
            tipoprestamo: {
                type: DataTypes.STRING,
            },
            numeroespecimen: {
                type: DataTypes.JSON,
            }, 
            generoespecie: {
                type: DataTypes.STRING,
            },
            emisor: {
                type: DataTypes.STRING,
            },
            investigador: {
                type: DataTypes.STRING,
            },
            correo: {
                type: DataTypes.STRING
            },
            contacto: {
                type: DataTypes.STRING,
            },
           
            institucion: {
                type: DataTypes.STRING,
            },
            fechaprestamo: {
                type: DataTypes.DATEONLY,
            },
            fechadevolucionest: {
                type: DataTypes.DATEONLY,
            },
            fechadevolucion: {
                type: DataTypes.DATEONLY,
            },
            devuelto: {
                type: DataTypes.BOOLEAN,
            },
            comentarios: {
                type: DataTypes.STRING,
            },
          
                  
        })
    }
