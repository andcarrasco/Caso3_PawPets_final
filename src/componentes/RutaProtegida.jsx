import { Navigate, Outlet } from 'react-router-dom'

function RutaProtegida({ usuario, rolPermitido, children }) {
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (usuario.rol !== rolPermitido) {
    const destino = usuario.rol === 'administrador'
      ? '/admin/productos'
      : usuario.rol === 'vendedor'
        ? '/vendedor'
        : '/'

    return <Navigate to={destino} replace />
  }

  return children ? children : <Outlet />
}

export default RutaProtegida
