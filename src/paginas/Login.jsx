import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { buscarUsuarioPorEmail } from '../servicios/usuarios.js'
import { iniciarSesion, destinoRol } from '../servicios/sesion.js'

function Login({ onLogin }) {
  const [formulario, setFormulario] = useState({
    email: '',
    password: '',
    rol: ''
  }) // fin estado formulario

  const [errores, setErrores] = useState({}) // fin estado errores
  const [error, setError] = useState('') // fin estado error general
  const navigate = useNavigate() // fin navigate

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario(anterior => ({
      ...anterior,
      [name]: value
    }))
  } // fin cambiarCampo

  function validarCorreo(email) {
    const dominios = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com', '@pawpets.cl']
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const dominio = dominios.some(d => email.endsWith(d))
    return formato && dominio
  } // fin validarCorreo

  function validar() {
    const nuevosErrores = {}

    if (!formulario.rol) {
      nuevosErrores.rol = 'Seleccione un rol.'
    } // fin validacion rol

    if (!validarCorreo(formulario.email)) {
      nuevosErrores.email = 'Ingrese un correo válido (@duoc.cl, @gmail.com).'
    } // fin validacion email

    if (formulario.password.length < 4 || formulario.password.length > 10) {
      nuevosErrores.password = 'La contraseña debe tener entre 4 y 10 caracteres.'
    } // fin validacion password

    return nuevosErrores
  } // fin validar

  function handleSubmit(evento) {
    evento.preventDefault()
    setError('')
    const erroresEncontrados = validar()

    if (Object.keys(erroresEncontrados).length > 0) {
      setErrores(erroresEncontrados)
      return
    } // fin if errores

    const usuario = buscarUsuarioPorEmail(formulario.email)

    if (!usuario) {
      setError('El correo no está registrado.')
      return
    } // fin if usuario no existe

    if (usuario.password !== formulario.password) {
      setError('La contraseña es incorrecta.')
      return
    } // fin if password incorrecta

    if (usuario.rol !== formulario.rol) {
      setError('El rol seleccionado no corresponde a este usuario.')
      return
    } // fin if rol incorrecto

    const sesion = iniciarSesion(usuario)
    onLogin(sesion)
    navigate(destinoRol(usuario.rol))
  } // fin handleSubmit

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">

          <h1 className="mb-4">Ingresar a PawPets</h1>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="mb-3">
              <label htmlFor="rol" className="form-label">Rol</label>
              <select
                id="rol"
                name="rol"
                className="form-select"
                value={formulario.rol}
                onChange={cambiarCampo}
              >
                <option value="">Seleccione un rol</option>
                <option value="cliente">Cliente</option>
                <option value="vendedor">Vendedor</option>
                <option value="administrador">Administrador</option>
              </select>
              {errores.rol && (
                <div className="text-danger small">{errores.rol}</div>
              )}
            </div>
            {/* fin campo rol */}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={formulario.email}
                onChange={cambiarCampo}
                placeholder="nombre@correo.com"
              />
              {errores.email && (
                <div className="text-danger small">{errores.email}</div>
              )}
            </div>
            {/* fin campo email */}

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={formulario.password}
                onChange={cambiarCampo}
              />
              {errores.password && (
                <div className="text-danger small">{errores.password}</div>
              )}
            </div>
            {/* fin campo password */}

            <button type="submit" className="btn btn-success w-100">
              Ingresar
            </button>

          </form>
          {/* fin form */}

          <p className="mt-3 text-center">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </p>

        </div>
      </div>
    </main>
  )
} // fin Login

export default Login