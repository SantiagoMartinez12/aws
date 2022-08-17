const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
    module.exports= (sequelize)=> {
        sequelize.define('periodo', {
          id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey:true,
            },
            periodo: {
                type: DataTypes.STRING,
            },
          
                  
        },{
            timestamps: false,
            createdAt: false,    
          })
    }
