import * as THREE from 'three';
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry, EXRLoader } from "three/examples/jsm/Addons.js";

export class GeometryHelper {


    getMoonMaterial = () => {
        const loader = new THREE.TextureLoader();
        const exrLoader = new EXRLoader();

        const colorMap = loader.load("./assets/textures/rockGround/rocks_ground_05_diff_1k.jpg");
        const roughnessMap = loader.load("./assets/textures/rockGround/rocks_ground_05_rough_1k.jpg");
        const normalMap = exrLoader.load("./assets/textures/rockGround/rocks_ground_05_nor_gl_1k.exr");


        colorMap.colorSpace = THREE.SRGBColorSpace;
        normalMap.type = THREE.FloatType;

        return new THREE.MeshStandardMaterial({
            map: colorMap,
            roughnessMap: roughnessMap,
            normalMap: normalMap,
            metalness: 0.05,
            roughness: 1.0,
            normalScale: new THREE.Vector2(0.3, 0.3)
        });
    }

    getPlanetMaterial = () => {
        const loader = new THREE.TextureLoader();
        const exrLoader = new EXRLoader();

        const colorMap = loader.load("./assets/textures/planet/bitumen_diff_1k.jpg");
        const displacementMap = loader.load("./assets/textures/planet/bitumen_disp_1k.png");

        const normalMap = exrLoader.load("./assets/textures/planet/bitumen_nor_gl_1k.exr");
        const roughnessMap = exrLoader.load("./assets/textures/planet/bitumen_rough_1k.exr");


        colorMap.colorSpace = THREE.SRGBColorSpace;
        normalMap.type = THREE.FloatType;
        roughnessMap.type = THREE.FloatType;

        return new THREE.MeshStandardMaterial({
            map: colorMap,
            normalMap: normalMap,
            roughnessMap: roughnessMap,
            displacementMap: displacementMap,
            displacementScale: 0.05,

            metalness: 0.1,
            roughness: 1.0,
            normalScale: new THREE.Vector2(2, 2),
        });
    }


create3dText = ({
    str = "SOLAR SYSTEM",
    fontUrl = "./assets/fonts/helvetiker_bold.typeface.json",
    color = 0xffffff,               
    emissive = 0xfff8cc,            
    emissiveIntensity = 1,       
    size = 3,
    height = 0.5,
    depth = 0.3,
    curveSegments = 20,
    bevelEnabled = true,
    centerText = true,
    callbackReady
} = {}) => {

    if (!this.fontLoader) {
        this.fontLoader = new FontLoader();
    }

    this.fontLoader.load(
        fontUrl,

        (font) => {
            const textGeometry = new TextGeometry(str, {
                font,
                size,
                height,
                curveSegments,
                depth,
                bevelEnabled,
                bevelThickness: 0.08,
                bevelSize: 0.04,
                bevelSegments: 4
            });


            const material = new THREE.MeshStandardMaterial({
                color,
                emissive: new THREE.Color(emissive),
                emissiveIntensity,
                metalness: 0.0,
                roughness: 0.4
            });

            const textMesh = new THREE.Mesh(textGeometry, material);


            if (centerText) {
                textGeometry.computeBoundingBox();
                const box = textGeometry.boundingBox;

                const offsetX = (box.max.x - box.min.x) * 0.5;
                const offsetY = (box.max.y - box.min.y) * 0.5;

                textMesh.position.x = -offsetX;
                textMesh.position.y = offsetY;
            }

            callbackReady(textMesh);
        }
    );
};
}

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

export function initClicks(renderer, camera, controls, planets) {
    renderer.domElement.addEventListener("pointerdown", (event) => {
        const mouse = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1,
        };

        raycaster.setFromCamera(mouse, camera);

        
        const clickable = planets.flatMap(p => [p.mesh, p.label].filter(Boolean));

        const intersects = raycaster.intersectObjects(clickable, true);

        if (intersects.length === 0) return;

        const hit = intersects[0].object;

        const planet = hit.userData.planetRef;
        if (!planet) return;
        console.log(planets);
        focusCameraOnPlanet(camera, controls, planet);
    });
}
export function focusCameraOnPlanet(camera, controls, planet) {

    const targetPos = planet.mesh.getWorldPosition(new THREE.Vector3());

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();

    const offset = new THREE.Vector3().subVectors(
        camera.position,
        controls.target
    );

    const endPos = targetPos.clone().add(offset);

    let t = 0;
    function animateMove() {
        t += 0.015;
        const s = t;

        camera.position.lerpVectors(startPos, endPos, s);
        controls.target.lerpVectors(startTarget, targetPos, s);

        if (t < 1) requestAnimationFrame(animateMove);
    }

    animateMove();
}
