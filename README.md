# Bienvenido a la Logistica Flash🚚✨!

Este sistema web desarrollado en React (Javascript Vanilla), Django y SQLite permite a la empresa *Flash* agilizar su metodologia de trabajo con los clientes y trabajadores de la misma empresa.

## 1. Instalar y correr localmente (FrontEnd) ⚙️

Para instalar localmente el repositorio y poner a correr el proyecto debemos de seguir los siguientes comandos en nuestra consola:
**1. Clonar el repositorio**
<code>git clone https://github.com/TotoSB/Logistica-Flash.git</code>
**2. Dirigirnos a la Carpeta <i>Frontend</i>**
<code>cd frontend</code>
**3. Verificar si tenemos Node.Js en nuestro equipo**
<code>node -v</code>
**4. En caso de tener el Node, instalamos Node en nuestro proyecto**
<code>npm install</code>
**5.  Y ahora ejecutamos el Frontend**
<code>npm run dev</code>
Listo, ya tendrias el proyecto frontend 🚀!

## 2. Revisión de archivos 🗂️ ##
Ahora vamos a tener corriendo nuestro repositorio.
En nuestra carpeta de <b> Frontend </b> vamos a encontrar:
<ol>  
<li><b>Public 📁</b>: En esta carpeta vamos a encontrar todos los archivos estaticos como imagenes, videos, multimedia. Es decir archivos que forman parte de la pagina estatica. </li>  
<li><b>src 🔧</b>:  Este va a ser nuestro directorio principal donde vamos a encontrar componentes, diseños, hooks, etc
	<ol>
		<li><b>Pages</b>: Acá vamos a encontrar las distintas paginas (componentes) que llamaremos desde el browser de rutas.</li>
		<li><b>Styles:</b> Aca van a ir las hojas de estilo de nuestro proyecto</li>
				<li><b>App.jsx:</b>  Este seria el  navegador de rutas (el archivo donde voy a declarar las rutas y enlazar las paginas que almacenamos en la carpeta <b>Pages</b>)</li>
				<li><b>main.jsx:</b>  En este archivo vamos a cargar el root del proyecto, donde correra el html reactivamente</li>
	</ol>
	</li>
	</ol>
