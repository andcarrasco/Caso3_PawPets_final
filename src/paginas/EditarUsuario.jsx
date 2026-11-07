import { useNavigate, useParams } from 'react-router-dom'
import FormularioUsuario from '../componentes/FormularioUsuario.jsx'
import { buscarUsuario, actualizarUsuario } from '../servicios/usuarios.js'

function EditarUsuario({ onActualizarUsuario }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const usuario = buscarUsuario(id)

  if (!usuario) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger">Usuario no encontrado.</div>
      </main>
    )
  } // fin if no usuario

  function guardar(datos) {
    const actualizado = actualizarUsuario(usuario.id, datos)
    onActualizarUsuario(actualizado)
    navigate('/admin/usuarios')
  } // fin guardar

  function cancelar() {
    navigate('/admin/usuarios')
  } // fin cancelar

  return (
    <main className="container py-5">
      <h1 className="mb-4">Editar usuario</h1>
      <FormularioUsuario
        usuarioInicial={usuario}
        onGuardar={guardar}
        onCancelar={cancelar}
      />
    </main>
  )
} // fin EditarUsuario

export default EditarUsuario
