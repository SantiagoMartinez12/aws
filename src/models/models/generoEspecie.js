const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
    module.exports= (sequelize)=> {
        sequelize.define('generoespecie', {
          id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey:true,
            },
            genero: {
                type: DataTypes.STRING,
            },
            especie: {
                type: DataTypes.JSON,
            },
                  
        })
    }