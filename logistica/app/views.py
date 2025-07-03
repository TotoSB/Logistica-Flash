import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth import authenticate
from .models import Usuario


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

