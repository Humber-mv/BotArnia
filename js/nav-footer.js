
async function cargarNav() {
    const res = await fetch('components/nav.html');
    const html = await res.text();
    document.getElementById('nav-container').innerHTML = html;

    
}

async function cargarFooter() {
    const res = await fetch('components/footer.html');
    const html = await res.text();
    document.getElementById('footer-container').innerHTML = html;
}

cargarNav();
cargarFooter();
