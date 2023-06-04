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
score = 0
score_label = pyglet.text.Label(text="Score: " + str(score),x=10,y=575,batch=main_batch)

#Game Over Label
game_over_label = pyglet.text.Label(text="GAME OVER", x=400, y=300, anchor_x='center', font_size=48, batch=None)

#Create Player
player = Player(x=400,y=300,batch=main_batch)

game_window.push_handlers(player)
game_window.push_handlers(player.key_handler)

#Create Background
background = pyglet.sprite.Sprite(img=background_image,x=game_window.size[0]//2,y=game_window.size[1]//2)
background.scale = 0.75

#Create object list
game_objects = [player]


#%%

#Game events

@game_window.event
def on_draw():
    game_window.clear()
    background.draw()
    score_label.draw()
    main_batch.draw()

def update(dt):
    global score
    objects_to_add = []
    for obj in game_objects:

        obj.update(dt,[other_obj for other_obj in game_objects if other_obj is not obj])

        objects_to_add.extend(obj.new_objects)
        obj.new_objects = []

    for obj in list(game_objects):
        if obj.dead == True:
            if type(obj) == Enemy:
                score += 100
                score_label.text = "Score: " + str(score)
            obj.delete()
            game_objects.remove(obj)

    game_objects.extend(objects_to_add)

    #Check lose condition
    if player not in game_objects:
        game_over_label.batch = main_batch
        pyglet.clock.unschedule(update)
        pyglet.clock.unschedule(spawn_enemy)

            

def spawn_enemy(dt):
    x_coord = game_window.size[0]-50
    y_coord = random.random()*(game_window.size[1]-100)+50
    new_enemy = Enemy(x=x_coord,y=y_coord,batch=main_batch)

    new_enemy.vx = -50    
    game_objects.append(new_enemy)


if __name__ == '__main__':
    pyglet.clock.schedule_interval(update,1/60.0)
    pyglet.clock.schedule_interval(spawn_enemy,2)
    pyglet.app.run()


# %%
