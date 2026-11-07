import productos from '../datos/productos.json'
import { confirmarCompra, validarCliente } from '../servicios/compras.js'
import { agregarAlCarrito, cambiarCantidad, quitarDelCarrito } from '../servicios/carrito.js'

// Revisa cantidades, stock y los datos que se copian al resumen.
describe('Carrito y compra simulada', () => {
  const cliente = {
    nombre: 'Cliente de prueba', email: 'prueba@gmail.com', direccion: 'Calle de prueba 123',
    region: 'Metropolitana', comuna: 'Santiago', entrega: 'domicilio'
  }

  // Datos: Carrito vacío y el primer producto del JSON.
  // Acción: Agregar una unidad y luego quitarla.
  // Resultado esperado: La copia inicial sigue vacía, se agrega el ID con cantidad 1 y al quitarlo el carrito queda vacío.
  it('agrega y quita productos sin modificar el carrito original', () => {
    const original = []
    const carrito = agregarAlCarrito(original, productos[0])
    expect(original).toEqual([])
    expect(carrito).toEqual([{ productoId: productos[0].id, cantidad: 1 }])
    expect(quitarDelCarrito(carrito, productos[0].id)).toEqual([])
  })

  // Datos: Un producto agregado al carrito.
  // Acción: Pedir una cantidad mayor al stock, una cantidad 0 y una cantidad 1,5.
  // Resultado esperado: Cada intento lanza el error correspondiente: stock insuficiente o cantidad entera inválida.
  it('impide cantidades superiores al stock y cantidades inválidas', () => {
    const producto = productos[0]
    const carrito = [{ productoId: producto.id, cantidad: 1 }]
    expect(() => cambiarCantidad(carrito, producto, producto.stock + 1)).toThrowError(/stock/)
    expect(() => cambiarCantidad(carrito, producto, 0)).toThrowError(/entero/)
    expect(() => cambiarCantidad(carrito, producto, 1.5)).toThrowError(/entero/)
  })

  // Datos: Usuario 7 y dos unidades del primer producto, a $25.000 cada una.
  // Acción: Confirmar la compra con los datos válidos del cliente.
  // Resultado esperado: El pedido pertenece al usuario 7, contiene 2 unidades, suma $50.000 y no modifica el JSON.
  it('calcula el total del pedido sin cambiar los productos del JSON', () => {
    const original = JSON.stringify(productos)
    const pedido = confirmarCompra([{ productoId: productos[0].id, cantidad: 2 }], cliente, productos, 7)
    expect(pedido.usuarioId).toBe(7)
    expect(pedido.total).toBe(productos[0].precio * 2)
    expect(pedido.productos[0].cantidad).toBe(2)
    expect(JSON.stringify(productos)).toBe(original)
  })

  // Datos: Una copia del catálogo y un pedido con una unidad del primer producto.
  // Acción: Cambiar el nombre y subir $1.000 al precio de la copia del catálogo.
  // Resultado esperado: El pedido conserva el nombre y el precio que tenía al confirmar la compra.
  it('copia nombre y precio al resumen sin reutilizar el objeto del catálogo', () => {
    const ejemplos = productos.map(producto => ({ ...producto }))
    const pedido = confirmarCompra([{ productoId: ejemplos[0].id, cantidad: 1 }], cliente, ejemplos)
    ejemplos[0].nombre = 'Nombre de otra demostración'
    ejemplos[0].precio += 1000
    expect(pedido.productos[0].nombre).toBe(productos[0].nombre)
    expect(pedido.productos[0].precio).toBe(productos[0].precio)
  })

  // Datos: Cliente válido y tres carritos: sin stock suficiente, vacío y con producto inexistente.
  // Acción: Intentar confirmar la compra de cada carrito.
  // Resultado esperado: Los tres intentos lanzan su error correspondiente y el JSON permanece igual.
  it('rechaza una compra inválida y mantiene intactos los datos estáticos', () => {
    const original = JSON.stringify(productos)
    expect(() => confirmarCompra([{ productoId: productos[0].id, cantidad: productos[0].stock + 1 }], cliente, productos)).toThrowError(/stock/)
    expect(() => confirmarCompra([], cliente, productos)).toThrowError(/vacío/)
    expect(() => confirmarCompra([{ productoId: -1, cantidad: 1 }], cliente, productos)).toThrowError(/disponible/)
    expect(JSON.stringify(productos)).toBe(original)
  })

  // Datos: Cliente con comuna incorrecta, cliente sin dirección y cliente con retiro en tienda.
  // Acción: Validar cada opción de entrega.
  // Resultado esperado: El domicilio informa errores de comuna o dirección; el retiro sin dirección no informa errores.
  it('valida el domicilio y permite retiro sin dirección', () => {
    expect(validarCliente({ ...cliente, comuna: 'Comuna no válida' })).toContain('comuna')
    expect(validarCliente({ ...cliente, direccion: '' })).toContain('dirección')
    expect(validarCliente({ ...cliente, entrega: 'retiro', direccion: '', region: '', comuna: '' })).toBe('')
  })
})
