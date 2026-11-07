import { useState } from 'react'
import { regionesCompra as REGIONES } from '../datos/regionesCompra.js'

function FormularioUsuario({ usuarioInicial = null, onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState({
    nombre: usuarioInicial?.nombre || '',
    email: usuarioInicial?.email || '',
    password: usuarioInicial?.password || '',
    rut: usuarioInicial?.rut || '',
    region: usuarioInicial?.region || '',
    comuna: usuarioInicial?.comuna || '',
    direccion: usuarioInicial?.direccion || '',
    rol: usuarioInicial?.rol || 'cliente'
  }) // fin estado formulario

  const [error, setError] = useState('') // fin estado error

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario(anterior => ({
      ...anterior,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {})
    }))
  } // fin cambiarCampo

  function guardar(evento) {
    evento.preventDefault()
    setError('')

    try {
      onGuardar(formulario)
    } catch (err) {
      setError(err.message)
    } // fin try catch
  } // fin guardar

  return (
    <form onSubmit={guardar} className="card p-4 mb-4">
      <h2 className="h4">
        {usuarioInicial ? 'Editar usuario' : 'Nuevo usuario'}
      </h2>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="row g-3">

        <div className="col-md-6">
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

        <div className="col-md-6">
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

        <div className="col-md-6">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-control"
            value={formulario.password}
            onChange={cambiarCampo}
            required
          />
        </div>
        {/* fin campo password */}

        <div className="col-md-6">
          <label htmlFor="rut" className="form-label">RUT</label>
          <input
            id="rut"
            name="rut"
            className="form-control"
            value={formulario.rut}
            onChange={cambiarCampo}
            placeholder="19011022K"
            required
          />
        </div>
        {/* fin campo rut */}

        <div className="col-md-6">
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

        <div className="col-md-6">
          <label htmlFor="region" className="form-label">Región</label>
          <select
            id="region"
            name="region"
            className="form-select"
            value={formulario.region}
            onChange={cambiarCampo}
            required
          >
            <option value="">Seleccione una región</option>
            {Object.keys(REGIONES).map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        {/* fin campo region */}

        <div className="col-md-6">
          <label htmlFor="comuna" className="form-label">Comuna</label>
          <select
            id="comuna"
            name="comuna"
            className="form-select"
            value={formulario.comuna}
            onChange={cambiarCampo}
            disabled={!formulario.region}
            required
          >
            <option value="">Seleccione una comuna</option>
            {formulario.region && REGIONES[formulario.region].map(comuna => (
              <option key={comuna} value={comuna}>{comuna}</option>
            ))}
          </select>
        </div>
        {/* fin campo comuna */}

        <div className="col-md-6">
          <label htmlFor="rol" className="form-label">Rol</label>
          <select
            id="rol"
            name="rol"
            className="form-select"
            value={formulario.rol}
            onChange={cambiarCampo}
            required
          >
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        {/* fin campo rol */}

      </div>
      {/* fin row */}

      <div className="d-flex gap-2 mt-4">
        <button className="btn btn-success" type="submit">
          Guardar usuario
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={onCancelar}
        >
          Cancelar
        </button>
      </div>
      {/* fin botones */}

    </form>
  )
} // fin FormularioUsuario

export default FormularioUsuario
