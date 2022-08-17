import axios from "axios";
import React, { useEffect, useState} from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { gradoAdecimal,decimalAGrado,fechaActual, getCuencaFormacion,getDatos, getFilo, getGeneroEspecie, getPeriodoEpoca, postDatos, postFilo, postGeneroEspecie, selectEpoca, selectEspecie } from "../store/action";

import './actualizarEspecimen.css'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {Alert} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import { FiCheck,FiDelete} from "react-icons/fi";
import { Carousel } from 'react-bootstrap';
import Menu from "./menu";





export default function ActualizarEspecimen (){
    const dispatch = useDispatch();
    const [especimen, setEspecimen] = useState(null)
    const [ prueba, setPrueba] = useState(null)
    
    const generoEspecie = useSelector((state)=> state.generoEspecie)
    const especiefiltrada = useSelector((state)=> state.especie)

    const filogenia = useSelector((state)=> state.filo )
    const partes = useSelector((state)=> state.partes )

    const periodoEpoca = useSelector((state)=> state.periodoepoca)
    const epocaFiltrada = useSelector((state)=> state.epoca)
    const [pisoFiltrado, setPisoFiltrado] = useState(null)



    const [imagenSelected, setImagenSelected] = useState(null)

    const [coordenadas, setCoordenadas] = useState(null)
    const [coordPl, setcoordPl] = useState(null)

   const [control, setControl] = useState([])

    const [imagenes , setImagenes] = useState([])
    
    const [pdfs, setPdfs] = useState([])
    const [modificacion, setModificacion] = useState(
        {
            usuario:'Santiago',
            fecha:'',
            espPrev:{},
            espNew:{},
        })

    const [errors, setErrors] = useState({})
    
    let id = useParams()
    let ids = id.id
    const navigate=useNavigate();
   // const [crear, setCrear] = useState({holo:'', publico:'' })
    const [modificar, setModificar] = useState({especimennumero:ids})
   
   //useeffect

    useEffect(() => {
        dispatch(getGeneroEspecie())
        dispatch(getCuencaFormacion())
            dispatch(getPeriodoEpoca())
            dispatch(getFilo())

            axios.get(`http://localhost:3001/especimen/id?id=${ids}`)
            .then((response) => {
                setEspecimen(response.data)
                setPrueba(response.data.posicionfilo)
                setImagenes(response.data.imagen)
                setCoordenadas(decimalAGrado(response.data.coordlat,response.data.coordlong))
                setcoordPl(decimalAGrado(response.data.coordlat,response.data.coordlong))
            })
            return () => {
                setEspecimen(null)
            }
        }, [control])


//GENERO LA FECHA ACTUAL PARA
var fecha=fechaActual();

//LLENADO DE EL ESTADO MODIFICACION(ESPECIMEN PREV Y NEW)
if(especimen){
  //  console.log('hay')
  
if(!modificacion.espPrev.especimennumero){
   // especimen.modificado=[];
        setModificacion({
            ...modificacion,
            fecha:fecha,
            espPrev:especimen,
        })
       
}else if(especimen!==modificacion.espNew){
    setModificacion({
        ...modificacion,
        espNew:especimen,
    })
   
}
}

//OBTEBCION DE COORDENADAS DESDE ESPECIMEN (TRUE OR FALSE DE LOS DELECT DE COORDENADAS)



console.log(coordenadas)




    
 
    function modificarEspe (e) { // funcion para actualizar datos del estado(con las modificaciones)
        e.preventDefault()
        setEspecimen({ 
            ...especimen,
            [e.target.name] : e.target.value,
        })
     
    }
    
      
    function filtrargenero(e){
        let comprobar = generoEspecie.filter((el) => el.genero === e.target.value )
        
        if(comprobar.length === 0 && e.target.value.length>0){
            setErrors({
                genero: "¿Desea agregar nuevo genero?"
            })
           
        }else {
            setErrors({})
        dispatch(selectEspecie(e.target.value))
        
        e.preventDefault()
       
        setEspecimen({
            
            ...especimen,
            [e.target.name] : e.target.value,
            especie:'',
        })
        document.getElementById('especie-Input').placeholder='';
    }
    }

    function filtrarEspecie(e){

        let comprobar1 = especiefiltrada.filter((el) => el === e.target.value )
        let genero1 = document.getElementById('genero-Input').value
        let genero2 = document.getElementById('genero-Input').placeholder
         let generoInput
            if(genero1.length>1){
                generoInput = genero1
            }else{
                generoInput = genero2
            }
        if(e.target.value.length === 0){
            setErrors({})
        }
        else if(comprobar1.length === 0 ){
            setErrors({
                especie: "Desea agregar especie para " + generoInput
            })
           
        }else {
            setErrors({})
        e.preventDefault()
        setEspecimen({
            
            ...especimen,
            [e.target.name] : e.target.value
        })
    }
    }
  //  console.log('imagenes',imagenes)
    function filtrarEpoca(e){
        dispatch(selectEpoca(e.target.value))
        e.preventDefault()
       
        setEspecimen({
            
            ...especimen,
            [e.target.name] : e.target.value,
            epoca:'',
            piso:'',
        })
        document.getElementById('epoca-input').placeholder='';
        document.getElementById('piso-input').placeholder='';
        document.getElementById('epoca-input').value='';
        document.getElementById('piso-input').value='';
    }

    function filtrarPiso(e){
       let piso = epocaFiltrada.filter(el => el.nombre === e.target.value)
       setPisoFiltrado(piso[0].piso)
        e.preventDefault()
        setEspecimen({
            
            ...especimen,
            [e.target.name] : e.target.value,
            piso:'',
        })
        document.getElementById('piso-input').placeholder='';
      
        document.getElementById('piso-input').value='';
    }

    function crearEspecie(e){
        e.preventDefault()
        let especieInput = document.getElementById('especie-Input').value
        var genero1 = document.getElementById('genero-Input').value
        var genero2 = document.getElementById('genero-Input').placeholder
        let generoInput
            if(genero1.length>1){
                generoInput = genero1
            }else{
                generoInput = genero2
            }
        let modelo = 'genero'
       // console.log(generoInput, especieInput, modelo)
        setErrors({})
        dispatch(postGeneroEspecie(modelo, generoInput, especieInput))
        setTimeout(() => {dispatch(getGeneroEspecie())}, "1000")
    }

    function crearGeneroEspecie(e){
        e.preventDefault()
        e.preventDefault()
        let generoInput = document.getElementById('genero-Input').value
       // console.log(generoInput)
        let modelo = 'genero'
            setErrors({})
            dispatch(postGeneroEspecie(modelo, generoInput))
            setTimeout(() => {dispatch(getGeneroEspecie())}, "1000")
    
    }

    function handleDelete(el,e){
       e.preventDefault()
       let cambio = prueba.filter( occ => occ !== el)
            setPrueba(
                cambio
            )
        setEspecimen({
            ...especimen,
            posicionfilo: cambio
        })
       
    }

    function handleSelectionFilo(e){
        if(prueba.includes(e.target.value)){
          return(alert('filogenia ya seleccionada'))
        }else{

        setPrueba([...prueba, e.target.value])
        setEspecimen({
          ...especimen,
          posicionfilo: [...prueba, e.target.value]
        })
    }
    }
 
   // console.log('especimen : ',especimen)
    //console.log(modificacion)


    function agregarFilo(e){
        e.preventDefault()
        
        
        const { value: formValues } =  Swal.fire({
            title: 'Ingrese Filogenia' ,
            html:
              
              '<input id="swal-input2" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
                var filo1
                document.getElementById('swal-input2').value.length===0?       Swal.fire(
                    'Filogenia vacia',
                    'Volver',
                    'error'
                  ): filo1 =  document.getElementById('swal-input2').value
              let filoNew = filo1[0].toUpperCase() + filo1.slice(1)
                let modelo = 'filo'
               
                
                Swal.fire(
                    'Creado con Exito',
                    'Volver',
                    'success'
                  )
              return [
                  // console.log(gen, esp),
                  filoNew.length===0?null:
                  setPrueba([...prueba, filoNew]),
                  setModificar({
                    ...modificar,
                    posicionfilo: [...prueba,filoNew]
                  }),
                
                  setTimeout(() => {
                    
                    dispatch(postFilo(modelo, filoNew))
                    dispatch(getFilo())
                    }, "2000"), 
                   /*  dispatch(getGeneroEspecie()),
                    dispatch(selectEspecie(gen1), console.log('hice slect')),
                    dispatch(postGeneroEspecie(modelo, gen1, espe1)), */
               
               
              
              ]
              
            }
            
          })
          
          if (formValues) {
            Swal.fire(JSON.stringify(formValues))
            
          }
    }
//console.log('espec --->>> ',especimen)
    const handleImg = (e) => {
      
        e.preventDefault()
    
           // console.log('ee<<>>>>>>',e)
            var file = e.target.files[0];
        //    console.log('fil-------<<<<<><',file)
            var reader = new FileReader();
            //console.log('e --->>> ',reader.result)
            reader.onloadend = async function () {
            //    console.log(reader)
                 setImagenes([...imagenes,reader.result])
                 setEspecimen({
                    ...especimen,
                    imagen: [...imagenes, reader.result]
                }) 
            }
            if (file) {
                

                setImagenSelected(reader.readAsDataURL(file)); 

            }        
    
        }
       
    var contImg=0;    

    function eliminarImagen(el, e){
      //  e.preventDefault()
        let nuevo = especimen.imagen.filter( occ => occ !== el)
        
        setEspecimen({
            ...especimen,
            imagen : nuevo,
        })
        setImagenes(
            nuevo
            
        )
        setModificar({
            ...modificar,
            imagen: nuevo
        })
        
    }
    
    let filoNombre = filogenia.map(el => el.filo);

    function modificarPublico(e){
        //console.log(e.target.value)
       
            setEspecimen({
                ...especimen,
                publico: e.target.value,
            })  
         
        
    }
    function modificarHolotipo(e){
        //  console.log(e.target.checked)
        //console.log(e.target.value)
       
        setEspecimen({
            ...especimen,
            holotipo: e.target.value,
        })  
       
    
          
      }
      
      var latnorte=coordenadas?.latitud?.coord==='N'?true:false;
      var longeste=coordenadas?.longitud?.coord==='E'?true:false;

      function handleSelectionPartes(e){
        e.preventDefault()
       // console.log(e.target.value)
if(!especimen.partesesqueletales.includes(e.target.value)){
     setEspecimen({
          ...especimen,
          partesesqueletales: [...especimen.partesesqueletales,e.target.value],
        })
    } else {
        alert( 'Parte esqueletal '+e.target.value+' ya seleccionada')
    }
       
    }
    
    function  handleDeletePartes(el,e){
        e.preventDefault()
    
         setEspecimen({
            ...especimen,
            partesesqueletales: especimen.partesesqueletales.filter( occ => occ !== el)
        })
       
        
     }





//COORDENADAS

  function  handleLat(e){
       // e.preventDefault()

       if(e.target.name==='grados'){
        console.log('GRADOS---->>>>>',e.target.value)
        coordenadas.latitud.gra=Number(e.target.value);
        
       }
       if(e.target.name==='minutos'){
        console.log('MINUTOS---->>>>>',e.target.value)
        coordenadas.latitud.min=Number(e.target.value);
        
        
       }
       if(e.target.name==='segundos'){
      //  console.log('segundos---->>>>>',e.target.value)
        coordenadas.latitud.seg=Number(e.target.value);
        
       }
       if(e.target.name==='coord'){
        coordenadas.latitud.coord=e.target.value;
       }
        
       // console.log('lat:   ',coordenadas.latitud)
       var decimal=gradoAdecimal(coordenadas.latitud,coordenadas.longitud);
    //   console.log('decimal:   ',decimal)
         setEspecimen({
            ...especimen,
            coordlat: decimal.latitud
        })
       
        
     }

     function  handleLong(e){
     //   e.preventDefault()
       if(e.target.name==='grados'){
        coordenadas.longitud.gra=Number(e.target.value);
       }
       if(e.target.name==='minutos'){
        coordenadas.longitud.min=parseFloat(e.target.value);
       }
       if(e.target.name==='segundos'){
        coordenadas.longitud.seg=parseFloat(e.target.value);
       }
       if(e.target.name==='coord'){
        coordenadas.longitud.coord=e.target.value;
       }
        
       // console.log('long:   ',coordenadas.longitud)

        var decimal=gradoAdecimal(coordenadas.latitud,coordenadas.longitud);
       // console.log('decimal:   ',decimal)
        setEspecimen({
            ...especimen,
            coordlong: decimal.longitud,
        })
       
        
     }

    console.log('coordenadas --->>> ',coordenadas)

//////////////////////////////////////////////////////////////
////////////////  SUBMIT    //////////////////////////////////
//////////////////////////////////////////////////////////////
function submitEspecimen(e){ // funcion submit + modal de cartel 

    e.preventDefault()
  
  
  //  console.log('especimen submit', especimen)

    Swal.fire({
        title: 'Confirmas los cambios?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            
          Swal.fire('Cambio Exitoso', '', 'success')

      //    console.log(modificar)
             postDatos([especimen,modificacion]) // envio datos al back
                setEspecimen(null) // seteo estado local a null

                    setTimeout(() => {navigate(`/home/${ids}`)}, "1000")   // funcion para que solo cargue la pagina despues
                    setTimeout(() => {getDatos()}, "2000")                                               // que los cambio se guarden en back
          
        } else if (result.isDenied) {
          Swal.fire('No se realizaron cambios', '', 'info')
        }
      })
}


const subirArchivo = (e) => {
   
    const archivos = e.target.files;
    const data = new FormData();
  
    data.append('archivo', archivos[0]);
  
    axios.post('http://localhost:3001/subir-archivo', data)
    .then(data => {
    //  console.log(data)
     
      setPdfs([...pdfs, data.data.filename])
      setEspecimen({
        ...especimen,
        pdf: [...pdfs,data.data.filename]
      })
    })
    .catch(error => {

        document.getElementById('resultado').innerHTML = 'Error al cargar PDF!';
    }); 


}
function eliminarArchivo(e, el){
    e.preventDefault();
    axios.delete('http://localhost:3001/eliminar-archivo?nombreArchivo=' + el)
    let nuevo = especimen.pdf.filter( occ => occ !== el)
    setEspecimen({
        ...especimen,
        pdf:nuevo,

    })
}   

    console.log(especimen)
    return (
        
            <div className="container34">
                
                <datalist id='generoEspecie'>
                    {
                        generoEspecie?.map(el => {return <option>{el.genero}</option>})
                    }
    
                </datalist>
                <datalist id='especiefiltrada'>
                    {
                        especiefiltrada?.map(ele => {return <option>{ele}</option>})
                        //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})
                       
                    }
                   
                </datalist>
    
                <datalist id='periodoEpoca'>
                    {
                        periodoEpoca?.map(elem => {return <option>{elem.periodo}</option>})
                        //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})
                       
                    }
                     <datalist id='epocaFiltrada'>
                    {
                        epocaFiltrada?.map(eleme => {return <option>{eleme.nombre}</option>})
                        //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})
                       
                    }
                   
                </datalist>
                <datalist id='pisoFiltrado'>
                    {
                       pisoFiltrado?.map(eleme => {return <option>{eleme}</option>})
                        //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})
                       
                    }
                   
                </datalist>
                   
                </datalist>
                <datalist id='posiFilo'>
                    {
                        filogenia?.map(elemento => {return <option>{elemento.filo}</option>})
                    }
                </datalist>
               
                <div>
                 <Menu/>
                </div>
                <div className="fantasma"></div>
                <div className="contenido34">
                    <div className="cabecera">
                        <div className="titulo">
                            <h5 className="a">
                                Modificando especimen nro {especimen?.especimennumero}
                            </h5>
                        </div>
                    </div>
                    <div className="cuerpo">
                        <div className="col1">
                            <div className="info1">
                                    <label className="label">Genero:</label>
                                    <input type='text' id='genero-Input' class='css-input'name='genero' autoComplete='off' list='generoEspecie' onChange={(e)=> {filtrargenero(e)}} placeholder={especimen?.genero}/>
                                  
                            </div>
                            <div className="err">
                            {
                                        errors.genero?<p  className="p2" onClick={(e)=> crearGeneroEspecie(e)}>+ agregar género</p>
                                        : <></>
                                    }
                            </div>
                            <div className="info1">   {
                                        errors.genero?<></>
                                        : <label className="label">Especie:</label>  }
                            {
                                        errors.genero?<p  className="p2" onClick={(e)=> crearGeneroEspecie(e)}>+ agregar nuevo género</p>
                                        :  <   input type='text' id = 'especie-Input'class='css-input'name='especie'autoComplete='off' list='especiefiltrada' onChange={(e)=> {filtrarEspecie(e)}} placeholder={especimen?.especie}/>
                                    }
                               
                                
                             
                            </div>
                            <div className="info3">
                                <div className="datos34">
                                {
                                    errors.especie?<p  className="p2" onClick={(e)=> crearEspecie(e)}>+ agregar especie</p>
                                    :
                                    <label className="label">Nro. Bochón:</label> } 
                                    {
                                    errors.especie?<p  className="p2" onClick={(e)=> crearEspecie(e)}>+ agregar especie</p>
                                    : <input type='number'  class='inpu' name='cantidadfrag' onChange={(e)=> {modificarEspe(e)}} defaultValue={especimen?.bochonnumero}/>
                                }              
                                   
                                 </div>
 
 
                                 <div className="mostrador">
                                    <div className="cabeza">
                                    <label className="lab">Pos. Filo:</label>

                                                <select  onChange={(e)=>handleSelectionFilo(e)}>
                                                <option>Agregar...</option>
                                                    {
                                                            filoNombre.sort().map(ee => {return <option value={ee}>{ee}</option>})
                                                        }
                                                </select> 
                                    </div>
                                
                                     {prueba?.length===0?<><p className="sin"> Sin Posicion Filogenetica</p></>:prueba?.map(el => {return <div className="caca" onClick={(e)=> handleDelete(el, e)}><span tooltip="click para eliminar" >{el} </span></div>})} 
                                     </div>
                                 <div className="base1" onClick={(e)=> agregarFilo(e)} >
                                     <h6 className="h67"> + nueva posición</h6>
                                 </div>
                            </div>
                            
                            <div className="info3">
                                             
                                        
                                <div className="mostrador2">   
                                <div className="cabeza">        
                                <label className="lab">Partes Esq:</label>
                                 <select onChange={(e)=>handleSelectionPartes(e)}>
                                 <option>Agregar...</option>
                                                    {
                                                        partes.map(el => {return <option value={el}>{el}</option>})
                                                    }
                                                </select> 
                                                </div>
                                            {
                                            especimen?.partesesqueletales?.length===0?<><p className="sin"> Sin partes esqueletales cargadas...</p></>:especimen?.partesesqueletales?.map(el => {return <div className="caca" onClick={(e)=> handleDeletePartes(el, e)}><span tooltip="click para eliminar" >{el} </span></div> }) 
                                            } 
                                        </div>
                            </div>

                            
                        </div>
                        <div className="col2">
                            <div className="info1">
                                <label className="label">Periodo:</label>
                                <input type='text' name='periodo' autoComplete='off' list='periodoEpoca' onChange={(e)=> {filtrarEpoca(e)}} placeholder={especimen?.periodo}/>
                            </div>
                            <div  class='info1'>
                                <label className="label">Epoca:</label>
                                <input type='text'  id='epoca-input' name='epoca'autoComplete='off' list='epocaFiltrada'onChange={(e)=> {filtrarPiso(e)} } placeholder={especimen?.epoca}/>
                            </div>
                            <div  class='info1'>
                                <label className="label">Piso:</label>
                                <input type='text' id='piso-input'name='piso'autoComplete='off' list='pisoFiltrado'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.piso}/>
                            </div>
                            <div  class='info1'>
                                <label className="label">Cuenca:</label>
                                <input type='text' name='cuenca'list='cuencaformacion'autoComplete='off' onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.cuenca}/>
                            </div>
                            <div  class='info1'>
                                <label className="label">Formacion:</label>
                                 <input type='text'  name='formacion' list='formacionfiltrada'autoComplete='off'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.formacion}/>
                            </div>
                            
                            <div  class='info1'>
                                <label className="label">Miembro:</label>
                                <input type='text' name='miembro'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.miembro}/>
                            </div>
                            <div  class='info1'>
                                <label className="label">Localidad:</label>
                                <input type='text'class='css-input' name='localidad'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.localidad}/>
                             </div>
                             <div  class='info1'>
                             <label className="label">Campaña:</label>
                 <input type='text' class='css-input'name='campana'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.campana}/>
                             </div>
                             <div  class='info1'>
                             <label className="label">Fecha Camp.:</label>
                 <input type='date' className="inpu"name='fechadescubrimiento'onChange={(e)=> {modificarEspe(e)}} value={especimen?.fechadescubrimiento}/>
                             </div>
                             <div  class='info1'>
                             <label className="label">Publico:</label>
                                         <div className="inpus2">
                                         <div>
                                       <div> si </div>
                                         {especimen?.publico ==='si'?<input type='radio' name='publico' value="si" checked='true'  onClick={(e)=> {modificarPublico(e)}} />:<input type='radio' name='publico' value="si"  onClick={(e)=> {modificarPublico(e)}} />}
                                         </div> 
                                         <div>
                                         <div> no </div>
                                         {especimen?.publico==='no'?<input type='radio' name='publico' value='no' checked='true' onClick={(e)=> {modificarPublico(e)}}/>:<input type='radio' name='publico' value='no'   onClick={(e)=> {modificarPublico(e)}}/>    }
                                         </div>
                                         </div>
                                      
                                  
                                         
                             </div>   
                        </div>
                        <div className="col1">
                        <div  class='info1'>
                        <label className='label'>Nro Campo:</label>
                 <input type='text' class='css-input'name='nrocampo'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.nrocampo}/>
                
                    
               </div>
                        <div className="coordena">
                            <div  class='info141'>
                                <label  className="label23">Coordenadas Geográficas </label>
                            </div>
                            <div  class='info14'>
                                    <div className="coorde">
                                            {latnorte?
                                    <select name='coord' className="coorden" onChange={(e)=>{handleLat(e)}}>
                                        <option value='N'>N</option>
                                        <option value='S' >S</option>
                                    </select>: 
                                    <select name='coord' className="coorden" onChange={(e)=>{handleLat(e)}}>
                                        <option value='S'>S</option>
                                        <option value='N'>N</option>
                                    </select>} <p className="p"></p>   
                                        
                                 <input className="coor" type='number' name='grados' placeholder={coordPl?.latitud.gra} onChange={(e)=>{handleLat(e)}} ></input><p className="p">gra</p>  
                                    <input className="coor" type='number' name='minutos'  placeholder={coordPl?.latitud.min} onChange={(e)=>{handleLat(e)}} ></input> <p className="p"> min' </p>
                                    <input  className="coorseg" type='number' name='segundos'  placeholder={coordPl?.latitud.seg} onChange={(e)=>{handleLat(e)}} ></input> <p className="p">seg</p>
                                </div>
                            </div>
                            
                            <div  class='info14'>
                            <div className="coorde">
                            {longeste?
                            <select name='coord' className="coorden" onChange={(e)=>{handleLong(e)}}>
                            <option value='E' >E</option>
                            <option value='W' >W</option>
                        </select>:
                                <select name='coord' className="coorden" onChange={(e)=>{handleLong(e)}}>
                                <option value='W'>W</option>
                                <option value='E'>E</option>
                            </select>
                            } <p className="p"> </p>
                    <input type='number'  name='grados' placeholder={coordPl?.longitud.gra} class='coor'  onChange={(e)=>{handleLong(e)}}></input><p className="p">gra</p>  
                    <input type='number' name='minutos' placeholder={coordPl?.longitud.min} class='coor'  onChange={(e)=>{handleLong(e)}}></input> <p className="p"> min </p>
                    <input type='number' name='segundos' placeholder={coordPl?.longitud.seg} class='coorseg'  onChange={(e)=>{handleLong(e)}}></input> <p className="p">seg</p>
                </div>
                            </div>
                        </div>
        
                        
                        <div  class='info1'>
                        <label className="label">Preparador:</label>
                 <input type='text' class='css-input'name='preparador'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.preparador}/>
           
                        </div>
                        <div  class='info1'>
                        <label className="label">Fecha Prep.:</label>
                 <input type='date' class='inpu'name='preparacionfecha'onChange={(e)=> {modificarEspe(e)}} value={especimen?.preparacionfecha}/>
             
                        </div >
                        <div  class='info1'>
                        <label className="label">Fragmentos:</label>
                    <input type='number'  class='inpu' name='cantidadfrag' onChange={(e)=> {modificarEspe(e)}} defaultValue={especimen?.cantidadfrag}/>
                        </div>
                        <div  class='info1coment'>
                        <label className="label">Comentario:</label>
                 <textarea type='text' class='textar'name='comentario'onChange={(e)=> {modificarEspe(e)}} defaultValue={especimen?.comentario}/>
                        </div>
                        <div  class='info1'>
                             <label className="label">Holotipo:</label>
                                         <div className="inpus">
                                         <div>
                                       <div> si </div>
                                         {especimen?.holotipo ==='si'?<input type='radio' name='holotipo' value="si" checked='true'  onClick={(e)=> {modificarPublico(e)}} />:<input type='radio' name='holotipo' value="si"  onClick={(e)=> {modificarHolotipo(e)}} />}
                                         </div> 
                                         <div>
                                         <div> no </div>
                                         {especimen?.holotipo==='no'?<input type='radio' name='holotipo' value='no' checked='true' onClick={(e)=> {modificarPublico(e)}}/>:<input type='radio' name='holotipo' value='no'   onClick={(e)=> {modificarHolotipo(e)}}/>    }
                                         </div>
                                         </div>
                            
                          </div>

                        </div>
                        <div className="col1">
                        <div className="info3">
                               
                                    <div className="cabeza5">
                                        <label className="lab">Armario:</label>
                                    
                                        <input type='number'  name='armario1'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.armario1}/>
                         
                         
                                    </div>
                                    <div className="estante">
                                        <label class='labelo'>Estante </label>
                                        <input className="ubic"  type='number' name='estante1desde'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.estante1desde}/>
                                        <label class='labelo'>Hasta</label>
                                        <input className="ubic" type='number'  name='estante1hasta'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.estante1hasta}/>
                            
                                    </div>
                                         
                                    
                    </div>
                    <div className="info3">
                               
                               <div className="cabeza5">
                                   <label className="lab">Armario:</label>
                               
                                   <input type='number' className="ubic"  name='armario2'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.armario2}/>
                    
                    
                               </div>
                               <div className="estante">
                                   <label class='labelo'>Estante </label>
                                   <input className="ubic"  type='number' name='estante2desde'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.estante2desde}/>
                                   <label class='labelo'>Hasta</label>
                                   <input className="ubic" type='number'  name='estante2hasta'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.estante2hasta}/>
                       
                               </div>
                                    
                               
               </div>
                         
                              
                           
                            <div className="info3">
                                <div className="mostrador3">   
                                    <div className="cabeza3">        
                                        <label className="lab">Publicaciones</label>
                                        <input onChange={(e) => subirArchivo(e)} type="file" id="pdf" name="pdf" accept="application/pdf" className="buto"/>
                                    </div>
                                        {
                                        especimen?.pdf?.length>0?especimen.pdf.map(el => {
                                            return <div className="caca2" onClick={(e)=> eliminarArchivo(e, el)}><span tooltip="click para eliminar" className="butono">{el} </span></div>
                                                }):<><p className="sin"> Sin publicaciones cargadas...</p></>
                                        }
                                </div>
                            </div>
                            <div className="info3">
                                <div className="mostrador3">   
                                    <div className="cabeza3">        
                                        <label className="lab">Imágenes</label>
                                        <input onChange={(e) => handleImg(e)} type="file" id="imagen" name="imagen" accept="image/png, image/jpeg" className="buto"/>
                                        
                                    </div>
                                    {
                                            
                                            imagenes?.length>0?imagenes.map(el => {contImg++;
                                                return <div>
                                                    <div className="caca2" onClick={(e)=> eliminarImagen(el, e)}><span tooltip="click para eliminar" className="butono">Imagen {contImg} </span></div>
                                                    
                                                    
                                                </div>
                                                
                                                
                                            }): <><p className="sin"> Sin imágenes cargadas...</p></>
                                    }
                                </div>
                            </div>
               
                    
                    </div>
                    </div>
                    <div className="pie">
                                    <p className="cargar" onClick={(e)=>submitEspecimen(e)}>CARGAR</p>
                    </div>
                </div>
        </div>
        
        

        /*
  <div>
    <Menu/>
            <div class="parent">

            <div class="div1"> 

                 <datalist id='generoEspecie'>
                    {
                        generoEspecie?.map(el => {return <option>{el.genero}</option>})
                    }
    
                </datalist>
                <datalist id='especiefiltrada'>
                    {
                        especiefiltrada?.map(ele => {return <option>{ele}</option>})
                        //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})
                       
                    }
                   
                </datalist>
    
                <datalist id='periodoEpoca'>
                    {
                        periodoEpoca?.map(elem => {return <option>{elem.periodo}</option>})
                        //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})
                       
                    }
                     <datalist id='epocaFiltrada'>
                    {
                        epocaFiltrada?.map(eleme => {return <option>{eleme.nombre}</option>})
                        //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})
                       
                    }
                   
                </datalist>
                <datalist id='pisoFiltrado'>
                    {
                       pisoFiltrado?.map(eleme => {return <option>{eleme}</option>})
                        //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})
                       
                    }
                   
                </datalist>
                   
                </datalist>
                <datalist id='posiFilo'>
                    {
                        filogenia?.map(elemento => {return <option>{elemento.filo}</option>})
                    }
                </datalist>
                <div class='navBar'>
                <div class="ds">
                    <Link to={`/home/${especimen?.especimennumero}`}>
                  
                    <button class='volver'>Volver</button>
                    </Link>
                    <h2 class='dd'>{'MODIFICANDO ESPECIMEN '+especimen?.especimennumero}</h2>
                    
                    <button class='modificar2'  onClick={(e)=>submitEspecimen(e)} >Actualizar</button>
                    
                    </div>
                </div>
                 </div>
                
            <div class="div2"> 
               
                   <div class='div-todos'>
                     <label>Genero:</label>
                     <input type='text' id='genero-Input' class='css-input'name='genero' autoComplete='off' list='generoEspecie' onChange={(e)=> {filtrargenero(e)}} placeholder={especimen?.genero}/>
                       {
                         errors.genero?<Alert variant="danger">
                         {errors.genero}<button class='boton-alert' onClick={(e)=> crearGeneroEspecie(e)}><FiCheck/></button></Alert>
                         : <></>
                       }
                       </div>
                    <div  class='div-todos'>
                    <label>Especie:</label>
                    <input type='text' id = 'especie-Input'class='css-input'name='especie'autoComplete='off' list='especiefiltrada' onChange={(e)=> {filtrarEspecie(e)}} placeholder={especimen?.especie}/>
                    
                    {
                        errors.especie?<Alert variant="danger">
                        {errors.especie}  <button class='boton-alert' onClick={(e)=> crearEspecie(e)}><FiCheck/></button></Alert>
                        : <></>
                    }
                    </div> 
                   
                <div  class='div-todos'>
                    <div className="ggg">
                    <div className="fff">
                        <div><label>Pos. Filogenetica:</label></div>
                    
                
                 
                  <div class='selector'>  <select onChange={(e)=>handleSelectionFilo(e)}>
                    <option>Agregar...</option>
                    
                    {
                        filoNombre.sort().map(ee => {return <option value={ee}>{ee}</option>})
                    }
                </select> </div>
              
                    </div>
                
              
                 <div class='filos'>                  
                 
                    {
                         prueba?.length===0?<><p> Sin Posicion Filogenetica</p></>:prueba?.map(el => {return <div class='div-filogenia'>{el} <h6 onClick={(e)=> handleDelete(el, e)}>X</h6></div>}) 
 
                    } 
                 
                 </div>
                 <h6 onClick={(e)=> agregarFilo(e)}>crear posicion filogenetica</h6>
                 </div>
                    </div>
                   
                
                </div>
            <div class="div3">
                <div class='div-cont'>
                 <div  class='div-todos'>
                 <label>Periodo:</label>
                 <input type='text' class='css-input'name='periodo' autoComplete='off' list='periodoEpoca' onChange={(e)=> {filtrarEpoca(e)}} placeholder={especimen?.periodo}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Epoca:</label>
                 <input type='text' class='css-input' id='epoca-input' name='epoca'autoComplete='off' list='epocaFiltrada'onChange={(e)=> {filtrarPiso(e)} } placeholder={especimen?.epoca}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Piso:</label>
                 <input type='text' class='css-input' id='piso-input'name='piso'autoComplete='off' list='pisoFiltrado'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.piso}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Cuenca:</label>
                 <input type='text'class='css-input' name='cuenca'list='cuencaformacion'autoComplete='off' onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.cuenca}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Formacion:</label>
                 <input type='text' class='css-input'name='formacion' list='formacionfiltrada'autoComplete='off'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.formacion}/>
                 </div>
                
                 <div  class='div-todos'>
                 <label>Miembro:</label>
                 <input type='text'class='css-input' name='miembro'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.miembro}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Localidad:</label>
                 <input type='text'class='css-input' name='localidad'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.localidad}/>
                 </div>
                 </div>
                 </div>
            <div class="div4">
                <div class='div-cont'>
                 <div  class='div-todos'>
                 <label>Coords Latitud:</label><br></br>
                    {latnorte?
                    <select name='coord' onChange={(e)=>{handleLat(e)}}>
                        <option value='N'>N</option>
                        <option value='S' >S</option>
                    </select>: 
                    <select name='coord' onChange={(e)=>{handleLat(e)}}>
                        <option value='S'>S</option>
                        <option value='N'>N</option>
                    </select>}    :
                    
                <input type='number' name='grados' placeholder={coordenadas?.latitud.gra} onChange={(e)=>{handleLat(e)}} class='coor'></input> ° 
                <input type='number' name='minutos' placeholder={coordenadas?.latitud.min} onChange={(e)=>{handleLat(e)}} class='coor'></input> ' 
                <input type='number' name='segundos' placeholder={coordenadas?.latitud.seg} onChange={(e)=>{handleLat(e)}} class='coorseg'></input> " 
              
                 </div>
                 <div  class='div-todos'>
                 <label>Coords Longitud:</label><br></br>
                    {longeste?
                          <select name='coord' onChange={(e)=>{handleLong(e)}}>
                          <option value='E' >E</option>
                          <option value='W' >W</option>
                      </select>:
                            <select name='coord' onChange={(e)=>{handleLong(e)}}>
                            <option value='W'>W</option>
                            <option value='E'>E</option>
                        </select>
                        } :
                <input type='number' name='grados' placeholder={coordenadas?.longitud.gra} class='coor'  onChange={(e)=>{handleLong(e)}}></input> ° 
                <input type='number' name='minutos' placeholder={coordenadas?.longitud.min} class='coor'  onChange={(e)=>{handleLong(e)}}></input> ' 
                <input type='number' name='segundos' placeholder={coordenadas?.longitud.seg} class='coorseg'  onChange={(e)=>{handleLong(e)}}></input> " 
              
                 </div>
                
                
                 <div  class='div-todos'>
                 <label>Campaña:</label>
                 <input type='text' class='css-input'name='campana'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.campana}/>
                 </div>
                 <div>
                 <label  class='div-todos'>Descubridor:</label>
                 <input type='text' class='css-input'name='descubridor'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.descubridor}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Fecha de Campaña:</label>
                 <input type='date' class='css-input'name='fechadescubrimiento'onChange={(e)=> {modificarEspe(e)}} value={especimen?.fechadescubrimiento}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Nro Campo:</label>
                 <input type='text' class='css-input'name='nrocampo'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.nrocampo}/>
                 </div>
               
                
                 <div  class='div-todos'>
                 <label>Nombre de Preparador:</label>
                 <input type='text' class='css-input'name='preparador'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.preparador}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Fecha de Preparacion:</label>
                 <input type='date' class='css-input'name='preparacionfecha'onChange={(e)=> {modificarEspe(e)}} value={especimen?.preparacionfecha}/>
                 </div>
                 </div>
                 </div>
                
            <div class="div5">
                <div class='div-cont'>
                 <div   class='div-todos'>
                 <label>Publico:</label>
                                         
                  SI 
                  {especimen?.publico ==='si'?<input type='radio' name='publico' value="si" checked='true'  onClick={(e)=> {modificarPublico(e)}} />:<input type='radio' name='publico' value="si"  onClick={(e)=> {modificarPublico(e)}} />}
                  NO  
                  {especimen?.publico==='no'?<input type='radio' name='publico' value='no' checked='true' onClick={(e)=> {modificarPublico(e)}}/>:<input type='radio' name='publico' value='no'   onClick={(e)=> {modificarPublico(e)}}/>    }
                  <br></br>
                 <label>Holotipo:</label>
                 SI
                 {especimen?.holotipo ==='si'?<input type='radio' name='holotipo' value="si" checked='true'  onClick={(e)=> {modificarHolotipo(e)}} />:<input type='radio' name='holotipo' value="si" onClick={(e)=> {modificarHolotipo(e)}} />}
                 NO
                 {especimen?.holotipo ==='no'?<input type='radio' name='holotipo' value="no" checked='true'  onClick={(e)=> {modificarHolotipo(e)}} />:<input type='radio' name='holotipo' value="no" onClick={(e)=> {modificarHolotipo(e)}} />}   
                         <div class='div-esqueleto'>
                     <label>Ubicacion Fosil/es:</label>
                     <div>
                         <label class='label'>Armario </label>
                         <input type='text' class='armario1' name='armario1'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.armario1}/>
                         <label class='label'>Desde:</label>
                         <input type='text' class='armario1'name='estante1desde'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.estante1desde}/>
                         <label class='label'>Hasta</label>
                         <input type='text' class='armario1' name='estante1hasta'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.estante1hasta}/>
                         </div>
                         <div>
                         <label class='label'>Armario </label>
                         <input type='text' class='armario1' name='armario2'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.armario2}/>
                         <label class='label'>desde: </label>
                         <input type='text' class='armario1' name='estante2desde'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.estante2desde}/>
                         <label class='label'>hasta:</label>
                         <input type='text' class='armario1'name='estante2hasta'onChange={(e)=> {modificarEspe(e)}} placeholder={especimen?.estante2hasta}/>
                      </div>
                      </div>
                          </div>     
                          <div class="partesEsq" >
                                    <div class="top"> 
                                        <label>Partes Esqueletales:</label>
                                    </div>
                                     <div class="cont">
                                     <div class='filo-todo2'>
                                            <div class='select-filo2'>
                                                <select multiple onChange={(e)=>handleSelectionPartes(e)}>
                                                    
                                                    {
                                                        partes.map(el => {return <option value={el}>{el}</option>})
                                                    }
                                                </select> 
                                           </div>
                                        </div>
                                
                                        
                                        <div class='filos2'>                  
                                        
                                            {
                                            especimen?.partesesqueletales?.length===0?<></>:especimen?.partesesqueletales?.map(el => {return <div class='div-filogenia'>{el} <button onClick={(e)=> handleDeletePartes(el, e)}>X</button></div>}) 
                                            } 
                                        </div>  
                                     </div>
                                        
                                
                                
                                </div>
                 <div class='div-todos'>
            
                 <div  class='div-todos'>
                
                 <div class='div-todos'>
                 <label>PDF</label>
               
                  </div>
                  <div class='img-div'>
                    
                 <label>Imagen:</label>
                 
                 <input onChange={(e) => handleImg(e)} type="file" id="imagen" name="imagen" accept="image/png, image/jpeg" class="form-control"/>
                 <br />
                            <div class='posicion-img'>
                 {
                        imagenes?.length>0?
                        imagenes?.map(el => {
                            return 
                            <div>
                                <img src={el} height="60px" width="80px" alt="image"></img>
                                <button onClick={(e)=> eliminarImagen(el, e)}>eliminar</button>
                            </div>
                            
                            
                        }): <></>
                 }

                    
                 
                       
                       </div>
                </div>
       
                
                 </div>
                 </div>

</div>
</div>
*/
            )
}