import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminProductos from '../paginas/AdminProductos.jsx'
import AdminCategorias from '../paginas/AdminCategorias.jsx'
import productos from '../datos/productos.json'
import categorias from '../datos/categorias.json'

// Revisa las consultas de productos y categorías, el detalle y el filtro de stock.
describe('Catálogo administrativo', () => {
  afterEach(() => cleanup())

  // Datos: Productos y categorías de los archivos JSON.
  // Acción: Abrir la consulta de productos.
  // Resultado esperado: Hay una fila por producto más el encabezado, y aparece el nombre del primer producto.
  it('muestra los productos recibidos desde el JSON', () => {
    render(<MemoryRouter><AdminProductos productos={productos} categorias={categorias} /></MemoryRouter>)

    expect(screen.getAllByRole('row').length).toBe(productos.length + 1)
    expect(screen.getByText(productos[0].nombre)).toBeTruthy()
  })

  // Datos: Consulta de productos con el detalle cerrado.
  // Acción: Abrir el primer producto y luego pulsar Cerrar detalle.
  // Resultado esperado: Aparece su descripción al abrir y desaparece la sección de detalle al cerrar.
  it('abre el detalle al pulsar Ver detalle y lo oculta al pulsar Cerrar detalle', () => {
    render(<MemoryRouter><AdminProductos productos={productos} categorias={categorias} /></MemoryRouter>)

    expect(screen.queryByRole('region', { name: 'Detalle administrativo del producto' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Ver detalle de ' + productos[0].nombre }))
    expect(screen.getByText(productos[0].descripcion)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar detalle' }))
    expect(screen.queryByRole('region', { name: 'Detalle administrativo del producto' })).toBeNull()
  })

  // Datos: Tres productos con stock 8, 5 y 0.
  // Acción: Activar y desactivar el filtro de stock crítico.
  // Resultado esperado: El filtro muestra solo los de stock 5 y 0; al quitarlo vuelven los tres y el stock no cambia.
  it('filtra los productos críticos y agotados sin cambiar sus existencias', () => {
    const ejemplos = [
      { ...productos[0], id: 101, nombre: 'Normal', stock: 8 },
      { ...productos[0], id: 102, nombre: 'Crítico', stock: 5 },
      { ...productos[0], id: 103, nombre: 'Agotado', stock: 0 }
    ]
    render(<MemoryRouter><AdminProductos productos={ejemplos} categorias={categorias} /></MemoryRouter>)

    fireEvent.click(screen.getByLabelText('Mostrar solo productos con stock crítico o agotado'))
    expect(screen.getAllByRole('row').length).toBe(3)
    expect(screen.queryByText('Normal', { selector: 'td' })).toBeNull()
    expect(ejemplos.map(producto => producto.stock)).toEqual([8, 5, 0])
    fireEvent.click(screen.getByLabelText('Mostrar solo productos con stock crítico o agotado'))
    expect(screen.getAllByRole('row').length).toBe(4)
  })

  // Datos: Productos y categorías del JSON.
  // Acción: Abrir la consulta de categorías.
  // Resultado esperado: Hay una fila por categoría; la primera muestra su nombre y la cantidad de productos asociados.
  it('muestra cada categoría y la cantidad de productos asociados', () => {
    render(<MemoryRouter><AdminCategorias categorias={categorias} productos={productos} /></MemoryRouter>)

    const filas = screen.getAllByRole('row')
    expect(filas.length).toBe(categorias.length + 1)
    expect(filas[1].textContent).toContain(categorias[0].nombre)
    expect(filas[1].cells[2].textContent).toBe(String(productos.filter(producto => producto.categoriaId === categorias[0].id).length))
  })

  // Datos: Consultas de productos y categorías con una copia del contenido original del JSON.
  // Acción: Buscar controles de escritura y abrir el detalle del primer producto.
  // Resultado esperado: No hay botones para crear, editar o eliminar y el contenido del JSON sigue igual.
  it('permite consultar el catálogo sin ofrecer crear, editar o eliminar datos', () => {
    const original = JSON.stringify({ productos, categorias })
    render(
      <MemoryRouter>
        <AdminProductos productos={productos} categorias={categorias} />
        <AdminCategorias categorias={categorias} productos={productos} />
      </MemoryRouter>
    )

    expect(screen.queryByRole('button', { name: /Nuevo|Crear|Editar|Eliminar/ })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Ver detalle de ' + productos[0].nombre }))
    expect(JSON.stringify({ productos, categorias })).toBe(original)
  })
})
