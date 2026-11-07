import Producto from './Producto.jsx'

function ListaProductos({ productos, onAgregar }) {
  if (productos.length === 0) return <p role="status">No hay productos para mostrar.</p>
  return (
    <div className="row g-4">
      {productos.map(producto => (
        <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
          <Producto producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  )
}

export default ListaProductos
