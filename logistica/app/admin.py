from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

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
