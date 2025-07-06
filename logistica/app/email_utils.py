from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_welcome_email(user):
    """
    Envía un email de bienvenida al usuario recién registrado
    """
    try:
        subject = f'¡Bienvenido a Logística Flash, {user.nombre_completo}!'
        
        # Renderizar el template HTML
        html_content = render_to_string('emails/welcome_email.html', {
            'user': user,
        })
        
        # Crear versión de texto plano
        text_content = strip_tags(html_content)
        
        # Crear el email
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )
        
        # Adjuntar la versión HTML
        email.attach_alternative(html_content, "text/html")
        
        # Enviar el email
        email.send()
        
        logger.info(f"Email de bienvenida enviado a {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Error enviando email de bienvenida a {user.email}: {str(e)}")
        return False

def send_password_reset_email(user, token, reset_url):
    """
    Envía un email para restablecer contraseña
    """
    try:
        subject = 'Restablecer contraseña - Logística Flash'
        
        # Renderizar el template HTML
        html_content = render_to_string('emails/password_reset_email.html', {
            'user': user,
            'token': token,
            'reset_url': reset_url,
        })
        
        # Crear versión de texto plano
        text_content = strip_tags(html_content)
        
        # Crear el email
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )
        
        # Adjuntar la versión HTML
        email.attach_alternative(html_content, "text/html")
        
        # Enviar el email
        email.send()
        
        logger.info(f"Email de recuperación de contraseña enviado a {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Error enviando email de recuperación de contraseña a {user.email}: {str(e)}")
        return False

def send_password_changed_notification(user):
    """
    Envía una notificación cuando la contraseña ha sido cambiada exitosamente
    """
    try:
        subject = 'Contraseña actualizada - Logística Flash'
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2ed573;">✅ Contraseña actualizada exitosamente</h2>
                
                <p>Hola {user.nombre_completo},</p>
                
                <p>Te confirmamos que tu contraseña ha sido actualizada exitosamente en Logística Flash.</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Detalles del cambio:</strong></p>
                    <p>• Usuario: {user.nombre_completo}</p>
                    <p>• Email: {user.email}</p>
                    <p>• Fecha: {user.last_login}</p>
                </div>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>⚠️ Si no realizaste este cambio:</strong></p>
                    <p>Contacta inmediatamente a nuestro equipo de soporte en soporte@logisticaflash.com</p>
                </div>
                
                <p>Gracias por usar Logística Flash.</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666;">
                    © 2025 Logística Flash. Todos los derechos reservados.
                </p>
            </div>
        </body>
        </html>
        """
        
        # Crear versión de texto plano
        text_content = strip_tags(html_content)
        
        # Crear el email
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )
        
        # Adjuntar la versión HTML
        email.attach_alternative(html_content, "text/html")
        
        # Enviar el email
        email.send()
        
        logger.info(f"Notificación de cambio de contraseña enviada a {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Error enviando notificación de cambio de contraseña a {user.email}: {str(e)}")
        return False
