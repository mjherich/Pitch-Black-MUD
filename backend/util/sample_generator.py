# Sample Python code that can be used to generate rooms in
# a zig-zag pattern.
#
# You can modify generate_rooms() to create your own
# procedural generation algorithm and use print_rooms()
# to see the world.

import random
# import django
# django.setup()
# from adv_project import settings
# from django.core.management import setup_environ
# setup_environ(settings)
from django.apps import apps
Room = apps.get_model('adventure', 'Room')

class World:
    def __init__(self):
        self.grid = None
        self.width = 0
        self.height = 0
        self.rooms = []
    def generate_rooms(self, size_x, size_y, num_rooms):
        '''
        Fill up the grid, bottom to top, in a zig-zag pattern
        '''

        # Initialize the grid
        self.grid = [None] * size_y
        self.width = size_x
        self.height = size_y
        for i in range( len(self.grid) ):
            self.grid[i] = [None] * size_x

        # Start from middle
        x = size_x // 2
        y = size_y // 2

        # While there are rooms to be created...
        previous_room = Room()
        print(previous_room)
        while room_count < num_rooms:

            directions = ["up", "down", "left", "right"]
            # open_paths = [x for x in directions if previous_room[f"room_{x}"] is None]

            # # Create a room in the given direction
            # room = Room(room_count, "A Generic Room", "This is a generic room.", x, y)
            # # Note that in Django, you'll need to save the room after you create it

            # # Save the room in the World grid
            # self.grid[y][x] = room

            # # Connect the new room to the previous room
            # if previous_room is not None:
            #     previous_room.connect_rooms(room, room_direction)

            # # Update iteration variables
            # previous_room = room
            room_count += 1



    def print_rooms(self):
        '''
        Print the rooms in room_grid in ascii characters.
        '''
        pass
        # # Add top border
        # str = "# " * ((3 + self.width * 5) // 2) + "\n"

        # # The console prints top to bottom but our array is arranged
        # # bottom to top.
        # #
        # # We reverse it so it draws in the right direction.
        # reverse_grid = list(self.grid) # make a copy of the list
        # reverse_grid.reverse()
        # for row in reverse_grid:
        #     # PRINT NORTH CONNECTION ROW
        #     str += "#"
        #     for room in row:
        #         if room is not None and room.n_to is not None:
        #             str += "  |  "
        #         else:
        #             str += "     "
        #     str += "#\n"
        #     # PRINT ROOM ROW
        #     str += "#"
        #     for room in row:
        #         if room is not None and room.w_to is not None:
        #             str += "-"
        #         else:
        #             str += " "
        #         if room is not None:
        #             str += f"{room.id}".zfill(3)
        #         else:
        #             str += "   "
        #         if room is not None and room.e_to is not None:
        #             str += "-"
        #         else:
        #             str += " "
        #     str += "#\n"
        #     # PRINT SOUTH CONNECTION ROW
        #     str += "#"
        #     for room in row:
        #         if room is not None and room.s_to is not None:
        #             str += "  |  "
        #         else:
        #             str += "     "
        #     str += "#\n"

        # # Add bottom border
        # str += "# " * ((3 + self.width * 5) // 2) + "\n"

        # # Print string
        # print(str)


w = World()
num_rooms = 44
width = 8
height = 7
w.generate_rooms(width, height, num_rooms)
w.print_rooms()


# print(f"\n\nWorld\n  height: {height}\n  width: {width},\n  num_rooms: {num_rooms}\n")
