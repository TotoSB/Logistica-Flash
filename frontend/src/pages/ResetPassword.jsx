import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import classes from '../styles/login.module.css';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/password-reset/validate/${token}/`);
      const data = await response.json();

      if (response.ok && data.valid) {
        setTokenValid(true);
        setUserEmail(data.user_email);
      } else {
        setError(data.error || 'Token inválido o expirado');
        setTokenValid(false);
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
      setTokenValid(false);
    } finally {
      setValidating(false);
    }
  };

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

    // Validaciones del frontend
    if (formData.new_password !== formData.confirm_password) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.new_password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/password-reset/confirm/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('¡Contraseña actualizada exitosamente! Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className={classes.container_login}>
        <main className={classes.main}>
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            fontSize: '18px',
            color: '#666'
          }}>
            <div style={{ marginBottom: '20px' }}>🔄</div>
            Validando token...
          </div>
        </main>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className={classes.container_login}>
        <main className={classes.main}>
          <div className={classes.form}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#ff4757' }}>
              ❌ Token inválido
            </h2>
            
            <div style={{
              backgroundColor: '#ff4757',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>

            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ color: '#495057', marginTop: 0 }}>💡 Posibles causas:</h4>
              <ul style={{ color: '#6c757d', fontSize: '14px' }}>
                <li>El enlace ya ha sido usado</li>
                <li>El enlace ha expirado (válido por 1 hora)</li>
                <li>El enlace no es válido</li>
                <li>Ya han pasado más de 1 hora desde que se solicitó</li>
              </ul>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link 
                to="/forgot-password" 
                className={classes.sub_login}
                style={{ 
                  display: 'inline-block',
                  textDecoration: 'none',
                  backgroundColor: '#667eea',
                  marginBottom: '10px'
                }}
              >
                Solicitar nuevo enlace
              </Link>
              <br />
              <Link to="/login" style={{ color: '#666' }}>
                ← Volver al login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={classes.container_login}>
      <header>
        <Link to="/login">← Volver al login</Link>
      </header>
      <main className={classes.main}>
        <div className={classes.form}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
            🔐 Restablecer Contraseña
          </h2>
          
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #bbdefb'
          }}>
            <p style={{ margin: 0, color: '#1976d2' }}>
              <strong>Usuario:</strong> {userEmail}
            </p>
          </div>

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

          {success && (
            <div style={{
              backgroundColor: '#2ed573',
              color: 'white',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="new_password">Nueva contraseña:</label>
            <input 
              type="password" 
              name="new_password" 
              id="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Mínimo 8 caracteres"
              minLength="8"
            />

            <label htmlFor="confirm_password">Confirmar contraseña:</label>
            <input 
              type="password" 
              name="confirm_password" 
              id="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Repite la contraseña"
              minLength="8"
            />

            <button 
              type="submit" 
              className={classes.sub_login}
              disabled={loading || !formData.new_password || !formData.confirm_password}
              style={{
                backgroundColor: loading ? '#ccc' : '#2ed573',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>

          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            marginTop: '20px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ color: '#495057', marginTop: 0 }}>🔒 Requisitos de seguridad:</h4>
            <ul style={{ color: '#6c757d', fontSize: '14px' }}>
              <li>Mínimo 8 caracteres</li>
              <li>Se recomienda usar letras, números y símbolos</li>
              <li>No uses contraseñas comunes</li>
              <li>No compartas tu contraseña con nadie</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
