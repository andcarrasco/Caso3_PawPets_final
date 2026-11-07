import { Link } from 'react-router-dom'
import { contarProductosStockCritico } from '../servicios/stock.js'


function AdminReportes({ productos, pedidos = [] }) {
  const stockBajo = contarProductosStockCritico(productos)

  const ahora = new Date()
  const pedidosDelMes = pedidos
    .filter(pedido => {
      const fecha = new Date(pedido.fecha)
      return fecha.getFullYear() === ahora.getFullYear() && fecha.getMonth() === ahora.getMonth()
    })
  const ventasDelMes = pedidosDelMes.reduce((total, pedido) => total + pedido.total, 0)

  const cantidadPedidos = pedidos.length

  const formatoPrecio = valor => `$${valor.toLocaleString('es-CL')}`

  return (
    <main className="container py-5">
      <p className="text-success fw-bold">Administrador</p>
      <h1>Reportes de ventas y seguimiento</h1>
      <p className="text-muted">
          Resumen de compras confirmadas durante esta sesión. Los datos se mantienen en memoria.
      </p>

      <div className="row g-3 my-4">
        <div className="col-md-4">
          <article className="bg-white rounded p-4 h-100">
            <h2 className="h5">Ventas del mes</h2>
            <p className="fs-3 fw-bold">{formatoPrecio(ventasDelMes)}</p>
            <p>{pedidosDelMes.length} pedidos del mes</p>
          </article>
        </div>

        <div className="col-md-4">
          <article className="bg-white rounded p-4 h-100">
            <h2 className="h5">Pedidos registrados</h2>
            <p className="fs-3 fw-bold">{cantidadPedidos}</p>
            <p>Compras confirmadas en esta sesión</p>
          </article>
        </div>

        <div className="col-md-4">
          <article className="bg-white rounded p-4 h-100">
            <h2 className="h5">Stock bajo</h2>
            <p className="fs-3 fw-bold">{stockBajo}</p>
            <p>Revisar reposición</p>
          </article>
        </div>
      </div>

      <h2 className="h4 mb-3">Seguimiento de ventas</h2>

      <div className="table-responsive">
        <table className="table table-bordered bg-white">
          <thead className="table-success">
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Entrega</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.cliente.nombre}</td>
                  <td>{new Date(pedido.fecha).toLocaleDateString("es-CL")}</td>
                  <td>{formatoPrecio(pedido.total)}</td>
                  <td>{pedido.entrega === "domicilio" ? "Domicilio" : "Retiro en tienda"}</td>
                  <td>
                    <Link className="btn btn-outline-success btn-sm" to={`/admin/pedidos/${pedido.id}`}>
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No hay compras registradas en esta sesión.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default AdminReportes
