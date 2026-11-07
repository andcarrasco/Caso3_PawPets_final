import ListaProductos from '../componentes/ListaProductos.jsx'

function Ofertas({ productos, onAgregar }) {
  return (
    <main className="container py-4">
      <h1>Productos en oferta</h1>
      <ListaProductos productos={productos.filter(producto => producto.oferta)} onAgregar={onAgregar} />
    </main>
  )
}

export default Ofertas
