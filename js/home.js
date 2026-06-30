const circulo = document.querySelector('.circulo-progreso');
const problemStat = document.querySelector('.problems-stat');
const healthyTotal = document.getElementById("healthy-total");
const attentionTotal = document.getElementById("attention-total");
const riskTotal = document.getElementById("risk-total");
const cropsTotal = document.getElementById("crops-total");

let contadorSaludables = 0;
let contadorAtencion = 0;
let contadorRiesgo = 0;

const resCultivos = await fetch("data/cultivos.json");
const cultivosJSON = await resCultivos.json();
const cultivosLocal = JSON.parse(localStorage.getItem("cultivos")) || [];
const todosLosCultivos = combinarCultivos(cultivosJSON, cultivosLocal);   

todosLosCultivos.forEach(cultivo => {
    const estado = calcularEstado(cultivo); 

    if (estado === "saludable") {
        contadorSaludables++;
    }
    else if (estado === "atencion") {
        contadorAtencion++;
    }
    else if (estado === "riesgo") {
        contadorRiesgo++;
    }
});

if (healthyTotal) healthyTotal.textContent = contadorSaludables;
if (attentionTotal) attentionTotal.textContent = contadorAtencion;
if (riskTotal) riskTotal.textContent = contadorRiesgo;
if (cropsTotal) cropsTotal.textContent = todosLosCultivos.length;


/*Lógica js para la animación del círculo*/
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && circulo) {
            circulo.classList.add('animado');
        }
    });
}, { threshold: 0.5 });

if (problemStat) {
    observer.observe(problemStat);
}

/* Combina los cultivos precargados del JSON con los cultivos del localStorage*/
function combinarCultivos(cultivosJSON, cultivosLocal) {
    const idsEnLocal = cultivosLocal.map(c => c.id);
    const cultivosJSONFiltrados = cultivosJSON.filter(c => !idsEnLocal.includes(c.id));
    return [...cultivosJSONFiltrados, ...cultivosLocal];
}
