#Load sprites and other resources

import pyglet
import os
import sys

if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    os.chdir(sys._MEIPASS)

pyglet.resource.path = ['sprites']
pyglet.resource.reindex()

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)

    return os.path.join(os.path.abspath("."), relative_path)

#Load Sprites
player_image = pyglet.resource.image("Nasa_Sprite.png")
bullet_image = pyglet.resource.image("Nasa_Bullet_Sprite.png")
enemy_image = pyglet.resource.image("enemy.png")
background_image = pyglet.resource.image("background.png")

def center_image(image):
    image.anchor_x = image.width // 2
    image.anchor_y = image.height // 2

center_image(player_image)
center_image(bullet_image)
center_image(enemy_image)
center_image(background_image)