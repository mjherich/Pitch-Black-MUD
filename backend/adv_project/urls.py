from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls import include

from rest_framework import routers
from rest_framework.authtoken import views

router = routers.DefaultRouter()
# router.register('players')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/adv/', include('adventure.urls')),
    # path('api/users/', include('users.urls')),
]
