#Load sprites and other resources

import pyglet

pyglet.resource.path = ['./sprites']
pyglet.resource.reindex()



#Load Sprites
player_image = pyglet.resource.image("Nasa.png")
bullet_image = pyglet.resource.image("bullet.png")
enemy_image = pyglet.resource.image("enemy.png")
background_image = pyglet.resource.image("background.png")

def center_image(image):
    image.anchor_x = image.width // 2
    image.anchor_y = image.height // 2

center_image(player_image)
center_image(bullet_image)
center_image(enemy_image)
center_image(background_image)