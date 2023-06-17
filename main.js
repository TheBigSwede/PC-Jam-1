import * as THREE from 'three';
import {Howl, Howler} from 'howler';


import {PhysicsObject, Player, Enemy, TrackingEnemy} from '/GameObjects'
import {loadObject} from '/LoadingHandler'

//Create the scene
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, -1, 1);

/* const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);
const audioloader = new THREE.AudioLoader();
audioloader.load('bgm/Rhinoceros.mp3', (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.4);
    sound.play();
}) */






const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Create Background
const background = await loadObject('/sprites/background.png',THREE.Sprite);
scene.add(background);

//Render Start Screen
renderer.render(scene, camera);
const start_label = document.getElementById("start_message");
start_label.textContent = "A virulent strain of mold has turned the capipis into undead 'floaters.' Smite these foul creatures before they invade Earth. \r\n \r\n Press SPACE to start."

//Wait for user the press play
async function wait_for_key() {
    await keypress();
 }

 function keypress() {
    return new Promise((resolve) => {
        window.addEventListener('keydown', onKeyHandler);
        function onKeyHandler(key) {
            if (key.code === 'Space') {
                window.removeEventListener('keydown', onKeyHandler);
                resolve();
            }
        }
    })
 }

 console.log('waiting for space');
 await wait_for_key();
 start_label.textContent = ""


//Score Label
var score = 0;
var score_label = document.getElementById("score");
score_label.textContent = "Score: "+score;

//Game Over Label
var game_over_label = document.getElementById("game_over");

//Create Player

const player = await loadObject('/sprites/Nasa_Sprite.png',Player);
scene.add(player);


//Start BGM
var BGM = new Howl({
    src: ['/bgm/Rhinoceros.mp3'],
    html5: true,
    loop: true,
    volume: 0.75,
});
  
BGM.play();





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
        var x_coord = window.innerWidth/2-10;
        var y_coord = ((2*Math.random()-1)*window.innerHeight/2-100)+50;
        if (Math.random() < 0.1) {
            new_enemy = await loadObject('/sprites/Zombie_Capipi.png', TrackingEnemy);
            new_enemy.target = player;
        } else {
            new_enemy = await loadObject('/sprites/Zombie_Capipi.png', Enemy);
        }
    

        new_enemy.vx = -0.1;
        new_enemy.position.x = x_coord;
        new_enemy.position.y = y_coord;
        scene.add(new_enemy);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }



const startTime = performance.now();

var enemySpawner = setInterval(spawn_enemy, 100);

var now = startTime;
var elapsed;
var player_dead = false;

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
            if (object instanceof Enemy && object.died_to_bullet) {
                score += 100;
                score_label.textContent = "Score: "+score;
            }
            if (object instanceof Player) {
                player_dead = true;
                clearInterval(enemySpawner);
                game_over_label.textContent = "GAME OVER \n\r \n\r Refresh the page to restart."
            }
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