import React, { useState, useEffect } from 'react';
import '../styles/EnvioForm.css'; 

const EnvioForm = () => {
  const [formData, setFormData] = useState({
    usuario: '',  
    destino: 'caba',
    nro_seguimiento: '',
    estado: 'pendiente',
    peso: '',
    ancho: '',
    alto: '',
    largo: ''
  });

  const [cotizacion, setCotizacion] = useState(null);
  const [cotizando, setCotizando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch('http://localhost:8000/api/user-status/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user?.id) {
          setFormData(prev => ({ ...prev, usuario: data.user.id }));
          setUsuarioAutenticado(true);
        }
      })
      .catch(() => {
        setUsuarioAutenticado(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setCotizacion(null);
    setMensajeExito(null);
    setError(null);
  };

  const handleCotizar = async () => {
    setCotizando(true);
    setError(null);
    setMensajeExito(null);
    try {
      const response = await fetch('http://localhost:8000/api/cotizar-envio/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          peso: formData.peso,
          ancho: formData.ancho,
          alto: formData.alto,
          largo: formData.largo,
          destino: formData.destino
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCotizacion(data);
      } else {
        setError(data.error || 'Error al cotizar');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setCotizando(false);
    }
  };

  const handleEnviar = async () => {
    setEnviando(true);
    setError(null);
    setMensajeExito(null);

    try {
      const token = localStorage.getItem('accessToken');

      const envioData = {
        usuario: formData.usuario,
        destino: formData.destino,
        peso: formData.peso,
        ancho: formData.ancho,
        alto: formData.alto,
        largo: formData.largo,
      };

      const response = await fetch('http://localhost:8000/api/crear-envio/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(envioData)
      });

      const data = await response.json();

      if (response.ok) {
        setMensajeExito(`¡Envío creado exitosamente! Nº Seguimiento: ${data.nro_seguimiento}`);
        setFormData(prev => ({
          ...prev,
          destino: 'caba',
          peso: '',
          ancho: '',
          alto: '',
          largo: ''
        }));
        setCotizacion(null);
      } else {
        setError(data.error || 'Error al crear el envío');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setEnviando(false);
    }
  };


  return (
    <form className="envio-form" onSubmit={(e) => e.preventDefault()}>

      <div className="envio-form__group">
        <label className="envio-form__label">Destino:</label>
        <select
          name="destino"
          value={formData.destino}
          onChange={handleChange}
          className="envio-form__select"
        >
          <option value="caba">Capital Federal</option>
          <option value="franja1">Franja 1</option>
          <option value="franja2">Franja 2</option>
          <option value="franja3">Franja 3</option>
        </select>
      </div>

      <div className="envio-form__group">
        <label className="envio-form__label">Peso (kg):</label>
        <input
          type="number"
          name="peso"
          value={formData.peso}
          onChange={handleChange}
          step="0.01"
          required
          className="envio-form__input"
        />
      </div>

      <div className="envio-form__group">
        <label className="envio-form__label">Ancho (cm):</label>
        <input
          type="number"
          name="ancho"
          value={formData.ancho}
          onChange={handleChange}
          step="0.01"
          required
          className="envio-form__input"
        />
      </div>

      <div className="envio-form__group">
        <label className="envio-form__label">Alto (cm):</label>
        <input
          type="number"
          name="alto"
          value={formData.alto}
          onChange={handleChange}
          step="0.01"
          required
          className="envio-form__input"
        />
      </div>

      <div className="envio-form__group">
        <label className="envio-form__label">Largo (cm):</label>
        <input
          type="number"
          name="largo"
          value={formData.largo}
          onChange={handleChange}
          step="0.01"
          required
          className="envio-form__input"
        />
      </div>

      <button
        type="button"
        onClick={handleCotizar}
        disabled={cotizando}
        className={`envio-form__button envio-form__button--cotizar ${cotizando ? 'envio-form__button--disabled' : ''}`}
      >
        {cotizando ? 'Cotizando...' : 'Cotizar Envío'}
      </button>

      {cotizacion && (
        <div className="envio-form__cotizacion-box">
          <h4>Cotización estimada:</h4>
          <p><strong>Costo estimado:</strong> ${cotizacion.costo_estimado}</p>
          <p><strong>Peso volumétrico:</strong> {cotizacion.peso_volumetrico} kg</p>
          <p><strong>Peso final:</strong> {cotizacion.peso_final} kg</p>
          <p><strong>Detalle:</strong> {cotizacion.detalle}</p>

          <button
            type="button"
            onClick={handleEnviar}
            disabled={enviando || !usuarioAutenticado}
            className={`envio-form__button envio-form__button--enviar ${(enviando || !usuarioAutenticado) ? 'envio-form__button--disabled' : ''}`}
          >
            {enviando ? 'Enviando...' : 'Hacer Envío'}
          </button>

          {!usuarioAutenticado && (
            <p className="envio-form__message-error">
              Debes iniciar sesión para poder realizar el envío.
            </p>
          )}
        </div>
      )}

      {error && <p className="envio-form__message-error">{error}</p>}
      {mensajeExito && <p className="envio-form__message-success">{mensajeExito}</p>}
    </form>
  );
};

export default EnvioForm;