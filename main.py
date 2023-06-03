#%%

#Game initialization

import pyglet
from GameObjects import PhysicsObject
from GameResources import *

game_window = pyglet.window.Window(800,600)

#Draw Batch
main_batch = pyglet.graphics.Batch()

#Score Label
score_label = pyglet.text.Label(text="Score: 0",x=10,y=575,batch=main_batch)

#Create Player
player = PhysicsObject(img=player_image,x=400,y=300,batch=main_batch)
player.scale = 0.1
player.radius = 25
player.vx = 100

#Create object list
game_objects = [player]


#%%

#Game events

@game_window.event
def on_draw():
    game_window.clear()

    main_batch.draw()

def update(dt):
    for obj in game_objects:
        obj.update(dt)

pyglet.clock.schedule_interval(update,1/60.0)
pyglet.app.run()

