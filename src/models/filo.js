const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
    module.exports= (sequelize)=> {
        sequelize.define('filo', {
          id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey:true,
            },
            filo: {
                type: DataTypes.STRING,
            },
          
                  
        })
    }
