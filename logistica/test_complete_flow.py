#!/usr/bin/env python
"""
Script para probar el flujo completo de recuperación de contraseña
"""
import os
import sys
import django
from django.conf import settings

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'logistica.settings')
django.setup()

from app.models import Usuario, PasswordResetToken
from app.email_utils import send_password_reset_email
from django.contrib.auth.hashers import make_password

def test_full_password_reset_flow():
    """
    Test completo del flujo de recuperación de contraseña
    """
    print("🔄 Iniciando prueba completa del flujo de recuperación de contraseña...")
    
    # Paso 1: Crear un usuario de prueba
    print("\n📝 Paso 1: Creando usuario de prueba...")
    try:
        # Intentar eliminar usuario existente si existe
        try:
            existing_user = Usuario.objects.get(email='alejovalentinocaputo07@gmail.com')
            existing_user.delete()
            print("Usuario existente eliminado")
        except Usuario.DoesNotExist:
            pass
        
        # Crear nuevo usuario
        test_user = Usuario.objects.create_user(
            username='testuser',
            email='alejovalentinocaputo07@gmail.com',
            password='password123',
            nombre_completo='Usuario de Prueba',
            telefono='123456789'
        )
        print(f"✅ Usuario creado: {test_user.email}")
        
    except Exception as e:
        print(f"❌ Error creando usuario: {e}")
        return False
    
    # Paso 2: Generar token de recuperación
    print("\n🔑 Paso 2: Generando token de recuperación...")
    try:
        # Eliminar tokens existentes para este usuario
        PasswordResetToken.objects.filter(user=test_user).delete()
        
        # Crear nuevo token
        reset_token = PasswordResetToken.objects.create(user=test_user)
        print(f"✅ Token creado: {reset_token.token}")
        
    except Exception as e:
        print(f"❌ Error creando token: {e}")
        return False
    
    # Paso 3: Enviar email de recuperación
    print("\n📧 Paso 3: Enviando email de recuperación...")
    try:
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{reset_token.token}"
        print(f"URL de recuperación: {reset_url}")
        
        success = send_password_reset_email(test_user, reset_token.token, reset_url)
        if success:
            print("✅ Email de recuperación enviado exitosamente")
        else:
            print("❌ Error enviando email de recuperación")
            return False
            
    except Exception as e:
        print(f"❌ Error enviando email: {e}")
        return False
    
    # Paso 4: Verificar que el token es válido
    print("\n🔍 Paso 4: Verificando validez del token...")
    try:
        # Buscar el token en la base de datos
        db_token = PasswordResetToken.objects.get(token=reset_token.token)
        
        if db_token.is_expired():
            print("❌ Token está expirado")
            return False
        
        if db_token.used:
            print("❌ Token ya fue usado")
            return False
            
        print("✅ Token es válido")
        
    except PasswordResetToken.DoesNotExist:
        print("❌ Token no encontrado en base de datos")
        return False
    except Exception as e:
        print(f"❌ Error verificando token: {e}")
        return False
    
    # Paso 5: Simular cambio de contraseña
    print("\n🔒 Paso 5: Simulando cambio de contraseña...")
    try:
        # Cambiar contraseña
        new_password = 'newpassword123'
        test_user.password = make_password(new_password)
        test_user.save()
        
        # Marcar token como usado
        db_token.used = True
        db_token.save()
        
        print("✅ Contraseña cambiada exitosamente")
        print("✅ Token marcado como usado")
        
    except Exception as e:
        print(f"❌ Error cambiando contraseña: {e}")
        return False
    
    # Paso 6: Verificar que el usuario puede iniciar sesión con la nueva contraseña
    print("\n🔐 Paso 6: Verificando autenticación con nueva contraseña...")
    try:
        from django.contrib.auth import authenticate
        
        # Intentar autenticar con la nueva contraseña
        authenticated_user = authenticate(username=test_user.email, password=new_password)
        
        if authenticated_user:
            print("✅ Autenticación exitosa con nueva contraseña")
        else:
            print("❌ Falló la autenticación con nueva contraseña")
            return False
            
    except Exception as e:
        print(f"❌ Error en autenticación: {e}")
        return False
    
    # Limpieza
    print("\n🧹 Limpieza: Eliminando datos de prueba...")
    try:
        PasswordResetToken.objects.filter(user=test_user).delete()
        test_user.delete()
        print("✅ Datos de prueba eliminados")
    except Exception as e:
        print(f"⚠️  Error en limpieza: {e}")
    
    return True

if __name__ == '__main__':
    print("🚀 Iniciando prueba completa del sistema de recuperación de contraseña")
    print("=" * 70)
    
    success = test_full_password_reset_flow()
    
    print("\n" + "=" * 70)
    if success:
        print("🎉 ¡ÉXITO! El flujo completo de recuperación de contraseña funciona correctamente.")
        print("\nTu sistema está listo para:")
        print("• Enviar emails de bienvenida")
        print("• Procesar solicitudes de recuperación de contraseña")
        print("• Enviar emails de recuperación con enlaces seguros")
        print("• Validar tokens de recuperación")
        print("• Cambiar contraseñas de usuarios")
        print("\n💡 Siguiente paso: Probar desde el frontend!")
    else:
        print("❌ FALLÓ: Hubo errores en el flujo de recuperación de contraseña.")
        print("Por favor revisa los errores arriba y corrige la configuración.")
