import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from '../styles/login.module.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/password-reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Se ha enviado un enlace de recuperación a tu email (revisa también tu carpeta de spam)');
        setEmail('');
      } else {
        setError(data.error || 'Error al enviar el enlace de recuperación');
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
        <Link to="/login">← Volver al login</Link>
      </header>
      <main className={classes.main}>
        <div className={classes.form}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
            🔐 Recuperar Contraseña
          </h2>
          
          <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
            Ingresa tu email para recibir un enlace de recuperación de contraseña.
          </p>

          {error && (
            <div style={{
              backgroundColor: '#ff4757',
              color: 'white',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              backgroundColor: '#2ed573',
              color: 'white',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electrónico:</label>
            <input 
              type="email" 
              name="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="tu@email.com"
            />

            <button 
              type="submit" 
              className={classes.sub_login}
              disabled={loading || !email}
              style={{
                backgroundColor: loading ? '#ccc' : '#ff4757',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>
              <Link to="/login">← Volver al login</Link>
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            marginTop: '20px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ color: '#495057', marginTop: 0 }}>💡 Instrucciones:</h4>
            <ul style={{ color: '#6c757d', fontSize: '14px' }}>
              <li>Ingresa el email con el que te registraste</li>
              <li>Revisa tu bandeja de entrada y spam</li>
              <li>El enlace es válido por 1 hora</li>
              <li>Si no recibes el email, intenta de nuevo en unos minutos</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
