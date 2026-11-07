import { useState } from 'react'
import { Link } from 'react-router-dom'
import { crearUsuario } from '../servicios/usuarios.js'
import { regionesCompra as REGIONES } from '../datos/regionesCompra.js'

function Registro() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: '',
    rut: '',
    region: '',
    comuna: '',
    direccion: ''
  }) // fin estado formulario

  const [errores, setErrores] = useState({}) // fin estado errores
  const [mensaje, setMensaje] = useState('') // fin estado mensaje

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario(anterior => ({
      ...anterior,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {})
    }))
  } // fin cambiarCampo

  function validarRut(rut) {
    const limpio = rut.replace(/[^0-9kK]/g, '').toUpperCase()
    const cuerpo = limpio.slice(0, -1)
    const digito = limpio.slice(-1)
    if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false
    let suma = 0
    let multiplicador = 2
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * multiplicador
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
    } // fin for
    const resultado = 11 - (suma % 11)
    const esperado = resultado === 11 ? '0' : resultado === 10 ? 'K' : String(resultado)
    return digito === esperado
  } // fin validarRut

  function validar() {
    const nuevosErrores = {}

    if (formulario.nombre.length < 3) {
      nuevosErrores.nombre = 'Ingrese su nombre completo.'
    } // fin validacion nombre

    if (!formulario.email) {
      nuevosErrores.email = 'El correo es obligatorio.'
    } // fin validacion email

    if (formulario.password.length < 4 || formulario.password.length > 10) {
      nuevosErrores.password = 'La contraseña debe tener entre 4 y 10 caracteres.'
    } // fin validacion password

    if (formulario.password !== formulario.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.'
    } // fin validacion confirmarPassword

    if (!validarRut(formulario.rut)) {
      nuevosErrores.rut = 'Ingrese un RUT válido.'
    } // fin validacion rut

    if (!formulario.region) {
      nuevosErrores.region = 'Seleccione una región.'
    } // fin validacion region

    if (!formulario.comuna) {
      nuevosErrores.comuna = 'Seleccione una comuna.'
    } // fin validacion comuna

    return nuevosErrores
  } // fin validar

  function handleSubmit(evento) {
    evento.preventDefault()
    const erroresEncontrados = validar()

    if (Object.keys(erroresEncontrados).length > 0) {
      setErrores(erroresEncontrados)
      return
    } // fin if errores

    try {
      crearUsuario({
        nombre: formulario.nombre,
        email: formulario.email,
        password: formulario.password,
        rut: formulario.rut,
        region: formulario.region,
        comuna: formulario.comuna,
        direccion: formulario.direccion,
        rol: 'cliente'
      })
      setErrores({})
      setMensaje('¡Registro exitoso! Ya puedes iniciar sesión.')
      setFormulario({
        nombre: '', email: '', password: '',
        confirmarPassword: '', rut: '', region: '', comuna: '', direccion: ''
      })
    } catch (err) {
      setErrores({ email: err.message })
    } // fin try catch

  } // fin handleSubmit

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7">

          <h1 className="mb-4">Crear cuenta en PawPets</h1>

          {mensaje && (
            <div className="alert alert-success">{mensaje}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre completo</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className="form-control"
                value={formulario.nombre}
                onChange={cambiarCampo}
              />
              {errores.nombre && (
                <div className="text-danger small">{errores.nombre}</div>
              )}
            </div>
            {/* fin campo nombre */}

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

            <div className="row g-3 mb-3">
              <div className="col-md-6">
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
              <div className="col-md-6">
                <label htmlFor="confirmarPassword" className="form-label">Confirmar contraseña</label>
                <input
                  id="confirmarPassword"
                  name="confirmarPassword"
                  type="password"
                  className="form-control"
                  value={formulario.confirmarPassword}
                  onChange={cambiarCampo}
                />
                {errores.confirmarPassword && (
                  <div className="text-danger small">{errores.confirmarPassword}</div>
                )}
              </div>
            </div>
            {/* fin campos password */}

            <div className="mb-3">
              <label htmlFor="rut" className="form-label">RUT <small>sin puntos ni guión</small></label>
              <input
                id="rut"
                name="rut"
                type="text"
                className="form-control"
                value={formulario.rut}
                onChange={cambiarCampo}
                placeholder="19011022K"
              />
              {errores.rut && (
                <div className="text-danger small">{errores.rut}</div>
              )}
            </div>
            {/* fin campo rut */}

            <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              className="form-control"
              value={formulario.direccion}
              onChange={cambiarCampo}
              placeholder="Av. Ejemplo 1234"
            />
           </div>
            {/* fin campo direccion */}

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="region" className="form-label">Región</label>
                <select
                  id="region"
                  name="region"
                  className="form-select"
                  value={formulario.region}
                  onChange={cambiarCampo}
                >
                  <option value="">Seleccione una región</option>
                  {Object.keys(REGIONES).map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errores.region && (
                  <div className="text-danger small">{errores.region}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="comuna" className="form-label">Comuna</label>
                <select
                  id="comuna"
                  name="comuna"
                  className="form-select"
                  value={formulario.comuna}
                  onChange={cambiarCampo}
                  disabled={!formulario.region}
                >
                  <option value="">Seleccione una comuna</option>
                  {formulario.region && REGIONES[formulario.region].map(comuna => (
                    <option key={comuna} value={comuna}>{comuna}</option>
                  ))}
                </select>
                {errores.comuna && (
                  <div className="text-danger small">{errores.comuna}</div>
                )}
              </div>
            </div>
            {/* fin campos region y comuna */}

            <button type="submit" className="btn btn-success w-100">
              Crear cuenta
            </button>

          </form>
          {/* fin form */}

          <p className="mt-3 text-center">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>

        </div>
      </div>
    </main>
  )
} // fin Registro

export default Registro
