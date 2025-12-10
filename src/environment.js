import * as THREE from "three";
export let stars;

function createNebulaSpriteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );

    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

export function getNebula(options) {
    const {
        numSprites = 15,
        radius = 50,
        size = 100,
        opacity = 0.1,
        hue = 0.1,
        z = -50
    } = options;

    const nebulaGroup = new THREE.Group();
    const nebulaTexture = createNebulaSpriteTexture();

    for (let i = 0; i < numSprites; i++) {
        const material = new THREE.SpriteMaterial({
            map: nebulaTexture,
            color: new THREE.Color().setHSL(hue + Math.random() * 0.1 - 0.05, 0.5, 0.5),
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: opacity + Math.random() * 0.1 - 0.05, // Varied opacity
            depthWrite: false, // Important for additive blending
        });

        const sprite = new THREE.Sprite(material);
        sprite.position.set((Math.random() - 0.5) * 2 * radius, (Math.random() - 0.5) * 2 * radius, (Math.random() - 0.5) * 2 * radius);
        sprite.scale.set(size * (0.5 + Math.random() * 0.5), size * (0.5 + Math.random() * 0.5), 1);
        nebulaGroup.add(sprite);
    }
    nebulaGroup.position.z = z;
    return nebulaGroup;
}

export function animateNebula(nebula, delta) {
    nebula.rotation.z += 0.002 * delta;
    nebula.rotation.y += 0.001 * delta;
}




export function createStarField(scene) {
    const starCount = 12000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const r = 450;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.0,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.6,
    depthWrite: false
});

     stars = new THREE.Points(geometry, material);
     stars.renderOrder = -5;
    scene.add(stars);
}
export function animateStars() {
    if (!stars) return;
    stars.rotation.y += 0.00005;
}