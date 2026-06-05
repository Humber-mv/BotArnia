
async function cargarNav() {
    const res = await fetch('components/nav.html');
    const html = await res.text();
    document.getElementById('nav-container').innerHTML = html;

    // Marcar página activa
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
}

async function cargarFooter() {
    const res = await fetch('components/footer.html');
    const html = await res.text();
    document.getElementById('footer-container').innerHTML = html;
}

cargarNav();
cargarFooter();
