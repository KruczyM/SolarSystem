import * as THREE from "three";

export class Planet {
    constructor(data, settings) {
        this.settings = settings;
        this.name = data.name;
        this.radius = data.radius;
        this.baseRadius = data.radius;
        this.color = data.color;
        this.textureUrl = data.textureUrl;
        this.orbitalRadius = data.orbitalRadius;
        this.orbitalSpeed = data.orbitalSpeed;
        this.rotationSpeed = data.rotationSpeed;
        this.funFact = data.funFact;
        this.yearLength = data.yearLength;
        this.isSun = data.isSun || false;
        this.moons = [];
        this.axialTilt = data.axialTilt || 0;
        this.orbit = new THREE.Object3D();
        this.mesh = this._createMesh();
        this.mesh.rotation.z = this.axialTilt;
        this.mesh.position.x = this.orbitalRadius;
        this.orbit.rotation.y = Math.random() * Math.PI * 2;
        // this.orbit.rotation.x = (Math.random() - 0.5) * 0.15;
        if (this.isSun) {
            this.mesh.layers.enable(1);
        }
        this.orbit.add(this.mesh);

        this.orbitLine = this._createOrbitLine();
        if (this.orbitLine) {
            this.orbit.add(this.orbitLine);
        }

    }

    rebuildGeometry(newRadius) {

        this.radius = newRadius;
        if (this.mesh.geometry) {
            this.mesh.geometry.dispose();
        }
        this.mesh.geometry = new THREE.SphereGeometry(newRadius, 64, 64);

    }

    _createMesh() {
        const geometry = new THREE.SphereGeometry(this.radius, 64, 64);

        let options = {
            roughness: 1,
            metalness: 0
        };

        if (this.textureUrl) {
            options.map = new THREE.TextureLoader().load(this.textureUrl);
        } else {
            options.color = new THREE.Color(this.color || 0xffffff);
        }

        const material = this.isSun
            ? new THREE.MeshStandardMaterial({
                map: options.map,
                emissive: new THREE.Color(0xffffff),
                emissiveMap: options.map,
                emissiveIntensity: 1.0,
                roughness: 0.55,
                metalness: 0
            })
            : new THREE.MeshStandardMaterial(options);


        return new THREE.Mesh(geometry, material);
    }

    _createOrbitLine() {
        if (this.orbitalRadius <= 0) return null;

        const segments = 128;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array((segments + 1) * 3);

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * this.orbitalRadius;
            const z = Math.sin(angle) * this.orbitalRadius;

            positions[i * 3] = x;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = z;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15
        });

        const line = new THREE.LineLoop(geometry, material);
        return line;
    }

    rebuildOrbit() {
    if (this.orbitLine) {
        this.orbit.remove(this.orbitLine);
        this.orbitLine.geometry.dispose();
        this.orbitLine.material.dispose();
    }

    this.orbitLine = this._createOrbitLine();
    if (this.orbitLine) {
        this.orbit.add(this.orbitLine);
    }

    this.mesh.position.x = this.orbitalRadius;
}

    update(delta) {

        if (!this.isSun) {
            this.orbit.rotation.y += this.orbitalSpeed * this.settings.orbitSpeedMultiplier * delta;
        }

        this.mesh.rotation.y += this.rotationSpeed * this.settings.rotationSpeedMultiplier * delta;
        this.moons.forEach(moon => moon.update(delta));
    }

    addMoon(data) {
        const moon = new Planet(data, this.settings);
        this.mesh.add(moon.orbit);
        this.moons.push(moon);
        return moon;
    }

    dispose() {
        this.moons.forEach(moon => moon.dispose());
        if (this.mesh.geometry) this.mesh.geometry.dispose();
        if (this.mesh.material) this.mesh.material.dispose();
        if (this.orbit.parent) this.orbit.parent.remove(this.orbit);
    }
}
export const solarSystemData = [
    {
        name: "Sun",
        radius: 5,
        color: "#ffffff",
        textureUrl: "/SolarSystem/assets/textures/sun.png",
        orbitalRadius: 0,
        orbitalSpeed: 0,
        rotationSpeed: (2 * Math.PI) / (36), // 0.15
        axialTilt: 0.1265,
        funFact: "The Sun contains 99.86% of the Solar System mass.",
        yearLength: "—",
        isSun: true
    },

    {
        name: "Mercury",
        radius: 0.35,
        color: "#b1b1b1",
        textureUrl: "/SolarSystem/assets/textures/mercury.webp",
        orbitalRadius: 8,
        orbitalSpeed: (2 * Math.PI) / (88),      // 0.713
        rotationSpeed: (2 * Math.PI) / (58.6),  // 1.072
        axialTilt: 0.0005,
        funFact: "Mercury has the largest temperature difference in the Solar System.",
        yearLength: "88 days",

    },

    {
        name: "Venus",
        radius: 0.87,
        color: "#e6c28b",
        textureUrl: "SolarSystem/assets/textures/venus.webp",
        orbitalRadius: 11,
        orbitalSpeed: (2 * Math.PI) / (225),    // 0.279
        rotationSpeed: -(2 * Math.PI) / (243),  // -0.259
        axialTilt: 3.0945,
        funFact: "Venus rotates backwards compared to most planets.",
        yearLength: "225 days",

    },

    {
        name: "Earth",
        radius: 0.92,
        color: "#2a6bd6",
        textureUrl: "SolarSystem/assets/textures/earth.webp",
        orbitalRadius: 14,
        orbitalSpeed: (2 * Math.PI) / (365),    // 0.172
        rotationSpeed: (2 * Math.PI) / (1),     // 62.83
        axialTilt: 0.4084,
        funFact: "Earth is the only known planet with life.",
        yearLength: "365 days",

    },

    {
        name: "Mars",
        radius: 0.49,
        color: "#c1440e",
        textureUrl: "SolarSystem/assets/textures/mars.webp",
        orbitalRadius: 18,
        orbitalSpeed: (2 * Math.PI) / (687),    // 0.091
        rotationSpeed: (2 * Math.PI) / (1.03),  // 60.99
        axialTilt: 0.4398,
        funFact: "Mars has the tallest volcano in the Solar System.",
        yearLength: "687 days",

    },

    {
        name: "Jupiter",
        radius: 2.8,
        color: "#d2b48c",
        textureUrl: "/SolarSystem/assets/textures/jupiter.webp",
        orbitalRadius: 26,
        orbitalSpeed: (2 * Math.PI) / (4333),   // 0.0145
        rotationSpeed: (2 * Math.PI) / (0.41),  // 153.2
        axialTilt: 0.0541,
        funFact: "Jupiter could fit over 1,300 Earths inside.",
        yearLength: "11.86 years",

    },

    {
        name: "Saturn",
        radius: 2.4,
        color: "#f5deb3",
        textureUrl: "/SolarSystem/assets/textures/saturn.webp",
        orbitalRadius: 34,
        orbitalSpeed: (2 * Math.PI) / (10759),  // 0.00584
        rotationSpeed: (2 * Math.PI) / (0.44),  // 142.8
        axialTilt: 0.466,
        funFact: "Saturn is so light it could float in water.",
        yearLength: "29.5 years",

    },

    {
        name: "Uranus",
        radius: 2.0,
        color: "#7fffd4",
        textureUrl: "/SolarSystem/assets/textures/uranus.webp",
        orbitalRadius: 42,
        orbitalSpeed: (2 * Math.PI) / (30687),  // 0.00205
        rotationSpeed: -(2 * Math.PI) / (0.72), // -87.26
        axialTilt: 1.7069,
        funFact: "Uranus rotates on its side.",
        yearLength: "84 years",

    },

    {
        name: "Neptune",
        radius: 1.95,
        color: "#4169e1",
        textureUrl: "/SolarSystem/assets/textures/neptune.webp",
        orbitalRadius: 50,
        orbitalSpeed: (2 * Math.PI) / (60190),  // 0.00104
        rotationSpeed: (2 * Math.PI) / (0.67),  // 93.7
        axialTilt: 0.4939,
        funFact: "Neptune has the fastest winds in the Solar System.",
        yearLength: "165 years",

    }
];

export const moonData = [
    {
        name: "Moon",
        radius: 0.18,
        color: "#ffffff",
        textureUrl: "/assets/textures/moon.webp",
        orbitalRadius: 1.5,
        orbitalSpeed: (2 * Math.PI) / (27.3217),
        rotationSpeed: (2 * Math.PI) / (27.3217),
        axialTilt: 0.1166,
        funFact: "The Moon always shows the same face to Earth.",
        yearLength: "27 days",

    },
    {
        name: "Moon",
        radius: 0.18,
        color: "#ffffff",
        textureUrl: "/assets/textures/moon.webp",
        orbitalRadius: 1.5,
        orbitalSpeed: 0.04,
        rotationSpeed: 0.015,
        axialTilt: 0.1166,
        funFact: "im not a real moon",
        yearLength: "27 days",

    }
];