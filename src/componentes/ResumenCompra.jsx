import { calcularTotal } from '../servicios/carrito.js'

function ResumenCompra({ lineas }) {
  return (
    <section aria-label="Resumen de compra">
      <h2 className="h4">Resumen de compra</h2>
      <ul className="list-group mb-3">
        {lineas.map(linea => (
          <li className="list-group-item" key={linea.productoId}>
            {linea.nombre} — {linea.cantidad} × ${linea.precio.toLocaleString('es-CL')}
            <strong className="d-block">Subtotal: ${linea.subtotal.toLocaleString('es-CL')}</strong>
          </li>
        ))}
      </ul>
      <p className="fs-5 fw-bold" data-testid="total-compra">Total: ${calcularTotal(lineas).toLocaleString('es-CL')}</p>
    </section>
  )
}

export default ResumenCompra
