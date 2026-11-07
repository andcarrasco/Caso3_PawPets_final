import { Link } from 'react-router-dom'
import '../estilos/inicio.css'

function Inicio({ productos = [] }) {
  return (
    <main className="inicio-pawpets">
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">Todo para quienes más quieres</p>
          <h1>Cuidado real para patas felices.</h1>
          <p>Alimentos, juegos y bienestar para acompañar cada etapa de su vida.</p>
          <Link className="btn btn-primary" to="/productos">
            Ver productos
          </Link>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Favoritos PawPets</p>
            <h2>Lo más buscado</h2>
          </div>
          <Link to="/productos">Ver catálogo completo →</Link>
        </div>
        <div className="row g-4 mt-2" id="contenedor-productos">
          {productos.slice(0, 4).map(producto => (
            <div className="col-12 col-md-6 col-lg-3" key={producto.id}>
              <article className="card h-100">
                {producto.imagen && (
                  <img className="card-img-top imagen-inicio" src={producto.imagen} alt={producto.nombre} />
                )}
                <div className="card-body d-flex flex-column">
                  <h3 className="h5">{producto.nombre}</h3>
                  <p>{producto.descripcion}</p>
                  <p className="fw-bold">${producto.precio.toLocaleString('es-CL')}</p>
                  <Link className="btn btn-primary mt-auto" to={'/productos/' + producto.id}>
                    Ver producto
                  </Link>
                </div>
              </article>
            </div>
          ))}
          {productos.length === 0 && <p>No hay productos para mostrar.</p>}
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Áreas del sistema</p>
            <h2>Vistas según el tipo de usuario</h2>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <article className="info-card bg-white border rounded p-4 h-100">
              <h3>Cliente</h3>
              <p>Explora productos, regístrate y usa el carrito de compras.</p>
              <Link className="btn btn-primary" to="/productos">Ver tienda</Link>
            </article>
          </div>

          <div className="col-12 col-md-4">
            <article className="info-card bg-white border rounded p-4 h-100">
              <h3>Vendedor</h3>
              <p>Consulta inventario, clientes propios y ventas.</p>
              <Link className="btn btn-primary" to="/vendedor">Ver panel vendedor</Link>
            </article>
          </div>

          <div className="col-12 col-md-4">
            <article className="info-card bg-white border rounded p-4 h-100">
              <h3>Administrador</h3>
              <p>Administra productos, usuarios, clientes y reportes.</p>
              <Link className="btn btn-primary" to="/admin/productos">Ver panel administrador</Link>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Inicio
