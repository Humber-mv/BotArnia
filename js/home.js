// Cargar cultivos
const resCultivos = await fetch("data/cultivos.json");
const cultivosJSON = await resCultivos.json();

const cultivosLocal = JSON.parse(localStorage.getItem("cultivos")) || [];

const todosLosCultivos = combinarCultivos(cultivosJSON, cultivosLocal);   

// Contadores
let contadorSaludables = 0;
let contadorAtencion = 0;
let contadorRiesgo = 0;

todosLosCultivos.forEach(cultivo => {
    const estado = calcularEstado(cultivo); 

    if (calcularEstado(cultivo) === "saludable") {
        contadorSaludables++;
    }
    else if (calcularEstado(cultivo) === "atencion") {
        contadorAtencion++;
    }
    else if (calcularEstado(cultivo) === "riesgo") {
        contadorRiesgo++;
    }
});

// Actualizar spans
document.getElementById("healthy-total").textContent =
    contadorSaludables;

document.getElementById("attention-total").textContent =
    contadorAtencion;

document.getElementById("risk-total").textContent =
    contadorRiesgo;

document.getElementById("crops-total").textContent =
    todosLosCultivos.length ;



//Script para el círculo del stat
const circulo = document.querySelector('.circulo-progreso');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            circulo.classList.add('animado');
        }
    });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.problems-stat'));

function combinarCultivos(cultivosJSON, cultivosLocal) {
    const idsEnLocal = cultivosLocal.map(c => c.id);

    const cultivosJSONFiltrados =
        cultivosJSON.filter(
            c => !idsEnLocal.includes(c.id)
        );

    return [
        ...cultivosJSONFiltrados,
        ...cultivosLocal
    ];
}
