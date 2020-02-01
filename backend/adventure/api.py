from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
# from pusher import Pusher
from django.http import JsonResponse
from decouple import config
from django.contrib.auth.models import User
from .models import *
from rest_framework.decorators import api_view, permission_classes
# from rest_framework import permissions, serializers
from rest_framework import permissions
# from rest_framework import serializers, viewsets
import json
import random

# instantiate pusher
# pusher = Pusher(app_id=config('PUSHER_APP_ID'), key=config('PUSHER_KEY'), secret=config('PUSHER_SECRET'), cluster=config('PUSHER_CLUSTER'))

"""
POST /api/adv/createworld/
HEADER Authorization: Token <token>
REQUEST: No Body
RETURNS:
[
    {
        "id": 1,
        "room_type": 1,
        "grid_x": 15,
        "grid_y": 20,
        "players": ['player1', 'player2'],
        "room_items": ['item1', 'item2']
    },
    {
        ....
    }
]
"""
@api_view(["POST"])
@permission_classes((permissions.IsAdminUser,))
def create_world(request):
    # Delete existing rooms and items
    Room.objects.all().delete()
    Item.objects.all().delete()

    # Reset all players to Room 1
    for player in Player.objects.all():
        player.location = 1
        player.save()

    # Create a World instance and generate rooms
    NUM_ROOMS = 200
    w = World()
    w.generate_rooms(25, 25, NUM_ROOMS)
    w.print_rooms()

    # Generate random item names and placements
    type_items = ["hammer", "bat", "sword", "axe", "whip", "dagger", "club", "idol", "hamster"]
    item_adj = ["plastic", "metal", "golden", "suede", "marble", "velvet", "obsidian"]
    items = [None] * 12

    for i in range(12):
        # Check random names against current item list. If duplicate, generate another
        while True:
            s = f"{random.choice(item_adj)} {random.choice(type_items)}"
            if s not in items:
                break
        # Place in a random world
        item = Item(name=s, room_id=random.randint(1, NUM_ROOMS))
        item.save()
        items.append(s)
    
    # Place exit key
    item = Item(name="exit key", room_id=NUM_ROOMS)
    item.save()
    # Place key room
    key_room = Room.objects.filter(id=NUM_ROOMS)[0]
    key_room.room_type = 4
    key_room.description = "Key Room"
    key_room.save()
    # Place monster room
    monster_room = Room.objects.filter(id=NUM_ROOMS // 2)[0]
    monster_room.room_type = 3
    monster_room.description = "Monster Room"
    monster_room.save()
    # Place treasure room
    treasure_room = Room.objects.filter(id=NUM_ROOMS // 2 - 20)[0]
    treasure_room.room_type = 2
    treasure_room.description = "Treasure Room"
    treasure_room.save()
    # Place treasure
    treasures = ["Sword of Employment", "Armor of Code Challenge Prowess", "1138 LambdaCoin"]
    for treasure in treasures:
        treasure_item = Item(name=treasure, room_id=NUM_ROOMS // 2 - 20)
        treasure_item.save()
    # Place exit room
    exit_room = Room.objects.filter(id=150)[0]
    exit_room.room_type = 5
    exit_room.description = "Locked Room"
    exit_room.save()

    # Generate a list of all rooms and contents
    room_list = []
    rooms = list(Room.objects.all())
    for room in rooms:
        room_list.append({
            'id': room.id,
            'room_type': room.room_type,
            'grid_x': room.grid_x,
            'grid_y': room.grid_y,
            'players': room.playerNames(),
            'room_items': room.roomItemNames()
        })

    # Get player inifo
    user = request.user
    player = user.player
    player_id = player.id
    uuid = player.uuid
    room = player.room()
    item = player.item()
    players = room.playerNames()
    room_items = room.roomItemNames()
    player_items = player.playerItemNames()

    # Return the rooms list and player info
    return JsonResponse({
            'rooms': room_list,
            'player': {
            'uuid': uuid, 
            'name':player.user.username, 
            'room_id': room.id, 
            'room_type':room.room_type, 
            'description':room.description, 
            'grid_x':room.grid_x, 
            'grid_y':room.grid_y, 
            'room_items':room_items,
            'player_items':player_items,
            'players':players
        }
    }, safe=False)

"""
GET /api/adv/map/:id/ # Returns all rooms or a single room if ID is included
HEADER None
REQUEST: No Body
RETURNS:
[
    {
        "id": 1,
        "room_type": 1,
        "grid_x": 15,
        "grid_y": 20,
        "players": ['player1', 'player2'],
        "room_items": ['item1', 'item2']
    },
    {
        ....
    }
]
"""
@api_view(["GET"])
@permission_classes((permissions.IsAuthenticated,))
def get_map(request, room_id=None):
    if room_id:
        rooms = list(Room.objects.filter(id=room_id))
    else:
        rooms = list(Room.objects.all())

    # Generate a list of all rooms and contents
    room_list = []
    for room in rooms:
        room_list.append({
            'id': room.id,
            'room_type': room.room_type,
            'grid_x': room.grid_x,
            'grid_y': room.grid_y,
            'players': room.playerNames(),
            'room_items': room.roomItemNames()
        })

    # Get player inifo
    user = request.user
    player = user.player
    player_id = player.id
    uuid = player.uuid
    room = player.room()
    item = player.item()
    players = room.playerNames()
    room_items = room.roomItemNames()
    player_items = player.playerItemNames()

    # Return the rooms list and player info
    return JsonResponse({
            'rooms': room_list,
            'player': {
            'uuid': uuid, 
            'name':player.user.username, 
            'room_id': room.id, 
            'room_type':room.room_type, 
            'description':room.description, 
            'grid_x':room.grid_x, 
            'grid_y':room.grid_y, 
            'room_items':room_items,
            'player_items':player_items,
            'players':players
        }
    }, safe=False)


"""
GET /api/adv/init/
REQUEST: No Body
RETURNS:
{
    "name": "bryanszendel1", 
    "room_type": "ROOM2", 
    "description": "DEFAULT DESCRIPTION", 
    "players": ["bryanszendel1"], 
    "error_msg": ""
}
"""
@csrf_exempt
@api_view(["GET"])
def initialize(request):
    user = request.user
    player = user.player
    player_id = player.id
    uuid = player.uuid
    room = player.room()
    item = player.item()
    players = room.playerNames()
    room_items = room.roomItemNames()
    player_items = player.playerItemNames()
    return JsonResponse({
        'uuid': uuid, 
        'name':player.user.username, 
        'room_id': room.id, 
        'room_type':room.room_type, 
        'description':room.description, 
        'grid_x':room.grid_x, 
        'grid_y':room.grid_y, 
        'room_items':room_items,
        'player_items':player_items,
        'players':players
        }, safe=True)


"""
POST /api/adv/move/
REQUEST:
{
    "direction":"u" || "d" || "l" || "r"
}
RETURNS:
{
    "name": "bryanszendel1", 
    "room_type": "ROOM1", 
    "description": "DEFAULT DESCRIPTION", 
    "players": ["bryanszendel1", "bryanszendel"], 
    "error_msg": ""
}
"""
# @csrf_exempt
@api_view(["POST"])
def move(request):
    dirs={"u": "up", "d": "down", "r": "right", "l": "left"}
    reverse_dirs = {"u": "down", "d": "up", "r": "left", "l": "right"}
    player = request.user.player
    player_id = player.id
    player_uuid = player.uuid
    data = json.loads(request.body)
    direction = data['direction']
    room = player.room()
    nextRoomID = None
    if direction == "u":
        nextRoomID = room.room_up
    elif direction == "d":
        nextRoomID = room.room_down
    elif direction == "r":
        nextRoomID = room.room_right
    elif direction == "l":
        nextRoomID = room.room_left

    print(nextRoomID)
    if nextRoomID is not None and nextRoomID > 0:
        nextRoom = Room.objects.get(id=nextRoomID)
        player.location=nextRoomID
        player.save()
        players = nextRoom.playerNames()
        room_items = room.roomItemNames()
        next_room_items = nextRoom.roomItemNames()
        player_items = player.playerItemNames()
        currentPlayerUUIDs = room.playerUUIDs()
        nextPlayerUUIDs = nextRoom.playerUUIDs()
        # for p_uuid in currentPlayerUUIDs:
        #     pusher.trigger(f'p-channel-{p_uuid}', u'broadcast', {'message':f'{player.user.username} has walked {dirs[direction]}.'})
        # for p_uuid in nextPlayerUUIDs:
        #     pusher.trigger(f'p-channel-{p_uuid}', u'broadcast', {'message':f'{player.user.username} has entered from the {reverse_dirs[direction]}.'})
        
        # Player can only enter the locked room if they have the key
        description = nextRoom.description
        error_message = ""
        if nextRoom.room_type == '5':
            if "exit key" not in player.playerItemNames():
                error_message = "The exit is locked and you don't have the key."
            else:
                error_message = "You win!"
                description = "You win!"
        return JsonResponse({
            'name':player.user.username, 
            'room_id': nextRoom.id, 
            'room_type': nextRoom.room_type, 
            'description': description, 
            'grid_x': nextRoom.grid_x,
            'grid_y': nextRoom.grid_y,
            'room_items': next_room_items,
            'player_items': player_items,
            'players': players,
            'error_msg': error_message
        }, safe=True)
    else:
        room_items = room.roomItemNames()
        player_items = player.playerItemNames()
        players = room.playerNames()
        return JsonResponse({
            'name':player.user.username, 
            'room_id': room.id, 
            'room_type':room.room_type, 
            'description':room.description, 
            'grid_x':room.grid_x,
            'grid_y':room.grid_y,
            'room_items':room_items,
            'player_items':player_items,
            'players':players, 
            'error_msg':"You cannot move that way."
            }, safe=True)

@api_view(["POST"])
def getItem(request):
    player = request.user.player
    player_id = player.id
    player_uuid = player.uuid
    data = json.loads(request.body)
    # action = data['action']
    itemName = data['item']
    print('itemName', itemName)
    player_item = player.getItem(itemName)
    print('item', player_item)
    room = player.room()
    players = room.playerNames()
    room_items = room.roomItemNames()
    print(room.id)

    if (itemName in room_items):
        # player_item = item.getItem(itemName)
        player_item.player_id = player_id
        player_item.room_id = 0
        player_item.save()

        room_items = room.roomItemNames() 
        player_items = player.playerItemNames()
    
        return JsonResponse({
            'uuid': player_uuid, 
            'name':player.user.username, 
            'room_id': room.id, 
            'room_type':room.room_type, 
            'description':room.description, 
            'grid_x':room.grid_x, 
            'grid_y':room.grid_y, 
            'room_items':room_items,
            'player_items':player_items,
            'players':players
            }, safe=True)
    
    else:
        return JsonResponse({
            'message':'That item is not in this room'
        }, status=404)

@api_view(["POST"])
def dropItem(request):
    player = request.user.player
    player_id = player.id
    player_uuid = player.uuid
    data = json.loads(request.body)
    # action = data['action']
    itemName = data['item']
    print('itemName', itemName)
    player_item = player.getItem(itemName)
    print('item', player_item)
    room = player.room()
    room_id = room.id
    players = room.playerNames()
    room_items = room.roomItemNames()
    player_items = player.playerItemNames()
    print(room.id)

    if (itemName in player_items):
        # player_item = item.getItem(itemName)
        player_item.player_id = 0
        player_item.room_id = room_id
        player_item.save()

        room_items = room.roomItemNames() 
        player_items = player.playerItemNames()
        
        return JsonResponse({
            'uuid': player_uuid, 
            'room_id': room.id, 
            'room_type':room.room_type, 
            'description':room.description, 
            'grid_x':room.grid_x, 
            'grid_y':room.grid_y, 
            'room_items':room_items,
            'player_items':player_items,
            'players':players
            }, safe=True)
    
    else:
        return JsonResponse({
            'message':'That item is not in your knapsack.'
        }, status=404)

@csrf_exempt
@api_view(["POST"])
def say(request):
    # IMPLEMENT
    return JsonResponse({'error':"Not yet implemented"}, safe=True, status=500)
