


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




// Constantes para los roles
const ROLES = {
    USUARIO: 'usuario',
    PACIENTE: 'paciente',
    PROFESIONAL: 'profesional'
  };
  
  // Base de datos simulada de carnets profesionales autorizados
  // En un entorno real, esto sería una tabla en una base de datos segura
  const carnetsProfesionalesAutorizados = [
    { id: 'PSI12345', email: 'doctor@ejemplo.com', especialidad: 'Psiquiatría' },
    { id: 'PSI67890', email: 'psicologo@ejemplo.com', especialidad: 'Psicología Clínica' },
    { id: 'PSI24680', email: 'terapeuta@ejemplo.com', especialidad: 'Terapia Familiar' }
    // Aquí se añadirían más carnets autorizados
  ];
  
  // Base de datos simulada para usuarios registrados
  let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
  
  // Función para mostrar mensajes al usuario
  function mostrarMensaje(mensaje, tipo = 'info') {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `alert alert-${tipo} mt-3`;
    mensajeDiv.textContent = mensaje;
    
    // Encontrar el contenedor adecuado para el mensaje
    const form = document.getElementById('registerForm') || document.getElementById('loginForm');
    if (form) {
      form.parentNode.insertBefore(mensajeDiv, form.nextSibling);
    } else {
      // Si no hay formulario, añadirlo al final del cuerpo
      document.body.appendChild(mensajeDiv);
    }
    
    // Autodestruir el mensaje después de 5 segundos
    setTimeout(() => mensajeDiv.remove(), 5000);
  }
  
  // Función para validar el formulario de registro
  function validarFormulario() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const sexo = document.getElementById('sexo').value;
    const edad = document.getElementById('edad').value;
    const role = document.getElementById('role').value;
    
    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarMensaje('Por favor, introduce un correo electrónico válido', 'danger');
      return false;
    }
    
    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'danger');
      return false;
    }
    
    // Validar edad
    if (edad < 18) {
      mostrarMensaje('Debes ser mayor de 18 años para registrarte', 'danger');
      return false;
    }
    
    return true;
  }
  
  // Función para verificar si un carnet profesional está autorizado
  function verificarCarnetProfesional(idCarnet) {
    return carnetsProfesionalesAutorizados.some(carnet => carnet.id === idCarnet);
  }
  
  // Función para verificar si un email coincide con un carnet profesional
  function verificarEmailProfesional(email, idCarnet) {
    const carnet = carnetsProfesionalesAutorizados.find(c => c.id === idCarnet);
    return carnet && carnet.email === email;
  }
  
  // Función para mostrar campos específicos de profesional
  function mostrarCamposProfesional() {
    const role = document.getElementById('role').value;
    
    // Buscar si ya existe un campo de carnet profesional
    let carnetDiv = document.getElementById('carnetDiv');
    
    // Si el rol es profesional y no existe el campo, crearlo
    if (role === ROLES.PROFESIONAL) {
      if (!carnetDiv) {
        carnetDiv = document.createElement('div');
        carnetDiv.className = 'mb-3';
        carnetDiv.id = 'carnetDiv';
        
        carnetDiv.innerHTML = `
          <label for="idCarnet" class="form-label">ID del Carnet Profesional:</label>
          <input type="text" class="form-control" id="idCarnet" required>
          <small class="form-text text-muted">Introduce el ID de tu carnet profesional para verificación.</small>
          
          <div class="mb-3 mt-3">
            <label for="especialidad" class="form-label">Especialidad:</label>
            <select class="form-control" id="especialidad" required>
              <option value="" disabled selected>Selecciona tu especialidad</option>
              <option value="psiquiatria">Psiquiatría</option>
              <option value="psicologia_clinica">Psicología Clínica</option>
              <option value="terapia_familiar">Terapia Familiar</option>
              <option value="neuropsicologia">Neuropsicología</option>
              <option value="otra">Otra</option>
            </select>
          </div>
        `;
        
        // Insertar antes del botón de submit
        const submitBtn = document.querySelector('button[type="submit"]').parentNode;
        submitBtn.parentNode.insertBefore(carnetDiv, submitBtn);
      }
    } else {
      // Si el rol no es profesional pero existe el campo, eliminarlo
      if (carnetDiv) {
        carnetDiv.remove();
      }
    }
  }
  
  // Función principal de registro
  function register(event) {
    event.preventDefault();
    
    if (!validarFormulario()) {
      return false;
    }
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const sexo = document.getElementById('sexo').value;
    const edad = document.getElementById('edad').value;
    const role = document.getElementById('role').value;
    
    // Verificar si el usuario ya existe
    if (usuariosRegistrados.some(user => user.email === email)) {
      mostrarMensaje('Este correo electrónico ya está registrado', 'warning');
      return false;
    }
    
    // Procesamiento específico para profesionales
    if (role === ROLES.PROFESIONAL) {
      const idCarnet = document.getElementById('idCarnet').value.trim();
      const especialidad = document.getElementById('especialidad').value;
      
      if (!idCarnet) {
        mostrarMensaje('Por favor, introduce el ID de tu carnet profesional', 'danger');
        return false;
      }
      
      // Verificar que el carnet profesional exista en la base de datos autorizada
      if (!verificarCarnetProfesional(idCarnet)) {
        mostrarMensaje('El ID del carnet profesional no está registrado en nuestra base de datos', 'danger');
        return false;
      }
      
      // Verificar que el email coincida con el registrado para ese carnet
      if (!verificarEmailProfesional(email, idCarnet)) {
        mostrarMensaje('El correo electrónico no coincide con el registrado para este carnet profesional', 'danger');
        return false;
      }
      
      // Si pasa todas las verificaciones, registrar al profesional
      const nuevoProfesional = {
        email,
        password, // En un entorno real, esto debe estar encriptado
        sexo,
        edad: parseInt(edad),
        role,
        idCarnet, 
        especialidad,
        fechaRegistro: new Date().toISOString()
      };
      
      // Guardar en almacenamiento local (simulación)
      usuariosRegistrados.push(nuevoProfesional);
      localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));
      
      // Mostrar mensaje de éxito
      mostrarMensaje('¡Registro exitoso! Redirigiendo...', 'success');
      
      // Redirigir a la página de profesionales
      setTimeout(() => {
        window.location.href = "profesional_dashboard.html";
      }, 2000);
      
      return false;
    }
    
    // Para usuarios que no son profesionales, proceso normal
    const nuevoUsuario = {
      email,
      password, // En un entorno real, esto debe estar encriptado
      sexo,
      edad: parseInt(edad),
      role,
      fechaRegistro: new Date().toISOString()
    };
    
    // Guardar en almacenamiento local (simulación)
    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));
    
    // Mostrar mensaje de éxito
    mostrarMensaje('¡Registro exitoso! Redirigiendo...', 'success');
    
    // Redirigir según el rol
    setTimeout(() => {
      switch(role) {
        case ROLES.USUARIO:
          window.location.href = "usuario_dashboard.html";
          break;
        case ROLES.PACIENTE:
          window.location.href = "paciente_dashboard.html";
          break;
        default:
          window.location.href = "ingreso.html";
      }
    }, 2000);
    
    return false;
  }
  
  // Función para iniciar sesión
  function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Obtener usuarios registrados
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Buscar al usuario
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (!usuario) {
      mostrarMensaje('Correo electrónico o contraseña incorrectos', 'danger');
      return false;
    }
    
    // Verificación específica para profesionales
    if (usuario.role === ROLES.PROFESIONAL) {
      const idCarnet = document.getElementById('loginIdCarnet')?.value;
      
      if (!idCarnet) {
        mostrarMensaje('Por favor, introduce el ID de tu carnet profesional', 'danger');
        return false;
      }
      
      // Verificar que el ID del carnet coincida con el registrado
      if (usuario.idCarnet !== idCarnet) {
        mostrarMensaje('El ID del carnet profesional es incorrecto', 'danger');
        return false;
      }
      
      // Verificar que el carnet siga siendo válido en la base de datos actual
      if (!verificarCarnetProfesional(idCarnet)) {
        mostrarMensaje('Tu carnet profesional ya no es válido. Contacta con administración', 'danger');
        return false;
      }
    }
    
    // Guardar sesión actual
    localStorage.setItem('usuarioActual', JSON.stringify({
      email: usuario.email,
      role: usuario.role
    }));
    
    // Redirigir según el rol
    setTimeout(() => {
      switch(usuario.role) {
        case ROLES.USUARIO:
          window.location.href = "usuario_dashboard.html";
          break;
        case ROLES.PACIENTE:
          window.location.href = "paciente_dashboard.html";
          break;
        case ROLES.PROFESIONAL:
          window.location.href = "profesional_dashboard.html";
          break;
        default:
          window.location.href = "index.html";
      }
    }, 1000);
    
    return false;
  }
  
  // Función para mostrar el campo de carnet profesional en el login
  function mostrarCampoCarnetLogin() {
    // Este código se ejecutaría en la página de login
    // Buscar si existe un checkbox para indicar que es un profesional
    const esProfesionalCheck = document.getElementById('esProfesional');
    
    if (esProfesionalCheck) {
      const loginCarnetDiv = document.getElementById('loginCarnetDiv');
      
      if (esProfesionalCheck.checked) {
        if (!loginCarnetDiv) {
          const carnetContainer = document.createElement('div');
          carnetContainer.className = 'mb-3';
          carnetContainer.id = 'loginCarnetDiv';
          carnetContainer.innerHTML = `
            <label for="loginIdCarnet" class="form-label">ID del Carnet Profesional:</label>
            <input type="text" class="form-control" id="loginIdCarnet" required>
          `;
          
          // Insertar antes del botón de submit
          const submitBtn = document.querySelector('#loginForm button[type="submit"]').parentNode;
          submitBtn.parentNode.insertBefore(carnetContainer, submitBtn);
        }
      } else if (loginCarnetDiv) {
        loginCarnetDiv.remove();
      }
    }
  }
  
  // Inicialización cuando se carga el DOM
  document.addEventListener('DOMContentLoaded', function() {
    // Configuración para la página de registro
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
      roleSelect.addEventListener('change', mostrarCamposProfesional);
      // Ejecutar una vez al cargar la página para configurar correctamente
      mostrarCamposProfesional();
    }
    
    // Inicialización del formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', register);
    }
    
    // Inicialización para la página de login
    const esProfesionalCheck = document.getElementById('esProfesional');
    if (esProfesionalCheck) {
      esProfesionalCheck.addEventListener('change', mostrarCampoCarnetLogin);
      // Configurar inicialmente
      mostrarCampoCarnetLogin();
    }
    
    // Inicialización del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', login);
    }
  });
  
  // Código para la página de ingreso (login)
  // Este código crea dinámicamente el formulario de login si no está presente en el HTML
  
  function crearFormularioLogin() {
    const container = document.querySelector('.container .row .col-md-6 .card .card-body');
    
    if (container && !document.getElementById('loginForm')) {
      const loginFormHTML = `
        <h2 class="text-center mb-4">Iniciar Sesión</h2>
        <form id="loginForm" onsubmit="return login(event)">
          <div class="mb-3">
            <label for="loginEmail" class="form-label">Correo electrónico:</label>
            <input type="email" class="form-control" id="loginEmail" required>
          </div>
          <div class="mb-3">
            <label for="loginPassword" class="form-label">Contraseña:</label>
            <input type="password" class="form-control" id="loginPassword" required>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="esProfesional">
            <label class="form-check-label" for="esProfesional">Soy un profesional</label>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">Ingresar</button>
          </div>
        </form>
        <div class="text-center mt-4">
          <p>¿No tienes cuenta? <a href="registro.html">Regístrate aquí</a></p>
        </div>
      `;
      
      container.innerHTML = loginFormHTML;
      
      // Añadir event listeners después de crear el formulario
      document.getElementById('esProfesional').addEventListener('change', mostrarCampoCarnetLogin);
      document.getElementById('loginForm').addEventListener('submit', login);
    }
  }
  
  // Ejecutar esta función si estamos en la página de login
  if (window.location.pathname.includes('ingreso.html')) {
    document.addEventListener('DOMContentLoaded', crearFormularioLogin);
  }



  