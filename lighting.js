import * as THREE from 'three';

export function createLights() {
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(-2, 0.5, 1.1);
    return sunLight;
}