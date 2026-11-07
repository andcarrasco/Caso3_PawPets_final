import { useState } from 'react'
import { listarUsuarios, eliminarUsuario } from '../servicios/usuarios.js'
import { useNavigate } from 'react-router-dom'

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(() => listarUsuarios())
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function confirmarEliminacion(usuario) {
    setError('')
    const confirmado = window.confirm(
      '¿Estás seguro de eliminar al usuario "' + usuario.nombre + '"?'
    )

    if (!confirmado) return

    try {
      eliminarUsuario(usuario.id)
      setUsuarios(listarUsuarios())
    } catch (err) {
      setError(err.message)
    } // fin try catch
  } // fin confirmarEliminacion

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Administración de usuarios</h1>
        <button
          className="btn btn-success"
          onClick={() => navigate('/admin/usuarios/nuevo')}
        >
          Nuevo usuario
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Región</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.region}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate('/admin/usuarios/detalle/' + usuario.id)}
                  >
                    Ver
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm ms-2"
                    onClick={() => navigate('/admin/usuarios/' + usuario.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => confirmarEliminacion(usuario)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
} // fin AdminUsuarios

export default AdminUsuarios