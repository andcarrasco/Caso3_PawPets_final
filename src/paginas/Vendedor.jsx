import { obtenerSesion } from '../servicios/sesion.js'
import { listarUsuarios } from '../servicios/usuarios.js'
import { Navigate, useNavigate } from 'react-router-dom'

function Vendedor({ productos, onCerrarSesion }) {
  const sesion = obtenerSesion()
  const navigate = useNavigate()
  const clientes = listarUsuarios().filter(u => u.rol === 'cliente')

  if (!sesion) {
    return <Navigate to="/login" replace />
  } // fin if no sesion

  if (sesion.rol !== 'vendedor') {
    return <Navigate to="/" replace />
  } // fin if rol incorrecto

  function handleCerrarSesion() {
    onCerrarSesion()
    navigate('/login')
  } // fin handleCerrarSesion

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Panel Vendedor</h1>
          {sesion && (
            <p className="text-muted">Bienvenido, {sesion.nombre}</p>
          )}
        </div>
        <button
          className="btn btn-outline-danger"
          onClick={handleCerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="row g-4">

        <div className="col-12">
          <div className="card p-4">
            <h3>Inventario</h3>
            <p className="text-muted">Productos disponibles en la tienda.</p>
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="table-success">
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(producto => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td>{producto.nombre}</td>
                      <td>${producto.precio.toLocaleString('es-CL')}</td>
                      <td>{producto.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* fin card inventario */}

        <div className="col-12">
          <div className="card p-4">
            <h3>Mis clientes</h3>
            <p className="text-muted">Listado de clientes registrados.</p>
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="table-success">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Región</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* fin card clientes */}

        <div className="col-12">
          <div className="card p-4">
            <h3>Mis ventas</h3>
            <p className="text-muted">Las ventas todavía no están disponibles en este panel.</p>
          </div>
        </div>
        {/* fin card ventas */}

      </div>
    </main>
  )
} // fin Vendedor

export default Vendedor
