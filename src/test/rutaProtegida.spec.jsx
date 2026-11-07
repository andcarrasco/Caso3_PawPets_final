import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RutaProtegida from '../componentes/RutaProtegida.jsx'

// Comprueba qué páginas puede abrir cada rol y cuándo se redirige al login.
describe('Protección de rutas por roles', () => {
  afterEach(() => cleanup())

  function probarAcceso(ruta, usuario) {
    render(
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/login" element={<h1>Inicio de sesión</h1>} />
          <Route path="/" element={<h1>Inicio de tienda</h1>} />
          <Route element={<RutaProtegida usuario={usuario} rolPermitido="administrador" />}>
            <Route path="/admin/productos" element={<h1>Panel administrador</h1>} />
          </Route>
          <Route element={<RutaProtegida usuario={usuario} rolPermitido="vendedor" />}>
            <Route path="/vendedor" element={<h1>Panel vendedor</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
  }

  // Datos: Visitante sin sesión.
  // Acción: Intentar abrir /admin/productos.
  // Resultado esperado: Se redirige al login y aparece Inicio de sesión.
  it('redirige al login cuando no existe una sesión', () => {
    probarAcceso('/admin/productos', null)
    expect(screen.getByText('Inicio de sesión')).toBeTruthy()
  })

  // Datos: Usuario con rol administrador.
  // Acción: Abrir /admin/productos.
  // Resultado esperado: Se permite el acceso y aparece Panel administrador.
  it('permite al administrador ingresar a administración', () => {
    probarAcceso('/admin/productos', { rol: 'administrador' })
    expect(screen.getByText('Panel administrador')).toBeTruthy()
  })

  // Datos: Usuario con rol cliente.
  // Acción: Intentar abrir /admin/productos.
  // Resultado esperado: Se redirige a la tienda y aparece Inicio de tienda.
  it('impide que un cliente ingrese a administración', () => {
    probarAcceso('/admin/productos', { rol: 'cliente' })
    expect(screen.getByText('Inicio de tienda')).toBeTruthy()
  })

  // Datos: Usuario con rol vendedor.
  // Acción: Abrir /vendedor.
  // Resultado esperado: Se permite el acceso y aparece Panel vendedor.
  it('permite al vendedor ingresar a su panel', () => {
    probarAcceso('/vendedor', { rol: 'vendedor' })
    expect(screen.getByText('Panel vendedor')).toBeTruthy()
  })

  // Datos: Usuario con rol vendedor.
  // Acción: Intentar abrir /admin/productos.
  // Resultado esperado: Se redirige al panel del vendedor y aparece Panel vendedor.
  it('impide que un vendedor ingrese a administración', () => {
    probarAcceso('/admin/productos', { rol: 'vendedor' })
    expect(screen.getByText('Panel vendedor')).toBeTruthy()
  })

  // Datos: Usuario con rol administrador.
  // Acción: Intentar abrir /vendedor.
  // Resultado esperado: Se redirige a administración y aparece Panel administrador.
  it('impide que un administrador ingrese al panel vendedor', () => {
    probarAcceso('/vendedor', { rol: 'administrador' })
    expect(screen.getByText('Panel administrador')).toBeTruthy()
  })
})
