///////////////////////////////////////////////////////////////////
/////// LLENADO DE TABLA DE TEMPERAMENTOS DESDE LA API   //////////
//////////////////////////////////////////////////////////////////

const expres = require('express')
const {Router} = require('express')
const {conn} = require('../db')
const rutas = Router()  
const axios = require('axios')
const {Op, ARRAY} = require('sequelize');


const {  especimen, formacioncuenca} = conn.models


module.exports = async()=>{
    //console.log('entra App Info')
         var cuencas=[];
        var formaciones=[]

        var tablaCuenca=[];
        var tablaFormacion=[];

        //var findGenre='';
        const catalog =  await especimen.findAll()
        const tablaFormacionCuenca=  await formacioncuenca.findAll()
       // console.log(catalog)

       tablaFormacionCuenca.map(e=>{
        if(!tablaCuenca.includes(e.cuenca)){
          tablaCuenca.push(e.cuenca);
        }
        if(!tablaFormacion.includes(e.formacion)){
          tablaFormacion.push(e.formacion);
        }
       })

        catalog.map(e=>{

          if(!cuencas.includes(e.cuenca)&&!tablaCuenca.includes(e.cuenca)){ //INSERTO NUEVO periodo (y todas sus ESPOCAS) 
          //  console.log(e.formacion)
            formacioncuenca.create({
              cuenca: e.cuenca,
              })
              cuencas.push(e.cuenca)

            //BUSCO TODOS LOS PERIODOS DE ESE APECO y creo el ARRAY para insErtar
            for(i=0;catalog.length>i;i++){
               if(catalog[i].cuenca==e.cuenca) {
           //     console.log(e.cuenca)
                if(!formaciones.includes(catalog[i].formacion)&&!tablaFormacion.includes(catalog[i].formacion)){
                //  console.log(catalog[i].cuenca)
                  formaciones.push(catalog[i].formacion)

                }

               }

            }
            //update de Tabla con las especies del genero correspondiente
            formacioncuenca.update({
              formacion: formaciones,
                  }, {
                where: {
                    cuenca: e.cuenca,
                }
            });

           // console.log(especies)

          }
          formaciones=[];

        })
    };
