import { Link } from 'react-router-dom'
import '../estilos/blog.css'

function Blog() {
  return (
    <main className="blog-pawpets container py-5">
      <p className="eyebrow">Consejos PawPets</p>
      <h1>Para una vida más saludable y feliz</h1>

      <div className="blog-grid">
        <article className="blog-card">
          <img
            src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=900&q=80"
            alt="Perro tomando agua"
          />
          <div>
            <p className="eyebrow">Bienestar</p>
            <h2>¿Cómo cuidar a tu mascota durante los días de calor?</h2>
            <p>
              Hidratación, sombra y horarios seguros para protegerlos
              cuando sube la temperatura.
            </p>
            <Link to="/blog/calor">Leer artículo →</Link>
          </div>
        </article>

        <article className="blog-card">
          <img
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80"
            alt="Cachorro mirando a cámara"
          />
          <div>
            <p className="eyebrow">Salud</p>
            <h2>Vacunas esenciales para cachorros: lo que debes saber</h2>
            <p>
              Una guía sencilla para acompañar sus primeras visitas
              veterinarias.
            </p>
            <Link to="/blog/vacunas">Leer artículo →</Link>
          </div>
        </article>
      </div>
    </main>
  )
}

export default Blog
