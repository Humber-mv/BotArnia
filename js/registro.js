const checkPlaga = document.getElementById("plaga")
const plagaFields = document.getElementById("plaga-fields")
const nombre = document.getElementById("nombre")
const error = document.getElementById("nombre-error")
const botonRegistrar = document.querySelector(".registrar")

const tipoPlaga = document.getElementById("tipo-plaga")
const tipoPlagaError = document.getElementById("tipoPlaga-error")
const fecha = document.getElementById("fecha")
const categoriaError = document.getElementById("categoria-error")
const categoria = document.getElementById("categoria")
const frecuenciaRiego = document.getElementById("frecuencia-riego")
const frecuenciRiegoError = document.getElementById("frecuenciaRiego-error")



checkPlaga.addEventListener("change",()=>{
    if(checkPlaga.checked){
        plagaFields.classList.add("visible")
    }
    else{
        plagaFields.classList.remove("visible")
    }
});

nombre.addEventListener("input",()=>{
    if(nombre.value.length<=2){
        error.textContent = "Debe tener al menos 3 caracteres"
        error.classList.add("error")
        nombre.style.borderColor = "red"

        botonRegistrar.classList.add("boton-registrar-error")
        botonRegistrar.disabled = true;
    }
    else{
        error.textContent = ""
        error.classList.remove("error")
        nombre.style.borderColor = "#91ff3d"

        botonRegistrar.classList.remove("boton-registrar-error")
        botonRegistrar.disabled = false
    }
})




categoria.addEventListener("change", () => {
    if (categoria.value === "") {
        categoriaError.textContent = "Debe seleccionar una categoría";
        categoriaError.classList.add("error");
        categoria.style.borderColor = "red"
    } else {
        categoriaError.textContent = "";
        categoriaError.classList.remove("error");
        categoria.classList.remove("input-error");
        categoria.style.borderColor = "#91ff3d" 
    }
});

frecuenciaRiego.addEventListener("change", () => {
    if (frecuenciaRiego.value === "") {
        frecuenciRiegoError.textContent = "Debe seleccionar una frecuencia de riego";
        frecuenciRiegoError.classList.add("error");
        frecuenciaRiego.style.borderColor = "red"
    } else {
        categoriaError.textContent = "";
        categoriaError.classList.remove("error");
        frecuenciaRiego.style.borderColor = "#91ff3d" 
    }
});

tipoPlaga.addEventListener("change", () => {
    if (tipoPlaga.value === "") {
        tipoPlagaError.textContent = "Debe seleccionar un tipo de plaga";
        tipoPlagaError.classList.add("error");
        tipoPlaga.style.borderColor = "red"
    } else {
        tipoPlagaError.textContent = "";
        tipoPlagaError.classList.remove("error");
        tipoPlaga.style.borderColor = "#91ff3d" 
    }
});

fecha.addEventListener("change", () => {
    if (!(fecha.value === "")) {
        fecha.style.borderColor = "#91ff3d"
    } 
});

