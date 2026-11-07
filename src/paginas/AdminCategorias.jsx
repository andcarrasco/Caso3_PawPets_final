import { Link } from 'react-router-dom'

function AdminCategorias({ categorias = [], productos = [] }) {
  return (
    <main className="container py-5">
      <h1>Administración de categorías</h1>
      <p>Consulta de las categorías del catálogo de PawPets.</p>
      <Link className="btn btn-outline-success mb-4" to="/admin/productos">Consultar productos</Link>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <caption>Categorías del catálogo de PawPets</caption>
          <thead className="table-success">
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Categoría</th>
              <th scope="col">Productos</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(categoria => (
              <tr key={categoria.id}>
                <th scope="row">{categoria.id}</th>
                <td>{categoria.nombre}</td>
                <td>{productos.filter(producto => producto.categoriaId === categoria.id).length}</td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr><td colSpan="3">No hay categorías para mostrar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default AdminCategorias
