import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <header class="header">
        <div class="container">
          <div class="logo">
            <span class="logo-icon">📦</span>
            <span class="logo-text">Flash  Market</span>
          </div>
          <nav class="nav">
            <ul>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#como-funciona">Cómo Funciona</a></li>
              <li><a href="#estadisticas">Estadísticas</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
            <a href="#" class="btn-login">Iniciar Sesión</a>
          </nav>
          <div class="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>Soluciones logísticas para hacer crecer tu negocio</h1>
            <p>Optimizamos tu cadena de suministro con tecnología avanzada y una red global de distribución confiable.</p>
            <div class="hero-buttons">
              <a href="#" class="btn-primary">Solicitar cotización</a>
              <a href="#" class="btn-outline">Conocer más</a>
            </div>
          </div>
          <div class="tracking-form">
            <h2>Rastrea tu envío</h2>
            <form>
              <div class="input-group">
                <input type="text" placeholder="Ingresa tu número de seguimiento" />
                <button type="submit" class="btn-primary">Rastrear</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="servicios" class="services">
        <div class="container">
          <div class="section-header">
            <h2>Nuestros Servicios</h2>
            <p>Ofrecemos soluciones logísticas integrales adaptadas a las necesidades específicas de tu negocio.</p>
          </div>

          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon">🚚</div>
              <h3>Transporte Terrestre</h3>
              <p>Distribución eficiente por carretera con seguimiento en tiempo real.</p>
            </div>

            <div class="service-card">
              <div class="service-icon">🕐</div>
              <h3>Envios en el dia</h3>
              <p>Encargandonos antes de las 10am te llega en el dia</p>
            </div>

            <div class="service-card">
              <div class="service-icon">💸</div>
              <h3>Envios contrarembolso</h3>
              <p>Te llevamos tu producto y tu cliente lo paga al recibir</p>
            </div>
            
            <div class="service-card">
              <div class="service-icon">🏭</div>
              <h3>Almacenaje</h3>
              <p>Espacios seguros con gestión de inventario automatizada.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" class="process">
        <div class="container">
          <div class="section-header">
            <h2>Cómo Funciona</h2>
            <p>Optimizamos cada etapa del proceso logístico para garantizar entregas puntuales y eficientes.</p>
          </div>

          <div class="process-grid">
            <div class="process-step">
              <div class="step-number">1</div>
              <div class="step-content">
                <div class="step-icon">📋</div>
                <h3>Solicitud y Cotización</h3>
                <p>Proporciona los detalles de tu envío y recibe una cotización personalizada en minutos.</p>
              </div>
            </div>
            
            <div class="process-step">
              <div class="step-number">2</div>
              <div class="step-content">
                <div class="step-icon">📦</div>
                <h3>Empaque y Recogida</h3>
                <p>Preparamos y recogemos tu mercancía en la ubicación designada.</p>
              </div>
            </div>
            
            <div class="process-step">
              <div class="step-number">3</div>
              <div class="step-content">
                <div class="step-icon">📊</div>
                <h3>Seguimiento en Tiempo Real</h3>
                <p>Monitorea el estado y ubicación de tu envío en cualquier momento desde nuestra plataforma.</p>
              </div>
            </div>
            
            <div class="process-step">
              <div class="step-number">4</div>
              <div class="step-content">
                <div class="step-icon">📍</div>
                <h3>Entrega y Confirmación</h3>
                <p>Entregamos en el destino final y proporcionamos confirmación con prueba de entrega.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="estadisticas" class="stats">
        <div class="container">
          <div class="section-header">
            <h2>Nuestros Resultados</h2>
            <p>Cifras que respaldan nuestra experiencia y compromiso con la excelencia logística.</p>
          </div>

          <div class="stats-grid">
            <div class="stat-counter">
              <div class="stat-value">15<span class="stat-suffix">+</span></div>
              <div class="stat-label">Años de experiencia</div>
            </div>
            
            <div class="stat-counter">
              <div class="stat-value">50<span class="stat-suffix">+</span></div>
              <div class="stat-label">Localidades con cobertura</div>
            </div>
            
            <div class="stat-counter">
              <div class="stat-value">100k<span class="stat-suffix">+</span></div>
              <div class="stat-label">Envíos completados</div>
            </div>
            
            <div class="stat-counter">
              <div class="stat-value">99<span class="stat-suffix">%</span></div>
              <div class="stat-label">Entregas a tiempo</div>
            </div>
          </div>
        </div>
      </section>

      <section class="cta">
        <div class="container">
          <h2>¿Listo para optimizar tu logística?</h2>
          <p>Únete a miles de empresas que confían en nosotros para sus necesidades logísticas.</p>
          <a href="#" class="btn-primary">Solicitar una demo</a>
        </div>
      </section>

      <section id="contacto" class="contact">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-info">
              <h2>Contáctanos</h2>
              <p>Estamos aquí para responder tus preguntas y ayudarte a encontrar la solución logística perfecta para tu negocio.</p>
              
              <div class="contact-details">
                <div class="contact-item">
                  <div class="contact-icon">📞</div>
                  <div>
                    <p class="contact-label">Llámanos</p>
                    <p class="contact-value">+11112312</p>
                  </div>
                </div>
                
                <div class="contact-item">
                  <div class="contact-icon">✉️</div>
                  <div>
                    <p class="contact-label">Email</p>
                    <p class="contact-value">info@flashmarket.com</p>
                  </div>
                </div>
                
                <div class="contact-item">
                  <div class="contact-icon">🕒</div>
                  <div>
                    <p class="contact-label">Horario de atención</p>
                    <p class="contact-value">Lun-Vie: 8am - 6pm</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="contact-form">
              <form>
                <div class="form-row">
                  <div class="form-group">
                    <label>Nombre completo</label>
                    <input type="text" placeholder="Tu nombre" />
                  </div>
                  <div class="form-group">
                    <label>Correo electrónico</label>
                    <input type="email" placeholder="tu@email.com" />
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Teléfono</label>
                  <input type="tel" placeholder="Tu número telefónico" />
                </div>
                
                <div class="form-group">
                  <label>Mensaje</label>
                  <textarea placeholder="¿En qué podemos ayudarte?" rows="4"></textarea>
                </div>
                
                <button type="submit" class="btn-primary btn-full">Enviar mensaje</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-about">
              <div class="logo">
                <span class="logo-icon">📦</span>
                <span class="logo-text">LogiTech</span>
              </div>
              <p>Soluciones logísticas integrales que optimizan tus envíos y cadena de suministro a nivel global.</p>
              <div class="social-links">
                <a href="#" class="social-link">Facebook</a>
                <a href="#" class="social-link">Twitter</a>
                <a href="#" class="social-link">Instagram</a>
                <a href="#" class="social-link">LinkedIn</a>
              </div>
            </div>

            <div class="footer-links">
              <h3>Enlaces rápidos</h3>
              <ul>
                <li><a href="#servicios">Servicios</a></li>
                <li><a href="#como-funciona">Cómo Funciona</a></li>
                <li><a href="#">Sobre Nosotros</a></li>
                <li><a href="#">Términos y Condiciones</a></li>
                <li><a href="#">Política de Privacidad</a></li>
              </ul>
            </div>

            <div class="footer-links">
              <h3>Servicios</h3>
              <ul>
                <li><a href="#">Transporte Terrestre</a></li>
                <li><a href="#">Transporte Marítimo</a></li>
                <li><a href="#">Transporte Aéreo</a></li>
                <li><a href="#">Almacenaje</a></li>
                <li><a href="#">Distribución</a></li>
              </ul>
            </div>

            <div class="footer-contact">
              <h3>Contacto</h3>
              <ul>
                <li>
                  <span class="footer-icon">📍</span>
                  Av. Principal 1234, Ciudad Logística, CP 12345
                </li>
                <li>
                  <span class="footer-icon">📞</span>
                  +1 (555) 123-4567
                </li>
                <li>
                  <span class="footer-icon">✉️</span>
                  info@flashmarket.com
                </li>
              </ul>
            </div>
          </div>

          <div class="footer-copy">
            <p>&copy; LogiTech. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
  </>
  )
}

export default App
