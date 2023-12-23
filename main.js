// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from './camera.js';
import { createLights } from './lighting.js';
import { createEarth } from './earth.js';


const textureLoader = new THREE.TextureLoader();
// Scene Setup
const scene = new THREE.Scene();

// Camera
const camera = createCamera();
scene.add(camera);

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Earth
const earth = createEarth(textureLoader); // Assuming createEarth doesn't need any arguments
scene.add(earth);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Example: Update Earth's rotation
    earth.rotation.y += 0.001;

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Window Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});