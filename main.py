#%%

#Game initialization

import pyglet

pyglet.resource.path = ['./sprites']
pyglet.resource.reindex()

game_window = pyglet.window.Window(800,600)


#Load Sprites
player_image = pyglet.resource.image("Nasa.png")
bullet_image = pyglet.resource.image("bullet.png")
enemy_image = pyglet.resource.image("enemy.png")

def center_image(image):
    image.anchor_x = image.width // 2
    image.anchor_y = image.height // 2

center_image(player_image)
center_image(bullet_image)
center_image(enemy_image)

#Draw Batch
main_batch = pyglet.graphics.Batch()

#Score Label
score_label = pyglet.text.Label(text="Score: 0",x=10,y=575,batch=main_batch)

#Create Player
player = pyglet.sprite.Sprite(img=player_image,x=400,y=300,batch=main_batch)
player.scale = 0.1



#%%

#Game events

@game_window.event
def on_draw():
    game_window.clear()

    main_batch.draw()



pyglet.app.run()
