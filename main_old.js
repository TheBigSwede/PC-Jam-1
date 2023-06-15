import * as THREE from 'three';
import { PhysicsObject,Player } from './GameObjects';
import { KeyboardState } from './KeyHandler';

const scene = new THREE.Scene();
const screen_aspect = window.innerWidth/window.innerHeight;
console.log(window.width);
const camera = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, -1, 1);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const spriteTexture = new THREE.TextureLoader().load('sprites/Nasa_Sprite.png', () => {
    const aspect = spriteTexture.image.width / spriteTexture.image.height;
    sprite.scale.set(spriteTexture.image.width, spriteTexture.image.height, 1);
  });
  
const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });
const sprite = new Player(spriteMaterial);
scene.add(sprite);

/* camera.position.z = 5; */
sprite.position.set(0, 0, 0);





const startTime = performance.now();
var now = startTime;
var elapsed;

function animate() {
  requestAnimationFrame(animate);
  elapsed = performance.now() - now;
  now = performance.now()
  sprite.update(elapsed)
  renderer.render(scene, camera);



}
animate();
