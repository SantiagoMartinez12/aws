const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
    module.exports= (sequelize)=> {
        sequelize.define('parte', {
          id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey:true,
            },
            principal: {
                type: DataTypes.STRING,
            },
            secundaria: {
                type: DataTypes.JSON,
            },
          
                  
        })
    }
