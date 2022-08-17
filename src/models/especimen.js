const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')
    module.exports= (sequelize)=> {
        sequelize.define('especimen', {
          
            especimennumero: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey:true,
            },
            bochonnumero: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sigla: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            genero: {
                type: DataTypes.STRING,
                defaultValue: "Sin datos"
            
            },
                                especie: {
                                    type:DataTypes.STRING,
                                    allowNull:false,
                                    defaultValue: "Sin datos"
                                },
                                subespecie: {
                                    type:DataTypes.STRING,
                                    defaultValue: "Sin datos"
                                },
                                posicionfilo: {
                                    type: Sequelize.JSON,
                                },

            periodo: {
                //efowefiwofijheofiejhwofiheoiwhhhhhhhfowehfoewifheofiewh
                type: DataTypes.STRING,
                defaultValue: "Sin datos"
                        },
                      epoca: {
                           type: DataTypes.STRING,
                           defaultValue: "Sin datos"
                       },
                            piso: {
                                type: DataTypes.STRING,
                                defaultValue: "Sin datos"
                            },

         


            cuenca: {
                type: DataTypes.STRING,
                defaultValue: "Sin datos"
            },
                    formacion: {
                        type: DataTypes.STRING,
                        defaultValue: "Sin datos"
                    },
                            miembro: {
                                type: DataTypes.STRING,
                                defaultValue: "Sin datos"
                            },

            localidad: {
                type: DataTypes.STRING,
                defaultValue: "Sin datos"
            },
                coordlat: {
                    type: DataTypes.FLOAT,
                    defaultValue:0,
                }, 
                coordlong: {
                        type: DataTypes.FLOAT,
                        defaultValue:0,
                    },    
                    
            campana: {
                type: DataTypes.STRING,
                defaultValue: "Sin datos"
            },

            nrocampo: {
                type: DataTypes.STRING,
                defaultValue: "Sin datos"
            },
                descubridor: {
                    type: DataTypes.STRING,
                    defaultValue: "Sin datos"
                },
                    fechadescubrimiento: {
                        type: DataTypes.DATEONLY,
                        
                        
                    },            
                       

            preparador: {
                type: DataTypes.STRING,
                defaultValue: "Sin datos"
            },
            preparacionfecha: {
                type: DataTypes.DATEONLY,
               
                
            },
            armario1: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            estante1desde: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            estante1hasta: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            armario2: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            estante2desde: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            estante2hasta: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            partesesqueletales: {
                type: DataTypes.JSON,
                defaultValue: [],
            },
            cantidadfrag:{
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            comentario: {
                type: DataTypes.STRING,
                defaultValue: "Sin datos"
            },
            imagen: {
                type: DataTypes.JSON,
                allowNull:true,
            },
            pdf: {
                type: DataTypes.JSON,
                allowNull:true,
            },
            
            url : {
                type: DataTypes.STRING,
                allowNull:true,
                defaultValue:"sin URL"
            },
            publico:{
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },   
            holotipo:{
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            modificado:{
                type: DataTypes.JSON,
                defaultValue: false,
            }, 
            prestado:{
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            }


        }
        );
    }