"""
URL configuration for logistica project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def root_view(request):
    """Vista para la ruta raíz"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Logística Flash - API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; text-align: center; }
            .status { color: #27ae60; font-weight: bold; }
            .endpoints { background: #ecf0f1; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .endpoint { margin: 10px 0; }
            .endpoint code { background: #34495e; color: white; padding: 5px 10px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚚 Logística Flash - API</h1>
            <p class="status">✅ Servidor funcionando correctamente</p>
            
            <h2>📋 Endpoints disponibles:</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <strong>🏠 Página de inicio:</strong> <code>GET /</code>
                </div>
                <div class="endpoint">
                    <strong>📋 Información API:</strong> <code>GET /api/</code>
                </div>
                <div class="endpoint">
                    <strong>📝 Registrar usuario:</strong> <code>POST /api/register/</code>
                </div>
                <div class="endpoint">
                    <strong>🔑 Login:</strong> <code>POST /api/login/</code>
                </div>
                <div class="endpoint">
                    <strong>🚪 Logout:</strong> <code>POST /api/logout/</code>
                </div>
                <div class="endpoint">
                    <strong>👤 Estado del usuario:</strong> <code>GET /api/user-status/</code>
                </div>
                <div class="endpoint">
                    <strong>⚙️ Panel de administración:</strong> <code><a href="/admin/">GET /admin/</a></code>
                </div>
            </div>
            
            <h2>🛠️ Cómo usar:</h2>
            <p>1. <strong>Crear usuario:</strong> POST a /api/register/ con email, password y nombre_completo</p>
            <p>2. <strong>Hacer login:</strong> POST a /api/login/ con email y password</p>
            <p>3. <strong>Verificar estado:</strong> GET a /api/user-status/</p>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html_content)

urlpatterns = [
    path('', root_view, name='root'),  # Ruta raíz
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')),
]
