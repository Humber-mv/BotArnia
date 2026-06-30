// Variables globales de estado
let todosLosCultivos = [];
let diccionarioGlobal = {};
let texto = "";
let categoriaSeleccionada = "todas";
let estadoSeleccionado = "todos";

// Selectores DOM generales
const toastSuccess = document.querySelector(".toast-success");
const mensajeToast = document.querySelector(".toast-message");
const botonesCategoria = document.querySelectorAll(".btn-categoria");
const botonesEstado = document.querySelectorAll(".btn-estado");
const botonLimpiar = document.querySelector(".btn-limpiar-filtro");
const filtroBusqueda = document.getElementById("search-cultivo");

// Selectores de botones de filtro específicos
const todosCategoria = document.querySelector(".all-category");
const vegetalesCategoria = document.querySelector(".vegetable");
const frutasCategoria = document.querySelector(".fruits");
const hierbasCategoria = document.querySelector(".herbs");
const cerealesCategoria = document.querySelector(".cereals");
const ornamentalesCategoria = document.querySelector(".ornamentals");

const todosEstado = document.querySelector(".all-state");
const saludableEstado = document.querySelector(".healthy");
const atencionEstado = document.querySelector(".attention");
const riesgoEstado = document.querySelector(".risk");


function quitarBordeCategoria() {
    botonesCategoria.forEach(boton => {
        boton.classList.remove("click-boton");
    });
}

function quitarBordeEstado() {
    botonesEstado.forEach(boton => {
        boton.classList.remove("click-boton");
        boton.classList.remove("click-boton-healthy");
        boton.classList.remove("click-boton-attention");
        boton.classList.remove("click-boton-risk");
    });
}

function aplicarFiltros() {
    const nuevoArreglo = todosLosCultivos.filter(cultivo => {
        const nombreCultivo = cultivo.nombre.toLowerCase();
        const cumpleTexto = nombreCultivo.startsWith(texto);
        const cumpleCategoria = categoriaSeleccionada === "todas" || cultivo.categoria === categoriaSeleccionada;
        const cumpleEstado = estadoSeleccionado === "todos" || calcularEstado(cultivo) === estadoSeleccionado;

        return cumpleTexto && cumpleCategoria && cumpleEstado;
    });
    reenderizarCultivos(nuevoArreglo, diccionarioGlobal);
}

function seleccionarCategoria(valor, boton) {
    categoriaSeleccionada = valor;
    quitarBordeCategoria();
    if (boton) {
        boton.classList.add("click-boton");
    }
    aplicarFiltros();
}

function seleccionarEstado(valor, boton) {
    estadoSeleccionado = valor;
    quitarBordeEstado();
    
    if (boton) {
        if (valor === "saludable") {
            boton.classList.add("click-boton-healthy");
        } else if (valor === "atencion") {
            boton.classList.add("click-boton-attention");
        } else if (valor === "riesgo") {
            boton.classList.add("click-boton-risk");
        } else {
            boton.classList.add("click-boton");
        }
    }
    aplicarFiltros();
}

function limpiarFiltros() {
    if (filtroBusqueda) {
        filtroBusqueda.value = "";
    }
    texto = "";

    if (todosCategoria) {
        seleccionarCategoria("todas", todosCategoria);
    }
    if (todosEstado) {
        seleccionarEstado("todos", todosEstado);
    }
}

function crearTarjetaCultivo(cultivo, diccionario) {
    const info = diccionario.cultivos[cultivo.nombre.toLowerCase()] ||
    diccionario.categorias[cultivo.categoria.toLowerCase()];

    const estado = calcularEstado(cultivo);
    const reqRiego = requiereRiego(cultivo);
    const reqCosecha = requiereCosecha(cultivo, diccionario);
    let ultimaFechaCosecha = cultivo.ultimaFechaCosecha || "No se ha cosechado";

    const tarjeta = document.createElement("article");
    tarjeta.classList.add("cultivo-card");

    tarjeta.innerHTML = /* html */ `
        <div class="card-inner">
            <div class="card-front">
                <div class="card-image">
                    <img src="${info.imagen}" alt="${cultivo.nombre}">
                    <span class="badge badge-${estado}">${formatearEstado(estado)}</span>
                    <div class="alert-icons">
                        ${reqRiego ? '<span class="alert-icon alert-riego" title="Necesita riego"><i class="fa-solid fa-droplet"></i></span>' : ''}
                        ${reqCosecha ? '<span class="alert-icon alert-cosecha" title="Listo para cosechar"><i class="fa-solid fa-wheat-awn"></i></span>' : ''}
                    </div>
                </div>
                <h3>${cultivo.nombre}</h3>
                <p>${cultivo.categoria}</p>
                <div class="data">
                    <p><i class="fa-solid fa-calendar"></i> Siembra: ${cultivo.fechaSiembra}</p>
                    <p><i class="fa-solid fa-droplet"></i> Riego: ${cultivo.frecuenciaRiego}</p>
                    <p><i class="fa-solid fa-clock"></i> Último riego: ${cultivo.ultimaFechaRiego}</p>
                    <p><i class="fa-solid fa-clock"></i> Última cosecha: ${ultimaFechaCosecha}</p>
                </div>
                <div class="actions">
                    <button class="btn-riego">Regar</button>
                    <button class="btn-cosecha">Cosechar</button>
                    <button class="btn-eliminar">Eliminar</button>
                    <button class="btn-detalle">Detalle</button>
                </div>
            </div>

            <div class="card-back">
                <h3>${cultivo.nombre}</h3>
                <p class="back-descripcion">${info.descripcion}</p>
                <div class="back-motivo">
                    <h4>¿Por qué está en este estado?</h4>
                    <p>${generarMotivoEstado(cultivo, estado)}</p>
                </div>
                ${reqCosecha ? `
                <div class="back-cosecha-alert">
                    <i class="fa-solid fa-wheat-awn"></i>
                    <span>Este cultivo necesita ser cosechado</span>
                </div>
                ` : ''}
                <button class="btn-volver">Volver</button>
            </div>
        </div>
    `;

    tarjeta.querySelector(".btn-riego").addEventListener("click", () => {
        marcarComoRegado(cultivo.id);
        mostrarToast("Cultivo regado");
    });
    
    tarjeta.querySelector(".btn-cosecha").addEventListener("click", () => {
        marcarComoCosechado(cultivo.id);
        mostrarToast("Cultivo cosechado");
    });

    tarjeta.querySelector(".btn-eliminar").addEventListener("click", () => {
        eliminarCultivo(cultivo.id);
        mostrarToast("Cultivo eliminado");
    });

    tarjeta.querySelector(".btn-detalle").addEventListener("click", () => {
        tarjeta.classList.add("flipped");
    });
    
    tarjeta.querySelector(".btn-volver").addEventListener("click", () => {
        tarjeta.classList.remove("flipped");
    });
    
    return tarjeta;
}

function generarMotivoEstado(cultivo, estado) {
    if (cultivo.tienePlaga) {
        return `Este cultivo tiene plaga activa (${cultivo.tipoPlaga}). ${cultivo.observaciones || ''}`;
    }

    const hoy = new Date();
    const ultimoRiego = new Date(cultivo.ultimaFechaRiego);
    const diasSinRiego = Math.floor((hoy - ultimoRiego) / (1000 * 60 * 60 * 24));

    if (estado === "riesgo") {
        return `Lleva ${diasSinRiego} días sin riego, muy por encima de lo recomendado.`;
    }
    if (estado === "atencion") {
        return `Lleva ${diasSinRiego} días sin riego, ya se pasó del tiempo ideal.`;
    }
    return "El cultivo está al día con su riego y sin problemas detectados.";
}

function mostrarToast(mensaje) {
    toastSuccess.classList.add("toast-visible");
    mensajeToast.textContent = mensaje;
    setTimeout(() => {
        toastSuccess.classList.remove("toast-visible");
    }, 2000);
}

function reenderizarCultivos(listaCultivos, diccionario) {
    const contenedor = document.querySelector(".cultivos-list");
    const mensajeVacio = document.querySelector(".no-results-message");
    
    contenedor.querySelectorAll(".cultivo-card").forEach(card => card.remove());

    if (listaCultivos.length === 0) {
        mensajeVacio.classList.add("visible");
        return;
    }

    mensajeVacio.classList.remove("visible");

    listaCultivos.forEach(cultivo => {
        const tarjeta = crearTarjetaCultivo(cultivo, diccionario);
        contenedor.appendChild(tarjeta);
    });
}

async function cargarCultivos() {
    try {
        const resCultivos = await fetch('data/cultivos.json');
        if (!resCultivos.ok) throw new Error('No se pudo cargar cultivos.json');
        const cultivosJSON = await resCultivos.json();

        const resDiccionario = await fetch('data/diccionario.json');
        if (!resDiccionario.ok) throw new Error('No se pudo cargar diccionario.json');
        diccionarioGlobal = await resDiccionario.json();

        const cultivosLocal = JSON.parse(localStorage.getItem('cultivos')) || [];
        todosLosCultivos = combinarCultivos(cultivosJSON, cultivosLocal);

        reenderizarCultivos(todosLosCultivos, diccionarioGlobal);
    } catch (error) {
        console.error('Error al cargar los cultivos:', error);
        const contenedor = document.querySelector('.cultivos-list');
        contenedor.innerHTML = `
            <div class="no-results">
                <h3>Ocurrió un error</h3>
                <p>No se pudieron cargar los cultivos. Verificá tu conexión o recargá la página.</p>
            </div>
        `;
    }
}


function busquedaCultivos() {
    quitarBordeCategoria();
    quitarBordeEstado();
    
    if (todosCategoria) {
        todosCategoria.classList.add("click-boton");
    }
    if (todosEstado) {
        todosEstado.classList.add("click-boton");
    }

    if (filtroBusqueda) {
        filtroBusqueda.addEventListener("input", () => {
            texto = filtroBusqueda.value.toLowerCase().trim();
            aplicarFiltros();
        });
    }

    if (vegetalesCategoria) {
        vegetalesCategoria.addEventListener("click", () => seleccionarCategoria("vegetal", vegetalesCategoria));
    }
    if (frutasCategoria) {
        frutasCategoria.addEventListener("click", () => seleccionarCategoria("frutal", frutasCategoria));
    }
    if (hierbasCategoria) {
        hierbasCategoria.addEventListener("click", () => seleccionarCategoria("hierba", hierbasCategoria));
    }
    if (cerealesCategoria) {
        cerealesCategoria.addEventListener("click", () => seleccionarCategoria("cereal", cerealesCategoria));
    }
    if (ornamentalesCategoria) {
        ornamentalesCategoria.addEventListener("click", () => seleccionarCategoria("ornamental", ornamentalesCategoria));
    }
    if (todosCategoria) {
        todosCategoria.addEventListener("click", () => seleccionarCategoria("todas", todosCategoria));
    }

    if (saludableEstado) {
        saludableEstado.addEventListener("click", () => seleccionarEstado("saludable", saludableEstado));
    }
    if (atencionEstado) {
        atencionEstado.addEventListener("click", () => seleccionarEstado("atencion", atencionEstado));
    }
    if (riesgoEstado) {
        riesgoEstado.addEventListener("click", () => seleccionarEstado("riesgo", riesgoEstado));
    }
    if (todosEstado) {
        todosEstado.addEventListener("click", () => seleccionarEstado("todos", todosEstado));
    }
}

function formatearEstado(estado) {
    const textos = {
        saludable: "Saludable",
        atencion: "Necesita atención",
        riesgo: "En riesgo"
    };
    return textos[estado] || estado;
}

function eliminarCultivo(id) {
    todosLosCultivos = todosLosCultivos.filter(cultivo => cultivo.id !== id);
    let cultivosLocal = JSON.parse(localStorage.getItem("cultivos")) || [];
    cultivosLocal = cultivosLocal.filter(cultivo => cultivo.id !== id);

    localStorage.setItem("cultivos", JSON.stringify(cultivosLocal));
    reenderizarCultivos(todosLosCultivos, diccionarioGlobal);
}

if (botonLimpiar) {
    botonLimpiar.addEventListener("click", limpiarFiltros);
}
busquedaCultivos();
cargarCultivos();
