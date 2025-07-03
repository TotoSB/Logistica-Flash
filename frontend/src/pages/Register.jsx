import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import classes from '../styles/login.module.css';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre_completo: '',
    telefono: ''
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
    // Limpiar errores al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar que los campos requeridos no estén vacíos
    if (!formData.email.trim() || !formData.password.trim() || !formData.nombre_completo.trim()) {
      setError('Todos los campos obligatorios deben estar completos');
      setLoading(false);
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validar longitud mínima de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nombre_completo: formData.nombre_completo,
          telefono: formData.telefono
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Error al crear la cuenta');
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
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#000' }}>
                  Crear Cuenta
                </h2>
                
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

                <label htmlFor="nombre_completo">Nombre completo:</label>
                <input 
                  type="text" 
                  name="nombre_completo" 
                  id="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

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

                <label htmlFor="telefono">Teléfono (opcional):</label>
                <input 
                  type="tel" 
                  name="telefono" 
                  id="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
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
                  minLength="6"
                />

                <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <button 
                  type="submit" 
                  className={classes.sub_login}
                  disabled={loading}
                >
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
                </div>
            </form>
        </main>
    </div>
  )
}

export default Register
