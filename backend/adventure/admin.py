from django.contrib import admin
from django.contrib.auth import get_user_model
# from django.contrib.auth.admin import UserAdmin

from .models import Player, Room, Item

class PlayerAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'uuid')

admin.site.register(Player, PlayerAdmin)
admin.site.register(Room)
admin.site.register(Item)
# admin.site.register(World)
