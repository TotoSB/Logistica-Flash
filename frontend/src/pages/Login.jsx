import React from 'react'
import { Link } from 'react-router-dom';
import classes from '../styles/login.module.css';


function Login() {
  return (
    <div className={classes.container_login}>
        <header>
            <Link to="/">Volver</Link>
        </header>
        <main className={classes.main}>
            <form className={classes.form}>
                <label htmlFor="">Correo electronico:</label>
                <input type="email" name="" id="" />

                <label htmlFor="">Contraseña:</label>
                <input type="text" name="" id="" />

                <button type="submit" className={classes.sub_login}>Iniciar sesion</button>
            </form>
        </main>
    </div>
  )
}

export default Login