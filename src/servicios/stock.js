// Se considera stock crítico cuando quedan cinco unidades o menos.
export const UMBRAL_STOCK_CRITICO = 5

export function obtenerEstadoStock(stock) {
  if (stock === 0) return 'Agotado'
  if (stock <= UMBRAL_STOCK_CRITICO) return 'Crítico'
  return 'Normal'
}

export function listarProductosStockCritico(productos) {
  return productos.filter(producto => producto.stock <= UMBRAL_STOCK_CRITICO)
}

export function contarProductosStockCritico(productos) {
  return listarProductosStockCritico(productos).length
}
