import { useState } from 'react'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Checkout from '../paginas/Checkout.jsx'
import ResultadoCompra from '../paginas/ResultadoCompra.jsx'
import productos from '../datos/productos.json'
import { confirmarCompra } from '../servicios/compras.js'

const usuario = {
  id: 7, nombre: 'Cliente de prueba', email: 'prueba@gmail.com', direccion: 'Calle de prueba 123',
  region: 'Metropolitana', comuna: 'Santiago'
}

function CompraPrueba({ confirmar }) {
  const [carrito, setCarrito] = useState([{ productoId: productos[0].id, cantidad: 1 }])
  const [pedido, setPedido] = useState(null)

  function comprar(cliente, usuarioId) {
    const resumen = confirmar ? confirmar(cliente, usuarioId) : confirmarCompra(carrito, cliente, productos, usuarioId)
    setPedido(resumen)
    setCarrito([])
    return resumen
  }

  return (
    <>
      <p data-testid="elementos-carrito">{carrito.length}</p>
      <Routes>
        <Route path="/checkout" element={<Checkout carrito={carrito} productos={productos} usuario={usuario} onConfirmar={comprar} />} />
        <Route path="/compra/error" element={<ResultadoCompra fallido />} />
        <Route path="/compra/exito/:id" element={<ResultadoCompra pedido={pedido} />} />
      </Routes>
    </>
  )
}

function mostrar(confirmar, estado = null) {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/checkout', state: estado }]}>
      <CompraPrueba confirmar={confirmar} />
    </MemoryRouter>
  )
}

// Revisa los datos del cliente y los resultados del pago simulado.
describe('Checkout', () => {
  afterEach(() => cleanup())

  // Datos: Cliente de prueba, Calle de prueba 123 y comuna Santiago.
  // Acción: Abrir el checkout con ese usuario.
  // Resultado esperado: Nombre, dirección y comuna aparecen completos con esos valores.
  it('completa nombre, dirección y comuna con el usuario recibido', () => {
    mostrar()

    expect(screen.getByLabelText('Nombre completo').value).toBe('Cliente de prueba')
    expect(screen.getByLabelText('Dirección y número').value).toBe('Calle de prueba 123')
    expect(screen.getByLabelText('Comuna').value).toBe('Santiago')
  })

  // Datos: Un producto en el carrito y un usuario con datos de entrega.
  // Acción: Elegir pago fallido, confirmar y pulsar Reintentar pago.
  // Resultado esperado: Se muestra el rechazo, no se confirma la compra, queda un producto y el reintento conserva el nombre.
  it('conserva el carrito cuando falla el pago y permite volver al checkout', () => {
    const confirmar = jasmine.createSpy('confirmar')
    mostrar(confirmar)

    fireEvent.change(screen.getByLabelText('Resultado del pago de demostración'), { target: { value: 'fallido' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    expect(screen.getByRole('heading', { name: 'No se pudo realizar el pago' })).toBeTruthy()
    expect(confirmar).not.toHaveBeenCalled()
    expect(screen.getByTestId('elementos-carrito').textContent).toBe('1')
    fireEvent.click(screen.getByRole('link', { name: 'Reintentar pago' }))
    expect(screen.getByLabelText('Nombre completo').value).toBe('Cliente de prueba')
  })

  // Datos: Un producto en el carrito y datos válidos del cliente.
  // Acción: Confirmar el pago exitoso.
  // Resultado esperado: Se muestra el éxito y el producto en el resumen, el carrito queda vacío y el JSON no cambia.
  it('muestra el resumen y vacía el carrito al confirmar una compra', () => {
    const original = JSON.stringify(productos)
    mostrar()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar compra simulada' }))
    expect(screen.getByRole('heading', { name: 'Compra realizada con éxito' })).toBeTruthy()
    expect(screen.getByText(productos[0].nombre, { exact: false })).toBeTruthy()
    expect(screen.getByTestId('elementos-carrito').textContent).toBe('0')
    expect(JSON.stringify(productos)).toBe(original)
  })

  // Datos: Dirección /compra/exito/1 sin un pedido en memoria.
  // Acción: Abrir esa dirección.
  // Resultado esperado: Se muestra el título Resumen no disponible.
  it('avisa que el resumen no está disponible si no hay un pedido en memoria', () => {
    render(
      <MemoryRouter initialEntries={['/compra/exito/1']}>
        <Routes><Route path="/compra/exito/:id" element={<ResultadoCompra />} /></Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Resumen no disponible' })).toBeTruthy()
  })

  // Datos: Usuario activo con ID 7 y un reintento con los datos de otra persona, ID 99.
  // Acción: Abrir el checkout con ese reintento.
  // Resultado esperado: Se usan nombre, correo y dirección del usuario activo, no los de la otra persona.
  it('descarta los datos de un reintento que pertenece a otra cuenta', () => {
    mostrar(null, {
      usuarioId: 99,
      cliente: { nombre: 'Otro cliente', email: 'otro@gmail.com', direccion: 'Otra calle 456' }
    })

    expect(screen.getByLabelText('Nombre completo').value).toBe(usuario.nombre)
    expect(screen.getByLabelText('Correo electrónico').value).toBe(usuario.email)
    expect(screen.getByLabelText('Dirección y número').value).toBe(usuario.direccion)
  })
})
