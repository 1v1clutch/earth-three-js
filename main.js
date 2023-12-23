// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCamera } from './camera.js';
import { createLights } from './lighting.js';
import { createEarth } from './earth.js';


const textureLoader = new THREE.TextureLoader();
const bumpTexture = textureLoader.load('./textures/earthbump4k.jpg');
const cloudsTexture = textureLoader.load('./textures/earthhiresclouds4K.jpg');

// Scene Setup
const scene = new THREE.Scene();

// Camera
const camera = createCamera();
scene.add(camera);

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Sun light
const sunLight = createLights();
scene.add(sunLight);

// Earth
const earth = createEarth(textureLoader,sunLight); // Assuming createEarth doesn't need any arguments
// scene.add(earth);

// Earth Group
const earthGroup = new THREE.Group();
earthGroup.add(earth);
scene.add(earthGroup);

const bumpMat = new THREE.MeshStandardMaterial({
    map: bumpTexture,
    bumpScale: 0.005,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.5, // Adjust for desired blend effect
})
const earthBump = new THREE.Mesh(earth.geometry, bumpMat);
earthBump.scale.multiplyScalar(1.005);
earthBump.rotation.z = THREE.MathUtils.degToRad(-23.5);
earthGroup.add(earthBump);

const cloudsMat = new THREE.MeshStandardMaterial({
    map: cloudsTexture,
    bumpScale: 0.005,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.5, // Adjust for desired blend effect
})
const earthClouds = new THREE.Mesh(earth.geometry, cloudsMat);
earthClouds.scale.multiplyScalar(1.006);
earthClouds.rotation.z = THREE.MathUtils.degToRad(-23.5);
earthGroup.add(earthClouds);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Example: Update Earth's rotation
    earthGroup.rotation.y += 0.001;
    earthClouds.rotation.y += 0.001;

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