// ejemplo-uso.js - Ejemplo de cómo usar el cliente API

import {
    getAllUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    
    getAllPacientes,
    getPacienteById,
    
    getAllProfesionales,
    createProfesional,
    
    getAllEspecializaciones
  } from './api-client.js';
  
  // Función para mostrar usuarios en una tabla HTML
  async function mostrarUsuarios() {
    try {
      const usuarios = await getAllUsuarios();
      const tabla = document.getElementById('tabla-usuarios');
      tabla.innerHTML = '';
      
      // Crear encabezados
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Login</th>
          <th>Rol</th>
          <th>Género</th>
          <th>Acciones</th>
        </tr>
      `;
      tabla.appendChild(thead);
      
      // Crear cuerpo de la tabla
      const tbody = document.createElement('tbody');
      usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${usuario.id}</td>
          <td>${usuario.email}</td>
          <td>${usuario.login}</td>
          <td>${usuario.rol}</td>
          <td>${usuario.genero}</td>
          <td>
            <button onclick="editarUsuario(${usuario.id})">Editar</button>
            <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      tabla.appendChild(tbody);
    } catch (error) {
      console.error('Error al mostrar usuarios:', error);
    }
  }
  
  // Función para crear un nuevo usuario
  async function crearUsuario(event) {
    event.preventDefault();
    
    const formulario = document.getElementById('form-usuario');
    const nuevoUsuario = {
      email: formulario.email.value,
      login: formulario.login.value,
      rol: formulario.rol.value,
      genero: formulario.genero.value
    };
    
    try {
      const resultado = await createUsuario(nuevoUsuario);
      alert(resultado.informacion || 'Usuario creado correctamente');
      formulario.reset();
      mostrarUsuarios(); // Actualizar la lista
    } catch (error) {
      alert('Error al crear usuario');
      console.error(error);
    }
  }
  
  // Función para editar un usuario
  async function editarUsuario(id) {
    try {
      const usuario = await getUsuarioById(id);
      if (usuario && usuario.length > 0) {
        // Rellenar formulario con datos del usuario
        const form = document.getElementById('form-usuario');
        form.email.value = usuario[0].email;
        form.login.value = usuario[0].login;
        form.rol.value = usuario[0].rol;
        form.genero.value = usuario[0].genero;
        
        // Cambiar el botón de envío a "Actualizar"
        const btnEnviar = form.querySelector('button[type="submit"]');
        btnEnviar.textContent = 'Actualizar Usuario';
        
        // Guardar el ID para la actualización
        form.dataset.editandoId = id;
      }
    } catch (error) {
      console.error(`Error al obtener datos del usuario ${id}:`, error);
    }
  }
  
  // Función para actualizar un usuario
  async function actualizarUsuario(event) {
    event.preventDefault();
    
    const formulario = document.getElementById('form-usuario');
    const id = formulario.dataset.editandoId;
    
    if (!id) {
      alert('No hay un usuario seleccionado para actualizar');
      return;
    }
    
    const usuarioActualizado = {
      email: formulario.email.value,
      login: formulario.login.value,
      rol: formulario.rol.value,
      genero: formulario.genero.value
    };
    
    try {
      const resultado = await updateUsuario(id, usuarioActualizado);
      alert(resultado.informacion || 'Usuario actualizado correctamente');
      formulario.reset();
      delete formulario.dataset.editandoId;
      
      // Restaurar el botón a "Crear Usuario"
      const btnEnviar = formulario.querySelector('button[type="submit"]');
      btnEnviar.textContent = 'Crear Usuario';
      
      mostrarUsuarios(); // Actualizar la lista
    } catch (error) {
      alert('Error al actualizar usuario');
      console.error(error);
    }
  }
  
  // Función para eliminar un usuario
  async function eliminarUsuario(id) {
    if (confirm(`¿Estás seguro de que deseas eliminar el usuario con ID ${id}?`)) {
      try {
        const resultado = await deleteUsuario(id);
        alert(resultado.informacion || 'Usuario eliminado correctamente');
        mostrarUsuarios(); // Actualizar la lista
      } catch (error) {
        alert('Error al eliminar usuario');
        console.error(error);
      }
    }
  }
  
  // Inicializar la página
  document.addEventListener('DOMContentLoaded', () => {
    // Cargar usuarios al iniciar
    mostrarUsuarios();
    
    // Configurar evento de envío del formulario
    const formUsuario = document.getElementById('form-usuario');
    formUsuario.addEventListener('submit', (event) => {
      if (formUsuario.dataset.editandoId) {
        actualizarUsuario(event);
      } else {
        crearUsuario(event);
      }
    });
    
    // Configurar botón para cancelar edición
    const btnCancelar = document.getElementById('btn-cancelar');
    btnCancelar.addEventListener('click', () => {
      formUsuario.reset();
      delete formUsuario.dataset.editandoId;
      const btnEnviar = formUsuario.querySelector('button[type="submit"]');
      btnEnviar.textContent = 'Crear Usuario';
    });
  });