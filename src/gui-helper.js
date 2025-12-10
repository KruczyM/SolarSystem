export function createPlanetFolder(gui, planet, planets, scene, settings) {
    const folder = gui.addFolder(planet.name);

    // Planet
folder.add(planet, "name").name("name").onChange(newName => {
    folder.title(newName); 
});
    folder.add(planet, "radius", 0, 10, 0.1).name("radius").onChange(v => {
        planet.rebuildGeometry(v);
    });
    if (planet.name !== "Sun")folder.add(planet, "orbitalRadius", 0, 200, 0.1).name("orbital radius")
        .onChange(v => {
            planet.mesh.position.x = v;
            planet.rebuildOrbit()
        });
   folder.addColor(planet, "color").name("color")
   .onChange(value => {
    if (planet.isSun) {
        planet.mesh.material.emissive.set(value);
    } else {
        planet.mesh.material.color.set(value);
    }
});

    folder.add(planet, "orbitalSpeed", 0, 5, 0.001).name("orbit speed");
    folder.add(planet, "rotationSpeed", -10, 10, 0.01).name("rotation speed");

    folder.add(planet.mesh.rotation, "z", -Math.PI, Math.PI, 0.01)
        .name("axial tilt");

    // Moon
    if (!planet.isSun)folder.add({
        addMoon: () => {
            const moonData = {
                name: "New Moon",
                radius: 0.5,
                color: "#ffffff",
                orbitalRadius: planet.radius + 4,
                orbitalSpeed: 0.5,
                rotationSpeed: 0.5,
                axialTilt: 0,
                funFact: "im not a real moon",
            };

            const moon = planet.addMoon(moonData);

            createMoonFolder(folder, planet, moon);
        }
    }, "addMoon").name("➕ add moon");

    folder.add({
        removePlanet: () => {
            planet.dispose();

            const idx = planets.indexOf(planet);
            if (idx !== -1) planets.splice(idx, 1);

            folder.destroy();
        }
    }, "removePlanet").name(planet.isSun ? "❌ remove Sun" : "❌ remove planet");

    planet.moons.forEach(moon => {
        createMoonFolder(folder, planet, moon);
    });
    folder.close(); 
    return folder;
}


function createMoonFolder(planetFolder, planet, moon) {
    const moonFolder = planetFolder.addFolder(moon.name || "Moon");

    moonFolder.add(moon, "orbitalRadius", 0.1, 20, 0.1).name("orbital radius")
        .onChange(v => {
            moon.mesh.position.x = v;
        });

    moonFolder.add(moon, "radius", 0.1, 2, 0.1).name("radius");
    moonFolder.add(moon, "orbitalSpeed", 0, 5, 0.001).name("orbit speed");
    moonFolder.add(moon, "rotationSpeed", 0, 5, 0.001).name("rotation speed");
    moonFolder.add(moon.mesh.rotation, "z", -Math.PI, Math.PI, 0.01).name("axial tilt");

moonFolder.add({
    removeMoon: () => {
        const idx = planet.moons.indexOf(moon);
        if (idx !== -1) planet.moons.splice(idx, 1);

        if (moon.orbit.parent) {
            moon.orbit.parent.remove(moon.orbit);
        }
        moon.dispose();
        moonFolder.destroy();
    }
}, "removeMoon").name("❌ remove moon");
}
