import { useState } from 'react'
import { obtenerSesion } from '../servicios/sesion.js'
import { regionesCompra as REGIONES } from '../datos/regionesCompra.js'
import { buscarUsuario, actualizarUsuario } from '../servicios/usuarios.js'
import { useNavigate } from 'react-router-dom'

function Perfil({ onActualizarUsuario, onCerrarSesion }) {
  const sesion = obtenerSesion()
  const navigate = useNavigate()
  const usuarioActual = sesion ? buscarUsuario(sesion.id) : null

  const [formulario, setFormulario] = useState({
    nombre: usuarioActual?.nombre || '',
    email: usuarioActual?.email || '',
    region: usuarioActual?.region || '',
    comuna: usuarioActual?.comuna || '',
    direccion: usuarioActual?.direccion || ''
  }) // fin estado formulario

  const [mensaje, setMensaje] = useState('') // fin estado mensaje
  const [error, setError] = useState('') // fin estado error

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario(anterior => ({
      ...anterior,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {})
    }))
  } // fin cambiarCampo

  function handleSubmit(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')

    try {
      const actualizado = actualizarUsuario(sesion.id, formulario)
      onActualizarUsuario(actualizado)
      setMensaje('Perfil actualizado correctamente.')
    } catch (err) {
      setError(err.message)
    } // fin try catch
  } // fin handleSubmit

  function handleCerrarSesion() {
    onCerrarSesion()
    navigate('/login')
  } // fin handleCerrarSesion

  if (!sesion) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning">
          Debes iniciar sesión para ver tu perfil.{' '}
          <a href="/login">Ir al login</a>
        </div>
      </main>
    )
  } // fin if no sesion

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>Mi perfil</h1>
              <p className="text-muted mb-0">Rol: {sesion.rol}</p>
            </div>
            <button
              className="btn btn-outline-danger"
              onClick={handleCerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>

          {mensaje && (
            <div className="alert alert-success">{mensaje}</div>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre completo</label>
              <input
                id="nombre"
                name="nombre"
                className="form-control"
                value={formulario.nombre}
                onChange={cambiarCampo}
                required
              />
            </div>
            {/* fin campo nombre */}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={formulario.email}
                onChange={cambiarCampo}
                required
              />
            </div>
            {/* fin campo email */}

            <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input
              id="direccion"
              name="direccion"
              className="form-control"
              value={formulario.direccion}
              onChange={cambiarCampo}
              placeholder="Av. Ejemplo 1234"
              />
            </div>
            {/* fin campo direccion */}
            

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="region" className="form-label">Región</label>
                <select
                  id="region"
                  name="region"
                  className="form-select"
                  value={formulario.region}
                  onChange={cambiarCampo}
                >
                  <option value="">Seleccione una región</option>
                  {Object.keys(REGIONES).map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="comuna" className="form-label">Comuna</label>
                <select
                  id="comuna"
                  name="comuna"
                  className="form-select"
                  value={formulario.comuna}
                  onChange={cambiarCampo}
                  disabled={!formulario.region}
                >
                  <option value="">Seleccione una comuna</option>
                  {formulario.region && REGIONES[formulario.region].map(comuna => (
                    <option key={comuna} value={comuna}>{comuna}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* fin campos region y comuna */}

            <button type="submit" className="btn btn-success w-100">
              Guardar cambios
            </button>

          </form>
          {/* fin form */}

        </div>
      </div>
    </main>
  )
} // fin Perfil

export default Perfil
