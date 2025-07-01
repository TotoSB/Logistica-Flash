from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Usuario(AbstractUser):
    """
    Modelo personalizado de usuario para el sistema de logística
    """
    email = models.EmailField(unique=True, verbose_name="Correo electrónico")
    nombre_completo = models.CharField(max_length=255, verbose_name="Nombre completo")
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de registro")
    activo = models.BooleanField(default=True, verbose_name="Usuario activo")
    
    # Usar email como campo de login en lugar de username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'nombre_completo']
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        
    def __str__(self):
        return f"{self.nombre_completo} ({self.email})"
