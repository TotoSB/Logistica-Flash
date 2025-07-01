from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import json

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def home_view(request):
    """
    Vista de inicio - información sobre la API
    """
    return Response({
        'message': 'Bienvenido a la API de Logística Flash',
        'version': '1.0.0',
        'endpoints': {
            'login': '/api/login/',
            'register': '/api/register/',
            'logout': '/api/logout/',
            'user_status': '/api/user-status/',
            'admin': '/admin/'
        }
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Vista para el login de usuarios
    """
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email y contraseña son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Autenticar usuario
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            if user.activo:
                login(request, user)
                return Response({
                    'message': 'Login exitoso',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'nombre_completo': user.nombre_completo,
                        'is_staff': user.is_staff
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Usuario inactivo'
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({
                'error': 'Credenciales inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except json.JSONDecodeError:
        return Response({
            'error': 'Formato JSON inválido'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': 'Error interno del servidor'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def logout_view(request):
    """
    Vista para cerrar sesión
    """
    logout(request)
    return Response({
        'message': 'Logout exitoso'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def user_status(request):
    """
    Vista para verificar el estado de autenticación del usuario
    """
    if request.user.is_authenticated:
        return Response({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'nombre_completo': request.user.nombre_completo,
                'is_staff': request.user.is_staff
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'authenticated': False
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Vista para registrar nuevos usuarios
    """
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        nombre_completo = data.get('nombre_completo')
        telefono = data.get('telefono', '')
        
        # Validaciones básicas
        if not email or not password or not nombre_completo:
            return Response({
                'error': 'Email, contraseña y nombre completo son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si el usuario ya existe
        from .models import Usuario
        if Usuario.objects.filter(email=email).exists():
            return Response({
                'error': 'Ya existe un usuario con este email'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Crear nuevo usuario
        user = Usuario.objects.create_user(
            username=email,  # Usamos email como username también
            email=email,
            password=password,
            nombre_completo=nombre_completo,
            telefono=telefono
        )
        
        return Response({
            'message': 'Usuario creado exitosamente',
            'user': {
                'id': user.id,
                'email': user.email,
                'nombre_completo': user.nombre_completo,
            }
        }, status=status.HTTP_201_CREATED)
        
    except json.JSONDecodeError:
        return Response({
            'error': 'Formato JSON inválido'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Error interno del servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
