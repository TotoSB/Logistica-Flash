import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from '../styles/login.module.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('¡Login exitoso! Redirigiendo...');

        // Guardar tokens y usuario en localStorage
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container_login}>
      <header>
        <Link to="/">Volver</Link>
      </header>
      <main className={classes.main}>
        <form className={classes.form} onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#ff4757',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: '#2ed573',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          <label htmlFor="email">Correo electrónico:</label>
          <input 
            type="email" 
            name="email" 
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            name="password" 
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <button 
            type="submit" 
            className={classes.sub_login}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
            <p>
              <Link 
                to="/forgot-password" 
                style={{ color: '#ff4757', textDecoration: 'none' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;
