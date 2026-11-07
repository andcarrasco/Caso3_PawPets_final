import { useNavigate } from 'react-router-dom'
import FormularioUsuario from '../componentes/FormularioUsuario.jsx'
import { crearUsuario } from '../servicios/usuarios.js'

function NuevoUsuario() {
  const navigate = useNavigate()

  function guardar(datos) {
    crearUsuario(datos)
    navigate('/admin/usuarios')
  } // fin guardar

  function cancelar() {
    navigate('/admin/usuarios')
  } // fin cancelar

  return (
    <main className="container py-5">
      <h1 className="mb-4">Nuevo usuario</h1>
      <FormularioUsuario
        onGuardar={guardar}
        onCancelar={cancelar}
      />
    </main>
  )
} // fin NuevoUsuario

export default NuevoUsuario