import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter, Link } from 'react-router-dom'
import { ContenidoApp } from '../App.jsx'
import { crearUsuario, eliminarUsuario, actualizarUsuario } from '../servicios/usuarios.js'
import { iniciarSesion, obtenerSesion } from '../servicios/sesion.js'

// Recorre la aplicación para comprobar que sesión, perfil y compra usan los mismos datos.
describe('Compra con usuario y sesión', () => {
  let cliente
  let segundoUsuario

  beforeEach(() => {
    sessionStorage.removeItem('pawpets_sesion')
    cliente = crearUsuario({
      nombre: 'Cliente de prueba', email: 'integracion@gmail.com', password: '1234', rut: '19011022K',
      direccion: 'Calle Uno 123', region: 'Biobío', comuna: 'Concepción', rol: 'cliente'
    })
    segundoUsuario = crearUsuario({
      nombre: 'Otra persona', email: 'otra.persona@gmail.com', password: '1234', rut: '19011022K',
      direccion: 'Calle Dos 456', region: 'Valparaíso', comuna: 'Villa Alemana', rol: 'vendedor'
    })
  })

  afterEach(() => {
    cleanup()
    eliminarUsuario(cliente.id)
    eliminarUsuario(segundoUsuario.id)
    sessionStorage.removeItem('pawpets_sesion')
  })

  function mostrar(ruta, usuario = null) {
    if (usuario) iniciarSesion(usuario)
    render(<MemoryRouter initialEntries={[ruta]}><ContenidoApp /></MemoryRouter>)
  }

  function verPerfil() {
    fireEvent.click(screen.getByRole('button', { name: /👤/ }))
    fireEvent.click(screen.getByRole('link', { name: 'Mi perfil' }))
  }

  function iniciarCompra() {
    fireEvent.click(screen.getByRole('button', { name: 'Productos', exact: true }))
    fireEvent.click(screen.getByRole('link', { name: 'Catálogo' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])
    continuarCompra()
  }

  function continuarCompra() {
    fireEvent.click(screen.getByRole('link', { name: /Carrito/ }))
    fireEvent.click(screen.getByRole('link', { name: 'Continuar compra' }))
  }

  function ingresar(usuario) {
    fireEvent.change(screen.getByLabelText('Rol'), { target: { value: usuario.rol } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: usuario.email } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '1234' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
  }

  // Datos: Cliente de prueba con contraseña 1234, dirección Calle Uno 123 y comuna Concepción, Biobío.
  // Acción: Iniciar sesión, agregar un producto y confirmar la compra.
  // Resultado esperado: El checkout carga los datos del cliente, la compra tiene éxito con esa dirección y el carrito queda vacío.
  it('carga los datos del cliente después del login y completa su compra', () => {
    mostrar('/login')
    ingresar(cliente)
    iniciarCompra()

    expect(screen.getByLabelText('Nombre completo').value).toBe(cliente.nombre)
    expect(screen.getByLabelText('Dirección y número').value).toBe(cliente.direccion)
    expect(screen.getByLabelText('Región').value).toBe('Biobío')
    expect(screen.getByLabelText('Comuna').value).toBe('Concepción')
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    expect(screen.getByRole('heading', { name: 'Compra realizada con éxito' })).toBeTruthy()
    expect(screen.getByText(/Dirección: Calle Uno 123, Concepción, Biobío/)).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: /Carrito/ }))
    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy()
  })

  // Datos: Cliente con sesión iniciada en su perfil.
  // Acción: Cambiar nombre, correo y región; elegir La Florida, guardar y abrir el checkout.
  // Resultado esperado: Cambiar región limpia la comuna; el nombre se actualiza en sesión y los datos guardados llegan al checkout.
  it('usa el nombre y la comuna editados en el perfil al abrir el checkout', () => {
    mostrar('/perfil', cliente)
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Nombre actualizado' } })
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'actualizado@gmail.com' } })
    fireEvent.change(screen.getByLabelText('Región'), { target: { value: 'Metropolitana' } })
    expect(screen.getByLabelText('Comuna').value).toBe('')
    fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'La Florida' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    iniciarCompra()

    expect(obtenerSesion().nombre).toBe('Nombre actualizado')
    expect(screen.getByLabelText('Nombre completo').value).toBe('Nombre actualizado')
    expect(screen.getByLabelText('Correo electrónico').value).toBe('actualizado@gmail.com')
    expect(screen.getByLabelText('Comuna').value).toBe('La Florida')
    expect(screen.getByLabelText('Dirección y número').value).toBe(cliente.direccion)
  })

  // Datos: Cliente con sesión iniciada y un producto en el carrito.
  // Acción: Cerrar sesión desde el perfil y comprar como Invitado, con correo invitado@gmail.com y retiro.
  // Resultado esperado: Se borra la sesión y los datos anteriores; se conserva el carrito y la compra exitosa identifica al invitado.
  it('conserva el carrito al cerrar sesión y permite comprar como invitado', () => {
    mostrar('/productos', cliente)
    iniciarCompra()
    verPerfil()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    continuarCompra()

    expect(obtenerSesion()).toBeNull()
    expect(screen.getByLabelText('Nombre completo').value).toBe('')
    expect(screen.getByLabelText('Correo electrónico').value).toBe('')
    expect(screen.getByLabelText('Dirección y número').value).toBe('')
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Invitado' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'invitado@gmail.com' } })
    fireEvent.change(screen.getByLabelText('Opción de entrega'), { target: { value: 'retiro' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    expect(screen.getByRole('heading', { name: 'Compra realizada con éxito' })).toBeTruthy()
    expect(screen.getByText('Cliente: Invitado — invitado@gmail.com')).toBeTruthy()
  })

  // Datos: Vendedor con sesión iniciada y un producto agregado.
  // Acción: Cerrar sesión desde el panel vendedor y volver al checkout.
  // Resultado esperado: La sesión queda vacía y el checkout no conserva el nombre ni la dirección del vendedor.
  it('limpia los datos del checkout al cerrar sesión desde el panel vendedor', () => {
    mostrar('/productos', segundoUsuario)
    iniciarCompra()
    fireEvent.click(screen.getByRole('link', { name: 'Vendedor' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    continuarCompra()

    expect(obtenerSesion()).toBeNull()
    expect(screen.getByLabelText('Nombre completo').value).toBe('')
    expect(screen.getByLabelText('Dirección y número').value).toBe('')
  })

  // Datos: Carrito de un cliente después de un pago fallido y una segunda cuenta de vendedor.
  // Acción: Cerrar la primera sesión, ingresar con la segunda cuenta y continuar la compra.
  // Resultado esperado: El checkout muestra Otra persona, Calle Dos 456 y Villa Alemana.
  it('carga la nueva cuenta al volver a comprar después de un pago fallido', () => {
    mostrar('/productos', cliente)
    iniciarCompra()
    fireEvent.change(screen.getByLabelText('Resultado del pago de demostración'), { target: { value: 'fallido' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    verPerfil()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    ingresar(segundoUsuario)
    continuarCompra()

    expect(screen.getByLabelText('Nombre completo').value).toBe(segundoUsuario.nombre)
    expect(screen.getByLabelText('Dirección y número').value).toBe(segundoUsuario.direccion)
    expect(screen.getByLabelText('Comuna').value).toBe('Villa Alemana')
  })

  // Datos: Cliente con una compra cuyo número se fija en 100.
  // Acción: Cerrar sesión y abrir otra vez /compra/exito/100.
  // Resultado esperado: Se muestra Resumen no disponible y no aparecen los datos personales del cliente.
  it('deja de mostrar el resumen de la compra al cerrar sesión', () => {
    // Fija el número de pedido para poder abrir otra vez su misma dirección.
    spyOn(Date, 'now').and.returnValue(100)
    iniciarSesion(cliente)
    render(
      <MemoryRouter initialEntries={['/productos']}>
        <ContenidoApp />
        <Link to="/compra/exito/100">Abrir compra anterior</Link>
      </MemoryRouter>
    )
    iniciarCompra()
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    expect(screen.getByRole('heading', { name: 'Compra realizada con éxito' })).toBeTruthy()
    verPerfil()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    fireEvent.click(screen.getByRole('link', { name: 'Abrir compra anterior' }))

    expect(screen.getByRole('heading', { name: 'Resumen no disponible' })).toBeTruthy()
    expect(screen.queryByText(/Cliente: Cliente de prueba/)).toBeNull()
  })

  // Datos: Usuario de prueba con rol administrador y sesión iniciada.
  // Acción: Editar su nombre a Nombre editado, guardar y abrir el checkout.
  // Resultado esperado: Tanto la sesión como el nombre del checkout muestran Nombre editado.
  it('actualiza la sesión al editar sus datos desde administración', () => {
    const administrador = actualizarUsuario(cliente.id, { rol: 'administrador' })
    mostrar('/admin/usuarios/' + administrador.id, administrador)
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Nombre editado' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))
    iniciarCompra()

    expect(obtenerSesion().nombre).toBe('Nombre editado')
    expect(screen.getByLabelText('Nombre completo').value).toBe('Nombre editado')
  })

  // Datos: Cliente con una compra de un producto de $25.000.
  // Acción: Cerrar sesión, ingresar como administrador, abrir Reportes y pulsar Ver detalle.
  // Resultado esperado: El reporte muestra al cliente y el comprobante abre el pedido con total de $25.000.
  it('incluye la compra en reportes y abre su comprobante por ID', () => {
    mostrar('/productos', cliente)
    iniciarCompra()
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    verPerfil()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    ingresar({ email: 'administrador@duoc.cl', rol: 'administrador' })
    fireEvent.click(screen.getByRole('link', { name: 'Reportes' }))
    expect(screen.getByText('Cliente de prueba')).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: 'Ver detalle' }))

    expect(screen.getByRole('heading', { name: /Detalle del pedido/ })).toBeTruthy()
    expect(screen.getByTestId('total-compra').textContent).toContain('25.000')
  })
})
