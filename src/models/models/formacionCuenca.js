const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
    module.exports= (sequelize)=> {
        sequelize.define('formacioncuenca', {
          id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey:true,
            },
            cuenca: {
                type: DataTypes.STRING,
                
            },
            formacion: {
                type: DataTypes.JSON,
                defaultValue: ['indet.']
            },

        })
    } 