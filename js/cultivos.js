function crearTarjetaCultivo(cultivo, diccionario){

    const info = diccionario.cultivos[cultivo.nombre.toLowerCase()];

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

    contenedor.innerHTML = "";

    if (listaCultivos.length === 0) {
        contenedor.innerHTML = /* html */ `
            <div class="no-results">
                <h3>Sin resultados</h3>
                <p>Cambie los filtros para visualizar otros cultivos disponibles.</p>
            </div>
        `;
        return;
    }

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
        const diccionario = await resDiccionario.json();

        //Cargar registros del usuario desde localStorage
        const cultivosLocal = JSON.parse(localStorage.getItem('cultivos')) || [];

        //Combinar ambas fuentes
        const todosLosCultivos = [...cultivosJSON, ...cultivosLocal];

        //Renderizar en pantalla
        reenderizarCultivos(todosLosCultivos, diccionario);

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
