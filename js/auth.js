// auth.js - Sistema de autenticación con roles para PsycheKinesis

// Constantes para los tipos de roles
const ROLES = {
    ADMIN: 'admin',
    PSIQUIATRA: 'profesional', // En la base de datos se usa 'profesional' pero con tipo_profesional = 'psiquiatra'
    USUARIO: 'paciente' // En la base de datos los usuarios normales son 'paciente'
  };
  
  // Clase para manejar la autenticación y roles
  class AuthService {
    constructor() {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.authStateListeners = [];
      
      // Intentar recuperar la sesión del localStorage al iniciar
      this.loadUserFromStorage();
    }
    
    // Iniciar sesión
    async login(email, password) {
      try {
        // Realizar petición a la API para validar credenciales
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error de autenticación');
        }
        
        const userData = await response.json();
        
        // Guardar información del usuario en localStorage y en memoria
        this.setCurrentUser(userData);
        return userData;
      } catch (error) {
        console.error('Error de inicio de sesión:', error);
        throw error;
      }
    }
    
    // Cerrar sesión
    logout() {
      // Eliminar datos de sesión
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Actualizar estado
      this.currentUser = null;
      this.isAuthenticated = false;
      
      // Notificar a los listeners sobre el cambio
      this.notifyAuthStateChange();
      
      // Redireccionar a la página de inicio de sesión
      window.location.href = '/index.html';
    }
    
    // Registrar un nuevo usuario
    async register(userData) {
      try {
        // Por defecto, los nuevos usuarios son pacientes/usuarios normales
        const userToRegister = {
          ...userData,
          rol: ROLES.USUARIO
        };
        
        // Realizar petición a la API para crear nuevo usuario
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userToRegister)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error en el registro');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error durante el registro:', error);
        throw error;
      }
    }
    
    // Establecer usuario actual
    setCurrentUser(userData) {
      this.currentUser = userData;
      this.isAuthenticated = true;
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
      
      // Notificar a los listeners sobre el cambio
      this.notifyAuthStateChange();
    }
    
    // Cargar usuario desde localStorage si existe
    loadUserFromStorage() {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          const userData = JSON.parse(storedUser);
          this.currentUser = userData;
          this.isAuthenticated = true;
        } catch (e) {
          console.error('Error al cargar usuario desde localStorage:', e);
          this.logout();
        }
      }
    }
    
    // Verificar si el usuario actual tiene un rol específico
    hasRole(role) {
      return this.isAuthenticated && this.currentUser && this.currentUser.rol === role;
    }
    
    // Verificar si es usuario es administrador
    isAdmin() {
      return this.hasRole(ROLES.ADMIN);
    }
    
    // Verificar si el usuario es psiquiatra
    isPsiquiatra() {
      // Verifica el rol profesional y además que el tipo_profesional sea 'psiquiatra'
      return this.hasRole(ROLES.PSIQUIATRA) && 
             this.currentUser.tipo_profesional === 'psiquiatra';
    }
    
    // Verificar si el usuario es un paciente (usuario regular)
    isUsuario() {
      return this.hasRole(ROLES.USUARIO);
    }
    
    // Obtener el token de autenticación
    getToken() {
      return localStorage.getItem('token');
    }
    
    // Añadir un listener para cambios en el estado de autenticación
    addAuthStateListener(listener) {
      if (typeof listener === 'function') {
        this.authStateListeners.push(listener);
      }
    }
    
    // Eliminar un listener
    removeAuthStateListener(listener) {
      const index = this.authStateListeners.indexOf(listener);
      if (index !== -1) {
        this.authStateListeners.splice(index, 1);
      }
    }
    
    // Notificar a todos los listeners sobre cambios en el estado de autenticación
    notifyAuthStateChange() {
      this.authStateListeners.forEach(listener => {
        listener(this.isAuthenticated, this.currentUser);
      });
    }
  }
  
  // Crear una instancia del servicio de autenticación
  const authService = new AuthService();
  
  // Funciones de manejadores para los formularios de login y registro
  function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Mostrar indicador de carga
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Iniciando sesión...';
    
    authService.login(email, password)
      .then(userData => {
        // Redirigir según el rol del usuario
        redirectBasedOnRole(userData.rol, userData.tipo_profesional);
      })
      .catch(error => {
        alert('Error al iniciar sesión: ' + error.message);
      })
      .finally(() => {
        // Restaurar botón
        submitButton.disabled = false;
        submitButton.innerHTML = 'Iniciar sesión';
      });
  }
  
  function register(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const nombreCompleto = document.getElementById('registerName').value;
    
    // Validar campos
    if (!email || !password || !nombreCompleto) {
      alert('Por favor, complete todos los campos');
      return;
    }
    
    // Mostrar indicador de carga
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Registrando...';
    
    // Datos para registro (por defecto rol 'paciente')
    const userData = {
      email: email,
      nombre_c: nombreCompleto,
      rol: ROLES.USUARIO,
      password: password
    };
    
    authService.register(userData)
      .then(() => {
        alert('Registro exitoso. Por favor inicie sesión.');
        window.location.href = 'index.html';
      })
      .catch(error => {
        alert('Error al registrar: ' + error.message);
      })
      .finally(() => {
        // Restaurar botón
        submitButton.disabled = false;
        submitButton.innerHTML = 'Registrarse';
      });
  }
  
  // Redireccionar basado en el rol del usuario
  function redirectBasedOnRole(rol, tipoProfesional) {
    switch (rol) {
      case ROLES.ADMIN:
        window.location.href = '/admin/dashboard.html';
        break;
      case ROLES.PSIQUIATRA:
        // Verificar si es específicamente psiquiatra
        if (tipoProfesional === 'psiquiatra') {
          window.location.href = '/profesional/psiquiatra/dashboard.html';
        } else {
          // Para otros profesionales (psicólogos)
          window.location.href = '/profesional/dashboard.html';
        }
        break;
      case ROLES.USUARIO:
        window.location.href = '/inicio.html';
        break;
      default:
        // Si no tiene un rol válido, redirigir al inicio
        window.location.href = '/inicio.html';
    }
  }
  
  // Protección de rutas según rol
  function protectRoute(allowedRoles = []) {
    // Si no está autenticado, redirigir al login
    if (!authService.isAuthenticated) {
      window.location.href = '/index.html';
      return false;
    }
    
    // Si no se especifican roles permitidos, cualquier usuario autenticado puede acceder
    if (!allowedRoles.length) {
      return true;
    }
    
    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasAllowedRole = allowedRoles.some(role => {
      if (role === ROLES.PSIQUIATRA) {
        return authService.isPsiquiatra();
      }
      return authService.hasRole(role);
    });
    
    if (!hasAllowedRole) {
      // Redirigir a página de acceso denegado o a la página principal según el rol actual
      alert('No tiene permisos para acceder a esta página');
      redirectBasedOnRole(authService.currentUser.rol, authService.currentUser.tipo_profesional);
      return false;
    }
    
    return true;
  }
  
  // Inicializar elementos de la interfaz basados en el rol del usuario
  function initializeUI() {
    // Ocultar/mostrar elementos según el rol del usuario
    document.addEventListener('DOMContentLoaded', () => {
      const adminElements = document.querySelectorAll('.admin-only');
      const psiquiatraElements = document.querySelectorAll('.psiquiatra-only');
      const usuarioElements = document.querySelectorAll('.usuario-only');
      const authElements = document.querySelectorAll('.auth-only');
      const noAuthElements = document.querySelectorAll('.no-auth-only');
      
      // Mostrar/ocultar elementos basados en autenticación
      if (authService.isAuthenticated) {
        authElements.forEach(el => el.style.display = 'block');
        noAuthElements.forEach(el => el.style.display = 'none');
        
        // Mostrar/ocultar elementos basados en rol
        adminElements.forEach(el => el.style.display = authService.isAdmin() ? 'block' : 'none');
        psiquiatraElements.forEach(el => el.style.display = authService.isPsiquiatra() ? 'block' : 'none');
        usuarioElements.forEach(el => el.style.display = authService.isUsuario() ? 'block' : 'none');
      } else {
        authElements.forEach(el => el.style.display = 'none');
        noAuthElements.forEach(el => el.style.display = 'block');
        
        // Ocultar elementos específicos de roles cuando no hay usuario autenticado
        adminElements.forEach(el => el.style.display = 'none');
        psiquiatraElements.forEach(el => el.style.display = 'none');
        usuarioElements.forEach(el => el.style.display = 'none');
      }
    });
  }
  
  // Exportar objetos y funciones
  export {
    authService,
    ROLES,
    login,
    register,
    protectRoute,
    redirectBasedOnRole,
    initializeUI
  };