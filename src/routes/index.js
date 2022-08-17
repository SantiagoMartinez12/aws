
const expres = require('express')
const {Router} = require('express')
const {conn} = require('../db')
const rutas = Router()  
const {Op} = require('sequelize');
const FileController = require('./FileController');
const fileController = new FileController();
let fs = require('fs');



const {  especimen, generoespecie,periodoEpoca,filo, parte ,prestamo, usuarios, bochon,formacioncuenca} = conn.models


//const app = expres()
rutas.get('/especimen/id',async (req, res) => {
    
 let id = req.query
 
 let  especimenEncontrado = await especimen.findByPk(id.id);
 especimenEncontrado.holotipo?especimenEncontrado.holotipo='si':especimenEncontrado.holotipo='no';
 especimenEncontrado.publico?especimenEncontrado.publico='si':especimenEncontrado.publico='no';
 res.send(especimenEncontrado)
})


rutas.get('/especimen',async (req, res) => {

    let {parametro, busqueda }= req.query
    let resultadoBusqueda
   // console.log(parametro)
    if(parametro === "genero") {
        resultadoBusqueda = await especimen.findAll({
            where: {genero: {
                [Op.iLike]: "%" + busqueda + "%"
            }}
        })
     //   console.log(resultadoBusqueda)
        res.send(resultadoBusqueda)
    } 
    
    else if (parametro === "especie") {
        resultadoBusqueda = await especimen.findAll({
            where: {especie: {
                [Op.iLike]: "%" + busqueda + "%"
            }}
        })
        res.send(resultadoBusqueda)
    }

    else if(parametro === "localidad"){
        resultadoBusqueda = await especimen.findAll({
            where: {localidad: {
                [Op.iLike]: "%" + busqueda + "%"
            }}
        })
        res.send(resultadoBusqueda)
    } 
    
    else if(parametro === "descubridor"){
        resultadoBusqueda = await especimen.findAll({
            where: {descubridor: {
                [Op.iLike]: "%" + busqueda + "%"
            }}
        })
        res.send(resultadoBusqueda)
    } 
    
    else if(parametro === "nuevo") {
      let numero = await especimen.sequelize.query('select especimennumero from especimens');
     // console.log(numero)
      let numeros=[];
    
      //buscamos el ultimo id ingresado
         numero[0].map(e=>{
         
             numeros.push(Number(e.especimennumero))
         })
       //  console.log(numeros)
          newId=Math.max(...numeros)+100;
           //console.log(resultadoBusqueda)
           var primero = numeros[0]
           var final = newId
           var faltantes = []
   // console.log(primero, final)  
     while(primero < final){
      
       if(!numeros.includes(primero)){
         faltantes.push(primero)

       }
       primero=primero+100;
     }     
     
      return res.send({newId, faltantes})
  } 
  else if(parametro === "nuevoEsp") {
    let numero = await especimen.sequelize.query('select especimennumero from especimens');
   // console.log(numero)
    let numeros=[];
  
    //buscamos el ultimo id ingresado
       numero[0].map(e=>{
          if(!numeros.includes(e.especimennumero.slice(0,e.especimennumero.length-2))){
           numeros.push(e.especimennumero.slice(0,e.especimennumero.length-2))
          }
       })
     //  console.log(numeros)
        newId=Math.max(...numeros)+1;
         //console.log(resultadoBusqueda)

   
    return res.send({newId,numeros,numero})
} 

  else if(!parametro){
        const especimens =  await especimen.findAll()

        if(especimens.length === 0){
          return  res.send('no hay datos en la tabla especimenes del back')
        }
        
       return res.send(especimens)
    } 
  
  else{
    return  res.send('parametro de busqueda inexistente')
  }
    
})

    rutas.put('/modificar', async ( req, res ) => {

        var parameters = req.body[0];
        var modificacion=[req.body[1]];
     


        var propiedades= Object.keys(modificacion[0].espPrev);
        var valoresPrev=Object.values(modificacion[0].espPrev);
        var valoresNew=Object.values(modificacion[0].espNew);

      //  console.log('New',valoresNew);
    //    console.log('Prev',valoresNew);
        var modificado={
          usuario:modificacion[0].usuario,
          fecha:modificacion[0].fecha,
          cambios:[],
        };

       // console.log(value)
        var cont=0;

       propiedades.map(e=>{
     //    console.log('entra map',cont)
        var prop=e;
        if(prop==='partesesqueletales'){
          var partes=0;
          valoresNew[cont].map(e=>{
            if(valoresNew[cont].length!==valoresPrev[cont].length  ||  !valoresPrev[cont].includes(e)){
              if(partes==0){
                modificado.cambios.push(prop+': '+valoresPrev[cont]+' ---> '+valoresNew[cont])
                partes=1
              }
             }
          })

        } else if(prop==='posicionfilo'){
          var filo=0;
          valoresNew[cont].map(e=>{
            if(valoresNew[cont].length!==valoresPrev[cont].length  ||  !valoresPrev[cont].includes(e)){
              if(filo==0){
                modificado.cambios.push(prop+': '+valoresPrev[cont]+' ---> '+valoresNew[cont])
                filo=1
              }
           
            }
          })

         
        
       
        

        }
         else if(valoresPrev[cont]!=valoresNew[cont]&&prop!='imagen'&&prop!='pdf'&&prop!='modificado'){
          modificado.cambios.push(prop+': '+valoresPrev[cont]+' ---> '+valoresNew[cont])
        }
        cont++;
       })

        //    console.log('modificado -->',modificado)
        
               
      //  console.log('parameters ---->>>',parameters.modificado)
        // console.log('modificacion --->>>',modificacion[0])



///////////////////// publico   ////////////////////////
        if(parameters.publico){
           var public;
          parameters.publico=='si'?public=true:public=false;
        }
        
///////////////////   holotipo  /////////////////////
        if(parameters.holotipo){
          var holo;
          parameters.holotipo=='si'?holo=true:holo=false;
        }


        var modif;
        if(parameters.modificado){
         modif=parameters.modificado
         modif.push(modificado)
        } else {
          modif=[modificado];
        }
   
       
        let especimen1 = await especimen.findOne({ where: { especimennumero: parameters.especimennumero } })
        let cambiarDetail = await especimen.update({
            genero: parameters.genero ? parameters.genero : especimen1.dataValues?.genero ? especimen1.dataValues?.genero : 'sin especificar',
            bochonnumero: parameters.bochonnumero ? parameters.bochonnumero : especimen1.dataValues?.bochonnumero ? especimen1.dataValues?.bochonnumero : '0',
            sigla: 'PVSJ',
            especie: parameters.especie ? parameters.especie : especimen1.dataValues?.especie ? especimen1.dataValues?.especie : 'sin especificar',
            subespecie: parameters.subespecie ? parameters.subespecie : especimen1.dataValues?.subespecie ? especimen1.dataValues?.subespecie : 'sin especificar',
            posicionfilo: parameters.posicionfilo ? parameters.posicionfilo : especimen1.dataValues?.posicionfilo ? especimen1.dataValues?.posicionfilo : [],
            periodo: parameters.periodo ? parameters.periodo : especimen1.dataValues?.periodo ? especimen1.dataValues?.periodo : 'sin especificar',
            epoca: parameters.epoca ? parameters.epoca : especimen1.dataValues?.epoca ? especimen1.dataValues?.epoca : 'sin especificar',
            piso: parameters.piso ? parameters.piso : especimen1.dataValues?.piso ? especimen1.dataValues?.piso :  'sin especificar',
            cuenca: parameters.cuenca ? parameters.cuenca : especimen1.dataValues?.cuenca ? especimen1.dataValues?.cuenca :  'sin especificar',
            formacion: parameters.formacion ? parameters.formacion : especimen1.dataValues?.formacion ? especimen1.dataValues?.formacion :  'sin especificar',
            miembro: parameters.miembro ? parameters.miembro : especimen1.dataValues?.miembro ? especimen1.dataValues?.miembro :  'sin especificar',
            localidad: parameters.localidad ? parameters.localidad : especimen1.dataValues?.localidad ? especimen1.dataValues?.localidad :  'sin especificar',
            coordlat: parameters.coordlat ? parameters.coordlat : especimen1.dataValues?.coordlat ? especimen1.dataValues?.coordlat :  0,
            coordlong: parameters.coordlong ? parameters.coordlong : especimen1.dataValues?.coordlong ? especimen1.dataValues?.coordlong : 0,
            campana: parameters.campana ? parameters.campana : especimen1.dataValues?.campana ? especimen1.dataValues?.campana :  'sin especificar',
            nrocampo: parameters.nrocampo ? parameters.nrocampo : especimen1.dataValues?.nrocampo ? especimen1.dataValues?.nrocampo :  'sin especificar',
            descubridor: parameters.descubridor ? parameters.descubridor : especimen1.dataValues?.descubridor ? especimen1.dataValues?.descubridor :  'sin especificar',
            fechadescubrimiento: parameters.fechadescubrimiento ? parameters.fechadescubrimiento : especimen1.dataValues?.fechadescubrimiento ? especimen1.dataValues?.fechadescubrimiento : null,
            preparador: parameters.preparador ? parameters.preparador : especimen1.dataValues?.preparador ? especimen1.dataValues?.preparador :  'sin especificar',
            preparacionfecha: parameters.preparacionfecha ? parameters.preparacionfecha : especimen1.dataValues?.preparacionfecha ? especimen1.dataValues?.preparacionfecha : null,
            armario1: parameters.armario1 ? parameters.armario1 : especimen1.dataValues?.armario1 ? especimen1.dataValues?.armario1 : 0,
            estante1desde: parameters.estante1desde ? parameters.estante1desde : especimen1.dataValues?.estante1desde ? especimen1.dataValues?.estante1desde : 0,
            estante1hasta: parameters.estante1hasta ? parameters.estante1hasta : especimen1.dataValues?.estante1hasta ? especimen1.dataValues?.estante1hasta : 0,
            armario2: parameters.armario2 ? parameters.armario2 : especimen1.dataValues?.armario2 ? especimen1.dataValues?.armario2 : 0,
            estante2desde: parameters.estante2desde ? parameters.estante2desde : especimen1.dataValues?.estante2desde ? especimen1.dataValues?.estante2desde : 0,
            estante2hasta: parameters.estante2hasta ? parameters.estante2hasta : especimen1.dataValues?.estante2hasta ? especimen1.dataValues?.estante2hasta : 0,
            partesesqueletales: parameters.partesesqueletales ? parameters.partesesqueletales : especimen1.dataValues?.partesesqueletales ? especimen1.dataValues?.partesesqueletales : [],
            cantidadfrag :parameters.cantidadfrag ? parameters.cantidadfrag : especimen1.dataValues?.cantidadfrag ? especimen1.dataValues?.cantidadfrag : 0,
            comentario: parameters.comentario ? parameters.comentario : especimen1.dataValues?.comentario ? especimen1.dataValues?.comentario :'sin especificar',
            imagen: parameters.imagen ? parameters.imagen : especimen1.dataValues?.imagen ? especimen1.dataValues?.imagen : [],
            pdf: parameters.pdf ? parameters.pdf : especimen1.dataValues?.pdf ? especimen1.dataValues?.pdf : [],
            URL: parameters.URL ? parameters.URL : especimen1.dataValues?.URL ? especimen1.dataValues?.URL : 'sin URL',
            publico: public,
            holotipo: holo,
            modificado: modif,
            prestado: parameters.prestado,

                 
            
        },  {
            where: {
                especimennumero: parameters.especimennumero
            }
        })
        
        res.send(cambiarDetail);

     })

rutas.put('/modificarespre', async (req, res)=>{
      console.log(req.body)
  
    req.body.especimennumero.map(el => {
                
              try{
              let update =  especimen.update({
              prestado: req.body.prestado,
            
              },
              {
              where:{
                especimennumero: el
              }
              })
             
            }
            catch (err){
              console.log(err)
                }} )
     /*  try{
        let update = await especimen.update({
         prestado: req.body.prestado,
       
        },
        {
         where:{
           especimennumero:req.body.especimennumero
         }
        })
        res.send(update)
       }
       catch (err){
         console.log(err)
       } */
      })



rutas.post('/especimen',async (req, res) => {


     let numero = await especimen.sequelize.query('select especimennumero from especimens');
     let numeros=[];
   
     //buscamos el ultimo id ingresado
        numero[0].map(e=>{
            numeros.push(e.especimennumero)
        })
        let newId=Math.max(...numeros)+1;

    try{
    const post = await especimen.create({
        especimennumero: req.body[2]?.toString() || req.body[0]?.especimennumero.toString() || newId.toString(),
        bochonnumero: req.body[0].bochonnumero || "0",
        sigla: "PVSJ",
        genero: req.body[0].genero,
        especie:req.body[0].especie,
        subespecie:req.body[0].subespecie,
        periodo:req.body[0].periodo,
        epoca:req.body[0].epoca,
        piso:req.body[0].piso ,
        posicionfilo:req.body[0].posicionfilo,
        cuenca:req.body[0].cuenca,
        formacion:req.body[0].formacion,
        miembro:req.body[0].miembro,
        localidad:req.body[0].localidad,
        coordlat:req.body[1].latitud,
        coordlong:req.body[1].longitud,
        campana:req.body[0].campana,
        descubridor:req.body[0].descubridor,
        fechadescubrimiento:req.body[0].fechadescubrimiento,
        nrocampo:req.body[0].nrocampo,
        preparador:req.body[0].preparador,
        armario1:req.body[0].armario1,
        estante1desde:req.body[0].estante1desde,
        estante1hasta:req.body[0].estante1hasta,
        armario2:req.body[0].armario2,
        estante2desde:req.body[0].estante2desde,
        estante2hasta:req.body[0].estante2hasta,
        preparacionfecha:req.body[0].preparacionfecha,
        partesesqueletales:req.body[0].partesesqueletales,
        cantidadfrag: req.body[0].cantidadfrag,
        imagen:req.body[0].imagen,
        pdf: req.body[0].pdf,
        comentario:req.body[0].comentario,
        URL:req.body[0].URL,
        publico: req.body[0].publico==='si'?true:false,
        holotipo:req.body[0].holo==='si'?true:false,
        modificado:false,
        prestado:false,
        })
        res.status(202).send(post)
     } catch(err){
console.log(err);
        res.status(404).send(err);
       
    } 
    if(req.body[2]){
      let updateBochon = await bochon.update({
        especimennumero: req.body[2],

       },
       {
        where:{
          bochonnumero:req.body[0].bochonnumero
        }
       })

      }
    
})

// rutas.get('/catalogo',async (req, res) => {

//     let nombre = req.query.nombre
//     if(nombre) {
//         const resultadoBusqueda = await catalogo.findAll({
//             where: {nombre: {
//                 [Op.iLike]: "%" + nombre + "%"
//             }}
//         })
//         console.log(resultadoBusqueda)
//         res.send(resultadoBusqueda)
//     }
//     try{
//         const nombre =  await catalogo.findAll()
//         console.log(nombre)

//         if(nombre.length === 0){
//           return  res.send('no hay datos')
//         }
//        return res.send(nombre)
//     } catch(err){
//         console.log(err)
//     }
    
// })

rutas.delete('/especimen/:id', (req,res,next)=>{
    const {id} = req.params;
 
        especimen.destroy({
            where: {
                especimennumero: id
            }
          }).then(()=> res.status(202).send('Especimen Borrado!')).catch((err)=>res.status(404).send(err))
          

    
})
rutas.get('/especimenHome', async (req, res) => {

  let especimenes = await especimen.sequelize.query('select especimennumero, genero, especie, partesesqueletales, posicionfilo, campana, nrocampo, descubridor from especimens')
  res.send(especimenes)
})
//get prestamos
rutas.get('/prestamos',async (req, res) => {
  
    let numero = req.query.id
    console.log(numero)
    if(numero){
      let  prestamo1 = await prestamo.findAll();
      let filtrado = prestamo1.filter( e => e.numeroespecimen.includes(numero))
      
     res.send(filtrado)
    } else{
      let prestamos = await prestamo.findAll()
      res.send(prestamos)
    }

})

rutas.post('/prestamos',async (req, res) => {
    console.log(req.body)
  try{
  const post = await prestamo.create({
      numeroespecimen: req.body.numeroespecimen ,
      generoespecie: req.body.generoespecie,
      tipoprestamo: req.body.tipoprestamo,
      emisor: req.body.emisor,
      correo: req.body.correo,
      investigador:req.body.investigador,
      contacto: req.body.contacto,
      institucion:req.body.institucion,
      fechaprestamo:req.body.fechaprestamo,
      fechadevolucionest:req.body.fechadevolucionest,
      fechadevolucion:null,
      devuelto:false ,
      comentarios:req.body.comentarios,
     })
      res.status(202).send(post)
   } catch(err){
//console.log(err);
      res.status(404).send(err);
     
  } 
})

rutas.put('/prestamos', async (req, res) =>{
  console.log(req.body)
  try{
   let updatePresta = await prestamo.update({
    fechadevolucion: req.body.fechadevolucion,
    devuelto: req.body.devuelto,
   },
   {
    where:{
      id:req.body.id
    }
   })
   res.send(updatePresta)
  }
  catch (err){
    console.log(err)
  }
})


// get de tablas para POST 

rutas.get('/tablas/',async (req, res) => {
 
const {parametro,indice} =req.query;
   try{
     //const {indice} =req.query;
    
  if(parametro==='genero'){
    let  genero = await generoespecie.findAll();
    res.send(genero)
  }

  if(parametro==='formacion'){
    let  genero = await formacioncuenca.findAll();
    res.send(genero)
  }


  if(parametro==='periodos'){
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
    res.send(tabla)
  }

  if(parametro==='epocas'){
    let  epoca = await periodoEpoca.findAll();
    const envio=[];
    epoca.map(e=>{
        if(indice==e.periodo){
      let obj={
        epoca:e.epoca,
        piso:e.piso,
      };
      envio.push(obj)
    }

    })
    res.send(envio)
  }

  if(parametro==='partes'){
    let  partes = await parte.sequelize.query('select principal,secundaria from partes')
    res.send(partes[0])
  }
  
  if(parametro==='filo'){
    let  filog = await filo.findAll();
    res.send(filog)
  }
   }catch(e){
    res.send(e).status(404)
   }
  
    })


   rutas.post('/tablas/',async (req, res) => {
    
        const {modelo,primario,secundario} =req.query;

      if(modelo==='genero'){
        let origin = await generoespecie.sequelize.query('select genero from generoespecies')
        //chequeo datos de tabla
        let generosTabla=[];
        origin[0].map(e=>{
            generosTabla.push(e.genero);
        })

        if(!generosTabla.includes(primario)){
          //  console.log('nuevo genero')
            let  newGenero = await generoespecie.create({
                genero: primario,
                especie:[]
            });
            res.send(newGenero)
        } else {
            let origin = await generoespecie.sequelize.query("select especie from generoespecies where genero = '"+primario+"'")
//console.log(origin[0][0].especie)
           let especies =origin[0][0].especie;
        
            especies.push(secundario)
          //  console.log(especies)
            
            let  newEspecie = await generoespecie.update({
                especie: especies,
            },{
                where:{
                    genero: primario,
                }
            });
            res.send(newEspecie)
           

        }
     }

     if(modelo==='cuenca'){
      try{
        console.log('cuencaPA')
        console.log('primario',primario)
      console.log('secundario',secundario)
        let origin = await formacioncuenca.sequelize.query('select cuenca from formacioncuencas')
        //chequeo datos de tabla
        let cuencasTabla=[];
        origin[0].map(e=>{
          cuencasTabla.push(e.cuenca);
        })
  
        if(!cuencasTabla.includes(primario)){
          //  console.log('nuevo genero')
            let  newCuenca = await formacioncuenca.create({
                cuenca: primario,
                formacion:[]
            });
            res.send(newCuenca)
        } else {
            let origin = await formacioncuenca.sequelize.query("select formacion from formacioncuencas where cuenca ='"+primario+"'")
  //console.log('secundario',origin[0][0])
           let forma =origin[0][0].formacion;
     //   console.log(secundario)
           forma.push(secundario)
            console.log(forma)
            
            let  newforma = await formacioncuenca.update({
                formacion: forma,
            },{
                where:{
                    cuenca: primario,
                }
            });
            console.log(newforma)
            res.send(newforma)
           
  
        }
      } catch(e){
        res.send(e)
      }
     
   }

     //post para nuevo filo
     if(modelo==='filo'){
        let origin = await filo.sequelize.query('select filo from filos')
        let filoTabla=[];
    //dontrol de duplicados    
    origin[0].map(e=>{
        filoTabla.push(e.filo)
    })

    if(!filoTabla.includes(primario)){

        let  newFilo = await filo.create({
        filo: primario,
        });
        res.send(newFilo).status(202)
    }
   

      }


      })
   rutas.post('/subir-archivo', fileController.subirArchivo);
   rutas.get('/getPdf/:filename', function(req, res) {

    console.log(req.params.filename)
    let filename = req.params.filename
    const rs = fs.createReadStream("/app/src/pdf/" + filename);
  
    rs.pipe(res)
  }); 


   rutas.delete('/eliminar-archivo',async (req, res) => {
     //fs.unlink('./../front/src/pdf/' + nombreArchivo)
    let nombreArchivo = req.query
    let archivoname = nombreArchivo.nombreArchivo

    try {
      fs.unlinkSync('/app/src/pdf/' + archivoname)
      res.status(200).send({ status: 'success', msg: 'archivo ' + archivoname + ' eliminado'});
    } catch(err) {
      console.error('Algo ocurrio al eliminar archivo', err)
    }
   })
   rutas.post('/usuario',async (req, res) => {
    try{
        let {id, correo, nombre, imagen} = req.body
       // console.log(req.body)
      let encontrado = await usuarios.findByPk(id)
      if(encontrado){
        res.send(encontrado.dataValues)
        console.log(encontrado.dataValues)
      } else {
        let newUser = await usuarios.create({
          id:id,
          correo: correo,
          nombre: nombre,
          imagen:imagen
        })
        res.send(newUser.dataValues)
     
      }
        /* let newUser = await usuarios.findOrCreate({
          id,
          correo,
          nombre,
          imagen,
          where: {
            id: id,
            correo: correo
          }
        }); */
        //res.send(newUser, console.log(newUser) );
      } catch (err) {
        console.log(err);
      }
   })
   rutas.put('/modificarUsuario', async (req, res) =>{
    let { id, correo, nombre, nivel, imagen1,contrasena} = req.body
    try{
     let update = await usuarios.update({
      correo: correo,
      nombre: nombre,
      contrasena:contrasena,
      nivel:nivel,
      imagen: imagen1,
     },
     {
      where:{
        id:id
      }
     })
     res.send(update)
    }
    catch (err){
      console.log(err)
    }
 })
   rutas.delete('/eliminarUsuario/:id' , async (req,res)=>{
    let {id} = req.params
    try{
    let eliminarUsuario = await  usuarios.destroy({
      where: {id: id}
    })
    res.send('se elimino correctemente', eliminarUsuario)
    }
    catch (err){
      console.log(err)
    }
   })
   rutas.get('/usuario' , async (req,res)=>{
    let ids = req.query
    
    try{
      if(ids.id){
        let usuario = await usuarios.findByPk(ids.id)
    //    console.log(usuario)
        res.send(usuario?.dataValues)
      }else{
    let usuariosList = await usuarios.findAll()
    //console.log(usuariosList)
    let lista = usuariosList.map(el => {return {
      id: el.dataValues.id,
      nombre : el.dataValues.nombre,
      correo: el.dataValues.correo,
      imagen: el.dataValues.imagen,
      nivel : el.dataValues.nivel
    }})
  
    res.send(lista)
    }
  }
    catch (err){
      console.log(err)
    }
   })


rutas.post('/postpartes', async (req,res)=> {
   let parte1 = req.query
  /*  let origin = await parte.sequelize.query("select secundaria from partes where principal = 'nueva'")
                let allPartes = origin[0][0].secundaria;
                allPartes.push(parte1.parte)
                */
   let nueva = await  parte.create({
    principal: parte1.parte,
    secundaria: [],
     
  }) 
  res.send(nueva) 

})











//-----------------------------------------BOCHON----------------------------------//

rutas.get('/bochon/especimen/id',async (req, res) => {
    
  let id = req.query
  
  let  especimenEncontrado = await bochon.findByPk(id.id);
    especimenEncontrado?.holotipo?especimenEncontrado.holotipo='si':especimenEncontrado.holotipo='no';
    especimenEncontrado?.publico?especimenEncontrado.publico='si':especimenEncontrado.publico='no';
  res.send(especimenEncontrado)
 })
 
 
 rutas.get('/bochon/especimen',async (req, res) => {
 
     let {parametro, busqueda }= req.query
     let resultadoBusqueda
    // console.log(parametro)
     if(parametro === "genero") {
         resultadoBusqueda = await bochon.findAll({
             where: {genero: {
                 [Op.iLike]: "%" + busqueda + "%"
             }}
         })
      //   console.log(resultadoBusqueda)
         res.send(resultadoBusqueda)
     } 
     
     else if (parametro === "especie") {
         resultadoBusqueda = await bochon.findAll({
             where: {especie: {
                 [Op.iLike]: "%" + busqueda + "%"
             }}
         })
         res.send(resultadoBusqueda)
     }
 
     else if(parametro === "localidad"){
         resultadoBusqueda = await bochon.findAll({
             where: {localidad: {
                 [Op.iLike]: "%" + busqueda + "%"
             }}
         })
         res.send(resultadoBusqueda)
     } 
     
     else if(parametro === "descubridor"){
         resultadoBusqueda = await bochon.findAll({
             where: {descubridor: {
                 [Op.iLike]: "%" + busqueda + "%"
             }}
         })
         res.send(resultadoBusqueda)
     } 
     
     else if(parametro === "nuevo") {
       let numero = await bochon.sequelize.query('select bochonnumero from bochons');
      // console.log(numero)
       let numeros=[];
     
       //buscamos el ultimo id ingresado
          numero[0].map(e=>{
          
              numeros.push(Number(e.bochonnumero))
          })
       // console.log(numeros)
           newId=Math.max(...numeros)+1;
            //console.log(resultadoBusqueda)
            var primero = numeros[0]
            var final = newId
            var faltantes = []
    // console.log(primero, final)  
      while(primero < final){
       
        if(!numeros.includes(primero)){
          faltantes.push(primero)

        }
        primero++
      }     
      

   return res.send({newId, faltantes}) 
   } 
 
   else if(!parametro){
         const especimens =  await bochon.findAll()
 
         if(especimens.length === 0){
           return  res.send('no hay datos en la tabla especimenes del back')
         }
         
        return res.send(especimens)
     } 
   
   else{
     return  res.send('parametro de busqueda inexistente')
   }
     
 })
 
rutas.put('/bochon/modificar', async ( req, res ) => {
 
         var parameters = req.body[0];
         var modificacion=[req.body[1]];
      
 
 
         var propiedades= Object.keys(modificacion[0].espPrev);
         var valoresPrev=Object.values(modificacion[0].espPrev);
         var valoresNew=Object.values(modificacion[0].espNew);
 
       //  console.log('New',valoresNew);
     //    console.log('Prev',valoresNew);
         var modificado={
           usuario:modificacion[0].usuario,
           fecha:modificacion[0].fecha,
           cambios:[],
         };
 
        // console.log(value)
         var cont=0;
 
        propiedades.map(e=>{
      //    console.log('entra map',cont)
         var prop=e;
         if(prop==='partesesqueletales'){
           var partes=0;
           valoresNew[cont].map(e=>{
             if(valoresNew[cont].length!==valoresPrev[cont].length  ||  !valoresPrev[cont].includes(e)){
               if(partes==0){
                 modificado.cambios.push(prop+': '+valoresPrev[cont]+' ---> '+valoresNew[cont])
                 partes=1
               }
              }
           })
 
         } else if(prop==='posicionfilo'){
           var filo=0;
           valoresNew[cont].map(e=>{
             if(valoresNew[cont].length!==valoresPrev[cont].length  ||  !valoresPrev[cont].includes(e)){
               if(filo==0){
                 modificado.cambios.push(prop+': '+valoresPrev[cont]+' ---> '+valoresNew[cont])
                 filo=1
               }
            
             }
           })
 
          
         
        
         
 
         }
          else if(valoresPrev[cont]!=valoresNew[cont]&&prop!='imagen'&&prop!='pdf'&&prop!='modificado'){
           modificado.cambios.push(prop+': '+valoresPrev[cont]+' ---> '+valoresNew[cont])
         }
         cont++;
        })
 
         //    console.log('modificado -->',modificado)
         
                
       //  console.log('parameters ---->>>',parameters.modificado)
         // console.log('modificacion --->>>',modificacion[0])
 
 
 
 ///////////////////// publico   ////////////////////////
         if(parameters.publico){
            var public;
           parameters.publico=='si'?public=true:public=false;
         }
         
 ///////////////////   holotipo  /////////////////////
         if(parameters.holotipo){
           var holo;
           parameters.holotipo=='si'?holo=true:holo=false;
         }
 
 
         var modif;
         if(parameters.modificado){
          modif=parameters.modificado
          modif.push(modificado)
         } else {
           modif=[modificado];
         }
         console.log(parameters.especimennumero)
    
        
         let especimen1 = await bochon.findOne({ where: { bochonnumero: parameters.bochonnumero } })
         let cambiarDetail = await bochon.update({
             especimennumero: parameters.especimennumero ? parameters.especimennumero : especimen1.dataValues?.especimennumero ? especimen1.dataValues?.especimennumero : '0',   
             genero: parameters.genero ? parameters.genero : especimen1.dataValues?.genero ? especimen1.dataValues?.genero : 'sin especificar',
             especie: parameters.especie ? parameters.especie : especimen1.dataValues?.especie ? especimen1.dataValues?.especie : 'sin especificar',
             subespecie: parameters.subespecie ? parameters.subespecie : especimen1.dataValues?.subespecie ? especimen1.dataValues?.subespecie : 'sin especificar',
             posicionfilo: parameters.posicionfilo ? parameters.posicionfilo : especimen1.dataValues?.posicionfilo ? especimen1.dataValues?.posicionfilo : [],
             periodo: parameters.periodo ? parameters.periodo : especimen1.dataValues?.periodo ? especimen1.dataValues?.periodo : 'sin especificar',
             epoca: parameters.epoca ? parameters.epoca : especimen1.dataValues?.epoca ? especimen1.dataValues?.epoca : 'sin especificar',
             piso: parameters.piso ? parameters.piso : especimen1.dataValues?.piso ? especimen1.dataValues?.piso :  'sin especificar',
             cuenca: parameters.cuenca ? parameters.cuenca : especimen1.dataValues?.cuenca ? especimen1.dataValues?.cuenca :  'sin especificar',
             formacion: parameters.formacion ? parameters.formacion : especimen1.dataValues?.formacion ? especimen1.dataValues?.formacion :  'sin especificar',
             miembro: parameters.miembro ? parameters.miembro : especimen1.dataValues?.miembro ? especimen1.dataValues?.miembro :  'sin especificar',
             localidad: parameters.localidad ? parameters.localidad : especimen1.dataValues?.localidad ? especimen1.dataValues?.localidad :  'sin especificar',
             coordlat: parameters.coordlat ? parameters.coordlat : especimen1.dataValues?.coordlat ? especimen1.dataValues?.coordlat :  0,
             coordlong: parameters.coordlong ? parameters.coordlong : especimen1.dataValues?.coordlong ? especimen1.dataValues?.coordlong : 0,
             campana: parameters.campana ? parameters.campana : especimen1.dataValues?.campana ? especimen1.dataValues?.campana :  'sin especificar',
             nrocampo: parameters.nrocampo ? parameters.nrocampo : especimen1.dataValues?.nrocampo ? especimen1.dataValues?.nrocampo :  'sin especificar',
             descubridor: parameters.descubridor ? parameters.descubridor : especimen1.dataValues?.descubridor ? especimen1.dataValues?.descubridor :  'sin especificar',
             fechadescubrimiento: parameters.fechadescubrimiento ? parameters.fechadescubrimiento : especimen1.dataValues?.fechadescubrimiento ? especimen1.dataValues?.fechadescubrimiento : null,
             preparador: parameters.preparador ? parameters.preparador : especimen1.dataValues?.preparador ? especimen1.dataValues?.preparador :  'sin especificar',
             preparacionfecha: parameters.preparacionfecha ? parameters.preparacionfecha : especimen1.dataValues?.preparacionfecha ? especimen1.dataValues?.preparacionfecha : null,
             armario1: parameters.armario1 ? parameters.armario1 : especimen1.dataValues?.armario1 ? especimen1.dataValues?.armario1 : 0,
             estante1desde: parameters.estante1desde ? parameters.estante1desde : especimen1.dataValues?.estante1desde ? especimen1.dataValues?.estante1desde : 0,
             estante1hasta: parameters.estante1hasta ? parameters.estante1hasta : especimen1.dataValues?.estante1hasta ? especimen1.dataValues?.estante1hasta : 0,
             armario2: parameters.armario2 ? parameters.armario2 : especimen1.dataValues?.armario2 ? especimen1.dataValues?.armario2 : 0,
             estante2desde: parameters.estante2desde ? parameters.estante2desde : especimen1.dataValues?.estante2desde ? especimen1.dataValues?.estante2desde : 0,
             estante2hasta: parameters.estante2hasta ? parameters.estante2hasta : especimen1.dataValues?.estante2hasta ? especimen1.dataValues?.estante2hasta : 0,
             partesesqueletales: parameters.partesesqueletales ? parameters.partesesqueletales : especimen1.dataValues?.partesesqueletales ? especimen1.dataValues?.partesesqueletales : [],
             cantidadfrag :parameters.cantidadfrag ? parameters.cantidadfrag : especimen1.dataValues?.cantidadfrag ? especimen1.dataValues?.cantidadfrag : 0,
             comentario: parameters.comentario ? parameters.comentario : especimen1.dataValues?.comentario ? especimen1.dataValues?.comentario :'sin especificar',
             imagen: parameters.imagen ? parameters.imagen : especimen1.dataValues?.imagen ? especimen1.dataValues?.imagen : [],
             pdf: parameters.pdf ? parameters.pdf : especimen1.dataValues?.pdf ? especimen1.dataValues?.pdf : [],
             URL: parameters.URL ? parameters.URL : especimen1.dataValues?.URL ? especimen1.dataValues?.URL : 'sin URL',
             publico: public,
             holotipo: holo,
             modificado: modif,
             prestado: parameters.prestado,
 
                  
             
         },  {
             where: {
                 bochonnumero: parameters.bochonnumero
             }
         })
         
         res.send(cambiarDetail);
 
      })
 

 
 rutas.post('/bochon/especimen',async (req, res) => {

   console.log(req.body)
 
      let numero = await bochon.sequelize.query('select bochonnumero from bochons');
      let numeros=[]; 
    
      //buscamos el ultimo id ingresado
          numero[0].map(e=>{
             numeros.push(e.bochonnumero)
         })
         let newId=Math.max(...numeros)+1;
     try{
     const post = await bochon.create({
          bochonnumero: req.body[0]?.bochonnumero.toString() || newId.toString(),
          especimennumero: req.body[0].especimennumero || "sin especificar", 
           sigla: "PVSJ",
          genero: req.body[0].genero,
         especie:req.body[0].especie,
         subespecie:req.body[0].subespecie,
         periodo:req.body[0].periodo,
         epoca:req.body[0].epoca,
         piso:req.body[0].piso ,
         posicionfilo:req.body[0].posicionfilo,
         cuenca:req.body[0].cuenca,
         formacion:req.body[0].formacion,
         miembro:req.body[0].miembro,
         localidad:req.body[0].localidad,
         coordlat:req.body[1].latitud,
         coordlong:req.body[1].longitud,
         campana:req.body[0].campana,
         descubridor:req.body[0].descubridor,
         fechadescubrimiento:req.body[0].fechadescubrimiento,
         nrocampo:req.body[0].nrocampo,
         preparador:req.body[0].preparador,
         armario1:req.body[0].armario1,
         estante1desde:req.body[0].estante1desde,
         estante1hasta:req.body[0].estante1hasta,
         armario2:req.body[0].armario2,
         estante2desde:req.body[0].estante2desde,
         estante2hasta:req.body[0].estante2hasta,
         preparacionfecha:req.body[0].preparacionfecha,
         partesesqueletales:req.body[0].partesesqueletales,
         cantidadfrag: req.body[0].cantidadfrag,
         imagen:req.body[0].imagen,
         pdf: req.body[0].pdf,
         comentario:req.body[0].comentario,
         URL:req.body[0].URL,
         publico: req.body[0].publico==='si'?true:false,
         holotipo:req.body[0].holo==='si'?true:false,
         modificado:false,
         prestado:false,
         })
         res.status(202).send(post)
      } catch(err){
 console.log(err);
         res.status(404).send(err);
        
     } 
 })
 
 
 
 rutas.delete('/bochon/especimen/:id', (req,res,next)=>{
     const {id} = req.params;
  console.log('ID->',id)
         bochon.destroy({
             where: {
                 bochonnumero: id,
             }
           }).then(()=> res.status(202).send('Especimen Borrado!')).catch((err)=>res.status(404).send(err))
           
 
     
 })
 
 

   
 
  

 module.exports = rutas
