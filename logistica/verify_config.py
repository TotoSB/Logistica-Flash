#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'logistica.settings')
django.setup()

from django.conf import settings

print("🔍 Verificando configuración de URLs...")
print(f"FRONTEND_URL: {settings.FRONTEND_URL}")
print(f"CORS_ALLOWED_ORIGINS: {settings.CORS_ALLOWED_ORIGINS}")

# Ejemplo de URL de recuperación
token_ejemplo = "abc123-def456-ghi789"
reset_url = f"{settings.FRONTEND_URL}/reset-password/{token_ejemplo}"
print(f"\nEjemplo de URL de recuperación:")
print(f"🔗 {reset_url}")

if "5173" in settings.FRONTEND_URL:
    print("\n✅ ¡Configuración correcta! El frontend está configurado para puerto 5173")
else:
    print("\n❌ Error: El frontend debería estar configurado para puerto 5173")
