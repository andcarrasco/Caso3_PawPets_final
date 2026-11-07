import { useState } from 'react'

function Contacto() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  }) // fin estado formulario

  const [errores, setErrores] = useState({}) // fin estado errores
  const [enviado, setEnviado] = useState(false) // fin estado enviado

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario(anterior => ({
      ...anterior,
      [name]: value
    }))
  } // fin cambiarCampo

  function validar() {
    const nuevosErrores = {}

    if (formulario.nombre.length < 3) {
      nuevosErrores.nombre = 'Ingrese su nombre completo.'
    } // fin validacion nombre

    if (!formulario.email) {
      nuevosErrores.email = 'El correo es obligatorio.'
    } // fin validacion email

    if (formulario.mensaje.length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
    } // fin validacion mensaje

    return nuevosErrores
  } // fin validar

  function handleSubmit(evento) {
    evento.preventDefault()
    const erroresEncontrados = validar()

    if (Object.keys(erroresEncontrados).length > 0) {
      setErrores(erroresEncontrados)
      return
    } // fin if errores

    setErrores({})
    setEnviado(true)
    setFormulario({ nombre: '', email: '', mensaje: '' })
  } // fin handleSubmit

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7">

          <h1 className="mb-4">Contacto</h1>

          {enviado && (
            <div className="alert alert-success">
              ¡Mensaje enviado correctamente! Te responderemos pronto.
            </div>
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

            <div className="mb-3">
              <label htmlFor="mensaje" className="form-label">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                className="form-control"
                rows={4}
                value={formulario.mensaje}
                onChange={cambiarCampo}
                placeholder="¿En qué podemos ayudarte?"
              />
              {errores.mensaje && (
                <div className="text-danger small">{errores.mensaje}</div>
              )}
            </div>
            {/* fin campo mensaje */}

            <button type="submit" className="btn btn-success w-100">
              Enviar mensaje
            </button>

          </form>
          {/* fin form */}

        </div>
      </div>
    </main>
  )
} // fin Contacto

export default Contacto