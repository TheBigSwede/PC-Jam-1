#Define physics object

import pyglet

class PhysicsObject(pyglet.sprite.Sprite):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.vx = 0.0
        self.vy = 0.0

        self.radius = 0.0


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
        return

    def update(self,dt):
        self.x += self.vx*dt
        self.y += self.vy*dt

        self.check_bounds()