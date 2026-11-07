// Funciones de cálculo: el componente padre conserva el carrito en useState.
export function agregarAlCarrito(carrito, producto) {
  const existente = carrito.find(item => item.productoId === producto.id)
  const cantidad = existente ? existente.cantidad + 1 : 1
  if (cantidad > producto.stock) throw new Error('No hay stock suficiente.')

  if (existente) {
    return carrito.map(item => item.productoId === producto.id ? { ...item, cantidad } : item)
  }
  return [...carrito, { productoId: producto.id, cantidad: 1 }]
}

export function cambiarCantidad(carrito, producto, cantidad) {
  const numero = Number(cantidad)
  if (!Number.isInteger(numero) || numero < 1) {
    throw new Error('La cantidad debe ser un número entero mayor que cero.')
  }
  if (numero > producto.stock) throw new Error('No hay stock suficiente.')
  return carrito.map(item => item.productoId === producto.id ? { ...item, cantidad: numero } : item)
}

export function quitarDelCarrito(carrito, productoId) {
  return carrito.filter(item => item.productoId !== productoId)
}

export function obtenerLineas(carrito, productos) {
  return carrito.map(item => {
    const producto = productos.find(producto => producto.id === item.productoId)
    return {
      productoId: item.productoId,
      nombre: producto ? producto.nombre : 'Producto no disponible',
      precio: producto ? producto.precio : 0,
      stock: producto ? producto.stock : 0,
      disponible: Boolean(producto),
      cantidad: item.cantidad,
      subtotal: (producto ? producto.precio : 0) * item.cantidad
    }
  })
}

export function calcularTotal(lineas) {
  return lineas.reduce((total, linea) => total + linea.subtotal, 0)
}
