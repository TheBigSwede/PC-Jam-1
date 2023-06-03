#%%

#Game initialization

import random
import pyglet
from GameObjects import PhysicsObject, Player, Enemy, Bullet
from GameResources import *

game_window = pyglet.window.Window(800,600)

#Draw Batch
main_batch = pyglet.graphics.Batch()

#Score Label
score_label = pyglet.text.Label(text="Score: 0",x=10,y=575,batch=main_batch)

#Create Player
player = Player(x=400,y=300,batch=main_batch)

game_window.push_handlers(player)
game_window.push_handlers(player.key_handler)

#Create object list
game_objects = [player]


#%%

#Game events

@game_window.event
def on_draw():
    game_window.clear()

    main_batch.draw()

def update(dt):
    for obj in reversed(game_objects):

        obj.update(dt,[other_obj for other_obj in game_objects if other_obj is not obj])

        game_objects.extend(obj.new_objects)
        obj.new_objects = []


        if obj.dead == True:
            obj.delete()
            game_objects.remove(obj)

            

def spawn_enemy(dt):
    x_coord = game_window.size[0]-50
    y_coord = random.random()*(game_window.size[1]-100)+50
    new_enemy = Enemy(x=x_coord,y=y_coord,batch=main_batch)

    new_enemy.vx = -50    
    game_objects.append(new_enemy)

pyglet.clock.schedule_interval(update,1/60.0)
pyglet.clock.schedule_interval(spawn_enemy,2)
pyglet.app.run()


# %%
