function glitchAutoText() {
    let elements = document.querySelectorAll(".glitch");
    elements.forEach(function(e){
        e.setAttribute("data-text", e.innerHTML);
    })
}

glitchAutoText();