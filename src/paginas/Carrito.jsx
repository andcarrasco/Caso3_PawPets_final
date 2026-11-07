import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerLineas, calcularTotal } from '../servicios/carrito.js'

function Carrito({ carrito, productos, onCambiarCantidad, onEliminar, onVaciar }) {
  const [error, setError] = useState('')
  const lineas = obtenerLineas(carrito, productos)
  const hayProblemas = lineas.some(linea => !linea.disponible || linea.cantidad > linea.stock)

  function cambiar(id, cantidad) {
    setError('')
    try {
      onCambiarCantidad(id, cantidad)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <main className="container py-4">
      <h1>Carrito de compras</h1>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {lineas.length === 0 ? (
        <><p>Tu carrito está vacío.</p><Link to="/productos">Ver productos</Link></>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acciones</th></tr></thead>
              <tbody>
                {lineas.map(linea => (
                  <tr key={linea.productoId}>
                    <td>{linea.nombre}{linea.cantidad > linea.stock && <p className="text-danger">Revisa el stock disponible.</p>}</td>
                    <td>${linea.precio.toLocaleString('es-CL')}</td>
                    <td>
                      <div className="d-flex gap-2 align-items-center">
                        <button type="button" className="btn btn-outline-success btn-sm" aria-label={'Disminuir ' + linea.nombre}
                          onClick={() => cambiar(linea.productoId, linea.cantidad - 1)} disabled={linea.cantidad <= 1 || !linea.disponible}>−</button>
                        <span aria-label={'Cantidad de ' + linea.nombre}>{linea.cantidad}</span>
                        <button type="button" className="btn btn-outline-success btn-sm" aria-label={'Aumentar ' + linea.nombre}
                          onClick={() => cambiar(linea.productoId, linea.cantidad + 1)} disabled={linea.cantidad >= linea.stock || !linea.disponible}>+</button>
                      </div>
                    </td>
                    <td>${linea.subtotal.toLocaleString('es-CL')}</td>
                    <td><button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onEliminar(linea.productoId)}>Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fs-4 fw-bold" data-testid="total-carrito">Total: ${calcularTotal(lineas).toLocaleString('es-CL')}</p>
          {hayProblemas && <p className="alert alert-warning" role="alert">Actualiza las cantidades o elimina los productos no disponibles antes de comprar.</p>}
          <div className="d-flex flex-wrap gap-3">
            <button className="btn btn-outline-danger" type="button" onClick={onVaciar}>Vaciar carrito</button>
            <Link className="btn btn-outline-success" to="/productos">Seguir comprando</Link>
            {!hayProblemas && <Link className="btn btn-success" to="/checkout">Continuar compra</Link>}
          </div>
        </>
      )}
    </main>
  )
}

export default Carrito
