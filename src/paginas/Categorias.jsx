import { Link, useParams } from 'react-router-dom'
import ListaProductos from '../componentes/ListaProductos.jsx'

function Categorias({ productos, categorias, onAgregar }) {
  const { id } = useParams()
  const seleccionada = categorias.find(categoria => categoria.id === Number(id))
  const filtrados = id ? productos.filter(producto => producto.categoriaId === Number(id)) : productos

  return (
    <main className="container py-4">
      <h1>Categorías</h1>
      <div className="d-flex flex-wrap gap-2 mb-4">
        <Link className="btn btn-outline-success" to="/categorias">Todas</Link>
        {categorias.map(categoria => (
          <Link className="btn btn-outline-success" key={categoria.id} to={'/categorias/' + categoria.id}>
            {categoria.nombre}
          </Link>
        ))}
      </div>
      {id && !seleccionada ? <p role="alert">La categoría no existe.</p> : (
        <>
          <h2 className="h4 mb-3">{seleccionada ? seleccionada.nombre : 'Todos los productos'}</h2>
          <ListaProductos productos={filtrados} onAgregar={onAgregar} />
        </>
      )}
    </main>
  )
}

export default Categorias
