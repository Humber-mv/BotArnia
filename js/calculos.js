function obtenerDiasFrecuencia(frecuencia) {
    const normalizado = frecuencia.replace(/-/g, ' ');
    const mapa = {
        "diario": 1,
        "cada 2 dias": 2,
        "cada 3 dias": 3,
        "semanal": 7,
        "quincenal": 15,
        "segun necesidad": 99
    };
    return mapa[normalizado] || 2;
}

function calcularEstado(cultivo) {
    if (cultivo.tienePlaga) {
        return "riesgo";
    }

    const hoy = new Date();
    const ultimoRiego = new Date(cultivo.ultimaFechaRiego);
    const diasSinRiego = Math.floor((hoy - ultimoRiego) / (1000 * 60 * 60 * 24));
    const diasFrecuencia = obtenerDiasFrecuencia(cultivo.frecuenciaRiego);

    if (diasSinRiego > diasFrecuencia * 2) {
        return "riesgo";
    }
    if (diasSinRiego > diasFrecuencia) {
        return "atencion";
    }
    return "saludable";
}

function obtenerFechaHoy() {
    return new Date().toISOString().split("T")[0];
}

function marcarComoRegado(idCultivo) {
    const cultivo = todosLosCultivos.find(c => c.id === idCultivo);
    if (!cultivo) return;

    cultivo.ultimaFechaRiego = obtenerFechaHoy();
    cultivo.tienePlaga = false;
    guardarCambioCultivo(cultivo);
}

function marcarComoCosechado(idCultivo) {
    const cultivo = todosLosCultivos.find(c => c.id === idCultivo);
    if (!cultivo) return;

    cultivo.ultimaFechaCosecha = obtenerFechaHoy();
    guardarCambioCultivo(cultivo);
}

function guardarCambioCultivo(cultivo) {
    let cultivosLocal = JSON.parse(localStorage.getItem("cultivos")) || [];
    const existe = cultivosLocal.find(c => c.id === cultivo.id);

    if (existe) {
        cultivosLocal = cultivosLocal.map(c => c.id === cultivo.id ? cultivo : c);
    } else {
        cultivosLocal.push(cultivo);
    }

    localStorage.setItem("cultivos", JSON.stringify(cultivosLocal));
    reenderizarCultivos(todosLosCultivos, diccionarioGlobal);
}

function combinarCultivos(cultivosJSON, cultivosLocal) {
    const idsEnLocal = cultivosLocal.map(c => c.id);
    const cultivosJSONFiltrados = cultivosJSON.filter(c => !idsEnLocal.includes(c.id));
    return [...cultivosJSONFiltrados, ...cultivosLocal];
}

function requiereRiego(cultivo) {
    const hoy = new Date();
    const ultimoRiego = new Date(cultivo.ultimaFechaRiego);
    const diasSinRiego = Math.floor((hoy - ultimoRiego) / (1000 * 60 * 60 * 24));
    const diasFrecuencia = obtenerDiasFrecuencia(cultivo.frecuenciaRiego);
    return diasSinRiego > diasFrecuencia;
}

function requiereCosecha(cultivo, diccionario) {
    if (!diccionario || !diccionario.cultivos) return false;

    const info = diccionario.cultivos[cultivo.nombre.toLowerCase()] ||  diccionario.categorias[cultivo.categoria.toLowerCase()];
    if (!info) return false;

    const hoy = new Date();
    const fechaSiembra = new Date(cultivo.fechaSiembra);
    const diasDesdeSiembra = Math.floor((hoy - fechaSiembra) / (1000 * 60 * 60 * 24));

    const diasMaduracion = info.diasMaduracion || 0;
    const cosechaRecurrente = info.cosechaRecurrente !== undefined ? info.cosechaRecurrente : info.cosechaConcurrente;
    const diasEntreCosechas = info.diasEntreCosechas || 0;

    if (diasDesdeSiembra < diasMaduracion) {
        return false;
    }

    if (cultivo.ultimaFechaCosecha && cultivo.ultimaFechaCosecha !== "No se ha cosechado") {
        if (!cosechaRecurrente) {
            return false;
        }
        const ultimaCosecha = new Date(cultivo.ultimaFechaCosecha);
        const diasDesdeUltimaCosecha = Math.floor((hoy - ultimaCosecha) / (1000 * 60 * 60 * 24));
        return diasDesdeUltimaCosecha >= diasEntreCosechas;
    }
    return true;
}