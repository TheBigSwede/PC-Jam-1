import * as THREE from 'three';


import {PhysicsObject, Player} from './GameObjects'

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
var game_over_label = document.getElementById("game_over")

//Start texture loader
const textureLoader = new THREE.TextureLoader();

//Create Player
const playerTexture = textureLoader.load( 'sprites/Nasa_Sprite.png',
function(texture) {
    player.scale.set(texture.image.width, texture.image.height, 1);
}
);
const playerMaterial = new THREE.SpriteMaterial({ map: playerTexture });
const player = new Player(playerMaterial);
player.position.z = 0.01;
scene.add(player);


//Create Background
const backgroundTexture = textureLoader.load( 'sprites/background.png',
function(texture) {
    background.scale.set(texture.image.width, texture.image.height, 1);
}
);
const backgroundMaterial = new THREE.SpriteMaterial({map:backgroundTexture});
const background = new THREE.Sprite(backgroundMaterial);
background.position.z = -0.01;
scene.add(background);


//Create object list
var game_objects = [player]
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

            

def spawn_enemy(dt):
    global score
    if random.random() > 1/(1.05+score/50000):
        x_coord = game_window.size[0]-50
        y_coord = random.random()*(game_window.size[1]-100)+50
        if random.random() < 0.1:
            new_enemy = TrackingEnemy(target=player,x=x_coord,y=y_coord,batch=main_batch)
        else:
            new_enemy = Enemy(x=x_coord,y=y_coord,batch=main_batch)

        new_enemy.vx = -100    
        game_objects.append(new_enemy)


    


# %%
 */

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
    

    game_objects.forEach(function(object){
        object.update(16);

        objects_to_add.concat(object.objects_to_add);
        object.new_objects = [];
    })

    game_objects.concat(objects_to_add);
    console.log(game_objects);
    renderer.render(scene, camera);


    elapsed = performance.now() - now;
    await sleep(16-elapsed)

}
animate();