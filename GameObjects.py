#Define physics object

import math
import pyglet
from pyglet.window import key
from GameResources import *

class PhysicsObject(pyglet.sprite.Sprite):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.vx = 0.0
        self.vy = 0.0

        self.radius = 0.0

        self.colliding_with = []
        self.collides_with = []

        self.dead = False

        self.new_objects = []

    def calculate_distance(self,obj):
        return math.sqrt((self.x-obj.x)**2 + (self.y-obj.y)**2)

    def check_bounds(self):
        min_x = self.radius
        min_y = self.radius
        max_x = 800-self.radius
        max_y = 600-self.radius

        if self.x < min_x:
            self.x = min_x
        if self.y < min_y:
            self.y = min_y
        if self.x > max_x:
            self.x = max_x
        if self.y > max_y:
            self.y = max_y

    def check_collisions(self, objects):
        for obj in objects:
            if self.calculate_distance(obj) <= self.radius+obj.radius:
                self.colliding_with.append(obj)
                obj.colliding_with.append(self)

    def check_death(self):
        for obj in self.colliding_with:
            if type(obj) in self.collides_with:
                self.dead = True

    def update(self,dt,objects):
        self.x += self.vx*dt
        self.y += self.vy*dt

        self.check_bounds()
        self.check_collisions(objects)
        self.check_death()
        self.colliding_with = []

class Player(PhysicsObject):

    def __init__(self, *args, **kwargs):
        super().__init__(img=player_image, *args, **kwargs)

        self.scale = 1.0
        self.radius = 10

        self.key_handler = key.KeyStateHandler()

        self.collides_with = [Enemy]

        self.energy = 100
        self.bullet_cost = 10
        self.energy_bar = pyglet.text.Label(text="Energy: " + str(self.energy),x=10,y=10,batch=self.batch)
    
    def fire_bullet(self):
        if self.energy >= self.bullet_cost:
            self.energy -= self.bullet_cost

            bullet = Bullet(x=self.x,y=self.y,batch=self.batch)
            bullet.vy = self.vy
            bullet.vx = 500 + self.vx
            self.new_objects.append(bullet) 

    def update(self, dt, objects):


        self.energy += 0.3333333333
        if self.energy > 100:
            self.energy = 100

        self.energy_bar.text = "Energy: " + str(int(self.energy))

        #self.vx = 0
        #self.vy = 0

        self.vx *= 0.9
        self.vy *= 0.9

        if self.key_handler[key.W]:
            self.vy += 20
        if self.key_handler[key.S]:
            self.vy -= 20
        if self.key_handler[key.D]:
            self.vx += 20
        if self.key_handler[key.A]:
            self.vx -= 20


        v = math.sqrt(self.vx**2 + self.vy**2)
        if v > 300.0:
            self.vx = 300*self.vx/v
            self.vy = 300*self.vy/v

        #self.vx *= 200
        #self.vy *= 200

        super(Player, self).update(dt, objects)

    def on_key_press(self, symbol, modifiers):
        if symbol == key.SPACE:
            self.fire_bullet()

class Enemy(PhysicsObject):
    
    def __init__(self, *args, **kwargs):
        super().__init__(img=enemy_image, *args, **kwargs)

        self.scale = 0.2
        self.radius = 25

        self.collides_with = [Bullet]


    def check_bounds(self):
        min_x = self.radius
        min_y = self.radius
        max_x = 800-self.radius
        max_y = 600-self.radius

        if self.x < min_x:
            self.dead = True
        if self.y < min_y:
            self.y = min_y
        if self.x > max_x:
            self.x = max_x
        if self.y > max_y:
            self.y = max_y

class Bullet(PhysicsObject):

    def __init__(self, *args, **kwargs):
        super().__init__(img = bullet_image, *args, **kwargs)

        self.scale = 1.0

        self.radius = 8

        self.collides_with = [Enemy]

    def check_bounds(self):
        min_x = self.radius
        min_y = self.radius
        max_x = 800-self.radius
        max_y = 600-self.radius

        if self.x < min_x:
            self.dead = True
        if self.y < min_y:
            self.dead = True
        if self.x > max_x:
            self.dead = True
        if self.y > max_y:
            self.dead = True