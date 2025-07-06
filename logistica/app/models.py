from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from datetime import timedelta
from django.utils import timezone

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


class PasswordResetToken(models.Model):
    """
    Modelo para manejar tokens de recuperación de contraseña
    """
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE, verbose_name="Usuario")
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name="Token")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    used = models.BooleanField(default=False, verbose_name="Token usado")
    
    class Meta:
        verbose_name = "Token de recuperación de contraseña"
        verbose_name_plural = "Tokens de recuperación de contraseña"
    
    def is_expired(self):
        """
        Verifica si el token ha expirado (válido por 1 hora)
        """
        return timezone.now() > self.created_at + timedelta(hours=1)
    
    def __str__(self):
        return f"Token para {self.user.email} - {'Usado' if self.used else 'Activo'}"
