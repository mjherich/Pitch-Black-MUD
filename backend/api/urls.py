from django.urls import include, path, re_path
from django.conf.urls import url
from rest_framework.authtoken import views

# /api/login/
# ACCEPTS 'username', 'password'
# RETURNS "key":"kael45637ghghdu" (fake token/key)

# /api/registration/ 
# ACCEPTS 'username', 'password1', 'password2'
# RETURN "key":"kael45637ghghdu" (fake token/key)

urlpatterns = [
    path('', include('rest_auth.urls')),
    path('registration/', include('rest_auth.registration.urls')),
]
