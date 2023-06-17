import * as THREE from 'three';
import { KeyboardState } from './KeyHandler';
import { loadObject } from './LoadingHandler';

export class PhysicsObject extends THREE.Sprite {

    constructor(material) {
        super(material)  ;

        this.vx = 0.0;
        this.vy = 0.0;

        this.radius = 0.0;

        this.colliding_with = [];
        this.collides_with = [];

        this.dead = false;
        this.death_sound = null;

        this.new_objects = [];


        this.died_to_bullet = false;

    }

    calculate_distance(obj){
        return Math.sqrt((this.x-obj.x)**2 + (this.y-obj.y)**2);

    }

    check_bounds(){
        var min_x = this.radius-window.innerWidth/2;
        var min_y = this.radius-window.innerHeight/2;
        var max_x = window.innerWidth/2-this.radius;
        var max_y = window.innerHeight/2-this.radius;

        if (this.position.x < min_x){
            this.position.x = min_x;
        }
        if (this.position.y < min_y){
            this.position.y = min_y;
        }
        if (this.position.x > max_x){
            this.position.x = max_x;
        }
        if (this.position.y > max_y){
            this.position.y = max_y;
        }
    }

    check_collisions(objects){
        for (obj in objects){
            if (this.calculate_distance(obj) <= this.radius+obj.radius){
                this.colliding_with.append(obj);
                obj.colliding_with.append(this);
            }
        }
    }

    check_death(){
        for (obj in this.colliding_with){
            if (type(obj) in this.collides_with){
                this.dead = true;
                if (obj instanceof Bullet){
                    this.died_to_bullet = true;
                }
                if (this.death_sound !== null){
                    this.death_sound.play();
                }
            }
        }
    }

    update(dt,objects){
        this.position.x += this.vx*dt;
        this.position.y += this.vy*dt;

        this.check_bounds();
        this.check_collisions(objects);
        this.check_death();
        this.colliding_with = [];
    }

}

export class Player extends PhysicsObject{

    constructor(player_image){
        super(player_image);

        this.position.z = 0.01;

        this.radius = 1;
        this.max_speed = 0.4;
        this.acceleration = 0.005;

        this.key_handler = new KeyboardState();
        this.key_handler.push_handler(this);

        this.collides_with = [];

        this.energy = 100;
        this.bullet_cost = 10;
        this.bullet_speed = 0.65;

        this.new_objects = [];
    }


    async fire_bullet(){
        if (this.energy > this.bullet_cost){
            this.energy -= this.bullet_cost;

            const bullet = await loadObject('sprites/Nasa_Bullet_Sprite.png', Bullet);
            bullet.vy = this.vy;
            bullet.vx = this.bullet_speed + this.vx;
            bullet.position.x = this.position.x;
            bullet.position.y = this.position.y;
            this.new_objects.push(bullet);

            //shooting_sfx.play();
        }
    }

    update( dt, objects){


        this.energy += 0.3333333333;
        if (this.energy > 100){
            this.energy = 100;
        }

        this.vx *= 0.9;
        this.vy *= 0.9;

        if (this.key_handler.isKeyPressed('KeyW')){
            this.vy += dt*this.acceleration;
        }
        if (this.key_handler.isKeyPressed('KeyS')){
            this.vy -= dt*this.acceleration;
        }
        if (this.key_handler.isKeyPressed('KeyD')){
            this.vx += dt*this.acceleration;
        }
        if (this.key_handler.isKeyPressed('KeyA')){
            this.vx -= dt*this.acceleration;
        }


        var v = Math.sqrt(this.vx**2 + this.vy**2);
        if (v > this.max_speed){
            this.vx = this.max_speed*this.vx/v;
            this.vy = this.max_speed*this.vy/v;
        }

        super.update(dt, objects);
    }

    onKeyDown(event){
        if (event.code === 'Space'){
            this.fire_bullet();
        }
    }
    onKeyUp(event){
        return
    }
}

export class Bullet extends PhysicsObject{

    constructor(bullet_image){
        super(bullet_image);

        this.radius = 1;

        this.collides_with = [];
    }

    check_bounds(){
        var min_x = this.radius-window.innerWidth/2;
        var min_y = this.radius-window.innerHeight/2;
        var max_x = window.innerWidth/2-this.radius;
        var max_y = window.innerHeight/2-this.radius;

        if (this.position.x < min_x){
            this.dead = true;
        }
        if (this.position.y < min_y){
            this.dead = true;
        }
        if (this.position.x > max_x){
            this.dead = true;
        }
        if (this.position.y > max_y){
            this.dead = true;
        }
    }
}

export class Enemy extends PhysicsObject{
    constructor(enemy_image){
        super(enemy_image);

        this.radius = 1;

        this.collides_with = [Bullet];

        this.death_sound = null;
    }


    check_bounds(){
        var min_x = this.radius-window.innerWidth/2;
        var min_y = this.radius-window.innerHeight/2;
        var max_x = window.innerWidth/2-this.radius;
        var max_y = window.innerHeight/2-this.radius;

        if (this.position.x < min_x){
            this.dead = true;
        }
        if (this.position.y < min_y){
            this.position.y = min_y;
        }
        if (this.position.x > max_x){
            this.position.x = max_x;
        }
        if (this.position.y > max_y){
            this.position.y = max_y;
        }
    }
}

