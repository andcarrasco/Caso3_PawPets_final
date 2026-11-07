import { Link } from 'react-router-dom'
import '../estilos/blog.css'

function BlogVacunas() {
  return (
    <main className="articulo-pawpets container">
      <Link to="/blog">← Volver al blog</Link>

      <p className="eyebrow mt-4">Salud</p>
      <h1>Vacunas esenciales para cachorros: lo que debes saber</h1>

      <img
        src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80"
        alt="Cachorro mirando a cámara"
      />

      <p>
        Las vacunas ayudan a proteger a los cachorros frente a enfermedades
        prevenibles. La pauta exacta debe definirla un médico veterinario,
        según la edad, estado de salud y entorno de tu mascota.
      </p>

      <h2>Planifica sus controles</h2>
      <p>
        Agenda su primera consulta y conserva su carnet de vacunación.
        Allí quedarán registradas las dosis, fechas y próximos refuerzos.
      </p>

      <h2>Cuidados posteriores</h2>
      <p>
        Después de vacunarse es normal que esté más tranquilo. Si notas
        una reacción importante o persistente, consulta de inmediato
        con su centro veterinario.
      </p>
    </main>
  )
}

export default BlogVacunas
