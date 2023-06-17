import * as THREE from 'three';


import {PhysicsObject, Player, Enemy} from './GameObjects'
import {loadObject} from './LoadingHandler'

//Create the scene
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, -1, 1);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Score Label
var score = 0;
var score_label = document.getElementById("score");
score_label.textContent = score;

//Game Over Label
var game_over_label = document.getElementById("game_over");


//Create Player

const player = await loadObject('sprites/Nasa_Sprite.png',Player);
scene.add(player);




//Create Background
const background = await loadObject('sprites/background.png',THREE.Sprite);
scene.add(background);



/*
#Create BGM Player
BGM_player = pyglet.media.Player()
BGM_player.queue(BGM_1)
BGM_player.queue(BGM_2)

@BGM_player.event
def on_player_eos():
    BGM_player.queue(BGM_1)
    BGM_player.queue(BGM_2)
    BGM_player.play()


#%%


def update(dt):
    global score
    objects_to_add = []
    for obj in game_objects:

        obj.update(dt,[other_obj for other_obj in game_objects if other_obj is not obj])

        objects_to_add.extend(obj.new_objects)
        obj.new_objects = []

    for obj in list(game_objects):
        if obj.dead == True:
            if isinstance(obj,Enemy) and obj.died_to_bullet == True:
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

*/            

async function spawn_enemy() {
    if (Math.random() > 1/(1.05+score/50000)) {
        var new_enemy;
        var x_coord = window.innerWidth-50;
        var y_coord = (Math.random()*window.innerHeight-200)+100;
        if (Math.random() < 0.1) {
            //new_enemy = TrackingEnemy(target=player,x=x_coord,y=y_coord,batch=main_batch);
            return;
        } else {
            new_enemy = await loadObject('sprites/Zombie_Capipi.png', Enemy);
        }
    

        new_enemy.vx = -0.1;
        new_enemy.position.x = x_coord;
        new_enemy.position.y = y_coord;
        scene.add(new_enemy);
    }
}

let enemySpawner = setInterval(spawn_enemy, 100);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

const startTime = performance.now();
var now = startTime;
var elapsed;

async function animate() {
    now = performance.now();   
    
    
    var objects_to_add = [];
    requestAnimationFrame(animate);
    
    scene.children.forEach((object) => {
        object.update?.(16,scene.children.filter((other_object) => {
            return other_object != object;
        }));



        if (object?.new_objects !== undefined) {
            objects_to_add = objects_to_add.concat(object?.new_objects);
            object.new_objects = [];
        }


        if (object?.dead === true) {
            scene.remove(object);
        }
    })

    objects_to_add.forEach((object) => {
        scene.add(object);
    })
    
    renderer.render(scene, camera);


    elapsed = performance.now() - now;
    await sleep(16-elapsed)

}
animate();

//});