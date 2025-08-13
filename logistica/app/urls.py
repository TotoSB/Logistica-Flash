from django.urls import path
from . import views

app_name = 'app'

urlpatterns = [
    path('', views.home_view, name='home'),  # Vista de inicio para /api/
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('user-status/', views.user_status, name='user_status'),
    path('cotizar-envio/', views.cotizar_envio, name='cotizar-envio'),
    path('crear-envio/', views.crear_envio_view, name='crear-envio'),
    path('envios-estado/', views.consultar_estado_envio, name='consulta-estado-envio'),
    # Rutas de admin
    path('obtener_envios/', views.obtener_envios, name='obtener_envios'),
    path('avanzar_envio/<int:envio_id>/', views.avanzar_estado_envio, name='avanzar_estado_envio'),

    # Nuevas rutas para recuperación de contraseña
    path('password-reset/', views.password_reset_request, name='password_reset_request'),
    path('password-reset/confirm/<uuid:token>/', views.password_reset_confirm, name='password_reset_confirm'),
    path('password-reset/validate/<uuid:token>/', views.validate_reset_token, name='validate_reset_token'),
]
