const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
    module.exports= (sequelize)=> {
        sequelize.define('periodoEpoca', {
          id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey:true,
            },
            periodo: {
                type: DataTypes.STRING,
            },
            epoca: {
                type: DataTypes.STRING,
            },
            piso: {
                type: DataTypes.JSON,
            },
                  
        },{
            timestamps: false,
            createdAt: false,    
          })
    }