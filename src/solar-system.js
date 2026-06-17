import * as THREE from 'three';
import { Planet, solarSystemData, moonData } from './planet.js';
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { getNebula, createStarField, animateStars, animateNebula } from './environment.js';
import { initPlanetHoverDetection } from './planetInfo.js';
import { setupAudio } from './audioManager.js';
import { GeometryHelper, initClicks, focusCameraOnPlanet } from './helper.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { loadFont } from "./fontManager.js";
import { createAppUi } from './mobile-ui.js';
import { getLanguage, t, translateBodies } from './i18n.js';

document.documentElement.lang = getLanguage();
document.title = t('title');

const globalFont = await loadFont("./assets/fonts/helvetiker_bold.typeface.json");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    36,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

camera.position.set(10, 12, 48);
camera.lookAt(0, 0, 0);
scene.add(camera);
scene.fog = new THREE.FogExp2(0x020308, 0.0006);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

createStarField(scene);

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

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.55,
    0.25,
    0.55
);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(bloomPass);

const orbitControls = new OrbitControls(camera, renderer.domElement);
const startCameraPosition = camera.position.clone();
const startTarget = orbitControls.target.clone();

const sunLight = new THREE.PointLight(0xffffff, 3.5, 300, 0.1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.03);
scene.add(ambientLight);

const geometryHelper = new GeometryHelper();
const planetMaterial = geometryHelper.getPlanetMaterial();
const moonMaterial = geometryHelper.getMoonMaterial();

let text3d = null;
geometryHelper.create3dText({
    depth: 0.5,
    size: 30,
    height: 1,
    curveSegments: 36,
    callbackReady: mesh => {
        text3d = mesh;
        scene.add(text3d);
        text3d.position.set(-227.7, -6.5, -300);
        text3d.rotation.set(0, 0, 0);
    }
});

const planets = [];
const settings = {
    sizeMultiplier: 1,
    orbitSpeedMultiplier: 1,
    rotationSpeedMultiplier: 0.1,
};

const localizedMoonData = translateBodies(moonData);

translateBodies(solarSystemData).forEach((data, index) => {
    const planet = new Planet(data, settings);
    planets.push(planet);
    scene.add(planet.orbit);

    if (solarSystemData[index].name === "Earth") {
        planet.addMoon(localizedMoonData[0], settings);
    }
});

planets.forEach(planet => {
    planet.createLabel(globalFont);
    planet.moons.forEach(moon => moon.createLabel(globalFont));
});

initClicks(renderer, camera, orbitControls, planets);

function applyGlobalSize(value) {
    planets.forEach(planet => {
        const newRadius = planet.baseRadius * value;
        planet.rebuildGeometry(newRadius);

        if (planet.ring) {
            planet.ring.scale.set(value, value, 1);
        }

        planet.moons.forEach(moon => {
            const newMoonRadius = moon.baseRadius * value;
            moon.rebuildGeometry(newMoonRadius);

            if (moon.ring) {
                moon.ring.scale.set(value, value, 1);
            }
        });
    });
}

function focusPlanet(planet) {
    const targetPosition = planet.mesh.getWorldPosition(new THREE.Vector3());
    const distance = Math.max(planet.radius * 8, 12);
    const offset = new THREE.Vector3(distance, distance * 0.45, distance);

    camera.position.copy(targetPosition).add(offset);
    orbitControls.target.copy(targetPosition);
    orbitControls.update();
}

function addPlanet() {
    const data = {
        name: `${t('newPlanet')} ${planets.length}`,
        radius: 1.2,
        color: "#e3fc01",
        material: planetMaterial,
        orbitalRadius: 20 + planets.length * 5,
        orbitalSpeed: 0.01,
        rotationSpeed: 1,
        axialTilt: 0,
        funFact: t('customPlanetFact'),
        yearLength: "-"
    };

    const planet = new Planet(data, settings);
    planets.push(planet);
    planet.createLabel(globalFont);
    scene.add(planet.orbit);
    return planet;
}

function removePlanet(planet) {
    if (!planet) return;
    const index = planets.indexOf(planet);
    if (index !== -1) planets.splice(index, 1);
    planet.dispose();
}

function addMoon(planet) {
    if (!planet) return null;

    const data = {
        name: t('newMoon'),
        radius: 0.5,
        color: "#ffffff",
        material: moonMaterial,
        orbitalRadius: planet.radius + 4,
        orbitalSpeed: 0.5,
        rotationSpeed: 0.5,
        axialTilt: 0,
        funFact: t('customMoonFact'),
        yearLength: "-"
    };

    const moon = planet.addMoon(data);
    moon.createLabel(globalFont);
    return moon;
}

function removeMoon(planet, moon) {
    if (!planet || !moon) return;

    const index = planet.moons.indexOf(moon);
    if (index !== -1) planet.moons.splice(index, 1);

    if (moon.orbit.parent) {
        moon.orbit.parent.remove(moon.orbit);
    }

    moon.dispose();
}

createAppUi({
    camera,
    controls: orbitControls,
    planets,
    settings,
    startCameraPosition,
    startTarget,
    actions: {
        applyGlobalSize,
        focusPlanet,
        addPlanet,
        removePlanet,
        addMoon,
        removeMoon,
        focusPlanet: (planet) => {
            focusCameraOnPlanet(camera, orbitControls, planet);
        }
    }
});

setupAudio(camera, './assets/music/space.mp3');

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    if (text3d) {
        text3d.rotation.y = Math.sin(performance.now() * 0.0003) * 0.15;
    }

    const delta = clock.getDelta();
    animateStars();

    planets.forEach(planet => {
        if (planet.labelGroup) {
            planet.labelGroup.lookAt(camera.position);
        }

        planet.moons.forEach(moon => {
            if (moon.labelGroup) {
                moon.labelGroup.lookAt(camera.position);
            }
        });
    });

    animateNebula(nebulaFar, delta);
    animateNebula(nebulaMid, delta);
    planets.forEach(planet => planet.update(delta));

    composer.render();
}

animate();
initPlanetHoverDetection(camera, scene, renderer, planets);
