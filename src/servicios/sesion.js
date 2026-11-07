// Servicio de sesión simulada usando sessionStorage

const CLAVE_SESION = 'pawpets_sesion'

export function iniciarSesion(usuario) {
  const datos = {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    region: usuario.region || '',
    comuna: usuario.comuna || '',
    direccion: usuario.direccion || ''
  }
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(datos))
  return datos
} // fin iniciarSesion

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION)
} // fin cerrarSesion

export function obtenerSesion() {
  const datos = sessionStorage.getItem(CLAVE_SESION)
  return datos ? JSON.parse(datos) : null
} // fin obtenerSesion

export function estaLogueado() {
  return obtenerSesion() !== null
} // fin estaLogueado

export function obtenerRol() {
  const sesion = obtenerSesion()
  return sesion ? sesion.rol : null
} // fin obtenerRol

export function destinoRol(rol) {
  if (rol === 'administrador') return '/admin/productos'
  if (rol === 'vendedor') return '/vendedor'
  return '/'
} // fin destinoRol