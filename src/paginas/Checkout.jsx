import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { regionesCompra } from '../datos/regionesCompra.js'
import { validarCliente, validarCarritoCompra } from '../servicios/compras.js'
import { obtenerLineas } from '../servicios/carrito.js'
import ResumenCompra from '../componentes/ResumenCompra.jsx'

function Checkout({ carrito, productos, onConfirmar, usuario = null }) {
  const navigate = useNavigate()
  const location = useLocation()
  const usuarioId = usuario ? usuario.id : null
  const [cliente, setCliente] = useState(() => {
    const reintento = location.state
    if (reintento?.cliente && reintento.usuarioId === usuarioId) return reintento.cliente
    return {
      nombre: usuario?.nombre || '',
      email: usuario?.email || '',
      direccion: usuario?.direccion || '',
      region: usuario?.region || '',
      comuna: usuario?.comuna || '',
      entrega: 'domicilio'
    }
  })
  const [resultado, setResultado] = useState('exitoso')
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)
  const comunas = regionesCompra[cliente.region] || []

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setCliente(anterior => ({
      ...anterior,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {})
    }))
  }

  function pagar(evento) {
    evento.preventDefault()
    setError('')
    if (procesando) return
    const mensaje = validarCliente(cliente)
    if (mensaje) {
      setError(mensaje)
      return
    }
    setProcesando(true)
    try {
      validarCarritoCompra(carrito, productos)
      if (resultado === 'fallido') {
        navigate('/compra/error', { state: { cliente, usuarioId } })
        return
      }
      const pedido = onConfirmar(cliente, usuarioId)
      navigate('/compra/exito/' + pedido.id)
    } catch (error) {
      setError(error.message)
      setProcesando(false)
    }
  }

  if (carrito.length === 0) {
    return <main className="container py-4"><h1>Checkout</h1><p>Tu carrito está vacío.</p><Link to="/productos">Ver productos</Link></main>
  }

  return (
    <main className="container py-4">
      <h1>Finalizar compra</h1>
      {usuario && <p>Se cargaron los datos disponibles de tu sesión. Puedes corregirlos antes de comprar.</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-4">
        <div className="col-lg-7">
          <form onSubmit={pagar} className="card p-4">
            <div className="mb-3">
              <label htmlFor="compra-nombre" className="form-label">Nombre completo</label>
              <input id="compra-nombre" className="form-control" name="nombre" autoComplete="name"
                value={cliente.nombre} onChange={cambiarCampo} required />
            </div>
            <div className="mb-3">
              <label htmlFor="compra-email" className="form-label">Correo electrónico</label>
              <input id="compra-email" className="form-control" name="email" type="email" autoComplete="email"
                value={cliente.email} onChange={cambiarCampo} required />
            </div>
            <div className="mb-3">
              <label htmlFor="compra-entrega" className="form-label">Opción de entrega</label>
              <select id="compra-entrega" className="form-select" name="entrega" value={cliente.entrega} onChange={cambiarCampo}>
                <option value="domicilio">Despacho a domicilio</option>
                <option value="retiro">Retiro en tienda</option>
              </select>
            </div>
            {cliente.entrega === 'domicilio' && (
              <>
                <div className="mb-3">
                  <label htmlFor="compra-direccion" className="form-label">Dirección y número</label>
                  <input id="compra-direccion" className="form-control" name="direccion" autoComplete="street-address"
                    value={cliente.direccion} onChange={cambiarCampo} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="compra-region" className="form-label">Región</label>
                  <select id="compra-region" className="form-select" name="region" value={cliente.region} onChange={cambiarCampo} required>
                    <option value="">Selecciona una región</option>
                    {Object.keys(regionesCompra).map(region => <option key={region} value={region}>{region}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="compra-comuna" className="form-label">Comuna</label>
                  <select id="compra-comuna" className="form-select" name="comuna" value={cliente.comuna}
                    onChange={cambiarCampo} disabled={!cliente.region} required>
                    <option value="">Selecciona una comuna</option>
                    {comunas.map(comuna => <option key={comuna} value={comuna}>{comuna}</option>)}
                  </select>
                </div>
              </>
            )}
            <div className="mb-3">
              <label htmlFor="compra-resultado" className="form-label">Resultado del pago de demostración</label>
              <select id="compra-resultado" className="form-select" value={resultado} onChange={evento => setResultado(evento.target.value)}>
                <option value="exitoso">Pago exitoso</option>
                <option value="fallido">Pago fallido</option>
              </select>
              <p className="form-text">Compra simulada para la evaluación. No se realiza un cobro real.</p>
            </div>
            <button className="btn btn-success" type="submit" disabled={procesando}>Confirmar compra simulada</button>
            <Link className="mt-3" to="/carrito">Volver al carrito</Link>
          </form>
        </div>
        <div className="col-lg-5"><ResumenCompra lineas={obtenerLineas(carrito, productos)} /></div>
      </div>
    </main>
  )
}

export default Checkout
