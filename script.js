// ==========================================
// BONUS GO
// Sistema de desafíos con etapas
// Guardado local seguro
// ==========================================


// ===============================
// CARGAR DATOS
// ===============================

const CLAVE_DATOS = "bonusgo";

let desafios = [];


// Intentar recuperar datos guardados
try {

    const datosGuardados = localStorage.getItem(CLAVE_DATOS);

    if (datosGuardados) {

        desafios = JSON.parse(datosGuardados);

    }

} catch (error) {

    console.error("Error al cargar los datos:", error);

    desafios = [];

}


// ===============================
// ADAPTAR DESAFÍOS ANTIGUOS
// ===============================

desafios = desafios.map(d => {

    // Si el desafío todavía no tiene etapas,
    // lo convertimos al nuevo formato.

    if (!d.etapas || !Array.isArray(d.etapas)) {

        const total =
            Number(d.total || 0);

        return {

            nombre:
            d.nombre || "Desafío 1",

            inicio:
            d.inicio || "08:00",

            fin:
            d.fin || "14:00",

            etapas: [

                {

                    viajes: total,

                    objetivo: total,

                    premio:
                    Number(
                        String(d.premio || 0)
                        .replace(/\$/g, "")
                        .replace(/\./g, "")
                        .replace(/,/g, "")
                    )

                }

            ],

            realizados:
            Number(d.realizados || 0)

        };

    }


    // Aseguramos que cada etapa tenga objetivo

    let acumulado = 0;

    d.etapas = d.etapas.map(e => {

        const viajes =
            Number(e.viajes || 0);

        acumulado += viajes;

        return {

            viajes: viajes,

            objetivo:
            Number(e.objetivo || acumulado),

            premio:
            Number(e.premio || 0)

        };

    });


    d.realizados =
    Number(d.realizados || 0);


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

function guardarDatos() {

    try {

        localStorage.setItem(
            CLAVE_DATOS,
            JSON.stringify(desafios)
        );

        console.log("✅ Bonus Go: datos guardados correctamente");

        return true;

    } catch (error) {

        console.error(
            "❌ Bonus Go: no se pudieron guardar los datos",
            error
        );

        alert(
            "⚠️ No se pudieron guardar los datos en este dispositivo."
        );

        return false;

    }

}



// ===============================
// MOSTRAR TARJETAS
// ===============================

function mostrar() {

    contenedor.innerHTML = "";


    desafios.forEach((d, index) => {


        // Si por algún motivo no tiene etapas,
        // evitamos que la página se rompa.

        if (!d.etapas || d.etapas.length === 0) {
            return;
        }



        // ===============================
        // COLORES DE LA BARRA
        // ===============================

        let estadoBarra = "barra-inicio";


        let objetivoFinal =
            d.etapas[d.etapas.length - 1].objetivo;



        if (d.realizados >= objetivoFinal) {

            estadoBarra = "barra-completa";

        }

        else if (
            d.etapas.length >= 2 &&
            d.realizados >= d.etapas[1].objetivo
        ) {

            estadoBarra = "barra-avanzada";

        }

        else if (
            d.realizados >= d.etapas[0].objetivo
        ) {

            estadoBarra = "barra-primera";

        }



        // ===============================
        // ESTADO DE LA TARJETA
        // ===============================

        let estado = "inicio";


        let ultimaEtapa =
            d.etapas[d.etapas.length - 1].objetivo;



        if (d.realizados >= ultimaEtapa) {

            estado = "completo";

        }

        else if (
            d.etapas.length >= 2 &&
            d.realizados >=
            d.etapas[d.etapas.length - 2].objetivo
        ) {

            estado = "nivel3";

        }

        else if (
            d.realizados >=
            d.etapas[0].objetivo
        ) {

            estado = "nivel2";

        }



        // ===============================
        // OBJETIVO FINAL
        // ===============================

        let ultimoViaje = 0;


        d.etapas.forEach(e => {

            if (e.objetivo > ultimoViaje) {

                ultimoViaje = e.objetivo;

            }

        });



        // ===============================
        // PORCENTAJE
        // ===============================

        let porcentaje = 0;


        if (ultimoViaje > 0) {

            porcentaje =
            (d.realizados / ultimoViaje) * 100;

        }


        if (porcentaje > 100) {

            porcentaje = 100;

        }


        if (porcentaje < 0) {

            porcentaje = 0;

        }



        // ===============================
        // PREMIOS
        // ===============================

        let premiosHTML = "";

        let totalPremios = 0;



        d.etapas.forEach(e => {


            totalPremios +=
            Number(e.premio);



            // ETAPA COMPLETADA

            if (d.realizados >= e.objetivo) {

                premiosHTML += `

                    <p>
                    ✅ ${e.viajes} viajes →
                    $${Number(e.premio).toLocaleString("es-AR")}
                    </p>

                `;

            }


            // ETAPA SIGUIENTE DESBLOQUEADA

            else if (
                d.realizados >=
                (e.objetivo - e.viajes)
            ) {

                premiosHTML += `

                    <p>
                    🔓 ${e.viajes} viajes →
                    $${Number(e.premio).toLocaleString("es-AR")}
                    </p>

                `;

            }


            // ETAPA BLOQUEADA

            else {

                premiosHTML += `

                    <p>
                    🔒 ${e.viajes} viajes →
                    $${Number(e.premio).toLocaleString("es-AR")}
                    </p>

                `;

            }

        });



        // ===============================
        // MENSAJE FINAL
        // ===============================

        let mensajeCompletado = "";


        if (d.realizados >= ultimoViaje) {

            mensajeCompletado = `

                <div class="completado">

                    🏆 DESAFÍO COMPLETADO

                </div>

            `;

        }



        // ===============================
        // TARJETA
        // ===============================

        contenedor.innerHTML += `

            <div class="tarjeta ${estado}">


                <h2>
                    ${d.nombre}
                </h2>



                <p>
                    🕒 Horario:
                    ${d.inicio} - ${d.fin}
                </p>



                <p>
                    🚗 Viajes:
                    ${d.realizados}/${ultimoViaje}
                </p>



                <div class="barra">

                    <div
                        class="progreso ${estadoBarra}"
                        style="width:${porcentaje}%">
                    </div>

                </div>



                <h3>
                    Premios
                </h3>



                ${premiosHTML}



                ${mensajeCompletado}



                <p>
                    💰 Total posible:
                    $${totalPremios.toLocaleString("es-AR")}
                </p>



                <div class="controles">


                    <button
                        onclick="restar(${index})">

                        -

                    </button>



                    <button
                        onclick="sumar(${index})">

                        +

                    </button>


                </div>



                <button
                    onclick="editar(${index})">

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

function sumar(i) {


    let desafio =
        desafios[i];


    let objetivoFinal = 0;



    desafio.etapas.forEach(e => {

        if (e.objetivo > objetivoFinal) {

            objetivoFinal =
            e.objetivo;

        }

    });



    // NO PERMITIR MÁS VIAJES
    // CUANDO EL DESAFÍO TERMINÓ

    if (
        desafio.realizados <
        objetivoFinal
    ) {

        desafio.realizados++;


        guardarDatos();


        mostrar();

    }

    else {

        alert(
            "🏆 Desafío completado"
        );

    }

}



// ===============================
// RESTAR VIAJE
// ===============================

function restar(i) {


    if (
        desafios[i].realizados > 0
    ) {

        desafios[i].realizados--;

    }


    guardarDatos();


    mostrar();

}



// ===============================
// NUEVO DESAFÍO
// ===============================

document
.getElementById("nuevoDesafio")
.addEventListener("click", function() {


    editando = null;


    document.getElementById(
        "horaInicio"
    ).value = "";


    document.getElementById(
        "horaFin"
    ).value = "";



    listaEtapas.innerHTML = `

        <div class="etapa">

            <h4>
                Etapa 1
            </h4>


            <div class="fila">


                <div class="campo">

                    <label>
                        🚗 Viajes
                    </label>


                    <input
                        class="viajesEtapa"
                        type="number"
                        min="1"
                        placeholder="Ej: 8">

                </div>



                <div class="campo">

                    <label>
                        💰 Premio
                    </label>


                    <input
                        class="premioEtapa"
                        type="number"
                        min="0"
                        placeholder="Ej: 8000">

                </div>


            </div>

        </div>

    `;



    modal.classList.remove(
        "oculto"
    );

});



// ===============================
// AGREGAR ETAPA
// ===============================

document
.getElementById("agregarEtapa")
.addEventListener("click", function() {


    let numero =
        listaEtapas.children.length + 1;


    let nueva =
        document.createElement("div");


    nueva.className =
        "etapa";


    nueva.innerHTML = `

        <h4>
            Etapa ${numero}
        </h4>


        <div class="fila">


            <div class="campo">

                <label>
                    🚗 Viajes
                </label>


                <input
                    class="viajesEtapa"
                    type="number"
                    min="1"
                    placeholder="Ej: 1">

            </div>



            <div class="campo">

                <label>
                    💰 Premio
                </label>


                <input
                    class="premioEtapa"
                    type="number"
                    min="0"
                    placeholder="Ej: 6000">

            </div>


        </div>

    `;


    listaEtapas.appendChild(
        nueva
    );

});



// ===============================
// CANCELAR
// ===============================

document
.getElementById("cerrar")
.addEventListener("click", function() {

    modal.classList.add(
        "oculto"
    );

});



// ===============================
// GUARDAR DESAFÍO
// ===============================

document
.getElementById("guardar")
.addEventListener("click", function() {


    let etapas = [];


    let viajes =
        document.querySelectorAll(
            ".viajesEtapa"
        );


    let premios =
        document.querySelectorAll(
            ".premioEtapa"
        );


    let acumulado = 0;



    for (
        let i = 0;
        i < viajes.length;
        i++
    ) {


        if (
            viajes[i].value !== "" &&
            premios[i].value !== ""
        ) {


            let cantidadViajes =
                Number(
                    viajes[i].value
                );


            let cantidadPremio =
                Number(
                    premios[i].value
                );


            if (
                cantidadViajes <= 0
            ) {

                continue;

            }


            acumulado +=
                cantidadViajes;



            etapas.push({

                viajes:
                    cantidadViajes,

                objetivo:
                    acumulado,

                premio:
                    cantidadPremio

            });

        }

    }



    if (
        etapas.length === 0
    ) {

        alert(
            "Cargá al menos una etapa"
        );

        return;

    }



    let nuevo = {


        nombre:

            editando === null

            ?

            "Desafío " +
            (desafios.length + 1)

            :

            desafios[editando].nombre,



        inicio:

            document.getElementById(
                "horaInicio"
            ).value,



        fin:

            document.getElementById(
                "horaFin"
            ).value,



        etapas:
            etapas,



        realizados:

            editando === null

            ?

            0

            :

            desafios[editando]
            .realizados

    };



    if (
        editando === null
    ) {

        desafios.push(
            nuevo
        );

    }

    else {

        desafios[editando] =
            nuevo;

    }



    // GUARDAMOS

    const guardado =
        guardarDatos();


    // Si se guardó correctamente,
    // actualizamos la pantalla.

    if (guardado) {

        mostrar();

        modal.classList.add(
            "oculto"
        );

        console.log(
            "✅ Desafío guardado"
        );

    }

});



// ===============================
// EDITAR
// ===============================

function editar(i) {


    editando = i;



    document.getElementById(
        "horaInicio"
    ).value =
        desafios[i].inicio;



    document.getElementById(
        "horaFin"
    ).value =
        desafios[i].fin;



    listaEtapas.innerHTML = "";



    desafios[i].etapas.forEach(
        (e, index) => {


        listaEtapas.innerHTML += `

            <div class="etapa">


                <h4>
                    Etapa ${index + 1}
                </h4>


                <div class="fila">


                    <div class="campo">

                        <label>
                            🚗 Viajes
                        </label>


                        <input
                            class="viajesEtapa"
                            type="number"
                            min="1"
                            value="${e.viajes}">

                    </div>



                    <div class="campo">

                        <label>
                            💰 Premio
                        </label>


                        <input
                            class="premioEtapa"
                            type="number"
                            min="0"
                            value="${e.premio}">

                    </div>


                </div>

            </div>

        `;

    });



    modal.classList.remove(
        "oculto"
    );

}



// ===============================
// BORRAR
// ===============================

function borrar(i) {


    if (
        !confirm(
            "¿Querés eliminar este desafío?"
        )
    ) {

        return;

    }


    desafios.splice(
        i,
        1
    );


    guardarDatos();


    mostrar();

}



// ===============================
// INICIO
// ===============================

mostrar();


// Comprobación en consola
console.log(
    "🚗 Bonus Go iniciado"
);

console.log(
    "Desafíos cargados:",
    desafios.length
);