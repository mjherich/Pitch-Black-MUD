from django.conf.urls import url
from . import api

urlpatterns = [
    url(r'^map/(?P<room_id>\d+)/$', api.get_map),
    url('map', api.get_map),
    url('createworld', api.create_world),
    url('init', api.initialize),
    url('move', api.move),
    url('say', api.say),
    url('get-item', api.getItem),
    url('drop-item', api.dropItem)
]