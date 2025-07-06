#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'logistica.settings')
django.setup()

# Now test the email functionality
from app.email_utils import send_welcome_email, send_password_reset_email
from app.models import Usuario
from django.core.mail import send_mail

def test_basic_email():
    """Test basic email sending"""
    print("Probando envío básico de email...")
    try:
        send_mail(
            'Email de Prueba desde Logística Flash',
            'Este es un email de prueba para verificar que la configuración de email funciona correctamente.',
            settings.DEFAULT_FROM_EMAIL,
            ['alejovalentinocaputo07@gmail.com'],
            fail_silently=False,
        )
        print("✅ Test de email básico exitoso!")
        return True
    except Exception as e:
        print(f"❌ Test de email básico falló: {e}")
        return False

def test_welcome_email():
    """Test welcome email"""
    print("\nProbando email de bienvenida...")
    try:
        # Create a test user (or use existing)
        test_user = Usuario(
            email='alejovalentinocaputo07@gmail.com',
            nombre_completo='Usuario de Prueba',
            telefono='123456789',
            username='testuser'
        )
        
        success = send_welcome_email(test_user)
        if success:
            print("✅ Test de email de bienvenida exitoso!")
            return True
        else:
            print("❌ Test de email de bienvenida falló!")
            return False
    except Exception as e:
        print(f"❌ Test de email de bienvenida falló: {e}")
        return False

def test_password_reset_email():
    """Test password reset email"""
    print("\nProbando email de recuperación de contraseña...")
    try:
        # Create a test user (or use existing)
        test_user = Usuario(
            email='alejovalentinocaputo07@gmail.com',
            nombre_completo='Usuario de Prueba',
            telefono='123456789',
            username='testuser'
        )
        
        reset_token = 'test-reset-token-123'
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"
        success = send_password_reset_email(test_user, reset_token, reset_url)
        if success:
            print("✅ Test de email de recuperación de contraseña exitoso!")
            return True
        else:
            print("❌ Test de email de recuperación de contraseña falló!")
            return False
    except Exception as e:
        print(f"❌ Test de email de recuperación de contraseña falló: {e}")
        return False

if __name__ == '__main__':
    print("🚀 Iniciando pruebas de configuración de email...")
    print(f"Backend de email: {settings.EMAIL_BACKEND}")
    print(f"Host de email: {settings.EMAIL_HOST}")
    print(f"Puerto de email: {settings.EMAIL_PORT}")
    print(f"Usuario de email: {settings.EMAIL_HOST_USER}")
    print(f"Email por defecto: {settings.DEFAULT_FROM_EMAIL}")
    print("-" * 50)
    
    # Run tests
    basic_test = test_basic_email()
    welcome_test = test_welcome_email()
    reset_test = test_password_reset_email()
    
    print("\n" + "="*50)
    print("📊 Resultados de las Pruebas:")
    print(f"Email básico: {'✅ EXITOSO' if basic_test else '❌ FALLÓ'}")
    print(f"Email de bienvenida: {'✅ EXITOSO' if welcome_test else '❌ FALLÓ'}")
    print(f"Email de recuperación: {'✅ EXITOSO' if reset_test else '❌ FALLÓ'}")
    
    if all([basic_test, welcome_test, reset_test]):
        print("\n🎉 ¡Todas las pruebas de email fueron exitosas! Tu configuración de email funciona correctamente.")
    else:
        print("\n⚠️  Algunas pruebas de email fallaron. Por favor revisa la configuración.")
