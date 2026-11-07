import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function DetalleProducto({ productos, onAgregar }) {
  const { id } = useParams()
  const producto = productos.find(producto => producto.id === Number(id))
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

  if (!producto) return <main className="container py-4"><h1>Producto no encontrado</h1><Link to="/productos">Volver al catálogo</Link></main>

  return (
    <main className="container py-4">
      <Link to="/productos">Volver al catálogo</Link>
      <div className="row g-4 mt-2">
        <div className="col-md-6">
          {producto.imagen && <img className="img-fluid rounded" src={producto.imagen} alt={producto.nombre} />}
        </div>
        <div className="col-md-6">
          <h1>{producto.nombre}</h1>
          <p>{producto.descripcion}</p>
          {producto.oferta && <p className="badge text-bg-warning">En oferta</p>}
          <p className="fs-4">${producto.precio.toLocaleString('es-CL')}</p>
          <p>Stock disponible: {producto.stock}</p>
          <button className="btn btn-success" type="button" onClick={agregar} disabled={producto.stock < 1}>
            {producto.stock < 1 ? 'Agotado' : 'Agregar al carrito'}
          </button>
          {mensaje && <p role="status" className="text-success mt-3">{mensaje}</p>}
          {error && <p role="alert" className="text-danger mt-3">{error}</p>}
        </div>
      </div>
    </main>
  )
}

export default DetalleProducto
