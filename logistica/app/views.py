import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from django.http import Http404
from django.conf import settings
from .models import Usuario, PasswordResetToken
from .email_utils import send_welcome_email, send_password_reset_email, send_password_changed_notification


@api_view(['GET'])
@permission_classes([AllowAny])
def home_view(request):
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
    Login con JWT - retorna access y refresh tokens
    """
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({'error': 'Email y contraseña requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)

        if user is not None:
            if user.activo:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'nombre_completo': user.nombre_completo,
                        'is_staff': user.is_staff
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Usuario inactivo'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response({'error': f'Error interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout JWT - invalida todos los tokens del usuario
    """
    try:
        tokens = OutstandingToken.objects.filter(user=request.user)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)

        return Response({'message': 'Logout exitoso'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': f'Error al cerrar sesión: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_status(request):
    return Response({
        'authenticated': True,
        'user': {
            'id': request.user.id,
            'email': request.user.email,
            'nombre_completo': request.user.nombre_completo,
            'is_staff': request.user.is_staff
        }
    }, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        nombre_completo = data.get('nombre_completo')
        telefono = data.get('telefono', '')

        if not email or not password or not nombre_completo:
            return Response({'error': 'Email, contraseña y nombre completo son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        if Usuario.objects.filter(email=email).exists():
            return Response({'error': 'Ya existe un usuario con este email'}, status=status.HTTP_400_BAD_REQUEST)

        user = Usuario.objects.create_user(
            username=email,
            email=email,
            password=password,
            nombre_completo=nombre_completo,
            telefono=telefono
        )

        # Enviar email de bienvenida
        send_welcome_email(user)

        return Response({
            'message': 'Usuario registrado exitosamente',
            'user': {
                'id': user.id,
                'email': user.email,
                'nombre_completo': user.nombre_completo
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': f'Error interno del servidor: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """
    Solicitar recuperación de contraseña
    """
    try:
        data = json.loads(request.body)
        email = data.get('email')

        if not email:
            return Response({'error': 'Email es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            # Por seguridad, no revelamos si el email existe o no
            return Response({'message': 'Si el email existe, recibirás un enlace para restablecer tu contraseña'}, status=status.HTTP_200_OK)

        # Invalidar tokens anteriores no usados
        PasswordResetToken.objects.filter(user=user, used=False).update(used=True)

        # Crear nuevo token
        reset_token = PasswordResetToken.objects.create(user=user)

        # Construir URL de reset usando la configuración
        frontend_url = settings.FRONTEND_URL
        reset_url = f"{frontend_url}/reset-password/{reset_token.token}"

        # Enviar email
        send_password_reset_email(user, reset_token, reset_url)

        return Response({
            'message': 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': f'Error interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request, token):
    """
    Confirmar recuperación de contraseña con token
    """
    try:
        data = json.loads(request.body)
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if not new_password or not confirm_password:
            return Response({'error': 'Ambas contraseñas son requeridas'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'Las contraseñas no coinciden'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({'error': 'La contraseña debe tener al menos 8 caracteres'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response({'error': 'Token inválido'}, status=status.HTTP_400_BAD_REQUEST)

        if reset_token.used:
            return Response({'error': 'Este token ya ha sido usado'}, status=status.HTTP_400_BAD_REQUEST)

        if reset_token.is_expired():
            return Response({'error': 'Este token ha expirado'}, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar contraseña
        user = reset_token.user
        user.set_password(new_password)
        user.save()

        # Marcar token como usado
        reset_token.used = True
        reset_token.save()

        # Enviar notificación de cambio de contraseña
        send_password_changed_notification(user)

        return Response({
            'message': 'Contraseña actualizada exitosamente'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': f'Error interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def validate_reset_token(request, token):
    """
    Validar si un token de recuperación es válido
    """
    try:
        reset_token = PasswordResetToken.objects.get(token=token)
        
        if reset_token.used:
            return Response({'valid': False, 'error': 'Token ya usado'}, status=status.HTTP_400_BAD_REQUEST)
        
        if reset_token.is_expired():
            return Response({'valid': False, 'error': 'Token expirado'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'valid': True,
            'user_email': reset_token.user.email,
            'expires_at': reset_token.created_at
        }, status=status.HTTP_200_OK)
        
    except PasswordResetToken.DoesNotExist:
        return Response({'valid': False, 'error': 'Token inválido'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': f'Error interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

