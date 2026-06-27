// Cargar cultivos
const resCultivos = await fetch("data/cultivos.json");
const cultivosJSON = await resCultivos.json();

const cultivosLocal =
    JSON.parse(localStorage.getItem("cultivos")) || [];

const todosLosCultivos = [
    ...cultivosJSON,
    ...cultivosLocal
];

// Contadores
let contadorSaludables = 0;
let contadorAtencion = 0;
let contadorRiesgo = 0;

todosLosCultivos.forEach(cultivo => {

    if (cultivo.estado === "saludable") {
        contadorSaludables++;
    }
    else if (cultivo.estado === "atencion") {
        contadorAtencion++;
    }
    else if (cultivo.estado === "riesgo") {
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


