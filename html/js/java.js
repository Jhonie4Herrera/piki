
//java para el login

async function register(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
        const response = await fetch("http://psykinesis/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, rol: role })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            window.location.href = "..html/inicio.html"; // Redirige al login
        } else {
            alert("Error en el registro: " + (data.detail || "Verifica los datos ingresados."));
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        alert("Hubo un problema con el registro. Inténtalo más tarde.");
    }
}

// Script para registro de usuarios
async function register(event) {
    event.preventDefault();

    // Obtener todos los valores del formulario, incluyendo los nuevos campos
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const sexo = document.getElementById("sexo").value;
    const edad = document.getElementById("edad").value;
    const role = document.getElementById("role").value;

    try {
        const response = await fetch("http://localhost/psykinesis/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email, 
                password, 
                sexo, 
                edad, 
                rol: role 
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.success);
            window.location.href = "../html/inicio.html"; // Redirige al inicio
        } else {
            alert("Error en el registro: " + data.error);
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
        alert("Error de conexión con el servidor. Intente nuevamente más tarde.");
    }
}
