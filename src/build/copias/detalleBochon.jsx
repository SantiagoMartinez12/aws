import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import './actualizarEspecimen.css'
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import './actualizarEspecimen.css';
import {agregarQR, decimalAGrado} from '../store/action'
import Menu from "./menu";
import { useDispatch,useSelector} from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import {Alert} from 'react-bootstrap'
import Swal from 'sweetalert2'
import {url} from '../'

const reqPdfs = require.context ( '../pdf', true, /.pdf$/ )


export default function DetalleBochon (){
    const userD = useSelector((state)=> state.usuario)
    const dispatch = useDispatch();
    const allPdfFilepaths = reqPdfs.keys ()
    const navigate = useNavigate()
    const [especimen, setEspecimen] = useState(null)

   
    let id = useParams()
    let ids = id.id

    
    useEffect(() => {
        axios.get(`${url}bochon/especimen/id?id=${ids}`)
        .then((response) => {
            setEspecimen(response.data)
            

        })
        return () => {
            setEspecimen(null)
        }
    }, [])
    function goBack(e){
        e.preventDefault()
        navigate(-1)
    }
    
 // parte de lectura y comparacion de pdfs de especimen con carpeta contenedora de pdf
    let pdfs = reqPdfs?.keys()


    let pdfArr = [];
    //console.log('especimen modif', especimen?.modificado)
    //console.log('latitud : ',especimen?.coordlat)
    //console.log('long : ',especimen?.coordlong)

    var coordenadas =  decimalAGrado(especimen?.coordlat,especimen?.coordlong)

    var linkMap='https://www.google.com/maps/place/'+especimen?.coordlat+especimen?.coordlong;
  
  

     if(pdfs.length>0){
    for(let i = 0; i < pdfs?.length; i++){
        especimen?.pdf?.map(el => {
            if('./' + el == pdfs[i]){
                pdfArr.push(i)
            }
        }
        )
    }
    } 
    function agregarqr(e){
        e.preventDefault()
        let idespecimen = especimen?.especimennumero
        dispatch(agregarQR(idespecimen))
    }

   

    return (
        <div>
            <Menu/>
             <div class="parent">

            <div class="div1"> 

                <div class='navBar'>
                    <div class="ds">
                    
                    <h2 class='dd'>{'DETALLE BOCHON '+especimen?.especimennumero}</h2>
                    {
                        userD.nivel===3 ? null :
                        <Link to={`/modificar/bochon/${especimen?.especimennumero}`}>
                        <button class='modificar2'>Modificar Bochon</button>
                        </Link>
                    }
                    
              </div>
                </div>
                 </div>
                
            <div class="div2"> 
                 
                <div  class='campos'>
                    <div class='campotitulo'>Género:</div>
                    <h6 class='datosCur'>{especimen?.genero?especimen.genero:'Sin especificar'}</h6>
                </div><br></br>
                <div  class='campos'>
                    <div class='campotitulo'>Especie:</div>
                    <h6 class='datosCur'>{especimen?.especie?especimen.especie:'Sin especificar'}</h6>
                   
                   
                    </div> 
                   
                
                <div class='div-todos'>
                 <label>Posicion Filogenética:</label>
                 <ul>
                    
                    {
                            especimen?.posicionfilo?.length==0?<><li class='datos'>Sin Posicion</li></>:especimen?.posicionfilo?.map(el => {return <li class='datos'>{el} </li>}) 
    
                       } 
                       </ul>                
                    
                 </div>
                 <div class='div-todos'>
                 <label>Partes Esqueletales:</label>
                <ul>
                {especimen?.partesesqueletales.map(e=>{
                    return <li class='datos'>{e}</li>
                })}
                </ul>
                
                 </div>
                 
               
               
                
                </div>
            <div class="div3">
                <div class='div-cont'>
                 <div  class='div-todos'>
                 <label>Periodo:</label>
                 <input type='text' class='css-input'value={especimen?.periodo}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Epoca:</label>
                 <input type='text' class='css-input'value={especimen?.epoca}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Piso:</label>
                 <input type='text' class='css-input'value={especimen?.piso}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Cuenca:</label>
                 <input type='text'class='css-input'value={especimen?.cuenca}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Formacion:</label>
                 <input type='text' class='css-input'value={especimen?.formacion}/>
                 </div>
                
                 <div  class='div-todos'>
                 <label>Miembro:</label>
                 <input type='text'class='css-input'value={especimen?.miembro}/>
                 </div>
                 <div  class='div-todos'>
                 <label>Localidad:</label>
                 <input type='text'class='css-input'value={especimen?.localidad}/>
                 </div>
                 </div>
                 </div>
            <div class="div4">
                <div class='div-cont'>
                  <div  class='campos'>
                    <div class='campotitulo'>Coords Latitud:</div>
                    <h6 class='datos'>{coordenadas?.latitud.completa}</h6>
                 </div><br></br>
                 <div  class='campos'>
                    <div class='campotitulo'>Coords Longitud:</div>
                    <h6 class='datos'>{coordenadas?.longitud.completa}</h6>
                    <a href={linkMap} target='_blank'>ver en maps</a>
                 </div>  <br></br>
                 <div  class='campos'>
                    <div class='campotitulo'>Campaña:</div>
                    <h6 class='datos'>{especimen?.campana}</h6>
                 </div><br></br>
                                 <div class='campos'>
                 <div class='campotitulo'>Descubridor:</div>
                 <h6 class='datos'>{especimen?.descubridor?especimen.descubridor:'sin especificar'}</h6>
                 
                 
                 </div>
                 <div class='campos'>
                 <div class='campotitulo'>Fecha de Campaña:</div>
                 <h6 class='datos'>{especimen?.fechadescubrimiento}</h6>
                 
                 </div>
                 <div  class='campos'>
                 <div class='campotitulo'>Nro Campo:</div>
                 <h6 class='datos'>{especimen?.nrocampo?especimen.nrocampo:'Sin especificar'}</h6>
                 </div>

                
                 <div  class='campos'>
                 <div class='campotitulo'>Nombre de Preparador:</div>
                 <h6 class='datos'>{especimen?.preparador?especimen.preparador:'Sin especificar'}</h6>
                 
                 </div>

                 <div  class='campos'>
  
                 
                 </div>
                 <div  class='campos'>
                 <div class='campotitulo'>Fecha de Preparacion:</div><h6 class='datos'>{especimen?.preparacionfecha}</h6>
                 
                
                 </div>
                 </div>
                 </div>
                
            <div class="div5">
                <div class='div-cont'>
                 <div   class='div-todos'>
                    <div class='div-esqueleto'>
                     <label>Ubicacion Fosil/es:</label>
                     <div>
                         <label class='label'>Armario 1</label>
                         <input type='text' class='armario1' name='armario1'value={especimen?.armario1}/>
                         <label class='label'>Desde:</label>
                         <input type='text' class='armario1'name='estante1desde'value={especimen?.estante1desde}/>
                         <label class='label'>Hasta</label>
                         <input type='text' class='armario1' name='estante1hasta'value={especimen?.estante1hasta}/>
                         </div>
                         <div>
                         <label class='label'>Armario 2</label>
                         <input type='text' class='armario1' name='armario2'value={especimen?.armario2}/>
                         <label class='label'>desde: </label>
                         <input type='text' class='armario1' name='estante2desde'value={especimen?.estante2desde}/>
                         <label class='label'>hasta:</label>
                         <input type='text' class='armario1'name='estante2hasta'value={especimen?.estante2hasta}/>
                      </div>
                      </div>
                          </div>     
             
                 <div>
                    <label>Fragmentos:</label>
                    <input type='number' class='css-input'name='cantidadfrag' value={especimen?.cantidadfrag}/>
                 </div>
               
                 <div  class='div-todos'>
                 <label>Comentario:</label>
                 <input type='text' class='css-input'name='comentario'value={especimen?.comentario}/>
                 </div>
                 {
                    pdfArr.map(el=> {
                        return <a href={reqPdfs(allPdfFilepaths[el])} target='_blank'>{pdfs[el].replace("./","")}</a>
                    })
                 }
                 {
                    userD.nivel===3 ? null :
                 <div class='div-todos'>
                    <button onClick={(e)=> agregarqr(e)}>generar QR</button>
                 </div>
                 }
                 <div class='img-div'>
                 <label>Imagen:</label>
                 <div class='carrusel'>
                 {
                    especimen?.imagen?.length>0?
                    <Carousel>
                    {especimen?.imagen?.map(el => { 
                        return <Carousel.Item interval={2000} >
                        <img
                            class="lala"
                            src={el}
                            alt='banner'
                            objectFit= "cover"
                        />
                        </Carousel.Item>
                    })}
                    </Carousel>
                        :<>
                        <img src='https://plantillasdememes.com/img/plantillas/imagen-no-disponible01601774755.jpg'
                        width= "150px"
                        height= "150px"
                        />
                        
                        </>
                    }
                    </div>
             </div>
                
                 </div>
                 </div>

</div>
</div>
            )
}