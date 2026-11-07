import { useState } from 'react'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Catalogo from '../paginas/Catalogo.jsx'
import Carrito from '../paginas/Carrito.jsx'
import { cambiarCantidad } from '../servicios/carrito.js'

const productos = [
  { id: 1, nombre: 'Pelota', descripcion: 'Juguete', precio: 3000, stock: 10, categoriaId: 1, imagen: '', oferta: false },
  { id: 2, nombre: 'Correa', descripcion: 'Accesorio', precio: 5000, stock: 5, categoriaId: 2, imagen: '', oferta: true }
]

function CarritoPrueba() {
  const [carrito, setCarrito] = useState([{ productoId: 1, cantidad: 1 }])
  return (
    <Carrito carrito={carrito} productos={productos}
      onCambiarCantidad={(id, cantidad) => setCarrito(cambiarCantidad(carrito, productos.find(producto => producto.id === id), cantidad))}
      onEliminar={() => {}} onVaciar={() => {}} />
  )
}

// Revisa que las tarjetas usen sus props y que los clics cambien el carrito.
describe('Catálogo y carrito', () => {
  afterEach(() => cleanup())

  // Datos: Dos productos: Pelota de $3.000 y Correa de $5.000.
  // Acción: Abrir el catálogo con esa lista.
  // Resultado esperado: Se muestran dos tarjetas con los nombres Pelota y Correa.
  it('muestra una tarjeta por cada producto recibido', () => {
    render(<MemoryRouter><Catalogo productos={productos} onAgregar={() => {}} /></MemoryRouter>)

    expect(screen.getAllByRole('article').length).toBe(2)
    expect(screen.getByRole('heading', { name: 'Pelota' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Correa' })).toBeTruthy()
  })

  // Datos: Catálogo con Pelota, ID 1, y una función de agregar simulada con un spy.
  // Acción: Pulsar Agregar al carrito en la primera tarjeta.
  // Resultado esperado: Se llama a la función con ID 1 y aparece la confirmación Producto agregado.
  it('envía el ID al agregar un producto y muestra la confirmación', () => {
    const agregar = jasmine.createSpy('agregar')
    render(<MemoryRouter><Catalogo productos={productos} onAgregar={agregar} /></MemoryRouter>)

    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])
    expect(agregar).toHaveBeenCalledWith(1)
    expect(screen.getByRole('status').textContent).toContain('Producto agregado')
  })

  // Datos: Una pelota de $3.000, cantidad 1 y total inicial $3.000.
  // Acción: Pulsar Aumentar Pelota.
  // Resultado esperado: La cantidad cambia a 2 y el total a $6.000.
  it('aumenta la cantidad de una pelota y cambia el total de 3000 a 6000', () => {
    render(<MemoryRouter><CarritoPrueba /></MemoryRouter>)

    expect(screen.getByTestId('total-carrito').textContent).toContain('3.000')
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar Pelota' }))
    expect(screen.getByLabelText('Cantidad de Pelota').textContent).toBe('2')
    expect(screen.getByTestId('total-carrito').textContent).toContain('6.000')
  })
})
