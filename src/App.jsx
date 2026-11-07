// Catálogo compartido desde JSON y carrito en memoria mediante estado React.
import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import Header from './componentes/Header.jsx'
import RutaProtegida from './componentes/RutaProtegida.jsx'
import Footer from './componentes/Footer.jsx'
import Inicio from './paginas/Inicio.jsx'
import Nosotros from './paginas/Nosotros.jsx'
import Blog from './paginas/Blog.jsx'
import BlogCalor from './paginas/BlogCalor.jsx'
import BlogVacunas from './paginas/BlogVacunas.jsx'
import AdminReportes from './paginas/AdminReportes.jsx'
import AdminProductos from './paginas/AdminProductos.jsx'
import AdminCategorias from './paginas/AdminCategorias.jsx'
import Catalogo from './paginas/Catalogo.jsx'
import DetalleProducto from './paginas/DetalleProducto.jsx'
import Categorias from './paginas/Categorias.jsx'
import Ofertas from './paginas/Ofertas.jsx'
import Carrito from './paginas/Carrito.jsx'
import Checkout from './paginas/Checkout.jsx'
import ResultadoCompra from './paginas/ResultadoCompra.jsx'
import DetallePedido from './paginas/DetallePedido.jsx'
import productos from './datos/productos.json'
import categorias from './datos/categorias.json'
import { agregarAlCarrito, cambiarCantidad, quitarDelCarrito } from './servicios/carrito.js'
import { confirmarCompra } from './servicios/compras.js'
import { obtenerSesion, iniciarSesion, cerrarSesion } from './servicios/sesion.js'
import Login from './paginas/Login.jsx'
import Registro from './paginas/Registro.jsx'
import Contacto from './paginas/Contacto.jsx'
import Vendedor from './paginas/Vendedor.jsx'
import AdminUsuarios from './paginas/AdminUsuarios.jsx'
import Perfil from './paginas/Perfil.jsx'
import NuevoUsuario from './paginas/NuevoUsuario.jsx'
import EditarUsuario from './paginas/EditarUsuario.jsx'
import DetalleUsuario from './paginas/DetalleUsuario.jsx'
import './estilos/tienda.css'


export function ContenidoApp() {
  const [usuario, setUsuario] = useState(() => obtenerSesion())
  const [carrito, setCarrito] = useState([])
  const [ultimoPedido, setUltimoPedido] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const location = useLocation()

  function agregar(id) {
    const producto = productos.find(producto => producto.id === id)
    if (!producto) throw new Error('El producto ya no está disponible.')
    setCarrito(agregarAlCarrito(carrito, producto))
  }

  function cambiar(id, cantidad) {
    const producto = productos.find(producto => producto.id === id)
    if (!producto) throw new Error('El producto ya no está disponible. Elimínalo del carrito.')
    setCarrito(cambiarCantidad(carrito, producto, cantidad))
  }

  function comprar(cliente, usuarioId) {
    const pedido = confirmarCompra(carrito, cliente, productos, usuarioId)
    setUltimoPedido(pedido)
    setPedidos(actuales => [...actuales, pedido])
    setCarrito([])
    return pedido
  }

  function recibirSesion(sesion) {
    setUsuario(sesion)
    setUltimoPedido(null)
  }

  function cerrarSesionActual() {
    cerrarSesion()
    recibirSesion(null)
  }

  function actualizarUsuarioSesion(usuarioActualizado) {
    if (usuario?.id === usuarioActualizado.id) {
      setUsuario(iniciarSesion(usuarioActualizado))
    }
  }

  const cantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0)

  return (
    <>
        <div className={location.pathname.startsWith("/admin/pedidos/") ? "d-print-none" : ""}><Header cantidadCarrito={cantidadCarrito} usuario={usuario} onCerrarSesion={cerrarSesionActual} /></div>
      <div className="contenido-principal">
        <Routes location={location}>
          <Route path="/" element={<Inicio productos={productos} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/calor" element={<BlogCalor />} />
          <Route path="/blog/vacunas" element={<BlogVacunas />} />
          <Route element={<RutaProtegida usuario={usuario} rolPermitido="administrador" />}>
          <Route path="/admin/reportes" element={<AdminReportes productos={productos} pedidos={pedidos} />} />
          <Route path="/admin/pedidos/:id" element={<DetallePedido pedidos={pedidos} />} />
          <Route path="/admin/productos" element={<AdminProductos productos={productos} categorias={categorias} />} />
          <Route path="/admin/categorias" element={<AdminCategorias categorias={categorias} productos={productos} />} />
          </Route>
          <Route path="/productos" element={<Catalogo productos={productos} onAgregar={agregar} />} />
          <Route path="/productos/:id" element={<DetalleProducto key={location.pathname} productos={productos} onAgregar={agregar} />} />
          <Route path="/categorias" element={<Categorias productos={productos} categorias={categorias} onAgregar={agregar} />} />
          <Route path="/categorias/:id" element={<Categorias productos={productos} categorias={categorias} onAgregar={agregar} />} />
          <Route path="/ofertas" element={<Ofertas productos={productos} onAgregar={agregar} />} />
          <Route path="/carrito" element={<Carrito carrito={carrito} productos={productos} onCambiarCantidad={cambiar}
            onEliminar={id => setCarrito(quitarDelCarrito(carrito, id))} onVaciar={() => setCarrito([])} />} />
          <Route path="/checkout" element={<Checkout key={usuario ? usuario.id : 'invitado'} carrito={carrito} productos={productos} onConfirmar={comprar} usuario={usuario} />} />
          <Route path="/compra/exito/:id" element={<ResultadoCompra pedido={ultimoPedido} />} />
          <Route path="/compra/error" element={<ResultadoCompra fallido />} />
          <Route path="/login" element={<Login onLogin={recibirSesion} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route element={<RutaProtegida usuario={usuario} rolPermitido="administrador" />}>
          <Route path="/admin/usuarios/detalle/:id" element={<DetalleUsuario />} />
          <Route path="/admin/usuarios/nuevo" element={<NuevoUsuario />} />
          <Route path="/admin/usuarios/:id" element={<EditarUsuario onActualizarUsuario={actualizarUsuarioSesion} />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          </Route>
          <Route element={<RutaProtegida usuario={usuario} rolPermitido="vendedor" />}>
          <Route path="/vendedor" element={<Vendedor productos={productos} onCerrarSesion={cerrarSesionActual} />} />
          </Route>
          <Route path="/perfil" element={<Perfil onActualizarUsuario={actualizarUsuarioSesion} onCerrarSesion={cerrarSesionActual} />} />
          <Route path="*" element={<main className="container py-4"><h1>Vista no disponible</h1>
            <p>Esta dirección no tiene una página integrada todavía.</p><Link to="/productos">Ir a la tienda</Link></main>} />
        </Routes>
      </div>
        <div className={location.pathname.startsWith("/admin/pedidos/") ? "d-print-none" : ""}><Footer /></div>
    </>
  )
} // fin ContenidoApp

function App() {
  return (
    <BrowserRouter>
      <ContenidoApp />
    </BrowserRouter>
  )
} // fin App

export default App
