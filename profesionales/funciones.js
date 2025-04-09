


//java para cerrar sección, para agregr pacinte, para colocar el nombre del profesional.


document.addEventListener("DOMContentLoaded", () => {
    const nombreUsuario = document.getElementById("nombreUsuario");
    const usuario = localStorage.getItem("usuario") || "Dr. Usuario";

    if (nombreUsuario) {
        nombreUsuario.textContent = usuario;
    }
});

function cerrarSesion() {
    localStorage.removeItem("usuario"); // Borra la información del usuario
    sessionStorage.removeItem("usuario"); // Borra en sesión si existe
    window.location.href = "../html/ingreso.html"; // Redirige a la página de inicio
}


// Asociar la función al botón de cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Evento para mostrar el modal
    document.getElementById("btnAgregarPaciente").addEventListener("click", function() {
        var modal = new bootstrap.Modal(document.getElementById("modalAgregarPaciente"));
        modal.show();
    });

    // Manejar el envío del formulario
    document.getElementById("formAgregarPaciente").addEventListener("submit", function(event) {
        event.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let edad = document.getElementById("edad").value;
        let genero = document.getElementById("genero").value;

        fetch("backend/api/agregar_paciente.php", {
            method: "POST",
            body: JSON.stringify({ nombre, edad, genero }),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                location.reload(); // Recargar la página si el paciente se guardó correctamente
            }
        })
        .catch(error => console.error("Error:", error));
    });
});


