from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from uuid import uuid4
import random
import math
import json

class Room(models.Model):
    id = models.IntegerField(primary_key=True, default=0)
    room_type = models.CharField(max_length=50, default="ROOM")
    # title = models.CharField(max_length=50, default="DEFAULT TITLE")
    description = models.CharField(
        max_length=500, default="Pathway")
    room_up = models.IntegerField(default=0)
    room_down = models.IntegerField(default=0)
    room_right = models.IntegerField(default=0)
    room_left = models.IntegerField(default=0)
    grid_x = models.IntegerField(default=None)
    grid_y = models.IntegerField(default=None)

    ################ These were provided ################
    def get_room_in_direction(self, direction):
        '''
        Return room in corresponding direction
        '''
        return getattr(self, f"room_{direction}")

    def get_by_id(self, id):
        # print("id", id)
        # print(Room.objects.filter(id=id)[0])
        return Room.objects.filter(id=id).first()

    def connect_rooms(self, connecting_room, direction):
        '''
        Connect two rooms in the given n/s/e/w direction
        '''
        reverse_dir = {"up": "down", "down": "up",
                        "right": "left", "left": "right"}[direction]
        setattr(self, f"room_{direction}", connecting_room.id)
        self.save()
        setattr(connecting_room, f"room_{reverse_dir}", self.id)
        connecting_room.save()

    def playerNames(self):
        return [p.user.username for p in Player.objects.filter(location=self.id)] #if p.id != int(currentPlayerID)

    def playerUUIDs(self):
        return [p.uuid for p in Player.objects.filter(location=self.id)] #if p.id != int(currentPlayerID)
    #####################################################

    def roomItemNames(self):
        return [i.name for i in Item.objects.filter(room_id=self.id)] #if p.id != int(currentPlayerID)


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    uuid = models.UUIDField(default=uuid4, unique=True, editable=False)
    location = models.IntegerField(default=1)
    items = []

    ############# These were provided ###############
    def initialize(self):
        if self.location == 1:
            self.location = Room.objects.first().id
            self.save()

    def room(self):
        try:
            return Room.objects.get(id=self.location)
        except Room.DoesNotExist:
            self.initialize()
            return self.room()

    def item(self):
        try:
            return Item.objects.filter(player_id=self.user.id)
        except Item.DoesNotExist:
            self.initialize()
            return self.item()

    def getItem(self, item):
        return Item.objects.get(name=item)
    ###############################################
    
    def playerItemNames(self):
        return [i.name for i in Item.objects.filter(player_id=self.user.id)] #if p.id != int(currentPlayerID)




@receiver(post_save, sender=User)
def create_user_player(sender, instance, created, **kwargs):
    if created:
        Player.objects.create(user=instance)
        Token.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_player(sender, instance, **kwargs):
    instance.player.save()


class Item(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=50, default="ITEM")
    player_id = models.IntegerField(default=0)
    room_id = models.IntegerField(default=0)

class World:
    def __init__(self):
        self.grid = None
        self.width = 0
        self.height = 0
        self.rooms = []
        self.room_count = 1
        self.prev_direction = "up"

    def generate_rooms(self, size_x, size_y, num_rooms):
        '''
        Wander around randomly to create a dungeon
        '''

        # If coordinate outside the grid, return previous value
        def limit(new, orig, maximum):
            if new < 0 or new >= maximum:
                return orig
            else:
                return new

        # Link rooms between two points horizontally
        def draw_horizontal(x1, x2, y):
            if x1 == x2:
                return
            for x in range(min(x1, x2), max(x1, x2) + 1):
                # print(x, y)
                if self.grid[y][x] == 0:
                    self.room_count += 1
                    self.grid[y][x] = self.room_count

        # Link rooms between two points horizontally
        def draw_vertical(y1, y2, x):
            if y1 == y2:
                return
            for y in range(min(y1, y2), max(y1, y2) + 1):
                if self.grid[y][x] == 0:
                    self.room_count += 1
                    self.grid[y][x] = self.room_count

        # Initialize the grid
        self.grid = [0] * size_y
        self.width = size_x
        self.height = size_y
        self.room_count = 1
        for i in range(len(self.grid)):
            self.grid[i] = [0] * size_x

        # Start from middle
        x = size_x // 2
        y = size_y // 2

        # Create first room
        self.current_room = Room(id=1, room_type=1, grid_x=x, grid_y=y)
        self.grid[y][x] = 1

        # Loop until we've made enough rooms
        while self.room_count < num_rooms:

            # Pick a random distance to move in one direction
            offset = random.choice([-5, -2, 1, 2, 5])
            # 50% chance of going sideways or up/down, at an offset of 1, 2, or 5 rooms
            if random.random() > 0.5:
                new_x = limit(x+offset, x, size_x)
                draw_horizontal(x, new_x, y)
                x = new_x
            else:
                new_y = limit(y+offset, y, size_y)
                draw_vertical(y, new_y, x)
                y = new_y
        
        print("Linking rooms... ", end="")

        # Linking happens separately after building the map
        cache = {}
        def create_or_retrieve_room(id, x, y):
            # If room not in cache, create a new room, otherwise return existing room
            if id in cache:
                room = cache[id]
            else:
                room = Room(id=id, room_type=1, grid_x=x, grid_y=y)
                room.save()
                cache[id] = room
            return room

        # Iterate over the grid
        for y in range(0, size_y):
            for x in range(0, size_x):
                current_id = self.grid[y][x]
                right_id = self.grid[y][x+1] if x + 1 < size_x else 0
                down_id = self.grid[y+1][x] if y + 1 < size_y else 0

                # Check right and down for rooms needing to be linked to the current one
                # and connect them
                if current_id:
                    current_room = create_or_retrieve_room(current_id, x, y)
                    if right_id:
                        print("right ", end="")
                        new_room = create_or_retrieve_room(right_id, x+1, y)
                        print(current_room, new_room)
                        current_room.connect_rooms(new_room, "right")
                    if down_id:
                        print("down ", end="")
                        new_room = create_or_retrieve_room(down_id, x, y+1)
                        print(current_room, new_room)
                        current_room.connect_rooms(new_room, "up")

        print("done")
        print(f"${self.room_count} rooms generated")

    def print_rooms(self):
        '''
        Print the rooms in room_grid in ascii characters.
        '''

        for row in self.grid:
            for room in row:
                if room != 0:
                    print(str(room).zfill(3), end=" ")
                else:
                    print("   ", end=" ")
            print()
