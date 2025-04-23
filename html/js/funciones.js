// java.js - Implementación de funciones para autenticación en PsycheKinesis
import { login as authLogin, register as authRegister } from './auth.js';

// Función para manejar el inicio de sesión
function login(event) {
  event.preventDefault();
  
  // Obtener valores del formulario
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Validar que los campos no estén vacíos
  if (!email || !password) {
    showAlert('Por favor, complete todos los campos', 'danger');
    return;
  }
  
  // Aquí deberíamos conectar con el backend
  // Simulación de autenticación para propósitos de demostración
  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }
    return response.json();
  })
  .then(data => {
    // Almacenar datos del usuario en localStorage para persistencia
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    
    // Redirigir según rol
    redirectByRole(data.user.rol, data.user.tipo_profesional);
  })
  .catch(error => {
    showAlert(error.message, 'danger');
  });
}

// Función para manejar el registro
function register(event) {
  event.preventDefault();
  
  // Obtener valores del formulario
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const nombre = document.getElementById('registerName').value;
  
  // Validar que los campos no estén vacíos
  if (!email || !password || !nombre) {
    showAlert('Por favor, complete todos los campos', 'danger');
    return;
  }
  
  // Datos del nuevo usuario (por defecto rol 'paciente')
  const userData = {
    email: email,
    nombre_c: nombre,
    rol: 'paciente',
    password: password,
    genero: null // Se actualizará más tarde con la información del perfil
  };
  
  // Enviar datos al servidor
  fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en el registro');
    }
    return response.json();
  })
  .then(data => {
    showAlert('Registro exitoso. Puede iniciar sesión ahora.', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  })
  .catch(error => {
    showAlert(error.message, 'danger');
  });
}

// Función para redirigir según el rol
function redirectByRole(rol, tipoProfesional) {
  switch(rol) {
    case 'admin':
      window.location.href = 'admin/dashboard.html';
      break;
    case 'profesional':
      // Si es psiquiatra, redirigir a su dashboard específico
      if (tipoProfesional === 'psiquiatra') {
        window.location.href = 'profesional/psiquiatra/dashboard.html';
      } else {
        // Para otros profesionales (psicólogos)
        window.location.href = 'profesional/dashboard.html';
      }
      break;
    case 'paciente':
      window.location.href = 'inicio.html';
      break;
    default:
      window.location.href = 'inicio.html';
  }
}

// Mostrar alertas al usuario
function showAlert(message, type) {
  // Crear elemento de alerta
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} mt-3`;
  alertDiv.setAttribute('role', 'alert');
  alertDiv.textContent = message;
  
  // Buscar el formulario y añadir la alerta después de él
  const form = document.querySelector('form');
  form.parentNode.insertBefore(alertDiv, form.nextSibling);
  
  // Eliminar la alerta después de 3 segundos
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// Función para proteger rutas según el rol del usuario
function checkAccess() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const token = localStorage.getItem('token');
  
  // Si no hay token o usuario, redirigir al login
  if (!token || !user.rol) {
    window.location.href = 'index.html';
    return;
  }
  
  // Verificar acceso según la página actual
  const currentPage = window.location.pathname;
  
  if (currentPage.includes('admin') && user.rol !== 'admin') {
    // Si intenta acceder a sección de admin sin serlo
    window.location.href = 'inicio.html';
  } else if (currentPage.includes('psiquiatra') && (user.rol !== 'profesional' || user.tipo_profesional !== 'psiquiatra')) {
    // Si intenta acceder a sección de psiquiatra sin serlo
    window.location.href = 'inicio.html';
  } else if (currentPage.includes('profesional') && user.rol !== 'profesional') {
    // Si intenta acceder a sección de profesional sin serlo
    window.location.href = 'inicio.html';
  }
}

// Configurar elementos UI según rol del usuario
function setupUI() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  // Elementos que solo deben ver los usuarios autenticados
  const authElements = document.querySelectorAll('.auth-only');
  // Elementos que solo deben ver los usuarios no autenticados
  const noAuthElements = document.querySelectorAll('.no-auth-only');
  // Elementos específicos por rol
  const adminElements = document.querySelectorAll('.admin-only');
  const profesionalElements = document.querySelectorAll('.profesional-only');
  const psiquiatraElements = document.querySelectorAll('.psiquiatra-only');
  const pacienteElements = document.querySelectorAll('.paciente-only');
  
  const isAuthenticated = !!localStorage.getItem('token');
  
  // Mostrar/ocultar elementos según autenticación
  authElements.forEach(el => el.style.display = isAuthenticated ? 'block' : 'none');
  noAuthElements.forEach(el => el.style.display = isAuthenticated ? 'none' : 'block');
  
  if (isAuthenticated) {
    // Mostrar/ocultar elementos según rol
    adminElements.forEach(el => el.style.display = user.rol === 'admin' ? 'block' : 'none');
    profesionalElements.forEach(el => el.style.display = user.rol === 'profesional' ? 'block' : 'none');
    psiquiatraElements.forEach(el => el.style.display = (user.rol === 'profesional' && user.tipo_profesional === 'psiquiatra') ? 'block' : 'none');
    pacienteElements.forEach(el => el.style.display = user.rol === 'paciente' ? 'block' : 'none');
    
    // Si hay un elemento con id 'userGreeting', mostrar saludo personalizado
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) {
      userGreeting.textContent = `Bienvenido, ${user.nombre_c || 'Usuario'}`;
    }
  }
}

// Inicializar cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
  // Configurar UI según rol
  setupUI();
  
  // Verificar acceso en páginas protegidas
  if (!window.location.pathname.includes('index.html') && 
      !window.location.pathname.includes('login.html')) {
    checkAccess();
  }
  
  // Agregar event listeners para formularios si existen
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', login);
  }
  
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', register);
  }
  
  // Agregar event listener para botón de logout si existe
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});

// Exportar funciones para uso en otros archivos
export {
  login,
  register,
  logout,
  checkAccess,
  setupUI
};