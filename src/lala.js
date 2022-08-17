const Catalogo = {    // 1 catalogo puede tenes mucho especimenes
    id:"",
    Nombre:""
}
const Usuario={
    id:"",
    Nombre:"",   // ej Santiago Martinez
    Nivel:"",  // tipo de acceso( ej, total, parcial, solo lectura etc (1,2,3,4,5))
    UsuarioCorreo:"", // info de acceso
    Contraseña:"",
   
} 
const institucion= {
    id:"",
    Nombre:"",
    Origen:"",
    info:""

}


const especimen =  {  // especimen puede pertenecer a un solo catalogo
    idEspecimen : "",
    Genero : {              // un genero tiene un nombre y una especie, que a su vez tiene nombre tambien
        nombre: "",
        Especie:{
            nombre:""
        }
    },
    Edad : {
        nombre: "",
        Periodo: {
            nombre: "",
            Piso: {
                nombre:""
            }
        }

    },
    UbicacionHallazgo: {
        Localidad: {
            nombre: "",
            cordenadas: {
                Geograficas:"",
                UTM:""
            }
        }
    },
    Campaña: {
        nombre: "",
        Descubridor:"",
        Fecha: "",
        NumeroDeCampo:""
    },
    Preparacion: {
        nombre: "",
        Fecha:""
    },
    PartesEsqueletales: ["", "", "", "", "", ""],
    
    PosicionFilogenetica: ["", "", "", "", "", "",],

    UbicacionEspecimen:{
        Armario:"",
        Estante:["",""], 

    },
    Imagen: "",
    Comentario:"",


    
}