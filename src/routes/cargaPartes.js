///////////////////////////////////////////////////////////////////
/////// LLENADO DE TABLA DE periodos EPOCAS Y PISOS   //////////
//////////////////////////////////////////////////////////////////


const {Router} = require('express')
const {conn} = require('../db');




const {parte, periodo} = conn.models


module.exports = async()=>{
    //console.log('entra App Info')

    const periodoDb= await parte.findAll()
      console.log(periodoDb.length)
      if(periodoDb.length==0){
        
        var tabla=[
            {
              primaria: 'nueva',
              secundaria: []
            },
            {
            primaria: 'Esqueleto Completo',
            secundaria: []
            },    {
              primaria: 'Craneo',
              secundaria: ['Premaxilar',
                "Maxilar",
                "Jugal",
                "Cuadrado",
                "Escamosal",
                "Postorbital",
                "Frontal",
                "Prefrontal",
                "Postfrontal",
                "Nasal",
                "Lacrimal",
                "Septomaxilar",
                "Parietal",
                "Supratemporal",
                "Opistótico",
                "Ectopterigoides",
                "Pterigoides",
                "Palatino",
                "Vómer",
                "Tabular",
                "Estribo",
                "Neurocráneo",
                "Exoccipital",
                "Basicráneo",
                "Cóndilo occipital",
                ]
              },    {
                primaria: 'Mandibula',
                secundaria: [
                  "Dentario",
                  "Angular",
                  "Surangular",
                  "Splenial",
                  "Articular",
                  "Prearticular"
                  ]
                }, {
                  primaria: 'diente',
                  secundaria: [
                    "Incisivo",
                    "Molariforme",
                    "Molar",
                    "Caniniforme",
                    "Canino"
                    
                    ]
                  },{
                    primaria: 'Columna vertebral',
                    secundaria: 
                    ["Sacro",
                    "Vértebra Cervical",
                    "Axis",
                    "Vértebra dorsal",
                    "Vértebra caudal",
                    "Vértebra sacra",
                    "Arco neural",
                    "Cuerpo vertebral",
                    "Costilla cervical",
                    "Costilla dorsal",
                    "Costilla sacra",
                    "Chevrón"
                      ]
                    },{
                      primaria: 'Cintura escapular',
                      secundaria: 
                      ["Interclavícula",
                      "Clavícula",
                      "Escápula",
                      "Coracoides"
                        ]
                      },{
                        primaria: 'Miembro anterior',
                        secundaria: 
                        ["Húmero",
                          "Radio",
                          "Ulna",
                          "Carpo",
                          "Metacarpo",
                          "Falange",
                          "Ungual"
                          ]
                        },{
                          primaria: 'Cintura Pélvica',
                          secundaria: 
                          ["Ilium",
                          "Pubis",
                          "Isquion"
                            ]
                          },{
                            primaria: 'Miembro posterior',
                            secundaria: 
                            ["Fémur",
                            "Tibia",
                              "Fíbula",
                              "Tarso",
                              "Metatarso",
                              "Falange",
                              "Ungual",
                              "Astrágalo",
                              "Calcáneo"
                               ]
                            },{
                              primaria: 'Caparazón',
                              secundaria:[]
                               
                              },{
                                primaria: 'Plastrón',
                                secundaria:[]
                                 
                                },{
                                  primaria: 'Placa',
                                  secundaria:[]
                                   
                                  },{
                                    primaria: 'Osteodermo',
                                    secundaria:[]
                                     
                                    }
                                  ,{
                                    primaria: 'Coprolito',
                                    secundaria:[]
                                     
                                    },{
                                      primaria: 'Icnita',
                                      secundaria:[]
                                       
                                      }
          
                  ]
      
      }

    //  console.log(tabla)

 if(tabla){
      
      tabla.map(e=>{
           const principal=e.primaria;   
           const secundaria=e.secundaria;

          parte.create({
            principal:principal,
            secundaria:secundaria,
          })
      
        });

       // console.log(todas)
 
    
    
      }
    
};