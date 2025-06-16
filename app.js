import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

// Load Buzzing Sound
const buzzSound = new Audio('/buzz.mp3'); // Add a buzzing sound file in your project

// Scene, Camera, Renderer
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 13;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

// Load 3D Model
let bee, mixer;
const loader = new GLTFLoader();
loader.load('/demon_bee_full_texture.glb', function (gltf) {
    bee = gltf.scene;
    scene.add(bee);
    mixer = new THREE.AnimationMixer(bee);
    mixer.clipAction(gltf.animations[0]).play();

    beeHoverEffect();
    modelMove();
}, undefined, function (error) {
    console.error(error);
});

// Floating Animation (Bee slightly moves up and down)
const beeHoverEffect = () => {
    gsap.to(bee.position, {
        y: '+=0.3',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });
};

// Bee Click Animation
document.getElementById('container3D').addEventListener('click', () => {
    if (!bee) return;
    gsap.to(bee.position, { y: '+=1', duration: 0.2, yoyo: true, repeat: 1, ease: 'power1.out' });
    buzzSound.play();
});

// Bee Hover Sound
document.getElementById('container3D').addEventListener('mouseenter', () => {
    if (!bee) return;
    buzzSound.play();
});

// Section-Based Bee Movement
let arrPositionModel = [
    { id: 'banner', position: { x: 0, y: -1, z: 0 }, rotation: { x: 0, y: 1.5, z: 0 } },
    { id: 'intro', position: { x: 1, y: -1, z: -5 }, rotation: { x: 0.5, y: -0.5, z: 0 } },
    { id: 'description', position: { x: -1, y: -1, z: -5 }, rotation: { x: 0, y: 0.5, z: 0 } },
    { id: 'contact', position: { x: 0.8, y: -1, z: 0 }, rotation: { x: 0.3, y: -0.5, z: 0 } },
];

const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });

    let position_active = arrPositionModel.findIndex((val) => val.id == currentSection);
    if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(bee.position, {
            x: new_coordinates.position.x,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            duration: 2.5,
            ease: 'power1.out',
        });
        gsap.to(bee.rotation, {
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            duration: 2.5,
            ease: 'power1.out',
        });
    }
};

// Scroll Event Listener
window.addEventListener('scroll', () => {
    if (bee) modelMove();
});

// Resize Event Listener
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Render Loop
const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.02);
};
reRender3D();
