#Load sprites and other resources

import pyglet
import os
import sys

if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    os.chdir(sys._MEIPASS)

pyglet.resource.path = ['sprites','sfx','bgm']
pyglet.resource.reindex()

#Load BGM
BGM_1 = pyglet.resource.media('Harmful or Fatal.mp3')
BGM_2 = pyglet.resource.media('In a Heartbeat.mp3')

#Load SFX
explosion_sfx = pyglet.resource.media('435413__v-ktor__explosion12.wav',streaming=False)
shooting_sfx = pyglet.resource.media('584196__unfa__weapons-plasma-shot-04.flac',streaming=False)

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