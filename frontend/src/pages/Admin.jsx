import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/admin.module.css'

function Admin() {
  const [envios, setEnvios] = useState([])
  const [error, setError] = useState(null)

  const fetchEnvios = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://127.0.0.1:8000/api/obtener_envios/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()
      setEnvios(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const avanzarEnvio = async (id) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://127.0.0.1:8000/api/avanzar_envio/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Error al avanzar estado')
        return
      }

      alert(data.mensaje)
      fetchEnvios()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchEnvios()
  }, [])

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <Link to="/" className={styles.btnReverse}>
          Ir al inicio
        </Link>
        <h1 className={styles.title}>Admin Dashboard</h1>
      </header>

      <main>
        {error && <p className={styles.errorMessage}>Error: {error}</p>}

        {envios.length > 0 ? (
          <ul className={styles.enviosList}>
            {envios.map(envio => (
              <li key={envio.id} className={styles.envioItem}>
                <div className={styles.envioInfo}>
                  <strong>{envio.nro_seguimiento}</strong>
                  <span>{envio.estado} - {envio.destino}</span>
                </div>
                {envio.estado !== 'entregado' && envio.estado !== 'cancelado' && (
                  <button
                    className={styles.btnAdvance}
                    onClick={() => avanzarEnvio(envio.id)}
                  >
                    Avanzar estado
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay envíos disponibles</p>
        )}
      </main>
    </div>
  )
}

export default Admin
