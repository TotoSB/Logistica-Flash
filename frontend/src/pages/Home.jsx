import React, { useState, useEffect } from 'react'
import classes from '../styles/home.module.css';
import { Link } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // También verificar con el servidor
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      localStorage.removeItem('user');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user-status/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.authenticated) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.log('Error verificando estado del usuario:', error);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

    const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setTrackingError('Por favor ingresa un número de seguimiento');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/envios-estado/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo_seguimiento: trackingNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setTrackingResult(data);
        setTrackingError('');
      } else {
        setTrackingError(data.error || 'Error al buscar el envío');
        setTrackingResult(null);
      }
    } catch (error) {
      setTrackingError('Error de conexión con el servidor');
      setTrackingResult(null);
    }
  };



  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <>
           <header className={classes.header}>
        <div className={classes.container}>
          <div className={classes.logo}>
            <span className={classes.logo_icon}>📦</span>
            <span className={classes.logo_text}>Flash  Market</span>
          </div>
          <nav className={classes.nav}>
            <ul>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#como_funciona">Cómo Funciona</a></li>
              <li><a href="#estadisticas">Estadísticas</a></li>
              <li><a href="#contacto">Contacto</a></li>
              {user !== null && (
                <Link to="/envio-form">Hacer envío</Link>
              )}
              {/* Mostrar solo si es admin */}
              {user?.is_staff && (
                <Link to="/admin">Panel admin</Link>
              )}
            </ul>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#000' }}>Hola, {user.nombre_completo}</span>
                <button 
                  onClick={handleLogout}
                  className={classes.btn_login}
                  style={{ backgroundColor: '#ff4757', border: 'none' }}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link to="/login" className={classes.btn_login}>Iniciar Sesión</Link>
            )}
          </nav>
          <div className={classes.menu_toggle}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      <section className={classes.hero}>
        <div className={classes.container}>
          {/* ... (contenido hero existente) */}
          
          <div className={classes.tracking_form}>
            <h2>Rastrea tu envío</h2>
            <form onSubmit={handleTrackSubmit}>
              <div className={classes.input_group}>
                <input 
                  type="text" 
                  placeholder="Ingresa tu número de seguimiento" 
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <button type="submit" className={classes.btn_primary}>Rastrear</button>
              </div>
              {trackingError && (
                <p style={{ color: 'red', marginTop: '10px' }}>{trackingError}</p>
              )}
            </form>
            
            {trackingResult && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#f1f2f6', 
                borderRadius: '8px',
                color: '#2f3542'
              }}>
                <h3>Resultado del rastreo</h3>
                <p><strong>Estado:</strong> {trackingResult.estado}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="servicios" className={classes.services}>
        <div className={classes.container}>
          <div className={classes.section_header}>
            <h2>Nuestros Servicios</h2>
            <p>Ofrecemos soluciones logísticas integrales adaptadas a las necesidades específicas de tu negocio.</p>
          </div>

          <div className={classes.services_grid}>
            <div className={classes.service_card}>
              <div className={classes.service_icon}>🚚</div>
              <h3>Transporte Terrestre</h3>
              <p>Distribución eficiente por carretera con seguimiento en tiempo real.</p>
            </div>

            <div className={classes.service_card}>
              <div className={classes.service_icon}>🕐</div>
              <h3>Envios en el dia</h3>
              <p>Encargandonos antes de las 10am te llega en el dia</p>
            </div>

            <div className={classes.service_card}>
              <div className={classes.service_icon}>💸</div>
              <h3>Envios contrarembolso</h3>
              <p>Te llevamos tu producto y tu cliente lo paga al recibir</p>
            </div>
            
            <div className={classes.service_card}>
              <div className={classes.service_icon}>🏭</div>
              <h3>Almacenaje</h3>
              <p>Espacios seguros con gestión de inventario automatizada.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="como_funciona" className={classes.proces}>
        <div className={classes.container}>
          <div className={classes.section_header}>
            <h2>Cómo Funciona</h2>
            <p>Optimizamos cada etapa del proceso logístico para garantizar entregas puntuales y eficientes.</p>
          </div>

          <div className={classes.process_grid}>
            <div className={classes.process_step}>
              <div className={classes.step_number}>1</div>
              <div className={classes.step_content}>
                <div className={classes.step_icon}>📋</div>
                <h3>Solicitud y Cotización</h3>
                <p>Proporciona los detalles de tu envío y recibe una cotización personalizada en minutos.</p>
              </div>
            </div>
            
            <div className={classes.process_step}>
              <div className={classes.step_number}>2</div>
              <div className={classes.step_content}>
                <div className={classes.step_icon}>📦</div>
                <h3>Empaque y Recogida</h3>
                <p>Preparamos y recogemos tu mercancía en la ubicación designada.</p>
              </div>
            </div>
            
            <div className={classes.process_step}>
              <div className={classes.step_number}>3</div>
              <div className={classes.step_content}>
                <div className={classes.step_icon}>📊</div>
                <h3>Seguimiento en Tiempo Real</h3>
                <p>Monitorea el estado y ubicación de tu envío en cualquier momento desde nuestra plataforma.</p>
              </div>
            </div>
            
            <div className={classes.process_step}>
              <div className={classes.step_number}>4</div>
              <div className={classes.step_content}>
                <div className={classes.step_icon}>📍</div>
                <h3>Entrega y Confirmación</h3>
                <p>Entregamos en el destino final y proporcionamos confirmación con prueba de entrega.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="estadisticas" className={classes.stats}>
        <div className={classes.container}>
          <div className={classes.section_header}>
            <h2>Nuestros Resultados</h2>
            <p>Cifras que respaldan nuestra experiencia y compromiso con la excelencia logística.</p>
          </div>

          <div className={classes.stats_grid}>
            <div className={classes.stat_counter}>
              <div className={classes.stat_value}>15<span className={classes.stat_suffix}>+</span></div>
              <div className={classes.stat_label}>Años de experiencia</div>
            </div>
            
            <div className={classes.stat_counter}>
              <div className={classes.stat_value}>50<span className={classes.stat_suffix}>+</span></div>
              <div className={classes.stat_label}>Localidades con cobertura</div>
            </div>
            
            <div className={classes.stat_counter}>
              <div className={classes.stat_value}>100k<span className={classes.stat_suffix}>+</span></div>
              <div className={classes.stat_label}>Envíos completados</div>
            </div>
            
            <div className={classes.stat_counter}>
              <div className={classes.stat_value}>99<span className={classes.stat_suffix}>%</span></div>
              <div className={classes.stat_label}>Entregas a tiempo</div>
            </div>
          </div>
        </div>
      </section>

      <section className={classes.cta}>
        <div className={classes.container}>
          <h2>¿Listo para optimizar tu logística?</h2>
          <p>Únete a miles de empresas que confían en nosotros para sus necesidades logísticas.</p>
          <a href="#" className={classes.btn_primary}>Solicitar una demo</a>
        </div>
      </section>

      <section id="contacto" className={classes.contact}>
        <div className={classes.container}>
          <div className={classes.contact_grid}>
            <div className={classes.contact_info}>
              <h2>Contáctanos</h2>
              <p>Estamos aquí para responder tus preguntas y ayudarte a encontrar la solución logística perfecta para tu negocio.</p>
              
              <div className={classes.contact_details}>
                <div className={classes.contact_item}>
                  <div className={classes.contact_icon}>📞</div>
                  <div>
                    <p className={classes.contact_label}>Llámanos</p>
                    <p className={classes.contact_value}>+11112312</p>
                  </div>
                </div>
                
                <div className={classes.contact_item}>
                  <div className={classes.contact_icon}>✉️</div>
                  <div>
                    <p className={classes.contact_label}>Email</p>
                    <p className={classes.contact_value}>info@flashmarket.com</p>
                  </div>
                </div>
                
                <div className={classes.contact_item}>
                  <div className={classes.contact_icon}>🕒</div>
                  <div>
                    <p className={classes.contact_label}>Horario de atención</p>
                    <p className={classes.contact_value}>Lun_Vie: 8am _ 6pm</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={classes.contact_form}>
              <form>
                <div className={classes.form_row}>
                  <div className={classes.form_group}>
                    <label>Nombre completo</label>
                    <input type="text" placeholder="Tu nombre" />
                  </div>  
                  <div className={classes.form_group}>
                    <label>Correo electrónico</label>
                    <input type="email" placeholder="tu@email.com" />
                  </div>
                </div>
                
                <div className={classes.form_group}>
                  <label>Teléfono</label>
                  <input type="tel" placeholder="Tu número telefónico" />
                </div>
                
                <div className={classes.form_group}>
                  <label>Mensaje</label>
                  <textarea placeholder="¿En qué podemos ayudarte?" rows="4"></textarea>
                </div>
                
                <button type="submit" className={`${classes['btn_primary']} ${classes['btn_full']}`}>Enviar mensaje</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className={classes.footer}>
        <div className={classes.container}>
          <div className={classes.footer_grid}>
            <div className={classes.footer_about}>
              <div className={classes.logo}>
                <span className={classes.logo_icon}>📦</span>
                <span className={classes.logo_text}>LogiTech</span>
              </div>
              <p>Soluciones logísticas integrales que optimizan tus envíos y cadena de suministro a nivel global.</p>
              <div className={classes.social_links}>
                <a href="#" className={classes.social_link}>Facebook</a>
                <a href="#" className={classes.social_link}>Twitter</a>
                <a href="#" className={classes.social_link}>Instagram</a>
                <a href="#" className={classes.social_link}>LinkedIn</a>
              </div>
            </div>

            <div className={classes.footer_links}>
              <h3>Enlaces rápidos</h3>
              <ul>
                <li><a href="#servicios">Servicios</a></li>
                <li><a href="#como_funciona">Cómo Funciona</a></li>
                <li><a href="#">Sobre Nosotros</a></li>
                <li><a href="#">Términos y Condiciones</a></li>
                <li><a href="#">Política de Privacidad</a></li>
              </ul>
            </div>

            <div className={classes.footer_links}>
              <h3>Servicios</h3>
              <ul>
                <li><a href="#">Transporte Terrestre</a></li>
                <li><a href="#">Transporte Marítimo</a></li>
                <li><a href="#">Transporte Aéreo</a></li>
                <li><a href="#">Almacenaje</a></li>
                <li><a href="#">Distribución</a></li>
              </ul>
            </div>

            <div className={classes.footer_contact}>
              <h3>Contacto</h3>
              <ul>
                <li>
                  <span className={classes.footer_icon}>📍</span>
                  Av. Principal 1234, Ciudad Logística, CP 12345
                </li>
                <li>
                  <span className={classes.footer_icon}>📞</span>
                  +1 (555) 123_4567
                </li>
                <li>
                  <span className={classes.footer_icon}>✉️</span>
                  info@flashmarket.com
                </li>
              </ul>
            </div>
          </div>

          <div className={classes.footer_copy}>
            <p>&copy; LogiTech. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      </>
  )
}

export default Home