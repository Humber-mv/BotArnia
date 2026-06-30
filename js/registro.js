const formulario = document.querySelector(".crop-form");
const nombre = document.getElementById("nombre");
const categoria = document.getElementById("categoria");
const fecha = document.getElementById("fecha");
const frecuenciaRiego = document.getElementById("frecuencia-riego");
const tienePlaga = document.getElementById("plaga");
const tipoPlaga = document.getElementById("tipo-plaga");
const observaciones = document.getElementById("observaciones");
const plagaFields = document.getElementById("plaga-fields");

const error = document.getElementById("nombre-error");
const categoriaError = document.getElementById("categoria-error");
const frecuenciRiegoError = document.getElementById("frecuenciaRiego-error");
const tipoPlagaError = document.getElementById("tipoPlaga-error");

const botonRegistrar = document.querySelector(".registrar");
const toastSuccess = document.querySelector(".toast-success");
const mensajeToast = document.querySelector(".toast-message");
const vistaPrevia = document.querySelector(".crop-preview");

/* HTML para la vista previa de la tarjeta de cultivo*/
function generarVistaPrevia(cultivo) {
    let tienePlagaTexto = "No";
    let tipoPlagaTexto = "-----";
    let observacionesTexto = "-----";
    
    if (cultivo.tienePlaga) {
        tienePlagaTexto = "Sí";
        tipoPlagaTexto = cultivo.tipoPlaga || "-----";
        observacionesTexto = cultivo.observaciones || "-----";
    }

    vistaPrevia.innerHTML = /* html */ `
        <div class="preview-image">
            <img src="assets/images/plant.jpg" alt="Imagen ilustrativa de cultivo" />
        </div>
        <div class="preview-info">
            <h3>${cultivo.nombre}</h3>
            <div class="row-info">
                <div class="group-info">
                    <p>Categoría</p>
                    <h4>${cultivo.categoria}</h4>
                </div>
                <div class="group-info">
                    <p>Fecha de siembra</p>
                    <h4>${cultivo.fechaSiembra}</h4>
                </div>
            </div>
            <div class="row-info">
                <div class="group-info">
                    <p>Frecuencia de riego</p>
                    <h4>${formatearTexto(cultivo.frecuenciaRiego)}</h4>
                </div>
                <div class="group-info">
                    <p>¿Tiene plaga?</p>
                    <h4>${tienePlagaTexto}</h4>
                </div>
            </div>
            <div class="row-info">
                <div class="group-info">
                    <p>Tipo de plaga</p>
                    <h4>${tipoPlagaTexto}</h4>
                </div>
                <div class="group-info">
                    <p>Observaciones</p>
                    <h4>${observacionesTexto}</h4>
                </div>
            </div>
        </div>
    `;
}

/* Agarrar valores de los inputs del form y actualizar la vista previa. */
function actualizarVistaPrevia() {
    const cultivo = {
        nombre: nombre.value || "-----",
        categoria: categoria.value || "-----",
        fechaSiembra: fecha.value || "-----",
        frecuenciaRiego: frecuenciaRiego.value || "-----",
        tienePlaga: tienePlaga.checked,
        tipoPlaga: tipoPlaga.value || "-----",
        observaciones: observaciones.value || "-----"
    };
    generarVistaPrevia(cultivo);
}

function formatearTexto(valor) {
    if (valor === "-----") return valor;
    return valor.replaceAll("-", " ");
}

function mostrarToast(mensaje) {
    toastSuccess.classList.add("toast-visible");
    mensajeToast.textContent = mensaje;
    setTimeout(() => {
        toastSuccess.classList.remove("toast-visible");
    }, 2000);
}

// Listeners para la actualización en tiempo real de la vista previa
nombre.addEventListener("input", actualizarVistaPrevia);
categoria.addEventListener("change", actualizarVistaPrevia);
fecha.addEventListener("change", actualizarVistaPrevia);
frecuenciaRiego.addEventListener("change", actualizarVistaPrevia);
tipoPlaga.addEventListener("change", actualizarVistaPrevia);
observaciones.addEventListener("input", actualizarVistaPrevia);

// Listener para el despliegue del contendor de campos de plaga
tienePlaga.addEventListener("change", () => {
    actualizarVistaPrevia();
    if (tienePlaga.checked) {
        plagaFields.classList.add("visible");
        tipoPlaga.required = true;
    } else {
        plagaFields.classList.remove("visible");
        tipoPlaga.required = false;
    }
});

// Validaciones en tiempo real y formatos visuales de error
nombre.addEventListener("input", () => {
    if (nombre.value.length <= 2) {
        error.textContent = "Debe tener al menos 3 caracteres";
        error.classList.add("error");
        nombre.style.borderColor = "red";
        botonRegistrar.disabled = true;
        botonRegistrar.classList.add("boton-registrar-error");
    } else {
        error.textContent = "";
        error.classList.remove("error");
        nombre.style.borderColor = "#91ff3d";
        botonRegistrar.disabled = false;
        botonRegistrar.classList.remove("boton-registrar-error");
    }
});

categoria.addEventListener("change", () => {
    if (categoria.value === "") {
        categoriaError.textContent = "Debe seleccionar una categoría";
        categoriaError.classList.add("error");
        categoria.style.borderColor = "red";
    } else {
        categoriaError.textContent = "";
        categoriaError.classList.remove("error");
        categoria.classList.remove("input-error");
        categoria.style.borderColor = "#91ff3d";
    }
});

frecuenciaRiego.addEventListener("change", () => {
    if (frecuenciaRiego.value === "") {
        frecuenciRiegoError.textContent = "Debe seleccionar una frecuencia de riego";
        frecuenciRiegoError.classList.add("error");
        frecuenciaRiego.style.borderColor = "red";
    } else {
        frecuenciRiegoError.textContent = "";
        frecuenciRiegoError.classList.remove("error");
        frecuenciaRiego.style.borderColor = "#91ff3d";
    }
});

tipoPlaga.addEventListener("change", () => {
    if (tipoPlaga.value === "") {
        tipoPlagaError.textContent = "Debe seleccionar un tipo de plaga";
        tipoPlagaError.classList.add("error");
        tipoPlaga.style.borderColor = "red";
    } else {
        tipoPlagaError.textContent = "";
        tipoPlagaError.classList.remove("error");
        tipoPlaga.style.borderColor = "#91ff3d";
    }
});

fecha.addEventListener("change", () => {
    if (fecha.value !== "") {
        fecha.style.borderColor = "#91ff3d";
    }
});

// Procesamiento de envío y reinicio del formulario
formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    if (formulario.checkValidity()) {
        const nuevoCultivo = {
            id: Date.now(),
            nombre: nombre.value,
            categoria: categoria.value,
            fechaSiembra: fecha.value,
            frecuenciaRiego: formatearTexto(frecuenciaRiego.value),
            tienePlaga: tienePlaga.checked,
            tipoPlaga: tienePlaga.checked ? tipoPlaga.value : null,
            observaciones: tienePlaga.checked ? observaciones.value : null,
            activo: true,
            ultimaFechaRiego: fecha.value,
            ultimaFechaCosecha: null
        };

        const cultivosGuardados = JSON.parse(localStorage.getItem("cultivos")) || [];
        cultivosGuardados.push(nuevoCultivo);
        localStorage.setItem("cultivos", JSON.stringify(cultivosGuardados));

        mostrarToast("Cultivo registrado");
    }
});

formulario.addEventListener("reset", () => {
    mostrarToast("Formulario limpio");
    generarVistaPrevia({
        nombre: "-----",
        categoria: "-----",
        fechaSiembra: "-----",
        frecuenciaRiego: "-----",
        tienePlaga: false,
        tipoPlaga: "-----",
        observaciones: "-----"
    });
});
