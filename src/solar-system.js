import * as THREE from 'three';
import { Planet, solarSystemData, moonData } from './planet.js';
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { createPlanetFolder } from './gui-helper.js';
import { getNebula, createStarField, animateStars, animateNebula } from './environment.js';
import { initPlanetHoverDetection } from './planetInfo.js';
import { setupAudio } from './audioManager.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm";


let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    36,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
const backgroundMusic = setupAudio(camera, 'public/assets/music/space.mp3');
camera.position.set(10, 12, 48);
camera.lookAt(0, 0, 0)
scene.add(camera);
scene.fog = new THREE.FogExp2(0x020308, 0.0006);


let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);

//stars
createStarField(scene);

//nebula
const nebulaFar = getNebula({
    numSprites: 25,
    radius: 300,
    size: 400,
    opacity: 0.05,
    hue: 0.6,
    x: 300,
    y: -120,
    z: -500
});

const nebulaMid = getNebula({
    numSprites: 20,
    radius: 180,
    size: 220,
    opacity: 0.08,
    hue: 0.55,
    x: -260,
    y: 100,
    z: -650
});

scene.add(nebulaFar, nebulaMid);
nebulaFar.position.set(-280, 120, -500);
nebulaFar.rotation.z = 0.6;

nebulaMid.position.set(350, -140, -650);
nebulaMid.rotation.z = -0.4;

nebulaFar.renderOrder = -10;
nebulaMid.renderOrder = -10;


// bloom
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.55,   // strength
    0.25,   // radius
    0.55   // threshold
);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(bloomPass);


renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const orbitControls = new OrbitControls(camera, renderer.domElement);


// Light emitted by the Sun (realistic)
const sunLight = new THREE.PointLight(0xffffff, 3.5, 300, 0.1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Subtle ambient space light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.03);
scene.add(ambientLight);


const planets = []
// for speed up self rotation and orbit fly time
const settings = {
    sizeMultiplier: 1,
    orbitSpeedMultiplier: 1,
    rotationSpeedMultiplier: 1,
};
solarSystemData.forEach(data => {
    const planet = new Planet(data, settings);
    planets.push(planet);
    scene.add(planet.orbit);


    if (planet.name === "Earth") {
        planet.addMoon(moonData[0], settings);
    }
});


window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
});


const gui = new GUI();
gui.add(settings, "sizeMultiplier", 0.5, 10, 0.1).name("global size")
    .onChange(value => {
        planets.forEach(p => {
            const newRadius = p.baseRadius * value;
            p.rebuildGeometry(newRadius);
        });
    });
gui.add(settings, "orbitSpeedMultiplier", 0, 1000, 0.1).name("orbit speed");
gui.add(settings, "rotationSpeedMultiplier", 0, 1, 0.1).name("rotation speed");

const systemFolder = gui.addFolder("SYSTEM");

systemFolder.add({
    addPlanet: () => {
        const data = {
            name: "New Planet " + planets.length,
            radius: 0.8,
            color: "#8888ff",
            orbitalRadius: 20 + planets.length * 5,
            orbitalSpeed: 0.2,
            rotationSpeed: 1,
            axialTilt: 0
        };

        const planet = new Planet(data, settings);
        planets.push(planet);
        scene.add(planet.orbit);

        createPlanetFolder(gui, planet, planets, scene, settings);
    }
}, "addPlanet").name("➕ add planet");

planets.forEach(planet => {
    createPlanetFolder(gui, planet, planets, scene, settings);
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    animateStars();

    animateNebula(nebulaFar, delta);
    animateNebula(nebulaMid, delta);
    planets.forEach(p => {
        p.update(delta)
    }
    );

    composer.render();
}
animate();

initPlanetHoverDetection(camera, scene, renderer, planets);