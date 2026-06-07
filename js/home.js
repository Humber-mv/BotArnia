//Animación css para el círculo del stat
const circulo = document.querySelector('.circulo-progreso');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            circulo.classList.add('animado');
        }
    });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.problems-stat'));