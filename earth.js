import * as THREE from 'three';

export function createEarth(textureLoader,sunLight) {
    // Load textures
    const dayTexture = textureLoader.load('textures/earthmap4k.jpg');
    const nightTexture = textureLoader.load('textures/earthlights4k.jpg');

    // Sphere Geometry
    const geometry = new THREE.SphereGeometry(1, 32, 32);

    // Custom Shader Material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            dayTexture: { type: 't', value: dayTexture },
            nightTexture: { type: 't', value: nightTexture },
            sunDirection: { type: 'v3', value: sunLight.position }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
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

    // Earth Mesh
    const earth = new THREE.Mesh(geometry, material);

    // Apply axial tilt
    earth.rotation.z = THREE.MathUtils.degToRad(23.5);

    return earth;
}
