from django.urls import path
from . import views

app_name = 'app'

urlpatterns = [
    path('', views.home_view, name='home'),  # Vista de inicio para /api/
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('user-status/', views.user_status, name='user_status'),
]
