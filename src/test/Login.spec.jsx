import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../paginas/Login.jsx'

// Revisa los campos del login y los mensajes ante datos incorrectos.
describe('Login', () => {
  afterEach(() => cleanup())

  // Datos: Login sin datos ingresados.
  // Acción: Abrir el formulario de ingreso.
  // Resultado esperado: Se ven rol, correo, contraseña y el botón Ingresar.
  it('muestra los campos de rol, correo y contraseña junto al botón Ingresar', () => {
    render(<MemoryRouter><Login onLogin={() => {}} /></MemoryRouter>)

    expect(screen.getByLabelText('Rol')).toBeTruthy()
    expect(screen.getByLabelText('Correo electrónico')).toBeTruthy()
    expect(screen.getByLabelText('Contraseña')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeTruthy()
  })

  // Datos: Rol cliente, correo correo-invalido y contraseña 1234.
  // Acción: Pulsar Ingresar.
  // Resultado esperado: Se muestra el mensaje que pide un correo válido.
  it('rechaza un correo sin formato válido', () => {
    render(<MemoryRouter><Login onLogin={() => {}} /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Rol'), { target: { value: 'cliente' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'correo-invalido' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '1234' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Ingrese un correo válido (@duoc.cl, @gmail.com).')).toBeTruthy()
  })

  // Datos: Correo cliente@gmail.com, contraseña 1234 y ningún rol seleccionado.
  // Acción: Pulsar Ingresar.
  // Resultado esperado: Se muestra el mensaje Seleccione un rol.
  it('pide seleccionar un rol antes de ingresar', () => {
    render(<MemoryRouter><Login onLogin={() => {}} /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'cliente@gmail.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '1234' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Seleccione un rol.')).toBeTruthy()
  })
})
