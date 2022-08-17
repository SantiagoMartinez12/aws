///////////////////////////////////////////////////////////////////
/////// LLENADO DE TABLA DE periodos EPOCAS Y PISOS   //////////
//////////////////////////////////////////////////////////////////


const {Router} = require('express')
const {conn} = require('../db');




const {periodoEpoca, periodo} = conn.models


module.exports = async()=>{
    //console.log('entra App Info')

    const periodoDb= await periodoEpoca.findAll()
      console.log(periodoDb.length)
      if(periodoDb.length==0){
        var tabla=[
          {
          periodo: 'Cámbrico',
          epoca: [{
              nombre: 'Terreneuviano',
              piso: ['Fortuniano','Piso 2']
          },{
            nombre: 'Serie 2',
            piso: ['Piso 3','Piso 4']
          },{
            nombre: 'Miaolingio',
            piso: ['Wuliuano','Drumiano','Guzhangiano']
          },{
            nombre: 'Furongiano',
            piso: ['Paibiano','Jiangshaniano','Piso 10']
        }],
        },
        {
          periodo: 'Ordovícico',
          epoca: [{
            nombre: 'Superior',
            piso: ['Sandbiano','Katiano','Hirnantiano']
        },{
          nombre: 'Medio',
          piso: ['Dapingiano','Darriwiliano']
        },{
          nombre: 'Inferior',
          piso: ['Tremadociano','Floiano']
        }],
        },
        {
          periodo: 'Silúrico',
          epoca: [{
            nombre: 'Llandovery',
            piso: ['Rhuddaniano','Aeroniano','Telychiano']
        },{
          nombre: 'Wenlock',
          piso: ['Sheinwoodiano','Homeriano']
        },{
          nombre: 'Ludlow',
          piso: ['Gorstiano','Ludfordiano']
        },{
          nombre: 'Pridoli',
          piso: []
        }],
        },
        {
          periodo: 'Dévonico',
          epoca: [{
            nombre: 'Inferior',
            piso: ['Lochkoviano','Pragiano','Emsiano']
        },{
          nombre: 'Medio',
          piso: ['Eifeliano','Givetiano']
        },{
          nombre: 'Superior',
          piso: ['Frasniano','Famenniano']
        }],
        },
        {
          periodo: 'Carbonífero Mississippiano',
          epoca: [{
            nombre: 'Inferior',
            piso: ['Tournaisiano']
        },{
          nombre: 'Medio',
          piso: ['Viseano']
        },{
          nombre: 'Superior',
          piso: ['Serpukhoviano']
        }],
        }, {
          periodo: 'Carbonífero Pennsylvaniano',
          epoca: [{
            nombre: 'Inferior',
            piso: ['Bashkiriano']
        },{
          nombre: 'Medio',
          piso: ['Moscovian']
        },{
          nombre: 'Superior',
          piso: ['Kasimoviano','Gzheliano']
        }],
        },
        {
          periodo: 'Pérmico',
          epoca: [{
            nombre: 'Inferior / Cisuraliense',
            piso: ['Asseliano','Sakmariano','Artinskiano','Kunguriano']
        },{
          nombre: 'Medio / Guadalupianse',
          piso: ['Roadiano','Wordiano','Capitaniano']
        },{
          nombre: 'Superior / Lopingiense',
          piso: ['Wuchiapingiano','Changhsingiano']
        }],
        },
        {
          periodo: 'Triásico',
          epoca: [{
            nombre: 'Inferior / Temprano)',
            piso: ['Induano','Olenekiano']
        },{
          nombre: 'Medio',
          piso: ['Anisiano','Ladiniano']
        },{
          nombre: 'Superior / Tardío',
          piso: ['Carniano','Noriano','Raetiano']
        }],
        },
        {
          periodo: 'Jurásico',
          epoca: [{
            nombre: 'Inferior / Temprano)',
            piso: ['Hetangiano','Sinemuriano','Pliensbachiano','Toarciano']
        },{
          nombre: 'Medio',
          piso: ['Aaleniano','Bajociano','Batoniano','Calloviano']
        },{
          nombre: 'Superior / Tardío',
          piso: ['Oxfordiano','Kimeridgiano','Titoniano']
        }],
        },
        {
          periodo: 'Cretácico',
          epoca: [{
            nombre: 'Inferior / Temprano',
            piso: ['Berriasiano','Valanginiano','Hauteriviano','Barremiano','Aptiano','Albiano']
        },{
          nombre: 'Superior / Tardío',
          piso: ['Cenomaniano','Turoniano','Coniaciano','Santoniano','Campaniano','Maastrichtiano']
        }],
        },
        {
          periodo: 'Paleogeno (Terceario Temprano)',
          epoca: [{
            nombre: 'Paleoceno',
            piso: ['Daniense','Selandiano','Thanetiano']
        },{
          nombre: 'Eoceno',
          piso: ['Ypresiano','Luteciano','Bartoniano','Priaboniano']
        },{
          nombre: 'Oligoceno',
          piso: ['Rupelieno','Chattiano']
        }],
        },
        {
          periodo: 'Neogeno',
          epoca: [{
            nombre: 'Neoceno',
            piso: ['Aquitaniano','Burdigaliano','Langhiano','Serravalliano','Tortoniano','Mesiniano']
        },{
          nombre: 'Plioceno',
          piso: ['Zancleano','Piacenziano']
        }],
        },
        {
          periodo: 'Cuaternario',
          epoca: [{
            nombre: 'Pleistoceno',
            piso: ['Gelasiano','Calabriano','Chibaniano','Tarantiano ó Superior']
        },{
          nombre: 'Holoceno',
          piso: ['Groenlandiano','Norgripiano','Megalayano']
        }],
        },
      ];  
        

      tabla.map(e=>{
           const period=e.periodo;           
           periodo.create({
            periodo:period,
           })

         e.epoca.map(el=>{
              periodoEpoca.create({
                periodo:period,
                epoca:el.nombre,
                piso:el.piso,
              })
           //   console.log(period,el.nombre,el.piso)
            })
        })
    
     }
    
};
