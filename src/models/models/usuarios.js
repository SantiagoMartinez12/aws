const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
    module.exports= (sequelize)=> {
        sequelize.define('usuarios', {
          id: {
                type: DataTypes.STRING,
                
                primaryKey:true,
            },
            nombre: {
                type: DataTypes.STRING
            },
            correo: {
                type: DataTypes.STRING,
            },
            imagen: {
                type: DataTypes.STRING,
            },
            nivel:{
                type: DataTypes.INTEGER,
                defaultValue: 4
            },

          
                  
        },{
            timestamps: false,
            createdAt: false,    
          })
    }