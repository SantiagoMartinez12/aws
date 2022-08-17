// hay que traer especimen unico desde back
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import './actualizarEspecimen.css'
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import {agregarQR, decimalAGrado} from '../store/action'
import Menu from "./menu";
import { useDispatch,useSelector} from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import {Alert} from 'react-bootstrap'
import Swal from 'sweetalert2'

const reqPdfs = require.context ( '../pdf', true, /.pdf$/ )


export default function Detalle (){
    const userD = useSelector((state)=> state.usuario)
    const dispatch = useDispatch();
    const allPdfFilepaths = reqPdfs.keys ()
    const navigate = useNavigate()
    const [especimen, setEspecimen] = useState(null)

    const [prestamoActivo, setPrestamoActivo] = useState({})
    let id = useParams()
    let ids = id.id

    
    useEffect(() => {
        axios.get(`http://localhost:3001/especimen/id?id=${ids}`)
        .then((response) => {
            let num = response.data.especimennumero
            setEspecimen(response.data)
            if(response.data.prestado){
             axios.get(`http://localhost:3001/prestamos?id=`+ num)
            .then(res => setPrestamoActivo(res.data))
            }

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

   /* if(especimen.prestado){
    let obj = especimen.especimennumero
    axios.get('http://localhost:3001/prestamos', obj)
    .then(res => prestamoActivo = res)
   } */
  
   function abrirPrestamo(){
    const { value: formValues } =  Swal.fire({
        title: `Prestamo` ,
        html: 
        `<p>Prestado por : ${prestamoActivo[0].emisor}</p>` +
        `<p>investigador: ${prestamoActivo[0].investigador}</p>`+
        `<p>institucion: ${prestamoActivo[0].institucion}</p>`+
        `<p>Nro especimen : ${prestamoActivo[0].numeroespecimen}</p>`+
        `<p>fecha de prestamo: ${prestamoActivo[0].fechaprestamo}</p>` +
        `<p>fecha devolucion: ${prestamoActivo[0].fechadevolucionest}</p>` +
        `<p> comentario: ${prestamoActivo[0].comentarios} </p>`,

        showCloseButton: true,
        showDenyButton:true,
        denyButtonText:'volver',
       confirmButtonText: 'ir a prestamos',
        preConfirm: () => {   
           
          return [
            navigate('/home/prestamos')
           
          ]  
        }   
      }) 
      if (formValues) {
        Swal.fire(JSON.stringify(formValues)) 
      }
   }
   console.log(especimen)
    return (
        
        <div className="container34">    
        <div>
         <Menu/>
        </div>
        <div className="fantasma"></div>
        <div className="contenido34">
            <div className="cabecera">
                <div className="titulo">
                    <h5 className="a">
                        Detalle especimen nro: {especimen?.especimennumero}
                    </h5>
                </div>
            </div>
            <div className="cuerpo">
                <div className="col1">
                    <div className="info1">
                            <label className="label">Genero:</label>

                            <h6 class='datosCur'>{especimen?.genero?especimen.genero:'Sin especificar'}</h6>
                          
                    </div>
                   
                    <div className="info1">   
                    <label className="label">especie:</label>

                        <h6 class='datosCur'>{especimen?.especie?especimen.especie:'Sin especificar'}</h6>
                       
                        
                     
                    </div>
                    <div className="info3">
                        <div className="datos34">
                      
                            <label className="label">Nro. Bochón:</label> 
                            <h6 class='datosCur'>{especimen?.bochonnumero?especimen.bochonnumero:'Sin especificar'}</h6>       
                           
                         </div>


                         <div className="mostrador">
                            <div className="cabeza">
                            <label className="lab">Pos. Filo:</label>

                            <ul>
                    
                                        {
                                                 especimen?.posicionfilo?.length==0?<><li class='datos'>Sin Posicion</li></>:especimen?.posicionfilo?.map(el => {return <li class='datos'>{el} </li>}) 
                        
                                           } 
                                           </ul>     
                            </div>
                        
                            
                             </div>
                      
                    </div>
                    
                    <div className="info3">
                                     
                                
                        <div className="mostrador2">   
                        <div className="cabeza">        
                        <label className="lab">Partes Esq:</label>
                                    <ul>
                                        {especimen?.partesesqueletales.map(e=>{
                                            return <li class='datos'>{e}</li>
                                        })}
                                </ul>
                                    </div>

                    
                </div>
                </div>
                </div>
                <div className="col2">
                    <div className="info1">
                        <label className="label">Periodo:</label>
                        <h6 class='datosCur'>{especimen?.periodo}</h6>
                    </div>
                    <div  class='info1'>
                        <label className="label">Epoca:</label>
                        <h6 class='datosCur'>{especimen?.epoca}</h6>
                        
                    </div>
                    <div  class='info1'>
                        <label className="label">Piso:</label>
                        <h6 class='datosCur'>{especimen?.piso}</h6>
                    </div>
                    <div  class='info1'>
                        <label className="label">Cuenca:</label>
                        <h6 class='datosCur'>{especimen?.cuenca}</h6>
                    </div>
                    <div  class='info1'>
                        <label className="label">Formacion:</label>
                        <h6 class='datosCur'>{especimen?.formacion}</h6>
                    </div>
                    
                    <div  class='info1'>
                        <label className="label">Miembro:</label>
                        <h6 class='datosCur'>{especimen?.mienmbro}</h6>
                    </div>
                    <div  class='info1'>
                        <label className="label">Localidad:</label>
                        <h6 class='datosCur'>{especimen?.localidad}</h6>
                     </div>
                     <div  class='info1'>
                     <label className="label">Campaña:</label>
                     <h6 class='datosCur'>{especimen?.campana}</h6>
                     </div>
                     <div  class='info1'>
                     <label className="label">Fecha Camp.:</label>
                     <h6 class='datosCur'>{especimen?.fechadescubrimiento}</h6>
       
                     </div>
                     <div  class='info1'>
                                      
                     </div>   
                </div>
                <div className="col1">
                <div  class='info1'>
                <label className="label">Nro Campo:</label>
                <h6 class='datosCur'>{especimen?.nrocampo}</h6>
        
            
       </div>
                <div className="coordena">
                    <div  class='info141'>
                        <label  className="label23">Coordenadas Geográficas </label>
                    </div>
                    <div  class='info14'>
                    <h6 class='datos'>{coordenadas?.latitud.completa}</h6>
                    </div>
                    
                    <div  class='info14'>
                    <h6 class='datos'>{coordenadas?.longitud.completa}</h6>
                    </div>
                    <a href={'https://www.google.com/maps/place/'+especimen?.coordlat+','+especimen?.coordlong}>ver en maps</a>
                </div>

                
                <div  class='info1'>
                <label className="label">Preparador:</label>
                <h6 class='datos'>{especimen?.preparador}</h6>
        
   
                </div>
                <div  class='info1'>
                <label className="label">Fecha Prep.:</label>
                <h6 class='datos'>{especimen?.preparacionfecha}</h6>
      
     
                </div >
                <div  class='info1'>
                <label className="label">Fragmentos:</label>
                <h6 class='datos'>{especimen?.cantidadfrag}</h6>
           
                </div>
                <div  class='info1coment'>
                <label className="label">Comentario:</label>
                <h6 class='datos'>{especimen?.comentario}</h6>
       
                </div>
                <div  class='info1'>
                     <label className="label">Holotipo:</label>
                     <h6 class='datos'>{especimen?.holotipo?'SI':'NO'}</h6>
                    
                  </div>

                </div>
                <div className="col1">
                <div className="info3">
                       
                            <div className="cabeza5">
                                <label className="lab">Armario:</label>
                                <h6 class='datos'>{especimen?.armario1}</h6>
                 
                            </div>
                            <div className="estante">
                            <h6 class='datos'>Estante {especimen?.estante1desde} hasta {especimen?.estante1hasta} </h6>
                    
                            </div>
                                 
                            
            </div>
            <div className="info3">
                       
                       <div className="cabeza5">
                           <label className="lab">Armario:</label>
                           <h6 class='datos'>{especimen?.armario2}</h6>
            
                       </div>
                       <div className="estante">
                       <h6 class='datos'>Estante {especimen?.estante2desde} hasta {especimen?.estante2hasta} </h6>
               
                       </div>
                            
                       
       </div>
                 
                      
                   
                    <div className="info3">
                               
                                <label className="lab">Publicaciones</label>
                                {
                                        pdfArr?.map(el=> {
                                                return <a href={reqPdfs(allPdfFilepaths[el])} target='_blank'>{pdfs[el].replace("./","")}</a>
                                            })
                                        }
                                     
                            </div>
                            
                   
                    <div className="info3">
                        <div className="mostrador3">   
                                 
                                <label className="lab">Imágenes</label>
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
            <div className="pie">
            {
                        userD.nivel===3 ? null :
                        <Link to={`/modificar/${especimen?.especimennumero}`}>
                         <button class='modificar2'>Modificar</button>
                        </Link>
                    }
                    
                            
            </div>
        </div>
</div>


            )
}
