
let todosLosCultivos = [];
let diccionarioGlobal = {};


function crearTarjetaCultivo(cultivo, diccionario){

    const info = diccionario.cultivos[cultivo.nombre.toLowerCase()] ||
    diccionario.categorias[cultivo.categoria.toLowerCase()];

    const tarjeta = document.createElement("article")

    tarjeta.classList.add("cultivo-card")

    tarjeta.innerHTML = /* html */ 
    `
        <img src = "${info.imagen}" alt="${cultivo.nombre}">
        <h3>${cultivo.nombre}</h3>
        <p>${cultivo.categoria}</p>
        <div class="data">
            <p><i class="fa-solid fa-calendar"></i> Siembra: ${cultivo.fechaSiembra}</p>
            <p><i class="fa-solid fa-droplet"></i> Riego: ${cultivo.frecuenciaRiego}</p>
            <p><i class="fa-solid fa-clock"></i> Último riego: ${cultivo.ultimaFechaRiego}</p>
        </div>
        <div class="actions">
            <button class="btn-riego">Marcar como regado</button>
            <button class="btn-cosecha">Marcar como cosechado</button>
            <button class="btn-detalle">Detalle</button>
        </div>
    `;

    return tarjeta
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
        // Cargar cultivos precargados
        const resCultivos = await fetch('data/cultivos.json');
        if (!resCultivos.ok) throw new Error('No se pudo cargar cultivos.json');
        const cultivosJSON = await resCultivos.json();

        //Cargar diccionario
        const resDiccionario = await fetch('data/diccionario.json');
        if (!resDiccionario.ok) throw new Error('No se pudo cargar diccionario.json');
        diccionarioGlobal = await resDiccionario.json();

        //Cargar registros del usuario desde localStorage
        const cultivosLocal = JSON.parse(localStorage.getItem('cultivos')) || [];

        //Combinar ambas fuentes
        todosLosCultivos = [...cultivosJSON, ...cultivosLocal];

        //Renderizar en pantalla
        reenderizarCultivos(todosLosCultivos, diccionarioGlobal);

    } catch (error) {
        console.error('Error al cargar los cultivos:', error);
        
        const contenedor = document.querySelector('.cultivos-list');
        contenedor.innerHTML = /* html */ `
            <div class="no-results">
                <h3>Ocurrió un error</h3>
                <p>No se pudieron cargar los cultivos. Verificá tu conexión o recargá la página.</p>
            </div>
        `;
    }
}
cargarCultivos();



function busquedaCultivos() {
    const filtroBusqueda = document.getElementById("search-cultivo")
    const todosCategoria = document.querySelector(".all-category")
    const vegetalesCategoria = document.querySelector(".vegetable")
    const frutasCategoria = document.querySelector(".fruits")
    const hierbasCategoria = document.querySelector(".herbs")
    const cerealesCategoria = document.querySelector(".cereals")
    const ornamentalesCategoria = document.querySelector(".ornamentals")
    const todosEstado = document.querySelector(".all-state")
    const saludableEstado = document.querySelector(".healthy")
    const atencionEstado = document.querySelector(".attention")
    const riesgoEstado = document.querySelector(".risk")
    const botonesCategoria = document.querySelectorAll(".btn-categoria")
    const botonesEstado = document.querySelectorAll(".btn-estado")
    let texto = ""
    let categoriaSeleccionada = ""
    let estadoSeleccionado = ""

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
            const cumpleCategoria = categoriaSeleccionada === "" || cultivo.categoria === categoriaSeleccionada;
            const cumpleEstado = estadoSeleccionado === "" || cultivo.estado === estadoSeleccionado;

            return ( cumpleTexto && cumpleCategoria && cumpleEstado );
        });
        reenderizarCultivos(nuevoArreglo, diccionarioGlobal);
    }
    
    function seleccionarCategoria(valor, boton) {
        categoriaSeleccionada = valor;
        quitarBordeCategoria();
        boton.classList.add("click-boton");
        aplicarFiltros();
    }

    function seleccionarEstado(valor, boton) {
        estadoSeleccionado = valor;
        quitarBordeEstado()
        if(valor === "saludable"){ 
            boton.classList.add("click-boton-healthy"); 
        } 
        else if(valor === "atencion"){ 
            boton.classList.add("click-boton-attention"); 
        } 
        else if(valor === "riesgo"){ 
            boton.classList.add("click-boton-risk"); 
        } 
        else{ 
            boton.classList.add("click-boton"); 
        }
        aplicarFiltros();
    }

    filtroBusqueda.addEventListener("input", () => {
        texto = filtroBusqueda.value.toLowerCase().trim();
        aplicarFiltros();
    });

    vegetalesCategoria.addEventListener("click", () => {
        seleccionarCategoria("vegetal", vegetalesCategoria)
    });

    frutasCategoria.addEventListener("click", () => {
        seleccionarCategoria("frutal", frutasCategoria)
    });

    hierbasCategoria.addEventListener("click", () => {
        seleccionarCategoria("hierba", hierbasCategoria)
    });

    cerealesCategoria.addEventListener("click", () => {
        seleccionarCategoria("cereal", cerealesCategoria)
    });

    ornamentalesCategoria.addEventListener("click", () => {
        seleccionarCategoria("ornamental", ornamentalesCategoria)
    });

    todosCategoria.addEventListener("click", () => {
        seleccionarCategoria("", todosCategoria)
    });

    saludableEstado.addEventListener("click", () => {
        seleccionarEstado("saludable", saludableEstado)
    });

    atencionEstado.addEventListener("click", () => {
        seleccionarEstado("atencion", atencionEstado)
    });

    riesgoEstado.addEventListener("click", () => {
        seleccionarEstado("riesgo", riesgoEstado)
    });

    todosEstado.addEventListener("click", () => {
        seleccionarEstado("", todosEstado)
    });
}

busquedaCultivos()






