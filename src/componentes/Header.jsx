import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../estilos/header.css'

function Header({ cantidadCarrito = 0, usuario = null, onCerrarSesion }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [menuCuentaAbierto, setMenuCuentaAbierto] = useState(false)
  const [menuProductosAbierto, setMenuProductosAbierto] = useState(false)

  function cerrarMenu() {
    setMenuAbierto(false)
    setMenuCuentaAbierto(false)
    setMenuProductosAbierto(false)
  }

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg" aria-label="Navegación principal">
        <div className="container">
          <NavLink className="brand navbar-brand" to="/" onClick={cerrarMenu}>
            🐾 <span>PawPets</span>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            aria-label="Abrir o cerrar menú"
            aria-expanded={menuAbierto}
            aria-controls="menu-pawpets"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            id="menu-pawpets"
            className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`}
          >
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3 flex-lg-wrap justify-content-lg-end">
              <NavLink className="nav-link" to="/" end onClick={cerrarMenu}>Inicio</NavLink>
              <div className="dropdown">
                <button className="nav-link dropdown-toggle" type="button"
                  aria-expanded={menuProductosAbierto} aria-controls="menu-productos"
                  onClick={() => {
                    setMenuProductosAbierto(!menuProductosAbierto)
                    setMenuCuentaAbierto(false)
                  }}>
                  Productos
                </button>
                {menuProductosAbierto && (
                  <div id="menu-productos" className="dropdown-menu show">
                    <NavLink className="dropdown-item" to="/productos" onClick={cerrarMenu}>Catálogo</NavLink>
                    <NavLink className="dropdown-item" to="/categorias" onClick={cerrarMenu}>Categorías</NavLink>
                    <NavLink className="dropdown-item" to="/ofertas" onClick={cerrarMenu}>Ofertas</NavLink>
                  </div>
                )}
              </div>
              <NavLink className="nav-link" to="/nosotros" onClick={cerrarMenu}>Nosotros</NavLink>
              <NavLink className="nav-link" to="/blog" onClick={cerrarMenu}>Blog</NavLink>
              <NavLink className="nav-link" to="/contacto" onClick={cerrarMenu}>Contacto</NavLink>
              {usuario?.rol === 'vendedor' && (
                <NavLink className="nav-link" to="/vendedor" onClick={cerrarMenu}>Vendedor</NavLink>
              )}
              {usuario?.rol === 'administrador' && (
                <>
                  <NavLink className="nav-link" to="/admin/productos" onClick={cerrarMenu}>Productos</NavLink>
                  <NavLink className="nav-link" to="/admin/categorias" onClick={cerrarMenu}>Categorías</NavLink>
                  <NavLink className="nav-link" to="/admin/usuarios" onClick={cerrarMenu}>Usuarios</NavLink>
                  <NavLink className="nav-link" to="/admin/reportes" onClick={cerrarMenu}>Reportes</NavLink>
                </>
              )}
              {!usuario ? (
                  <NavLink className="nav-link" to="/login" onClick={cerrarMenu}>
                    Ingresar
                  </NavLink>
                ) : (
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-success dropdown-toggle"
                      type="button"
                      aria-expanded={menuCuentaAbierto}
                      onClick={() => {
                        setMenuCuentaAbierto(!menuCuentaAbierto)
                        setMenuProductosAbierto(false)
                      }}
                    >
                      👤 {usuario.nombre || 'Mi cuenta'}
                    </button>

                    {menuCuentaAbierto && (
                      <div className="dropdown-menu dropdown-menu-end show">
                        <span className="dropdown-item-text">
                          {usuario.rol}
                        </span>

                        <NavLink
                          className="dropdown-item"
                          to="/perfil"
                          onClick={() => {
                            setMenuCuentaAbierto(false)
                            cerrarMenu()
                          }}
                        >
                          Mi perfil
                        </NavLink>

                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => {
                            onCerrarSesion?.()
                            setMenuCuentaAbierto(false)
                            cerrarMenu()
                          }}
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <NavLink className="cart-button" to="/carrito" onClick={cerrarMenu}>
                🛒 Carrito <b>{cantidadCarrito}</b>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
