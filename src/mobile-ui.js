export function createAppUi({
    camera,
    controls,
    planets,
    settings,
    startCameraPosition,
    startTarget,
    actions
}) {
    injectUiStyles();

    const root = document.createElement('div');
    root.className = 'app-ui';
    root.innerHTML = `
        <div class="app-floating-actions" aria-label="Application controls">
            <button id="muteButton" class="app-icon-button" type="button" aria-label="Toggle sound">🔇</button>
            <button id="menuToggle" class="app-icon-button" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="appMenu">☰</button>
        </div>

        <div id="menuBackdrop" class="app-menu-backdrop" hidden></div>

        <nav id="appMenu" class="app-menu" aria-label="Main menu" aria-hidden="true">
            <div class="app-menu__handle" aria-hidden="true"></div>
            <div class="app-menu__header">
                <strong>Controls</strong>
                <button class="app-menu__close" type="button" data-action="close" aria-label="Close menu">×</button>
            </div>

            <div class="app-menu__section">
                <button type="button" data-action="reset-view">Reset view</button>
                <button type="button" data-action="toggle-labels" id="toggleLabelsButton">Hide labels</button>
                <button type="button" data-action="add-planet">➕ Add planet</button>
            </div>

            <div class="app-menu__section">
                <p class="app-menu__section-title">Global settings</p>
                <div id="globalControls"></div>
            </div>

            <div class="app-menu__section">
                <p class="app-menu__section-title">Focus planet</p>
                <div id="planetQuickActions" class="planet-actions"></div>
            </div>

            <div class="app-menu__section">
                <p class="app-menu__section-title">Planet editor</p>
                <div id="planetEditor" class="planet-editor"></div>
            </div>
        </nav>
    `;

    document.body.appendChild(root);

    const menuToggle = root.querySelector('#menuToggle');
    const menu = root.querySelector('#appMenu');
    const backdrop = root.querySelector('#menuBackdrop');
    const planetQuickActions = root.querySelector('#planetQuickActions');
    const planetEditor = root.querySelector('#planetEditor');
    const globalControls = root.querySelector('#globalControls');
    const toggleLabelsButton = root.querySelector('#toggleLabelsButton');

    let labelsVisible = true;

    function openMenu() {
        menu.classList.add('is-open');
        backdrop.classList.add('is-open');
        backdrop.hidden = false;
        menu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        menu.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');

        window.setTimeout(() => {
            if (!backdrop.classList.contains('is-open')) {
                backdrop.hidden = true;
            }
        }, 180);
    }

    function toggleMenu() {
        if (menu.classList.contains('is-open')) closeMenu();
        else openMenu();
    }

    function resetView() {
        camera.position.copy(startCameraPosition);
        controls.target.copy(startTarget);
        controls.update();
    }

    function toggleLabels() {
        labelsVisible = !labelsVisible;

        planets.forEach(planet => {
            if (planet.labelGroup) planet.labelGroup.visible = labelsVisible;
            planet.moons.forEach(moon => {
                if (moon.labelGroup) moon.labelGroup.visible = labelsVisible;
            });
        });

        toggleLabelsButton.textContent = labelsVisible ? 'Hide labels' : 'Show labels';
    }

    function focusPlanet(planet) {
        if (!planet?.mesh) return;
        actions.focusPlanet(planet);
        closeMenu();
    }

    function createRangeControl({ label, value, min, max, step, control, planetIndex, moonIndex }) {
        const id = `${control}-${planetIndex ?? 'global'}-${moonIndex ?? 'main'}`;
        return `
            <label class="control-row" for="${id}">
                <span class="control-row__top">
                    <span>${label}</span>
                    <output data-output-for="${id}">${formatNumber(value)}</output>
                </span>
                <input
                    id="${id}"
                    type="range"
                    min="${min}"
                    max="${max}"
                    step="${step}"
                    value="${value}"
                    data-control="${control}"
                    ${planetIndex !== undefined ? `data-planet-index="${planetIndex}"` : ''}
                    ${moonIndex !== undefined ? `data-moon-index="${moonIndex}"` : ''}
                />
            </label>
        `;
    }

    function createColorControl({ label, value, control, planetIndex }) {
        const id = `${control}-${planetIndex}`;
        return `
            <label class="control-row control-row--inline" for="${id}">
                <span>${label}</span>
                <input
                    id="${id}"
                    type="color"
                    value="${normalizeColor(value)}"
                    data-control="${control}"
                    data-planet-index="${planetIndex}"
                />
            </label>
        `;
    }

    function createTextControl({ label, value, control, planetIndex, moonIndex }) {
        const id = `${control}-${planetIndex}-${moonIndex ?? 'main'}`;
        return `
            <label class="control-row" for="${id}">
                <span class="control-row__top"><span>${label}</span></span>
                <input
                    id="${id}"
                    type="text"
                    value="${escapeHtml(value)}"
                    data-control="${control}"
                    data-planet-index="${planetIndex}"
                    ${moonIndex !== undefined ? `data-moon-index="${moonIndex}"` : ''}
                />
            </label>
        `;
    }

    function renderGlobalControls() {
        globalControls.innerHTML = `
            ${createRangeControl({
            label: 'Global size',
            value: settings.sizeMultiplier,
            min: 0.5,
            max: 10,
            step: 0.1,
            control: 'global-size'
        })}
            ${createRangeControl({
            label: 'Orbit speed',
            value: settings.orbitSpeedMultiplier,
            min: 0,
            max: 1000,
            step: 0.1,
            control: 'global-orbit-speed'
        })}
            ${createRangeControl({
            label: 'Rotation speed',
            value: settings.rotationSpeedMultiplier,
            min: 0,
            max: 1,
            step: 0.1,
            control: 'global-rotation-speed'
        })}
        `;
    }

    function renderPlanetButtons() {
        planetQuickActions.innerHTML = '';

        planets.forEach((planet, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = planet.name;
            button.dataset.action = 'focus-planet';
            button.dataset.planetIndex = String(index);
            planetQuickActions.appendChild(button);
        });
    }

    function renderPlanetEditor() {
        planetEditor.innerHTML = planets.map((planet, planetIndex) => {
            const moonsHtml = planet.moons.map((moon, moonIndex) => `
                <details class="editor-card editor-card--moon">
                    <summary>${escapeHtml(moon.name || `Moon ${moonIndex + 1}`)}</summary>
                    <div class="editor-card__content">
                        ${createTextControl({ label: 'Name', value: moon.name || '', control: 'moon-name', planetIndex, moonIndex })}
                        ${createRangeControl({ label: 'Radius', value: moon.radius, min: 0.1, max: 2, step: 0.1, control: 'moon-radius', planetIndex, moonIndex })}
                        ${createRangeControl({ label: 'Orbital radius', value: moon.orbitalRadius, min: 0.1, max: 20, step: 0.1, control: 'moon-orbital-radius', planetIndex, moonIndex })}
                        ${createRangeControl({ label: 'Orbit speed', value: moon.orbitalSpeed, min: 0, max: 5, step: 0.001, control: 'moon-orbit-speed', planetIndex, moonIndex })}
                        ${createRangeControl({ label: 'Rotation speed', value: moon.rotationSpeed, min: 0, max: 5, step: 0.001, control: 'moon-rotation-speed', planetIndex, moonIndex })}
                        ${createRangeControl({ label: 'Axial tilt', value: moon.mesh.rotation.z, min: -Math.PI, max: Math.PI, step: 0.01, control: 'moon-axial-tilt', planetIndex, moonIndex })}
                        <button type="button" data-action="remove-moon" data-planet-index="${planetIndex}" data-moon-index="${moonIndex}">❌ Remove moon</button>
                    </div>
                </details>
            `).join('');

            return `
                <details class="editor-card">
                    <summary>${escapeHtml(planet.name)}</summary>
                    <div class="editor-card__content">
                        ${createTextControl({ label: 'Name', value: planet.name, control: 'planet-name', planetIndex })}
                        ${createRangeControl({ label: 'Radius', value: planet.radius, min: 0, max: 10, step: 0.1, control: 'planet-radius', planetIndex })}
                        ${planet.isSun ? '' : createRangeControl({ label: 'Orbital radius', value: planet.orbitalRadius, min: 0, max: 200, step: 0.1, control: 'planet-orbital-radius', planetIndex })}
                        ${createColorControl({ label: 'Color', value: planet.color || '#ffffff', control: 'planet-color', planetIndex })}
                        ${createRangeControl({ label: 'Orbit speed', value: planet.orbitalSpeed, min: 0, max: 5, step: 0.001, control: 'planet-orbit-speed', planetIndex })}
                        ${createRangeControl({ label: 'Rotation speed', value: planet.rotationSpeed, min: -10, max: 10, step: 0.01, control: 'planet-rotation-speed', planetIndex })}
                        ${createRangeControl({ label: 'Axial tilt', value: planet.mesh.rotation.z, min: -Math.PI, max: Math.PI, step: 0.01, control: 'planet-axial-tilt', planetIndex })}
                        ${planet.isSun ? '' : `<button type="button" data-action="add-moon" data-planet-index="${planetIndex}">➕ Add moon</button>`}
                        <button type="button" data-action="remove-planet" data-planet-index="${planetIndex}">${planet.isSun ? '❌ Remove Sun' : '❌ Remove planet'}</button>
                        ${moonsHtml}
                    </div>
                </details>
            `;
        }).join('');
    }

    function refresh() {
        renderGlobalControls();
        renderPlanetButtons();
        renderPlanetEditor();
    }

    function updateOutput(input) {
        const output = root.querySelector(`[data-output-for="${input.id}"]`);
        if (output) output.textContent = formatNumber(input.value);
    }

    function handleInput(event) {
        const input = event.target.closest('input');
        if (!input) return;

        const control = input.dataset.control;
        const planetIndex = Number(input.dataset.planetIndex);
        const moonIndex = Number(input.dataset.moonIndex);
        const value = input.type === 'text' || input.type === 'color' ? input.value : Number(input.value);

        updateOutput(input);

        if (control === 'global-size') {
            settings.sizeMultiplier = value;
            actions.applyGlobalSize(value);
            return;
        }
        if (control === 'global-orbit-speed') {
            settings.orbitSpeedMultiplier = value;
            return;
        }
        if (control === 'global-rotation-speed') {
            settings.rotationSpeedMultiplier = value;
            return;
        }

        const planet = planets[planetIndex];
        if (!planet) return;

        if (control?.startsWith('planet-')) {
            updatePlanetControl(planet, control, value);
            if (control === 'planet-name') renderPlanetButtons();
            return;
        }

        const moon = planet.moons[moonIndex];
        if (!moon) return;

        if (control?.startsWith('moon-')) {
            updateMoonControl(moon, control, value);
        }
    }

    function updatePlanetControl(planet, control, value) {
        if (control === 'planet-name') {
            planet.name = value;
            return;
        }

        if (control === 'planet-radius') {
            planet.rebuildGeometry(value);

            if (planet.isSun) {
                planets.forEach(p => {
                    if (p.isSun) return;
                    p.orbitalRadius = p.orbitalRadiusBase + value;
                    p.rebuildOrbit();
                });
            } else {
                planet.moons.forEach(moon => {
                    moon.orbitalRadius = moon.orbitalRadiusBase + value;
                    moon.rebuildOrbit();
                });
            }
            return;
        }

        if (control === 'planet-orbital-radius') {
            planet.orbitalRadius = value;
            planet.mesh.position.x = value;
            planet.rebuildOrbit();
            return;
        }

        if (control === 'planet-color') {
            planet.color = value;
            if (planet.isSun && planet.mesh.material?.emissive) {
                planet.mesh.material.emissive.set(value);
            } else if (planet.mesh.material?.color) {
                planet.setColor(value);
            }
            return;
        }

        if (control === 'planet-orbit-speed') planet.orbitalSpeed = value;
        if (control === 'planet-rotation-speed') planet.rotationSpeed = value;
        if (control === 'planet-axial-tilt') planet.mesh.rotation.z = value;
    }

    function updateMoonControl(moon, control, value) {
        if (control === 'moon-name') {
            moon.name = value;
            return;
        }
        if (control === 'moon-radius') {
            moon.rebuildGeometry(value);
            return;
        }
        if (control === 'moon-orbital-radius') {
            moon.orbitalRadius = value;
            moon.mesh.position.x = value;
            moon.rebuildOrbit();
            return;
        }
        if (control === 'moon-orbit-speed') moon.orbitalSpeed = value;
        if (control === 'moon-rotation-speed') moon.rotationSpeed = value;
        if (control === 'moon-axial-tilt') moon.mesh.rotation.z = value;
    }

    menuToggle.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);
    menu.addEventListener('input', handleInput);
    menu.addEventListener('change', handleInput);

    menu.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const planetIndex = Number(button.dataset.planetIndex);
        const moonIndex = Number(button.dataset.moonIndex);

        if (action === 'close') closeMenu();
        if (action === 'reset-view') resetView();
        if (action === 'toggle-labels') toggleLabels();
        if (action === 'focus-planet') focusPlanet(planets[planetIndex]);

        if (action === 'add-planet') {
            actions.addPlanet();
            refresh();
        }

        if (action === 'remove-planet') {
            actions.removePlanet(planets[planetIndex]);
            refresh();
        }

        if (action === 'add-moon') {
            actions.addMoon(planets[planetIndex]);
            refresh();
        }

        if (action === 'remove-moon') {
            actions.removeMoon(planets[planetIndex], planets[planetIndex]?.moons[moonIndex]);
            refresh();
        }
    });

    window.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
    });

    refresh();

    return {
        root,
        refresh,
        closeMenu
    };
}

function normalizeColor(value) {
    if (typeof value === 'string' && value.startsWith('#') && value.length >= 7) {
        return value.slice(0, 7);
    }
    return '#ffffff';
}

function formatNumber(value) {
    const number = Number(value);
    if (Number.isNaN(number)) return value;
    return Number.isInteger(number) ? String(number) : number.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function injectUiStyles() {
    if (document.getElementById('app-ui-styles')) return;

    const style = document.createElement('style');
    style.id = 'app-ui-styles';
    style.textContent = `
        * {
            box-sizing: border-box;
        }

        html,
        body {
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        canvas {
            display: block;
            width: 100vw;
            height: 100vh;
            touch-action: none;
        }

        .app-ui {
            color: #fff;
        }

        .app-floating-actions {
            position: fixed;
            top: max(10px, env(safe-area-inset-top));
            right: 12px;
            z-index: 40;
            display: flex;
            align-items: center;
            gap: 8px;
            pointer-events: auto;
        }

        .app-icon-button,
        .app-menu button,
        .app-menu input {
            font: inherit;
        }

        .app-icon-button,
        .app-menu button {
            color: #fff;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
        }

        .app-icon-button {
            width: 44px;
            height: 44px;
            display: grid;
            place-items: center;
            border: 1px solid rgba(255, 255, 255, 0.16);
            border-radius: 999px;
            background: rgba(6, 9, 22, 0.74);
            backdrop-filter: blur(12px);
            font-size: 20px;
        }

        .app-icon-button:active,
        .app-menu button:active {
            transform: scale(0.97);
        }

        .app-menu-backdrop {
            position: fixed;
            inset: 0;
            z-index: 25;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 180ms ease;
        }

        .app-menu-backdrop.is-open {
            opacity: 1;
        }

        .app-menu {
            position: fixed;
            left: 12px;
            right: 12px;
            bottom: max(12px, env(safe-area-inset-bottom));
            z-index: 30;
            max-height: min(82vh, 720px);
            overflow: auto;
            padding: 10px;
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 24px;
            background: rgba(7, 10, 24, 0.95);
            box-shadow: 0 20px 70px rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(18px);
            transform: translateY(calc(100% + 28px));
            transition: transform 220ms ease;
        }

        .app-menu.is-open {
            transform: translateY(0);
        }

        .app-menu__handle {
            width: 44px;
            height: 4px;
            margin: 4px auto 10px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.28);
        }

        .app-menu__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 2px 4px 10px;
        }

        .app-menu__header strong {
            font-size: 18px;
        }

        .app-menu__close {
            width: 38px;
            height: 38px;
            border: 0;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.1);
            font-size: 25px;
            line-height: 1;
        }

        .app-menu__section {
            display: grid;
            gap: 9px;
            padding: 8px 0;
        }

        .app-menu__section + .app-menu__section {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .app-menu__section-title {
            margin: 2px 4px 0;
            color: rgba(255, 255, 255, 0.68);
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .app-menu button {
            min-height: 46px;
            width: 100%;
            border: 0;
            border-radius: 15px;
            background: rgba(255, 255, 255, 0.1);
            padding: 0 15px;
            font-size: 15px;
            font-weight: 700;
            text-align: left;
        }

        .app-menu button:hover {
            background: rgba(255, 255, 255, 0.16);
        }

        .planet-actions {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 9px;
        }

        .planet-actions button {
            text-align: center;
        }

        .control-row {
            display: grid;
            gap: 7px;
            padding: 10px;
            border-radius: 15px;
            background: rgba(255, 255, 255, 0.07);
        }

        .control-row--inline {
            grid-template-columns: 1fr auto;
            align-items: center;
        }

        .control-row__top {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            color: rgba(255, 255, 255, 0.88);
            font-size: 13px;
            font-weight: 700;
        }

        .control-row output {
            color: rgba(255, 255, 255, 0.64);
            font-variant-numeric: tabular-nums;
        }

        .control-row input[type="range"] {
            width: 100%;
        }

        .control-row input[type="text"] {
            width: 100%;
            min-height: 38px;
            border: 1px solid rgba(255, 255, 255, 0.13);
            border-radius: 10px;
            padding: 0 10px;
            color: #fff;
            background: rgba(0, 0, 0, 0.24);
        }

        .control-row input[type="color"] {
            width: 46px;
            height: 36px;
            border: 0;
            border-radius: 10px;
            background: transparent;
        }

        .planet-editor {
            display: grid;
            gap: 9px;
        }

        .editor-card {
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.07);
            overflow: hidden;
        }

        .editor-card--moon {
            background: rgba(255, 255, 255, 0.055);
        }

        .editor-card summary {
            min-height: 46px;
            display: flex;
            align-items: center;
            padding: 0 14px;
            cursor: pointer;
            font-weight: 800;
        }

        .editor-card__content {
            display: grid;
            gap: 9px;
            padding: 0 9px 9px;
        }

        @media (min-width: 768px) {
            .app-floating-actions {
                top: 14px;
                right: 22px;
            }

            .app-menu {
                left: auto;
                right: 22px;
                bottom: auto;
                top: 72px;
                width: min(420px, calc(100vw - 44px));
                max-height: calc(100vh - 92px);
                transform: translateY(-10px);
                opacity: 0;
                pointer-events: none;
            }

            .app-menu.is-open {
                transform: translateY(0);
                opacity: 1;
                pointer-events: auto;
            }
        }
    `;

    document.head.appendChild(style);
}
