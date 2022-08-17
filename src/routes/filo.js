///////////////////////////////////////////////////////////////////
/////// LLENADO DE TABLA DE TEMPERAMENTOS DESDE LA API   //////////
//////////////////////////////////////////////////////////////////

const expres = require('express')
const {Router} = require('express')
const {conn} = require('../db')
const rutas = Router()  
const axios = require('axios')
const {Op, ARRAY} = require('sequelize');


const {  especimen, filo} = conn.models


module.exports = async()=>{
    //console.log('entra App Info')
        var filogen=[];
   
        var tablaFilo=[];
    
              
        //var findGenre='';
        const catalog =  await especimen.sequelize.query('select posicionfilo from especimens')
        //console.log('entre',catalog)
        const tablaFilogenesis =  await filo.findAll()
     //   console.log(tablaFilogenesis[0].filo)


       
        tablaFilogenesis.map(e=>{
         
        if(!tablaFilo.includes(e.filo)){
          tablaFilo.push(e.filo);
        }
       
       })

    //   console.log(tablaFilo)


        catalog[0].map(e=>{
         // console.log(e.posicionfilo)
        if(e.posicionfilo.length>0 ){
     //     console.log(e.posicionfilo)
          
           for(i=0; e.posicionfilo.length > i; i++){
            if(!filogen.includes(e.posicionfilo[i])&& !tablaFilo.includes(e.posicionfilo[i])){
             // console.log(e.posicionfilo[0])
             filo.create({
              filo: e.posicionfilo[i],
              })
              filogen.push(e.posicionfilo[i])
            }

           }
  

          
        }
     
        })
       // console.log(filogen)

    
};
