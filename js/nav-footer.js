async function cargarNav() {
    const res = await fetch('components/nav.html');
    const html = await res.text();
    document.getElementById('nav-container').innerHTML = html;

    const pagina = window.location.pathname.split("/").pop();

    const ubicacion = document.getElementById("current-location");

    if (pagina === "mis-cultivos.html") {
        ubicacion.textContent = "Mis cultivos";
    }
    else if (pagina === "registrar-cultivo.html") {
        ubicacion.textContent = "Registrar cultivo";
    }
    else {
        ubicacion.textContent = "Inicio";
    }
    
    // Configuración del menú hamburguesa una vez que el HTML del navbar se ha insertado en el DOM
    const boton = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    if (boton && links) {
        boton.addEventListener("click", () => {
            links.classList.toggle("activo");
        });
    }
}

async function cargarFooter() {
    const res = await fetch('components/footer.html');
    const html = await res.text();
    document.getElementById('footer-container').innerHTML = html;
}

cargarNav();
cargarFooter();
