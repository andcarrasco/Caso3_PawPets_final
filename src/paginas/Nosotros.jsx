import '../estilos/nosotros.css'

function Nosotros() {
  return (
    <main className="nosotros-pawpets">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Nuestra historia</p>
          <h1>Una veterinaria local con corazón digital.</h1>
          <p>
            En PawPets acercamos productos confiables y educación para una vida
            más feliz junto a las mascotas.
          </p>
        </div>
      </section>

      <section className="container section">
        <h2>Cuidamos a quienes te acompañan</h2>
        <p>
          Nacimos como veterinaria local y hoy somos una comunidad de pet lovers.
          Seleccionamos alimentos, accesorios, juguetes y productos de salud
          pensando en cada etapa de vida.
        </p>
        <p>
          Creemos en una tenencia responsable, informada y llena de cariño.
        </p>
      </section>

      <section className="video-section">
        <div className="container">
          <p className="eyebrow">Aprende con nosotros</p>
          <h2>Pequeños cuidados, grandes cambios</h2>
          <div className="video-wrap">
            <iframe
              src="https://www.youtube.com/embed/VtcRS8ME1Uo?si=GnXHSILwlqu7yG4g"
              title="Pequeños cuidados, grandes cambios"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Nosotros
