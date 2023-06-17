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
        return Math.sqrt((this.position.x-obj.position.x)**2 + (this.position.y-obj.position.y)**2);

    }

    check_bounds(){
        var min_x = this.radius-window.innerWidth/2;
        var min_y = this.radius-window.innerHeight/2;
        var max_x = window.innerWidth/2-this.radius;
        var max_y = window.innerHeight/2-this.radius;

        if (this.position.x < min_x){
            this.position.x = min_x;
            this.vx = 0;
        }
        if (this.position.y < min_y){
            this.position.y = min_y;
            this.vy = 0;
        }
        if (this.position.x > max_x){
            this.position.x = max_x;
            this.vx = 0;
        }
        if (this.position.y > max_y){
            this.position.y = max_y;
            this.vy = 0;
        }
    }

    check_collisions(objects){
        objects.forEach(obj => {
            if (this.calculate_distance(obj) <= this.radius+obj.radius){
                this.colliding_with.push(obj);
                obj.colliding_with.push(this);
            }            
        });
    }

    check_death(){
        this.colliding_with.forEach((obj) => {
            this.collides_with.forEach((collision_target) => {
                if (obj instanceof collision_target) {
                    this.dead = true;
                    if (obj instanceof Bullet){
                        this.died_to_bullet = true;
                    }
                    if (this.death_sound !== null){
                        this.death_sound.play();
                    }
                }
            });            
        });
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

        this.radius = 16;
        this.max_speed = 0.25;
        this.acceleration = 0.005;

        this.key_handler = new KeyboardState();
        this.key_handler.push_handler(this);

        this.collides_with = [Enemy];

        this.energy = 100;
        this.energy_label = document.getElementById("energy");
        this.energy_label.textContent = "Energy: "+Math.ceil(this.energy);


        this.bullet_cost = 10;
        this.bullet_speed = 0.65;

        this.new_objects = [];

        this.bullet_sound = new Howl({
            src: ['sfx/584196__unfa__weapons-plasma-shot-04.flac']
        });

        this.death_sound = new Howl({
            src: ['sfx/435413__v-ktor__explosion12.wav']
        })
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

            this.bullet_sound.play();
        }
    }

    update( dt, objects){


        this.energy += 0.3333333333;
        if (this.energy > 100){
            this.energy = 100;
        }

        this.energy_label.textContent = "Energy: "+Math.ceil(this.energy);

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
            if (this.dead === false) {
                this.fire_bullet();
            }
        }
    }
    onKeyUp(event){
        return
    }
}

export class Bullet extends PhysicsObject{

    constructor(bullet_image){
        super(bullet_image);

        this.radius = 8;

        this.collides_with = [Enemy];
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

        this.radius = 20;

        this.collides_with = [Bullet];

        this.death_sound = new Howl({
            src: ['sfx/435413__v-ktor__explosion12.wav']
        });
    };
    


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

export class TrackingEnemy extends Enemy{
    constructor(enemy_image){
        super(enemy_image);

        this.radius = 20;

        this.collides_with = [Bullet];

        this.death_sound = null;

        this.target = null;
        this.tracking_strength = 1.0

        this.walk_speed = 0.1
        this.charge_speed = 0.2
    }

    track_player(target) {
        var target_direction_x = target.position.x - this.position.x
        var target_direction_y = target.position.y - this.position.y
        var target_distance = Math.sqrt(target_direction_x**2+target_direction_y**2)
        target_direction_x /= target_distance
        target_direction_y /= target_distance

        return [target_direction_x, target_direction_y, target_distance]
    }


    check_bounds(){
        var min_x = this.radius-window.innerWidth/2;


        if (this.position.x < min_x){
            this.dead = true;
        }
        
        super.check_bounds();
    }

    update(dt,objects) {
        this.vx -= 0.01

        if (this.target !== null) {
            var [player_direction_x, player_direction_y, player_distance] = this.track_player(this.target)
            if (player_distance < 50) {
                this.vx = this.charge_speed*player_direction_x
                this.vy = this.charge_speed*player_direction_y
                this.target=null
            } else {
                this.vx += this.tracking_strength*player_direction_x
                this.vy += this.tracking_strength*player_direction_y
            }
        }
        
        var v = Math.sqrt(this.vx**2 + this.vy**2)
        if (this.target !== null) {
            if (v > this.walk_speed) {
                this.vx = this.walk_speed*this.vx/v
                this.vy = this.walk_speed*this.vy/v
            }
        } else {
            if (v > this.charge_speed) {
                this.vx = this.charge_speed*this.vx/v
                this.vy = this.charge_speed*this.vy/v
            }
        }

        super.update(dt,objects)
    }
}





