import * as THREE from 'three';

function loadTexture(path) {
    return new Promise((resolve,reject) => {
        textureLoader.load(path, resolve)
    })
}

export function loadObject(path, object_blueprint) {

    

    return loadTexture(path).then((sprite) => {
        const material = new THREE.SpriteMaterial({map: sprite});
        const object = new object_blueprint(material);
        object.scale.set(sprite.image.width,sprite.image.height);
        return object
    })
}

//Start texture loader
const textureLoader = new THREE.TextureLoader();