import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminReportes from '../paginas/AdminReportes.jsx'
import DetallePedido from '../paginas/DetallePedido.jsx'

// Revisa las sumas de ventas y los datos del comprobante de un pedido.
describe('Reportes y pedidos', () => {
  afterEach(() => cleanup())

  // Datos: Listas vacías de productos y pedidos.
  // Acción: Abrir los reportes administrativos.
  // Resultado esperado: Las ventas muestran $0 y aparece el mensaje de que no hay compras en la sesión.
  it('muestra ventas en cero y un mensaje cuando no existen pedidos', () => {
    render(<MemoryRouter><AdminReportes productos={[]} pedidos={[]} /></MemoryRouter>)

    expect(screen.getByText('$0')).toBeTruthy()
    expect(screen.getByText('No hay compras registradas en esta sesión.')).toBeTruthy()
  })

  // Datos: Dos pedidos del mes actual, uno de $10.000 y otro de $15.000.
  // Acción: Abrir los reportes con ambos pedidos.
  // Resultado esperado: Se muestran $25.000, los nombres de los dos clientes y dos enlaces Ver detalle.
  it('suma dos pedidos del mes y muestra un enlace al detalle de cada uno', () => {
    const fecha = new Date().toISOString()
    const pedidos = [
      { id: 101, cliente: { nombre: 'Cliente Uno' }, fecha, total: 10000, entrega: 'retiro' },
      { id: 102, cliente: { nombre: 'Cliente Dos' }, fecha, total: 15000, entrega: 'domicilio' }
    ]
    render(<MemoryRouter><AdminReportes productos={[]} pedidos={pedidos} /></MemoryRouter>)

    expect(screen.getByText('$25.000')).toBeTruthy()
    expect(screen.getByText('Cliente Uno')).toBeTruthy()
    expect(screen.getByText('Cliente Dos')).toBeTruthy()
    expect(screen.getAllByRole('link', { name: 'Ver detalle' }).length).toBe(2)
  })

  // Datos: Dirección /admin/pedidos/999 y lista de pedidos vacía.
  // Acción: Abrir el detalle de ese pedido.
  // Resultado esperado: Se muestra el título Pedido no disponible.
  it('avisa cuando el ID de la dirección no corresponde a un pedido', () => {
    render(
      <MemoryRouter initialEntries={['/admin/pedidos/999']}>
        <Routes><Route path="/admin/pedidos/:id" element={<DetallePedido pedidos={[]} />} /></Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Pedido no disponible' })).toBeTruthy()
  })

  // Datos: Pedido 103 de Cliente Prueba con dos Huesos de goma de $3.500.
  // Acción: Abrir /admin/pedidos/103.
  // Resultado esperado: Se ven pedido, cliente, correo, producto, total $7.000, botón de impresión y enlace a reportes.
  it('busca el pedido por su ID y muestra cliente, producto, total e impresión', () => {
    const pedido = {
      id: 103,
      fecha: '2026-10-22T15:00:00.000Z',
      cliente: { nombre: 'Cliente Prueba', email: 'prueba@pawpets.cl' },
      entrega: 'retiro',
      direccion: null,
      productos: [
        { productoId: 1, nombre: 'Hueso de goma', cantidad: 2, precio: 3500, subtotal: 7000 }
      ],
      total: 7000
    }
    render(
      <MemoryRouter initialEntries={['/admin/pedidos/103']}>
        <Routes><Route path="/admin/pedidos/:id" element={<DetallePedido pedidos={[pedido]} />} /></Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Detalle del pedido #103' })).toBeTruthy()
    expect(screen.getByText(/Cliente Prueba/)).toBeTruthy()
    expect(screen.getByText(/prueba@pawpets.cl/)).toBeTruthy()
    expect(screen.getByText(/Hueso de goma/)).toBeTruthy()
    expect(screen.getByTestId('total-compra').textContent).toContain('$7.000')
    expect(screen.getByRole('button', { name: 'Imprimir comprobante' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Volver a reportes' }).getAttribute('href')).toBe('/admin/reportes')
  })
})
