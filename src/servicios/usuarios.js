import { usuariosIniciales } from '../datos/usuarios.js'

// Copia en memoria para simular persistencia
let usuarios = [...usuariosIniciales]

export function listarUsuarios() {
  return [...usuarios]
} // fin listarUsuarios

export function buscarUsuario(id) {
  const usuario = usuarios.find(usuario => usuario.id === Number(id))
  return usuario || null
} // fin buscarUsuario

export function buscarUsuarioPorEmail(email) {
  const usuario = usuarios.find(
    usuario => usuario.email.toLowerCase() === email.toLowerCase()
  )
  return usuario || null
} // fin buscarUsuarioPorEmail

export function crearUsuario(datosUsuario) {
  const nombre = String(datosUsuario.nombre == null ? '' : datosUsuario.nombre).trim()
  const email = String(datosUsuario.email == null ? '' : datosUsuario.email).trim()

  if (!nombre) throw new Error('El nombre es obligatorio.')
  if (!email) throw new Error('El correo es obligatorio.')

  const duplicado = usuarios.some(
    usuario => usuario.email.toLowerCase() === email.toLowerCase()
  )

  if (duplicado) throw new Error('Ya existe un usuario con ese correo.')

  const nuevoId = Math.max(0, ...usuarios.map(u => u.id)) + 1
  const nuevoUsuario = {
    ...datosUsuario,
    id: nuevoId,
    nombre,
    email,
    rol: datosUsuario.rol == null ? 'cliente' : datosUsuario.rol
  }

  usuarios.push(nuevoUsuario)
  return nuevoUsuario
} // fin crearUsuario

export function actualizarUsuario(id, datosActualizados) {
  const indice = usuarios.findIndex(usuario => usuario.id === Number(id))

  if (indice === -1) throw new Error('El usuario no existe.')

  const emailNuevo = String(datosActualizados.email == null ? '' : datosActualizados.email).trim().toLowerCase()

  const duplicado = usuarios.some(
    usuario => usuario.email.toLowerCase() === emailNuevo && usuario.id !== Number(id)
  )

  if (duplicado) throw new Error('Ya existe un usuario con ese correo.')

  usuarios[indice] = {
    ...usuarios[indice],
    ...datosActualizados,
    id: usuarios[indice].id
  }

  return usuarios[indice]
} // fin actualizarUsuario

export function eliminarUsuario(id) {
  const indice = usuarios.findIndex(usuario => usuario.id === Number(id))

  if (indice === -1) throw new Error('El usuario no existe.')

  usuarios.splice(indice, 1)
  return true
} // fin eliminarUsuario