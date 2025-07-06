from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, PasswordResetToken

# Register your models here.

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    """
    Configuración del panel de administración para el modelo Usuario
    """
    list_display = ('email', 'nombre_completo', 'is_staff', 'activo', 'fecha_registro')
    list_filter = ('is_staff', 'is_superuser', 'activo', 'fecha_registro')
    search_fields = ('email', 'nombre_completo', 'username')
    ordering = ('-fecha_registro',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {
            'fields': ('nombre_completo', 'telefono', 'activo')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información adicional', {
            'fields': ('email', 'nombre_completo', 'telefono')
        }),
    )


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    """
    Configuración del panel de administración para tokens de recuperación de contraseña
    """
    list_display = ('user', 'token', 'created_at', 'used', 'is_expired')
    list_filter = ('used', 'created_at')
    search_fields = ('user__email', 'user__nombre_completo', 'token')
    ordering = ('-created_at',)
    readonly_fields = ('token', 'created_at', 'is_expired')
    
    def is_expired(self, obj):
        return obj.is_expired()
    is_expired.boolean = True
    is_expired.short_description = 'Expirado'
