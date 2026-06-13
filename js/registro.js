const checkPlaga = document.getElementById("plaga")
const plagaFields = document.getElementById("plaga-fields")

checkPlaga.addEventListener("change",()=>{
    if(checkPlaga.checked){
        plagaFields.classList.add("visible")
    }
    else{
        plagaFields.classList.remove("visible")
    }
});