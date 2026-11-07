import { useParams, useNavigate } from 'react-router-dom'
import { buscarUsuario } from '../servicios/usuarios.js'

function DetalleUsuario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const usuario = buscarUsuario(id)

  if (!usuario) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger">Usuario no encontrado.</div>
      </main>
    )
  } // fin if no usuario

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Detalle de usuario</h1>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-success"
            onClick={() => navigate('/admin/usuarios/' + usuario.id)}
          >
            Editar
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/admin/usuarios')}
          >
            Volver
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="row g-3">

          <div className="col-md-6">
            <p className="text-muted mb-1">ID</p>
            <p className="fw-bold">{usuario.id}</p>
          </div>

          <div className="col-md-6">
            <p className="text-muted mb-1">Nombre</p>
            <p className="fw-bold">{usuario.nombre}</p>
          </div>

          <div className="col-md-6">
            <p className="text-muted mb-1">Correo</p>
            <p className="fw-bold">{usuario.email}</p>
          </div>

          <div className="col-md-6">
            <p className="text-muted mb-1">RUT</p>
            <p className="fw-bold">{usuario.rut}</p>
          </div>

          <div className="col-md-6">
            <p className="text-muted mb-1">Región</p>
            <p className="fw-bold">{usuario.region || '—'}</p>
          </div>

          <div className="col-md-6">
            <p className="text-muted mb-1">Comuna</p>
            <p className="fw-bold">{usuario.comuna || '—'}</p>
          </div>

          <div className="col-md-6">
            <p className="text-muted mb-1">Dirección</p>
            <p className="fw-bold">{usuario.direccion || '—'}</p>
          </div>

          <div className="col-md-6">
            <p className="text-muted mb-1">Rol</p>
            <p className="fw-bold">{usuario.rol}</p>
          </div>

        </div>
      </div>
    </main>
  )
} // fin DetalleUsuario

export default DetalleUsuario