// api-client.js - Cliente JavaScript para consumir la API de FastAPI

// URL base de la API
const API_BASE_URL = 'http://localhost:127.0.0.1';

// Clase para manejar todas las operaciones de la API
class ApiClient {
    // USUARIOS
    
    // Obtener todos los usuarios
    static async getAllUsuarios() {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios`);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }
    
    // Obtener un usuario por ID
    static async getUsuarioById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener usuario con ID ${id}:`, error);
            throw error;
        }
    }
    
    // Crear un nuevo usuario
    static async createUsuario(usuario) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }
    
    // Actualizar un usuario existente
    static async updateUsuario(id, usuario) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar usuario con ID ${id}:`, error);
            throw error;
        }
    }
    
    // Eliminar un usuario
    static async deleteUsuario(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar usuario con ID ${id}:`, error);
            throw error;
        }
    }
    
    // PACIENTES
    
    // Obtener todos los pacientes
    static async getAllPacientes() {
        try {
            const response = await fetch(`${API_BASE_URL}/pacientes`);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener pacientes:', error);
            throw error;
        }
    }
    
    // Obtener un paciente por ID
    static async getPacienteById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/pacientes/${id}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener paciente con ID ${id}:`, error);
            throw error;
        }
    }
    
    // Crear un nuevo paciente
    static async createPaciente(paciente) {
        try {
            const response = await fetch(`${API_BASE_URL}/pacientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paciente),
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear paciente:', error);
            throw error;
        }
    }
    
    // Actualizar un paciente existente
    static async updatePaciente(id, paciente) {
        try {
            const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paciente),
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar paciente con ID ${id}:`, error);
            throw error;
        }
    }
    
    // Eliminar un paciente
    static async deletePaciente(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar paciente con ID ${id}:`, error);
            throw error;
        }
    }
    
    // PROFESIONALES
    
    // Obtener todos los profesionales
    static async getAllProfesionales() {
        try {
            const response = await fetch(`${API_BASE_URL}/profesionales`);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener profesionales:', error);
            throw error;
        }
    }
    
    // Obtener un profesional por ID
    static async getProfesionalById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/profesionales/${id}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener profesional con ID ${id}:`, error);
            throw error;
        }
    }
    
    // Crear un nuevo profesional
    static async createProfesional(profesional) {
        try {
            const response = await fetch(`${API_BASE_URL}/profesionales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profesional),
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear profesional:', error);
            throw error;
        }
    }
    
    // Actualizar un profesional existente
    static async updateProfesional(id, profesional) {
        try {
            const response = await fetch(`${API_BASE_URL}/profesionales/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profesional),
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar profesional con ID ${id}:`, error);
            throw error;
        }
    }
    
    // Eliminar un profesional
    static async deleteProfesional(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/profesionales/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar profesional con ID ${id}:`, error);
            throw error;
        }
    }
    
    // ESPECIALIZACIONES
    
    // Obtener todas las especializaciones
    static async getAllEspecializaciones() {
        try {
            const response = await fetch(`${API_BASE_URL}/especializaciones`);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener especializaciones:', error);
            throw error;
        }
    }
    
    // Obtener una especialización por ID
    static async getEspecializacionById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/especializaciones/${id}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener especialización con ID ${id}:`, error);
            throw error;
        }
    }
    
    // Crear una nueva especialización
    static async createEspecializacion(especializacion) {
        try {
            const response = await fetch(`${API_BASE_URL}/especializaciones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(especializacion),
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear especialización:', error);
            throw error;
        }
    }
    
    // Actualizar una especialización existente
    static async updateEspecializacion(id, especializacion) {
        try {
            const response = await fetch(`${API_BASE_URL}/especializaciones/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(especializacion),
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar especialización con ID ${id}:`, error);
            throw error;
        }
    }
    
    // Eliminar una especialización
    static async deleteEspecializacion(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/especializaciones/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar especialización con ID ${id}:`, error);
            throw error;
        }
    }
}

// Exportar la clase para su uso en otros archivos
export default ApiClient;