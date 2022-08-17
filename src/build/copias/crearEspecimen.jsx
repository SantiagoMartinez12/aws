import axios from "axios";
import React, { useEffect, useState} from "react";
import { useParams } from "react-router";
import pdf from "../pdf/ChronostratChart2022-02.pdf"
import { Link } from "react-router-dom";
import { getCuencaFormacion, getFilo,getPartes, getGeneroEspecie, getPeriodoEpoca, postDatos, postEspecimen, postFilo, postGeneroEspecie, selectCuenca, selectEpoca, selectEspecie, postBochon } from "../store/action";
import './actualizarEspecimen.css'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {Alert, Ratio} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFillFilePdfFill} from "react-icons/bs";
import { FiCheck,FiDelete} from "react-icons/fi";
import {gradoAdecimal,decimalAGrado} from '../store/action';
import Menu from "./menu";


// genero especie revisar , posicion filo mas de una
// comprobar datos en modal

export default function CrearEspecimen(){
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const generoEspecie = useSelector((state)=> state.generoEspecie)
    const especiefiltrada = useSelector((state)=> state.especie)

    const filogenia = useSelector((state)=> state.filo )
    const partes = useSelector((state)=> state.partes )

    const periodoEpoca = useSelector((state)=> state.periodoepoca)
    const epocaFiltrada = useSelector((state)=> state.epoca)
    const [pisoFiltrado, setPisoFiltrado] = useState(null)



    const [imagenSelected, setImagenSelected] = useState(null)
    const [control, setControl] = useState(null)
    const [imagenes , setImagenes] = useState([])
    const [pdfs, setPdfs] = useState([])



    const [errors, setErrors] = useState({})
    const [ prueba, setPrueba] = useState(null)
    const [crear, setCrear] = useState({posicionfilo:[], partesesqueletales:[], publico:'no', holo:'no' })
    const [newId, setNewId] = useState(null);
    const [pregunta, setPregunta] = useState('seleccionar')
    const  [ newIdBochon,setNewIdBochon] = useState(null)
    const [latitud, setLat] = useState(
        {
                    gra:0,
                    min:0,
                    seg:0,
                    coord:'S',
           
    })

    const [longitud, setLong] = useState(
        {
                     gra:0,
                    min:0,
                    seg:0,
                    coord:'W',
           
    })


   
    

    let generoEspecieFil = generoEspecie.map(el => el.genero)
    var checkHolo='';
    var checkPublico='';
    if(crear.holo===""||crear.holo==="no")checkHolo='true';
    if(crear.publico===""||crear.publico==="no")checkPublico='true';

console.log('latitud --->>>',latitud)
console.log('latitud --->>>',longitud)

    //---------------------use efect--------------------------//
    useEffect(() => {
        dispatch(getGeneroEspecie())
        dispatch(getCuencaFormacion())
            dispatch(getPeriodoEpoca())
            dispatch(getFilo())
            dispatch(getPartes())
            axios.get(`http://localhost:3001/bochon/especimen/?parametro=nuevo`)
            .then((response) => {
                setNewIdBochon(response.data)
            })
             axios.get(`http://localhost:3001/especimen/?parametro=nuevo`)
            .then((response) => {
                setNewId(response.data)
               
               
            }) 
            if (control){       
                setCrear({
                    ...crear,
                    imagen: control
                });
            }
            return () => {
              setNewId(null)  
            }
        }, [control&&newId===undefined]);

   console.log(newIdBochon)
//console.log(newId?.newId)
 /////------------------------------FILTROS--------------------------//

     function filtrargenero(e){
   /*      if(e.target.value.length===0){
            setErrors({})
        } */
        let comprobar = generoEspecie.filter((el) => el.genero === e.target.value )

    if(comprobar.length === 0 && e.target.value.length>0){
        setErrors({
            genero: "¿Desea agregar nuevo genero?"
        })
       
    }else {
        setErrors({})
    dispatch(selectEspecie(e.target.value))
    
    e.preventDefault()
   
    setCrear({
        
        ...crear,
        [e.target.name] : e.target.value
    })
}
}

var contImg=0;




function filtrarEspecie(e){
    let comprobar1 = especiefiltrada.filter((el) => el === e.target.value )
    let generoInput = document.getElementById('genero-Input').value
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
    setCrear({
        
        ...crear,
        [e.target.name] : e.target.value
    })
}
}



function filtrarEpoca(e){
    dispatch(selectEpoca(e.target.value))
    e.preventDefault()
   
    setCrear({
        
        ...crear,
        [e.target.name] : e.target.value
    })
}

function filtrarPiso(e){
    let piso = epocaFiltrada.filter(el => el.nombre === e.target.value)
    setPisoFiltrado(piso[0].piso)
     e.preventDefault()
     setCrear({
         
         ...crear,
         [e.target.name] : e.target.value
     })
 }

// ------------------- CREAR GENERO/ESPECIE------------------------------//

function crearGeneroEspecie(e){
    e.preventDefault()
    let generoInput = document.getElementById('genero-Input').value
  //  console.log(generoInput)
    let modelo = 'genero'
        setErrors({})
        dispatch(postGeneroEspecie(modelo, generoInput))
        setTimeout(() => {dispatch(getGeneroEspecie())}, "1000")

}
function crearEspecie(e){

    e.preventDefault()
    let generoInput = document.getElementById('genero-Input').value
    let especieInput = document.getElementById('especie-Input').value
    let modelo = 'genero'
  //  console.log(generoInput, especieInput, modelo)
    setErrors({})
    dispatch(postGeneroEspecie(modelo, generoInput, especieInput))
    setTimeout(() => {dispatch(getGeneroEspecie())}, "1000")

}

// ------------------------ posicion filogenetica ------------------------//
//................ELIMINA SELECCIONADO----
function handleDelete(el,e){
    e.preventDefault()

     setCrear({
        ...crear,
        posicionfilo: crear.posicionfilo.filter( occ => occ !== el)
    })
    
 }
 // ------------------------ partes  esqueletales ------------------------//
 function  handleDeletePartes(el,e){
    e.preventDefault()

     setCrear({
        ...crear,
        partesesqueletales: crear.partesesqueletales.filter( occ => occ !== el)
    })
    
 }

 //------- AGREGA UNA NUEVA POSICION FILO---------------//
 function handleSelectionFilo(e){


    setCrear({
      ...crear,
      posicionfilo: [...crear.posicionfilo, e.target.value]
    })

}
function handleSelectionPartes(e){


    setCrear({
      ...crear,
      partesesqueletales: [...crear.partesesqueletales, e.target.value]
    })

}
function modificarEspe (e) { // funcion para actualizar datos del estado(con las modificaciones)
    e.preventDefault()
    setCrear({ 
        ...crear,
        [e.target.name] : e.target.value
    })
}
const handleImg = (e) => {
    e.preventDefault()
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onloadend = async function () {
            //setControl([... control, reader.result])
            setImagenes([...imagenes,reader.result])
            setCrear({
                ...crear,
                imagen: [...imagenes, reader.result]
            })
        }
        if (file) {
            
            setImagenSelected(reader.readAsDataURL(file));
        }        

    }
    function eliminarImagen(el, e){
        e.preventDefault()
        let nuevo = imagenes.filter( occ => occ !== el)
        setImagenes(nuevo)
        setCrear({
            ...crear,
            imagen: nuevo
        })
        
    }
   
function submitEspecimen(e){ // funcion submit + modal de cartel 
    e.preventDefault()
   // console.log(latitud)
   
   var coorde=gradoAdecimal(latitud,longitud)

   console.log(coorde.latitud,coorde.longitud)
  
    // setCrear({
    //     ...crear,
    //     latitud: coorde.latitud,
    //     longitud: coorde.longitud,
    // })

    
   // console.log(crear)
 
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
          
          if(pregunta === 'especimen'){
              postEspecimen([crear,coorde]) // envio datos al back
              setTimeout(() => {llamarIDnew()}, "2000")  // funcion para que solo cargue la pagina despues
          } else if( pregunta === 'bochon'){
            postBochon([crear,coorde])
            setTimeout(() => {llamarIDnew()}, "2000")
          } else {
            alert('Debes seleccionar que quieres crear (genero/bochon)')
          }
         

        } else if (result.isDenied) {
          Swal.fire('No se realizaron cambios', '', 'info')
        }
      })
}
let filoNombre = filogenia.map(el => el.filo)
//console.log(partes);
function llamarIDnew(){
    axios.get(`http://localhost:3001/especimen/?parametro=nuevo`)
            .then((response) => {
                setNewId(response.data)})
}
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
              setCrear({
                ...crear,
                posicionfilo: [...crear.posicionfilo,filoNew]
              }),
          //  console.log(crear),
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
function modificarPublico(e){
    console.log(e.target.value)
   
        setCrear({
            ...crear,
            publico: e.target.value,
        })  
   
    
}
function modificarHolotipo(e){
    //  console.log(e.target.checked)
    console.log(e.target.value)
   
    setCrear({
        ...crear,
        holo: e.target.value,
    })  

      
  }

  const subirArchivo = (e) => {
   
    const archivos = e.target.files;
    const data = new FormData();
  
    data.append('archivo', archivos[0]);
  
    axios.post('http://localhost:3001/subir-archivo', data)
    .then(data => {
      console.log(data)
     // document.getElementById('resultado').innerHTML = 'El archivo ' + data.data.filename + ' se ha subido correctamente.';
      setPdfs([...pdfs, data.data.filename])
      setCrear({
        ...crear,
        pdf: [...pdfs,data.data.filename]
      })
    })
    .catch(error => {
        console.error(error);
    });
    
}
function eliminarArchivo(e, el){
    e.preventDefault();
    axios.delete('http://localhost:3001/eliminar-archivo?nombreArchivo=' + el)
    let nuevo = pdfs.filter( occ => occ !== el)
    setPdfs(nuevo)
}

  //console.log('longitud: ',longitud);
  //console.log('latitud: ',latitud);

  
  function modificarCoorLong(e){
   // console.log(e.target.selected)
   // console.log(e.target.value)
   // console.log(e.target.name)
  
    setLong({
        ...longitud,
        [e.target.name]:Number(e.target.value),

    })
  
      
  }
  function modificarCoorLat(e){
    //  console.log(e.target.checked)
    console.log(e.target.value)
    console.log(e.target.name)
   setLat({
        ...latitud,
        [e.target.name]:Number(e.target.value),

    })
      
  }


  function especimenORbochon(e){
    setPregunta(e.target.value)
  }

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
                <div className="b">
                <h5 className="a">Que quieres crear ? </h5>
                                    <select className="cc" onChange={(e)=> especimenORbochon(e)}>
                                        <option value='seleccionar'>seleccionar</option>
                                        <option value='especimen'>especimen</option>
                                        <option value='bochon'>bochon</option>
                                    </select>
                </div>
            </div>
        </div>
        <div className="cuerpo">
            <div className="col1">
                <div className="info1">
                        <label className="label">Genero:</label>
                        <input type='text' id='genero-Input' class='css-input'name='genero' autoComplete='off' list='generoEspecie' onChange={(e)=> {filtrargenero(e)}}/>
                      
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
                            :  <   input type='text' id = 'especie-Input'class='css-input'name='especie'autoComplete='off' list='especiefiltrada' onChange={(e)=> {filtrarEspecie(e)}}/>
                        }
                   
                    
                 
                </div>
                <div className="info3">
                    <div className="datos34">
                    {
                        errors.especie?<p  className="p2" onClick={(e)=> crearEspecie(e)}>+ agregar especie</p>
                        :
                        pregunta==='especimen'?<label className="label">Nro Bochón:</label>:<></> } 
                        {
                        errors.especie?<p  className="p2" onClick={(e)=> crearEspecie(e)}>+ agregar especie</p>
                        :pregunta=='especimen'?<input type='number'  class='inpu' name='bochonnumero' onChange={(e)=> {modificarEspe(e)}}/>:<></>
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
                    
                         {crear.posicionfilo.length===0?<></>:crear.posicionfilo?.map(el => {return <div className="caca" onClick={(e)=> handleDelete(el, e)}><span tooltip="click para eliminar" >{el} </span></div>})} 
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
                                crear?.partesesqueletales?.length===0?<></>:crear?.partesesqueletales?.map(el => {return <div className="caca" onClick={(e)=> handleDeletePartes(el, e)}><span tooltip="click para eliminar" >{el} </span></div> }) 
                                } 
                            </div>
                </div>

                
            </div>
            <div className="col2">
                 <div className="info1">
                    <label className="label">Periodo:</label>
                    <input type='text' name='periodo' autoComplete='off' list='periodoEpoca' onChange={(e)=> {filtrarEpoca(e)}} />
                </div>
                <div  class='info1'>
                    <label className="label">Epoca:</label>
                    <input type='text'  id='epoca-input' name='epoca'autoComplete='off' list='epocaFiltrada'onChange={(e)=> {filtrarPiso(e)} } />
                </div>
                <div  class='info1'>
                    <label className="label">Piso:</label>
                    <input type='text' id='piso-input'name='piso'autoComplete='off' list='pisoFiltrado'onChange={(e)=> {modificarEspe(e)}} />
                </div>
                <div  class='info1'>
                    <label className="label">Cuenca:</label>
                    <input type='text' name='cuenca'list='cuencaformacion'autoComplete='off' onChange={(e)=> {modificarEspe(e)}} />
                </div>
                <div  class='info1'>
                    <label className="label">Formacion:</label>
                     <input type='text'  name='formacion' list='formacionfiltrada'autoComplete='off'onChange={(e)=> {modificarEspe(e)}} />
                </div>
                
                <div  class='info1'>
                    <label className="label">Miembro:</label>
                    <input type='text' name='miembro'onChange={(e)=> {modificarEspe(e)}} />
                </div>
                <div  class='info1'>
                    <label className="label">Localidad:</label>
                    <input type='text'class='css-input' name='localidad'onChange={(e)=> {modificarEspe(e)}} />
                 </div>
                 <div  class='info1'>
                 <label className="label">Campaña:</label>
     <input type='text' class='css-input'name='campana'onChange={(e)=> {modificarEspe(e)}} />
                 </div>
                 <div  class='info1'>
                 <label className="label">Fecha Camp.:</label>
     <input type='date' className="inpu"name='fechadescubrimiento'onChange={(e)=> {modificarEspe(e)}}/>
                 </div>
                 <div  class='info1'>
                 <label className="label">Publico:</label>
                             <div className="inpus2">
                             <div>
                           <div> si </div>
                             {crear?.publico ==='si'?<input type='radio' name='publico' value="si" checked='true'  onClick={(e)=> {modificarPublico(e)}} />:<input type='radio' name='publico' value="si"  onClick={(e)=> {modificarPublico(e)}} />}
                             </div> 
                             <div>
                             <div> no </div>
                             {crear?.publico==='no'?<input type='radio' name='publico' value='no' checked='true' onClick={(e)=> {modificarPublico(e)}}/>:<input type='radio' name='publico' value='no'   onClick={(e)=> {modificarPublico(e)}}/>    }
                             </div>
                             </div>
                          
                      
                             
                 </div>    
            </div>
            <div className="col1">
             <div  class='info1'>
            <label className="label">Nro Campo:</label>
                <input type='text' class='css-input'name='nrocampo'onChange={(e)=> {modificarEspe(e)}}/>
                
                    
            </div>
                        <div className="coordena">
                <div  class='info141'>
                    <label  className="label23">Coordenadas Geográficas </label>
                </div>
                <div  class='info14'>
                        <div className="coorde">
                      
                        <select name='coord' className="coorden" onChange={(e)=>{modificarCoorLat(e)}}>
                            <option value='S'>S</option>
                            <option value='N'>N</option>
                        </select>
                            
                        <input className="coor" type='number' name='gra' onChange={(e)=>{modificarCoorLat(e)}} ></input><p className="p">gra</p>  
                        <input className="coor" type='number' name='min'  onChange={(e)=>{modificarCoorLat(e)}} ></input> <p className="p"> min' </p>
                        <input  className="coorseg" type='number' name='seg'  onChange={(e)=>{modificarCoorLat(e)}} ></input> <p className="p">seg</p>
                    </div>
                </div>
                
                <div  class='info14'>
                <div className="coorde">
               
                    <select name='coord' className="coorden" onChange={(e)=>{modificarCoorLong(e)}}>
                    <option value='W'>W</option>
                    <option value='E'>E</option>
                </select>
               
        <input type='number'  name='gra'  class='coor'  onChange={(e)=>{modificarCoorLong(e)}}></input><p className="p">gra</p>  
        <input type='number' name='min' class='coor'  onChange={(e)=>{modificarCoorLong(e)}}></input> <p className="p"> min </p>
        <input type='number' name='seg'  class='coorseg'  onChange={(e)=>{modificarCoorLong(e)}}></input> <p className="p">seg</p>
    </div>
                </div>
            </div>

            
            <div  class='info1'>
            <label className="label">Preparador:</label>
     <input type='text' class='css-input'name='preparador'onChange={(e)=> {modificarEspe(e)}} />

            </div>
            <div  class='info1'>
            <label className="label">Fecha Prep.:</label>
     <input type='date' class='inpu'name='preparacionfecha'onChange={(e)=> {modificarEspe(e)}} />
 
            </div >
            <div  class='info1'>
            <label className="label">Fragmentos:</label>
        <input type='number'  class='inpu' name='cantidadfrag' onChange={(e)=> {modificarEspe(e)}} />
            </div>
            <div  class='info1coment'>
            <label className="label">Comentario:</label>
     <textarea type='text' class='textar'name='comentario'onChange={(e)=> {modificarEspe(e)}} />
            </div>
            <div  class='info1'>
                 <label className="label">Holotipo:</label>
                             <div className="inpus">
                             <div>
                           <div> si </div>
                             {crear?.holotipo ==='si'?<input type='radio' name='holotipo' value="si" checked='true'  onClick={(e)=> {modificarPublico(e)}} />:<input type='radio' name='holotipo' value="si"  onClick={(e)=> {modificarHolotipo(e)}} />}
                             </div> 
                             <div>
                             <div> no </div>
                             {crear?.holotipo==='no'?<input type='radio' name='holotipo' value='no' checked='true' onClick={(e)=> {modificarPublico(e)}}/>:<input type='radio' name='holotipo' value='no'   onClick={(e)=> {modificarHolotipo(e)}}/>    }
                             </div>
                             </div>
                
              </div> 

            </div>
            <div className="col1">
             <div className="info3">
                   
                        <div className="cabeza5">
                            <label className="lab">Armario:</label>
                        
                            <input type='number'  name='armario1'onChange={(e)=> {modificarEspe(e)}} />
             
             
                        </div>
                        <div className="estante">
                            <label class='labelo'>Estante </label>
                            <input className="ubic"  type='number' name='estante1desde'onChange={(e)=> {modificarEspe(e)}} />
                            <label class='labelo'>Hasta</label>
                            <input className="ubic" type='number'  name='estante1hasta'onChange={(e)=> {modificarEspe(e)}} />
                
                        </div>
                             
                        
        </div>
        <div className="info3">
                   
                   <div className="cabeza5">
                       <label className="lab">Armario:</label>
                   
                       <input type='number' className="ubic"  name='armario2'onChange={(e)=> {modificarEspe(e)}} />
        
        
                   </div>
                   <div className="estante">
                       <label class='labelo'>Estante </label>
                       <input className="ubic"  type='number' name='estante2desde'onChange={(e)=> {modificarEspe(e)}} />
                       <label class='labelo'>Hasta</label>
                       <input className="ubic" type='number'  name='estante2hasta'onChange={(e)=> {modificarEspe(e)}} />
           
                   </div>
                        
                   
   </div>
             
                  
               
                <div className="info3">
                    <div className="mostrador3">   
                        <div className="cabeza3">        
                            <label className="lab">Publicaciones</label>
                            <input onChange={(e) => subirArchivo(e)} type="file" id="pdf" name="pdf" accept="application/pdf" className="buto"/>
                        </div>
                            {
                            pdfs.length>0?pdfs.map(el => {
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
</div> //termina container



    
    /*           
    <div> 
        <Menu/>
                        <div class="parent">
                       
                            <div class="div1"> 
                          
                                 <datalist id='generoEspecie'>
                                    {
                                        generoEspecieFil.sort()?.map(el => {return <option>{el}</option>})
                                    }
                    
                                </datalist>
                                <datalist id='especiefiltrada'>
                                    {
                                        especiefiltrada?.sort()?.map(ele => {return <option>{ele}</option>})
                                   
                                       
                                    }
                                   
                                </datalist>
                    
                                <datalist id='periodoEpoca'>
                                    {
                                        periodoEpoca?.map(elem => {return <option>{elem.periodo}</option>})
                                       
                                       
                                    }
                                     <datalist id='epocaFiltrada'>
                                    {
                                        epocaFiltrada?.map(eleme => {return <option>{eleme.nombre}</option>})
                                       
                                       
                                    }
                                   
                                </datalist>
                                <datalist id='pisoFiltrado'>
                                    {
                                       pisoFiltrado?.map(eleme => {return <option>{eleme}</option>})
                                       
                                       
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
                               
                                    
                                      <h2 class='dd'>CREAR { pregunta === 'especimen' ? 'ESPECIMEN ' + newId?.newId : pregunta === 'bochon' ? 'BOCHON ' +newIdBochon?.newId : pregunta ==='seleccionar' ? null : null }</h2>
                           
                                    
                                    <button class='modificar2'  onClick={(e)=>submitEspecimen(e)} >Crear</button>
                                    </div>
                                </div>
                                 </div>
                                
                            <div class="div2"> 
                                 <div class='div-cont2'>
                                    <p>Que quieres crear ? </p>
                                    <select onChange={(e)=> especimenORbochon(e)}>
                                        <option value='seleccionar'>seleccionar</option>
                                        <option value='especimen'>especimen</option>
                                        <option value='bochon'>bochon</option>
                                    </select>
                                    
                                   
                                     <label>Genero:</label>
                                     <input type='text' id='genero-Input' class='css-input'name='genero' autoComplete='off' list='generoEspecie' onChange={(e)=> {filtrargenero(e)}}/>
                                     
                                       {
                                          errors.genero?<Alert variant="danger">
                                         {errors.genero} <button class='boton-alert' onClick={(e)=> crearGeneroEspecie(e)}><FiCheck/></button>
                                         </Alert> 
                                         
                                         : <></>
                                       }
                                   
                                    <label>Especie:</label>
                                    <input type='text' id = 'especie-Input'class='css-input'name='especie'autoComplete='off' list='especiefiltrada' onChange={(e)=> {filtrarEspecie(e)}}/>
                                    
                                    {
                                        errors.especie?<Alert variant="danger">
                                        {errors.especie} <button class='boton-alert' onClick={(e)=> crearEspecie(e)}><FiCheck/></button>
                                         </Alert>
                                        : <></>
                                    }
                                    
                                    </div>
                                 <div class='posicion-filo'>
                                 <label>Posicion Filogenetica:</label>
                                
                                 <div class='filo-todo'>
                                    <div class='select-filo'>
                                 <select multiple onChange={(e)=>handleSelectionFilo(e)}>
                                     
                                     {
                                         filoNombre.sort().map(ee => {return <option value={ee}>{ee}</option>})
                                     }
                                 </select> 
                                 </div>
                                 <div class='filos'>                  
                                 
                                    {
                                    crear.posicionfilo?.length==0?<></>:crear.posicionfilo?.map(el => {return <div class='div-filogenia'>{el} <button onClick={(e)=> handleDelete(el, e)}>X</button></div>}) 
                                    } 
                                 </div>   
                                 </div>
                                 <button onClick={(e)=> agregarFilo(e)}>crear posicion filogenetica</button>
                                 </div>
                                </div>
                            <div class="div3">
                                <div class='div-cont'>
                                 <div  class='div-todos'>
                                 <label>Periodo:</label>
                                 <input type='text' class='css-input'name='periodo' autoComplete='off' list='periodoEpoca' onChange={(e)=> {filtrarEpoca(e)}}/>
                                 </div>
                                 <div class="tabla">
                                    <a rel="noreferrer" target="_blank" href={pdf}>Carta Cronoestratigrafica</a>
                                 </div>
                                 <div  class='div-todos'>
                                     <label>Epoca:</label>
                                 <input type='text' class='css-input'name='epoca'autoComplete='off' list='epocaFiltrada'onChange={(e)=> {filtrarPiso(e)}}/>
                                 </div>
                                 <div  class='div-todos'>
                                     <label>Piso:</label>
                                 <input type='text' class='css-input'name='piso'autoComplete='off' list='pisoFiltrado'onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>
                                 <div  class='div-todos'>
                                  <label>Cuenca:</label>
                                  <input type='text'class='css-input' name='cuenca'list='cuencaformacion'autoComplete='off' onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>
                                 <div  class='div-todos'>
                                  <label>Formacion:</label>
                                  <input type='text' class='css-input'name='formacion' list='formacionfiltrada'autoComplete='off'onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>
                                
                                 <div  class='div-todos'>
                                     <label>Miembro:</label>
                                     <input type='text'class='css-input' name='miembro'onChange={(e)=> {modificarEspe(e)}} />
                                 </div>
                                 <div  class='div-todos'>
                                 <label>Localidad:</label>
                                 <input type='text'class='css-input' name='localidad'onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>
                                 <div class='img-div'>
                                <label>Imagen:</label>
                                <input onChange={(e) => handleImg(e)} type="file" id="imagen" name="imagen[]" accept="image/png, image/jpeg" class="form-control" multiple/>
                                <br />
                                <div class='posicion-img'>
                                    {
                                            imagenes?.length>0?
                                            imagenes?.map(el => {
                                                return <div>
                                                <img src={el} height="60px" width="80px"></img>
                                                <button onClick={(e)=> eliminarImagen(el, e)}>eliminar</button>
                                                </div>
                                                
                                                
                                            }): <></>
                                    }
                                    </div>
                            </div>
                                 </div>
                                 </div>
                            <div class="div4">
                                <div class='div-cont'>
                                <div  class='div-todos'>
                 <label>Coords Latitud:</label><br></br>
                 
                    <select name="coord" onChange={(e)=> {modificarCoorLat(e)}}>
                        <option value='N' name='coord' >N</option>
                        <option value='S' name='coord' selected='true'>S</option>
                    </select>: 
                  
                    
                <input type='number'  name='gra' class='coor' onChange={(e)=> {modificarCoorLat(e)}} ></input> ° 
                <input type='number'  name='min' class='coor' onChange={(e)=> {modificarCoorLat(e)}}></input> ' 
                <input type='number' name='seg' class='coorseg' onChange={(e)=> {modificarCoorLat(e)}}></input> " 
              
                 </div>
                 <div  class='div-todos'>
                 <label>Coords Longitud:</label><br></br>
                   
                      <select name="coord" onChange={(e)=> {modificarCoorLong(e)}} >
                          <option value='E' name='coord' >E</option>
                          <option value='W' name='coord' selected='true'>W</option>
                      </select>
                           
                           :
                <input type='number' name="gra" class='coor' onChange={(e)=> {modificarCoorLong(e)}} ></input> ° 
                <input type='number' name="min" class='coor' onChange={(e)=> {modificarCoorLong(e)}}  ></input> ' 
                <input type='number' name="seg" class='coorseg' onChange={(e)=> {modificarCoorLong(e)}} ></input> " 
              
                 </div>


                                 <div  class='div-todos'>
                                 <label>Campaña:</label>
                                 <input type='text' class='css-input'name='campana'onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>
                                 <div>
                                 <label  class='div-todos'>Descubridor:</label>
                                 <input type='text' class='css-input'name='descubridor'onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>
                                 <div  class='div-todos'>
                                 <label>Fecha de Campaña:</label>
                                 <input type="date" class='css-input'name='fechadescubrimiento'onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>
                                 <div  class='div-todos'>
                                 <label>Nro Campo:</label>
                                 <input type='text' class='css-input'name='nrocampo'onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>                          
                                 <div  class='div-todos'>
                                 <label>Preparador:</label>
                                 <input type='text' class='css-input'name='preparador'onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>
                                 <div  class='div-todos'>
                                 <label>Fecha Preparacion:</label>
                                 <input type='date' class='css-input'name='preparacionfecha'onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>
                                 </div>
                                 </div>
                                
                            <div class="div5">
                                <div class='div-cont'>
                                 <div   class='div-todos'>
                                    <div class='div-esqueleto'>

                                    <label>Publico:</label>
                                         
                                    SI <input type='radio' name='publico' value="si" onClick={(e)=> {modificarPublico(e)}} />  NO  <input type='radio' name='publico' value='no' checked={checkPublico}  onClick={(e)=> {modificarPublico(e)}}/>  
                                    <br></br>

                                    <label>Holotipo:</label>
                                         
                                         SI <input type='radio' name='holotipo' value="si" onClick={(e)=> {modificarHolotipo(e)}} />  NO  <input type='radio' value='no' name='holotipo' checked={checkHolo} onClick={(e)=> {modificarHolotipo(e)}} />  
                                 
                                    </div>
                                    <div class='div-esqueleto'>
                                     <label>Ubicacion Fosil/es:</label>
                                     <div>
                                        <div>  <label class='label'>Armario </label>
                                         <input type='text' class='armario1' name='armario1'onChange={(e)=> {modificarEspe(e)}}/>
                                         </div>
                                         <div> <label class='label'>Estantes desde</label>
                                         <input type='text' class='armario1'name='estante1desde'onChange={(e)=> {modificarEspe(e)}}/>
                                         <label class='label'> hasta</label>
                                         <input type='text' class='armario1' name='estante1hasta'onChange={(e)=> {modificarEspe(e)}}/>
                                         </div>
                                         </div>
                                         <div>
                                            <div><label class='label'>Armario </label>
                                            <input type='text' class='armario1' name='armario2'onChange={(e)=> {modificarEspe(e)}}/>
                                         </div>
                                        <div>
                                            <label class='label'>Estantes desde </label>
                                            <input type='text' class='armario1' name='estante2desde'onChange={(e)=> {modificarEspe(e)}}/>
                                            <label class='label'>hasta:</label>
                                            <input type='text' class='armario1'name='estante2hasta'onChange={(e)=> {modificarEspe(e)}}/>
                                         </div>
                                         
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
                                            crear.partesesqueletales?.length==0?<></>:crear.partesesqueletales?.map(el => {return <div class='div-filogenia'>{el} <button onClick={(e)=> handleDeletePartes(el, e)}>X</button></div>}) 
                                            } 
                                        </div>  
                                     </div>
                                        
                                
                                
                                </div>
                                 <div class='div-todos'>
                                    <label>Fragmentos:</label>
                                    <input type='number' class='css-input'name='cantidadfrag' onChange={(e)=> {modificarEspe(e)}} />
                                </div>
                               
                                 <div  class='div-todos'>
                                 <label>Comentario:</label>
                                 <textarea type='text' class='css-input'name='comentario'onChange={(e)=> {modificarEspe(e)}}/>
                                 </div>
                                 <div class='div-todos'>
                                    <label>PDF</label>
                                    <input onChange={(e) => subirArchivo(e)} type="file" id="pdf" name="pdf" accept="application/pdf" class="form-control" multiple/>
                                    <div id="resultado"></div>
                                    {
                                        pdfs?.map(el => {
                                            return <p>{el}<button onClick={(e)=> eliminarArchivo(e, el)}><FiDelete/></button></p>
                                        })
                                    }
                                    </div>
                               
                                
                                 </div>
                                 </div>

            </div>
            </div> */

        )
}