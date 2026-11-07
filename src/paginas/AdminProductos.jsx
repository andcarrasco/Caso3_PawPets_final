import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerEstadoStock, listarProductosStockCritico, UMBRAL_STOCK_CRITICO } from '../servicios/stock.js'

function AdminProductos({ productos = [], categorias = [] }) {
  const [soloCriticos, setSoloCriticos] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const criticos = listarProductosStockCritico(productos)
  const productosVisibles = soloCriticos ? criticos : productos

  function nombreCategoria(id) {
    const categoria = categorias.find(categoria => categoria.id === id)
    return categoria ? categoria.nombre : 'Sin categoría'
  }

  return (
    <main className="container py-5">
      <h1>Administración de productos</h1>
      <p>Consulta del catálogo de PawPets.</p>
      <Link className="btn btn-outline-success mb-4" to="/admin/categorias">Consultar categorías</Link>

      <div className={criticos.length > 0 ? 'alert alert-warning' : 'alert alert-success'} role="status">
        Productos con stock crítico o agotado: <strong>{criticos.length}</strong>
      </div>
      <div className="form-check mb-4">
        <input className="form-check-input" id="solo-criticos" type="checkbox" checked={soloCriticos}
          onChange={evento => setSoloCriticos(evento.target.checked)} />
        <label className="form-check-label" htmlFor="solo-criticos">Mostrar solo productos con stock crítico o agotado</label>
      </div>

      {productoSeleccionado && (
        <section className="card p-4 mb-4" aria-label="Detalle administrativo del producto">
          <h2 className="h4">{productoSeleccionado.nombre}</h2>
          <p>{productoSeleccionado.descripcion}</p>
          <p>Categoría: {nombreCategoria(productoSeleccionado.categoriaId)}</p>
          <p>Precio: ${productoSeleccionado.precio.toLocaleString('es-CL')}</p>
          <p>Stock: {productoSeleccionado.stock}</p>
          <p>Oferta: {productoSeleccionado.oferta ? 'Sí' : 'No'}</p>
          <button className="btn btn-outline-secondary align-self-start" type="button"
            onClick={() => setProductoSeleccionado(null)}>Cerrar detalle</button>
        </section>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <caption>Productos del catálogo de PawPets</caption>
          <thead className="table-success">
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Producto</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Stock</th>
              <th scope="col">Estado</th>
              <th scope="col">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {productosVisibles.map(producto => (
              <tr key={producto.id}>
                <th scope="row">{producto.id}</th>
                <td>{producto.nombre}</td>
                <td>{nombreCategoria(producto.categoriaId)}</td>
                <td>${producto.precio.toLocaleString('es-CL')}</td>
                <td>{producto.stock}</td>
                <td>
                  <span className={producto.stock === 0 ? 'badge text-bg-danger'
                    : producto.stock <= UMBRAL_STOCK_CRITICO ? 'badge text-bg-warning' : 'badge text-bg-success'}>
                    {obtenerEstadoStock(producto.stock)}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline-success btn-sm" type="button"
                    aria-label={'Ver detalle de ' + producto.nombre}
                    onClick={() => setProductoSeleccionado(producto)}>Ver detalle</button>
                </td>
              </tr>
            ))}
            {productosVisibles.length === 0 && (
              <tr><td colSpan="7">{soloCriticos ? 'No hay productos con stock crítico o agotado.' : 'No hay productos para mostrar.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default AdminProductos
