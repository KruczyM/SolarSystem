import * as THREE from "three";

let raycaster;
let mouse;
let infoPanel;
let currentlyHovered = null;
let hideTimeout = null;

export function initPlanetHoverDetection(camera, scene, renderer, planets) {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();


    infoPanel = document.createElement('div');
    infoPanel.style.position = 'absolute';
    infoPanel.style.top = '5px';
    infoPanel.style.left = '30px';
    infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    infoPanel.style.color = 'white';
    infoPanel.style.padding = '5px';
    infoPanel.style.fontFamily = 'monospace';
    infoPanel.style.borderRadius = '5px';
    infoPanel.style.display = 'none';
    document.body.appendChild(infoPanel);

    renderer.domElement.addEventListener('mousemove', (event) => onHover(event, camera, scene, planets), false);
}

function onHover(event, camera, scene, planets) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const interactiveObjects = planets.map(p => p.mesh);
    const intersects = raycaster.intersectObjects(interactiveObjects, false);

    let hoveredPlanet = null;

    if (intersects.length > 0) {
        const intersectedMesh = intersects[0].object;
        hoveredPlanet = planets.find(p => p.mesh === intersectedMesh);
    }


    if (hoveredPlanet && hoveredPlanet !== currentlyHovered) {

        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        displayPlanetInfo(hoveredPlanet);
        currentlyHovered = hoveredPlanet;
        return;
    }

    if (!hoveredPlanet && currentlyHovered !== null && !hideTimeout) {

        hideTimeout = setTimeout(() => {
            hidePlanetInfo();
            currentlyHovered = null;
            hideTimeout = null;
        }, 3000);
    }
}

function displayPlanetInfo(planet) {
    infoPanel.innerHTML = `
        <strong>Name:</strong> ${planet.name}<br>
        <strong>Size:</strong> ${planet.radius.toFixed(2)} units<br>
        <strong>Distance:</strong> ${planet.orbitalRadius.toFixed(2)} units<br>
        <strong>Year Length:</strong> ${planet.yearLength}<br>
        <strong>Fun Fact:</strong> ${planet.funFact}
    `;
    infoPanel.style.display = 'block';
}

function hidePlanetInfo() {
    infoPanel.style.display = 'none';
}
