import { Link, useLocation, useParams } from 'react-router-dom'
import ResumenCompra from '../componentes/ResumenCompra.jsx'

function ResultadoCompra({ fallido = false, pedido = null }) {
  const { id } = useParams()
  const location = useLocation()

  if (fallido) {
    return (
      <main className="container py-4">
        <h1>No se pudo realizar el pago</h1>
        <p role="alert">El pago simulado fue rechazado. Tu carrito se conserva y puedes intentarlo nuevamente.</p>
        <div className="d-flex flex-wrap gap-3">
          <Link className="btn btn-success" to="/checkout" state={location.state}>Reintentar pago</Link>
          <Link className="btn btn-outline-success" to="/carrito">Revisar carrito</Link>
        </div>
      </main>
    )
  }

  if (!pedido || pedido.id !== Number(id)) {
    return <main className="container py-4"><h1>Resumen no disponible</h1>
      <p>El resumen se conserva mientras la aplicación está abierta. Al recargar la página se reinicia.</p>
      <Link to="/productos">Volver al catálogo</Link></main>
  }

  return (
    <main className="container py-4">
      <h1>Compra realizada con éxito</h1>
      <p role="status">Tu compra simulada número {pedido.id} se completó.</p>
      <p>Fecha: {new Date(pedido.fecha).toLocaleString('es-CL')}</p>
      <p>Cliente: {pedido.cliente.nombre} — {pedido.cliente.email}</p>
      <p>Entrega: {pedido.entrega === 'retiro' ? 'Retiro en tienda' : 'Despacho a domicilio'}</p>
      {pedido.direccion && <p>Dirección: {pedido.direccion.calle}, {pedido.direccion.comuna}, {pedido.direccion.region}</p>}
      <ResumenCompra lineas={pedido.productos} />
      <Link className="btn btn-success" to="/productos">Seguir comprando</Link>
    </main>
  )
}

export default ResultadoCompra
