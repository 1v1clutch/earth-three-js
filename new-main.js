import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-1, 1, 5); // Adjusted camera position

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load textures
const textureLoader = new THREE.TextureLoader();
const dayTexture = textureLoader.load('textures/earthmap4k.jpg');
const nightTexture = textureLoader.load('textures/earthlights4k.jpg');

// Sphere Geometry
const geometry = new THREE.SphereGeometry(1, 32, 32);

// Custom Shader Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        dayTexture: { type: 't', value: dayTexture },
        nightTexture: { type: 't', value: nightTexture },
        sunDirection: { type: 'v3', value: new THREE.Vector3() }
    },
    vertexShader: /* glsl */`
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */`
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;

        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
            vec3 dayColor = texture2D(dayTexture, vUv).rgb;
            vec3 nightColor = texture2D(nightTexture, vUv).rgb;

            float lighting = dot(normalize(vNormal), sunDirection);
            float mixAmount = smoothstep(-0.2, 0.2, lighting);
            vec3 color = mix(nightColor, dayColor, mixAmount);

            gl_FragColor = vec4(color, 1.0);
        }
    `
});

const earth = new THREE.Mesh(geometry, material);
scene.add(earth);


// Apply axial tilt
earth.rotation.z = THREE.MathUtils.degToRad(23.5);

// Sunlight
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(-2, 0.5, 1.1);
scene.add(sunLight);


// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI; // Allows the camera to go beneath the Earth
controls.minPolarAngle = 0; // Allows the camera to go above the Earth

function animate() {
    requestAnimationFrame(animate);

    // Update sun direction in shader
    material.uniforms.sunDirection.value.copy(sunLight.position).normalize();

    // Rotate the Earth
    earth.rotation.y += 0.001;

    controls.update();

    renderer.render(scene, camera);
}

animate();
