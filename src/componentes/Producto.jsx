import { useState } from 'react'
import { Link } from 'react-router-dom'

function Producto({ producto, onAgregar }) {
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  function agregar() {
    setError('')
    setMensaje('')
    try {
      onAgregar(producto.id)
      setMensaje('Producto agregado al carrito.')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <article className="card h-100">
      {producto.imagen && <img src={producto.imagen} className="card-img-top imagen-producto" alt={producto.nombre} />}
      <div className="card-body d-flex flex-column">
        <h2 className="h5">{producto.nombre}</h2>
        {producto.oferta && <p><span className="badge text-bg-warning">En oferta</span></p>}
        <p>${producto.precio.toLocaleString('es-CL')}</p>
        <p>Stock: {producto.stock}</p>
        <div className="d-flex flex-wrap gap-2 mt-auto">
          <Link className="btn btn-outline-success" to={'/productos/' + producto.id}>Ver detalle</Link>
          <button type="button" className="btn btn-success" onClick={agregar} disabled={producto.stock < 1}>
            {producto.stock < 1 ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
        {mensaje && <p className="text-success mt-2 mb-0" role="status">{mensaje}</p>}
        {error && <p className="text-danger mt-2 mb-0" role="alert">{error}</p>}
      </div>
    </article>
  )
}

export default Producto
