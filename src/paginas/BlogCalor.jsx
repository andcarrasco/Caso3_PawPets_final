import { Link } from 'react-router-dom'
import '../estilos/blog.css'

function BlogCalor() {
  return (
    <main className="articulo-pawpets container">
      <Link to="/blog">← Volver al blog</Link>

      <p className="eyebrow mt-4">Bienestar</p>
      <h1>¿Cómo cuidar a tu mascota durante los días de calor?</h1>

      <img
        src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80"
        alt="Perro tomando agua"
      />

      <p>
        El calor puede afectar a perros y gatos más rápido de lo que imaginamos.
        Mantén siempre agua fresca disponible, renueva el recipiente varias
        veces al día y elige lugares ventilados y con sombra para su descanso.
      </p>

      <h2>Paseos con sentido común</h2>
      <p>
        Prefiere las primeras horas de la mañana o el atardecer. El pavimento
        caliente puede quemar sus almohadillas: si no puedes sostener tu mano
        sobre el suelo unos segundos, tampoco es seguro para sus patas.
      </p>

      <h2>Señales de alerta</h2>
      <p>
        Jadeo intenso, debilidad, encías muy rojas o vómitos requieren actuar
        rápido. Lleva a tu mascota a un sitio fresco, ofrece agua sin forzarla
        y contacta a su veterinario.
      </p>
    </main>
  )
}

export default BlogCalor
