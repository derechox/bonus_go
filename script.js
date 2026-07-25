// ==========================================
// BONUS GO V2
// Sistema de desafíos con etapas
// ==========================================


// ===============================
// CARGAR DATOS
// ===============================


let desafios = JSON.parse(localStorage.getItem("bonusgo")) || [];



// Adaptar desafíos antiguos

desafios = desafios.map(d => {


    if(!d.etapas){


        return {

            nombre:
            d.nombre || "Desafío 1",


            inicio:
            d.inicio || "08:00",


            fin:
            d.fin || "14:00",


            etapas:[

                {

                    viajes:
                    d.total || 0,


                    objetivo:
                    d.total || 0,


                    premio:
                    Number(
                        String(d.premio || 0)
                        .replace("$","")
                        .replace(".","")
                    )


                }

            ],


            realizados:
            d.realizados || 0


        };


    }


    return d;


});






let editando = null;




const contenedor =
document.getElementById("contenedorDesafios");


const modal =
document.getElementById("modal");


const listaEtapas =
document.getElementById("listaEtapas");







// ===============================
// GUARDAR DATOS
// ===============================


function guardarDatos(){


    localStorage.setItem(
        "bonusgo",
        JSON.stringify(desafios)
    );


}








// ===============================
// MOSTRAR TARJETAS
// ===============================


function mostrar(){


    contenedor.innerHTML="";



    desafios.forEach((d,index)=>{

        let estadoBarra = "barra-inicio";


let objetivoFinal = d.etapas[d.etapas.length - 1].objetivo;



if(d.realizados >= objetivoFinal){

    estadoBarra = "barra-completa";

}
else if(d.realizados >= d.etapas[1]?.objetivo){

    estadoBarra = "barra-avanzada";

}
else if(d.realizados >= d.etapas[0]?.objetivo){

    estadoBarra = "barra-primera";

}

        let estado = "inicio";


let ultimaEtapa = d.etapas[d.etapas.length - 1].objetivo;



if(d.realizados >= ultimaEtapa){

    estado = "completo";

}

else if(d.realizados >= d.etapas[d.etapas.length - 2]?.objetivo){

    estado = "nivel3";

}

else if(d.realizados >= d.etapas[0].objetivo){

    estado = "nivel2";

}



        let ultimoViaje = 0;



        d.etapas.forEach(e=>{


            if(e.objetivo > ultimoViaje){

                ultimoViaje = e.objetivo;

            }


        });





        let porcentaje = 0;



        if(ultimoViaje > 0){


            porcentaje =
            (d.realizados / ultimoViaje) * 100;


        }





        if(porcentaje > 100){

            porcentaje = 100;

        }





        let premiosHTML="";



        let totalPremios=0;





        d.etapas.forEach((e)=>{



            totalPremios += Number(e.premio);





            if(d.realizados >= e.objetivo){


                premiosHTML += `


                <p>
                ✅ ${e.viajes} viajes →
                $${Number(e.premio).toLocaleString("es-AR")}
                </p>


                `;



            }

            else if(d.realizados >= (e.objetivo - e.viajes)){



                premiosHTML += `


                <p>
                🔓 ${e.viajes} viajes →
                $${Number(e.premio).toLocaleString("es-AR")}
                </p>


                `;



            }

            else{


                premiosHTML += `


                <p>
                🔒 ${e.viajes} viajes →
                $${Number(e.premio).toLocaleString("es-AR")}
                </p>


                `;


            }



        });








        contenedor.innerHTML += `


        <div class="tarjeta ${estado}">



            <h2>${d.nombre}</h2>





            <p>
            🕒 Horario:
            ${d.inicio} - ${d.fin}
            </p>





            <p>
            🚗 Viajes:
            ${d.realizados}/${ultimoViaje}
            </p>






            <div class="barra">


                <div class="progreso ${estadoBarra}"
style="width:${porcentaje}%">
</div>


            </div>






            <h3>
            Premios
            </h3>





            ${premiosHTML}

            ${d.realizados >= ultimoViaje 
?
`
<div class="completado">
🏆 DESAFÍO COMPLETADO
</div>
`
:
""
}







            <p>
            💰 Total posible:
            $${totalPremios.toLocaleString("es-AR")}
            </p>






            <div class="controles">


                <button onclick="restar(${index})">
                -
                </button>



                <button onclick="sumar(${index})">
                +
                </button>



            </div>






            <button onclick="editar(${index})">

            ✏️ Editar

            </button>






            <button 
            class="eliminar"
            onclick="borrar(${index})">

            🗑️ Eliminar

            </button>





        </div>


        `;



    });



}







// ===============================
// SUMAR VIAJE
// ===============================


function sumar(i){


    let desafio = desafios[i];


    let objetivoFinal = 0;



    desafio.etapas.forEach(e => {


        if(e.objetivo > objetivoFinal){

            objetivoFinal = e.objetivo;

        }


    });




    if(desafio.realizados < objetivoFinal){


        desafio.realizados++;


        guardarDatos();


        mostrar();


    }else{


        alert("🏆 Desafío completado");


    }



}







// ===============================
// RESTAR VIAJE
// ===============================


function restar(i){


    if(desafios[i].realizados > 0){


        desafios[i].realizados--;


    }


    guardarDatos();


    mostrar();


}

// ==========================================
// BONUS GO V2
// SCRIPT.JS PARTE 2/2
// ==========================================


// ===============================
// NUEVO DESAFÍO
// ===============================


document
.getElementById("nuevoDesafio")
.addEventListener("click",function(){


    editando=null;



    document.getElementById("horaInicio").value="";

    document.getElementById("horaFin").value="";



    listaEtapas.innerHTML=`


    <div class="etapa">


        <h4>Etapa 1</h4>


        <div class="fila">


            <div class="campo">


                <label>
                🚗 Viajes
                </label>


                <input
                class="viajesEtapa"
                type="number"
                placeholder="Ej: 8">


            </div>




            <div class="campo">


                <label>
                💰 Premio
                </label>


                <input
                class="premioEtapa"
                type="number"
                placeholder="Ej: 8000">


            </div>



        </div>


    </div>


    `;



    modal.classList.remove("oculto");


});







// ===============================
// AGREGAR ETAPA
// ===============================


document
.getElementById("agregarEtapa")
.addEventListener("click",function(){



    let numero =
    listaEtapas.children.length + 1;



    let nueva =
    document.createElement("div");



    nueva.className="etapa";



    nueva.innerHTML=`


        <h4>Etapa ${numero}</h4>


        <div class="fila">


            <div class="campo">


                <label>
                🚗 Viajes
                </label>


                <input
                class="viajesEtapa"
                type="number"
                placeholder="Ej: 1">


            </div>




            <div class="campo">


                <label>
                💰 Premio
                </label>


                <input
                class="premioEtapa"
                type="number"
                placeholder="Ej: 6000">


            </div>



        </div>


    `;



    listaEtapas.appendChild(nueva);



});









// ===============================
// CANCELAR
// ===============================


document
.getElementById("cerrar")
.addEventListener("click",function(){


    modal.classList.add("oculto");


});








// ===============================
// GUARDAR DESAFÍO
// ===============================


document
.getElementById("guardar")
.addEventListener("click",function(){



    let etapas=[];


    let viajes =
    document.querySelectorAll(".viajesEtapa");



    let premios =
    document.querySelectorAll(".premioEtapa");



    let acumulado = 0;





    for(let i=0;i<viajes.length;i++){



        if(
            viajes[i].value !== "" &&
            premios[i].value !== ""
        ){


            acumulado += Number(viajes[i].value);



            etapas.push({


                viajes:
                Number(viajes[i].value),



                objetivo:
                acumulado,



                premio:
                Number(premios[i].value)



            });



        }



    }







    if(etapas.length===0){


        alert("Cargá al menos una etapa");


        return;


    }







    let nuevo={



        nombre:

        editando===null

        ?

        "Desafío " + (desafios.length + 1)

        :

        desafios[editando].nombre,





        inicio:

        document.getElementById("horaInicio").value,





        fin:

        document.getElementById("horaFin").value,





        etapas:etapas,





        realizados:


        editando===null

        ?

        0

        :

        desafios[editando].realizados



    };








    if(editando===null){


        desafios.push(nuevo);


    }

    else{


        desafios[editando]=nuevo;


    }







    guardarDatos();



    mostrar();



    modal.classList.add("oculto");



});









// ===============================
// EDITAR
// ===============================


function editar(i){



    editando=i;



    document.getElementById("horaInicio").value =
    desafios[i].inicio;



    document.getElementById("horaFin").value =
    desafios[i].fin;





    listaEtapas.innerHTML="";






    desafios[i].etapas.forEach((e,index)=>{



        listaEtapas.innerHTML += `



        <div class="etapa">


            <h4>Etapa ${index+1}</h4>




            <div class="fila">


                <div class="campo">


                    <label>
                    🚗 Viajes
                    </label>


                    <input
                    class="viajesEtapa"
                    type="number"
                    value="${e.viajes}">



                </div>





                <div class="campo">


                    <label>
                    💰 Premio
                    </label>


                    <input
                    class="premioEtapa"
                    type="number"
                    value="${e.premio}">



                </div>



            </div>



        </div>



        `;



    });







    modal.classList.remove("oculto");



}









// ===============================
// BORRAR
// ===============================


function borrar(i){


    desafios.splice(i,1);



    guardarDatos();



    mostrar();



}









// ===============================
// INICIO
// ===============================


mostrar();