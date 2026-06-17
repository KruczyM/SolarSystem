import { getLanguage, getLanguages, setLanguage, t } from './i18n.js';

export function createAppUi({
    camera,
    controls,
    planets,
    settings,
    startCameraPosition,
    startTarget,
    actions
}) {
    const root = document.querySelector('.app-ui');
    const menuToggle = document.querySelector('#menuToggle');
    const menu = document.querySelector('#appMenu');
    const backdrop = document.querySelector('#menuBackdrop');
    const planetQuickActions = document.querySelector('#planetQuickActions');
    const planetEditor = document.querySelector('#planetEditor');
    const globalControls = document.querySelector('#globalControls');
    const toggleLabelsButton = document.querySelector('#toggleLabelsButton');
    const languageSwitch = document.querySelector('#languageSwitch');

    if (!root || !menuToggle || !menu || !backdrop || !planetQuickActions || !planetEditor || !globalControls || !toggleLabelsButton || !languageSwitch) {
        throw new Error('App UI markup is missing. Check index.html.');
    }

    let labelsVisible = true;

    applyStaticLabels();

    function applyStaticLabels() {
        document.querySelector('.app-menu__header strong').textContent = t('controls');
        root.setAttribute('aria-label', t('appControls'));
        document.querySelector('#muteButton')?.setAttribute('aria-label', t('toggleSound'));
        document.querySelector('[data-action="reset-view"]').textContent = t('resetView');
        document.querySelector('[data-action="add-planet"]').textContent = t('addPlanet');
        document.querySelector('[data-action="close"]').setAttribute('aria-label', t('closeMenu'));
        menuToggle.setAttribute('aria-label', t('openMenu'));
        toggleLabelsButton.textContent = t('hideLabels');
        document.querySelector('[data-i18n="global-settings"]').textContent = t('globalSettings');
        document.querySelector('[data-i18n="focus-planet"]').textContent = t('focusPlanet');
        document.querySelector('[data-i18n="planet-editor"]').textContent = t('planetEditor');
        document.querySelector('[data-i18n="music-credit"]').textContent = t('musicCredit');
        document.querySelector('[data-i18n="licensed-under"]').textContent = t('licensedUnder');
        renderLanguageSwitch();
    }

    function renderLanguageSwitch() {
        languageSwitch.setAttribute('aria-label', t('languageSelector'));
        languageSwitch.replaceChildren(...getLanguages().map(language => {
            const button = createElement('button', {
                text: language.toUpperCase(),
                attributes: {
                    type: 'button',
                    'aria-pressed': String(language === getLanguage())
                },
                dataset: {
                    language
                }
            });

            button.addEventListener('click', () => setLanguage(language));
            return button;
        }));
    }

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

        toggleLabelsButton.textContent = labelsVisible ? t('hideLabels') : t('showLabels');
    }

    function focusPlanet(planet) {
        if (!planet?.mesh) return;
        actions.focusPlanet(planet);
        closeMenu();
    }

    function createRangeControl({ label, value, min, max, step, control, planetIndex, moonIndex }) {
        const id = `${control}-${planetIndex ?? 'global'}-${moonIndex ?? 'main'}`;

        const labelElement = createElement('label', {
            className: 'control-row',
            attributes: { for: id }
        });

        const top = createElement('span', { className: 'control-row__top' });
        top.append(createElement('span', { text: label }));
        top.append(createElement('output', {
            text: formatNumber(value),
            dataset: { outputFor: id }
        }));

        const input = createElement('input', {
            attributes: {
                id,
                type: 'range',
                min,
                max,
                step,
                value
            },
            dataset: { control }
        });

        if (planetIndex !== undefined) input.dataset.planetIndex = String(planetIndex);
        if (moonIndex !== undefined) input.dataset.moonIndex = String(moonIndex);

        labelElement.append(top, input);
        return labelElement;
    }

    function createColorControl({ label, value, control, planetIndex }) {
        const id = `${control}-${planetIndex}`;

        const labelElement = createElement('label', {
            className: 'control-row control-row--inline',
            attributes: { for: id }
        });

        const input = createElement('input', {
            attributes: {
                id,
                type: 'color',
                value: normalizeColor(value)
            },
            dataset: {
                control,
                planetIndex: String(planetIndex)
            }
        });

        labelElement.append(createElement('span', { text: label }), input);
        return labelElement;
    }

    function createTextControl({ label, value, control, planetIndex, moonIndex }) {
        const id = `${control}-${planetIndex}-${moonIndex ?? 'main'}`;

        const labelElement = createElement('label', {
            className: 'control-row',
            attributes: { for: id }
        });

        const top = createElement('span', { className: 'control-row__top' });
        top.append(createElement('span', { text: label }));

        const input = createElement('input', {
            attributes: {
                id,
                type: 'text',
                value: value ?? ''
            },
            dataset: {
                control,
                planetIndex: String(planetIndex)
            }
        });

        if (moonIndex !== undefined) input.dataset.moonIndex = String(moonIndex);

        labelElement.append(top, input);
        return labelElement;
    }

    function renderGlobalControls() {
        replaceChildren(globalControls, [
            createRangeControl({
                label: t('globalSize'),
                value: settings.sizeMultiplier,
                min: 0.5,
                max: 10,
                step: 0.1,
                control: 'global-size'
            }),
            createRangeControl({
                label: t('orbitSpeed'),
                value: settings.orbitSpeedMultiplier,
                min: 0,
                max: 1000,
                step: 0.1,
                control: 'global-orbit-speed'
            }),
            createRangeControl({
                label: t('rotationSpeed'),
                value: settings.rotationSpeedMultiplier,
                min: 0,
                max: 1,
                step: 0.1,
                control: 'global-rotation-speed'
            })
        ]);
    }

    function renderPlanetButtons() {
        const buttons = planets.map((planet, index) => {
            const button = createElement('button', {
                text: planet.name,
                attributes: { type: 'button' },
                dataset: {
                    action: 'focus-planet',
                    planetIndex: String(index)
                }
            });

            return button;
        });

        replaceChildren(planetQuickActions, buttons);
    }

    function renderPlanetEditor() {
        const cards = planets.map((planet, planetIndex) => createPlanetCard(planet, planetIndex));
        replaceChildren(planetEditor, cards);
    }

    function createPlanetCard(planet, planetIndex) {
        const details = createElement('details', { className: 'editor-card' });
        details.append(createElement('summary', { text: planet.name }));

        const content = createElement('div', { className: 'editor-card__content' });

        content.append(
            createTextControl({ label: t('name'), value: planet.name, control: 'planet-name', planetIndex }),
            createRangeControl({ label: t('radius'), value: planet.radius, min: 0, max: 10, step: 0.1, control: 'planet-radius', planetIndex })
        );

        if (!planet.isSun) {
            content.append(createRangeControl({
                label: t('orbitalRadius'),
                value: planet.orbitalRadius,
                min: 0,
                max: 200,
                step: 0.1,
                control: 'planet-orbital-radius',
                planetIndex
            }));
        }

        content.append(
            createColorControl({ label: t('color'), value: planet.color || '#ffffff', control: 'planet-color', planetIndex }),
            createRangeControl({ label: t('orbitSpeed'), value: planet.orbitalSpeed, min: 0, max: 5, step: 0.001, control: 'planet-orbit-speed', planetIndex }),
            createRangeControl({ label: t('rotationSpeed'), value: planet.rotationSpeed, min: -10, max: 10, step: 0.01, control: 'planet-rotation-speed', planetIndex }),
            createRangeControl({ label: t('axialTilt'), value: planet.mesh.rotation.z, min: -Math.PI, max: Math.PI, step: 0.01, control: 'planet-axial-tilt', planetIndex })
        );

        if (!planet.isSun) {
            content.append(createElement('button', {
                text: t('addMoon'),
                attributes: { type: 'button' },
                dataset: {
                    action: 'add-moon',
                    planetIndex: String(planetIndex)
                }
            }));
        }

        content.append(createElement('button', {
            text: planet.isSun ? t('removeSun') : t('removePlanet'),
            attributes: { type: 'button' },
            dataset: {
                action: 'remove-planet',
                planetIndex: String(planetIndex)
            }
        }));

        planet.moons.forEach((moon, moonIndex) => {
            content.append(createMoonCard(moon, planetIndex, moonIndex));
        });

        details.append(content);
        return details;
    }

    function createMoonCard(moon, planetIndex, moonIndex) {
        const details = createElement('details', { className: 'editor-card editor-card--moon' });
        details.append(createElement('summary', { text: moon.name || `${t('newMoon')} ${moonIndex + 1}` }));

        const content = createElement('div', { className: 'editor-card__content' });

        content.append(
            createTextControl({ label: t('name'), value: moon.name || '', control: 'moon-name', planetIndex, moonIndex }),
            createRangeControl({ label: t('radius'), value: moon.radius, min: 0.1, max: 2, step: 0.1, control: 'moon-radius', planetIndex, moonIndex }),
            createRangeControl({ label: t('orbitalRadius'), value: moon.orbitalRadius, min: 0.1, max: 20, step: 0.1, control: 'moon-orbital-radius', planetIndex, moonIndex }),
            createRangeControl({ label: t('orbitSpeed'), value: moon.orbitalSpeed, min: 0, max: 5, step: 0.001, control: 'moon-orbit-speed', planetIndex, moonIndex }),
            createRangeControl({ label: t('rotationSpeed'), value: moon.rotationSpeed, min: 0, max: 5, step: 0.001, control: 'moon-rotation-speed', planetIndex, moonIndex }),
            createRangeControl({ label: t('axialTilt'), value: moon.mesh.rotation.z, min: -Math.PI, max: Math.PI, step: 0.01, control: 'moon-axial-tilt', planetIndex, moonIndex }),
            createElement('button', {
                text: t('removeMoon'),
                attributes: { type: 'button' },
                dataset: {
                    action: 'remove-moon',
                    planetIndex: String(planetIndex),
                    moonIndex: String(moonIndex)
                }
            })
        );

        details.append(content);
        return details;
    }

    function refresh() {
        renderGlobalControls();
        renderPlanetButtons();
        renderPlanetEditor();
        translateActionButtons();
    }

    function translateActionButtons() {
        menu.querySelectorAll('[data-action="add-moon"]').forEach(button => {
            button.textContent = t('addMoon');
        });

        menu.querySelectorAll('[data-action="remove-planet"]').forEach(button => {
            const planet = planets[Number(button.dataset.planetIndex)];
            button.textContent = planet?.isSun ? t('removeSun') : t('removePlanet');
        });

        menu.querySelectorAll('[data-action="remove-moon"]').forEach(button => {
            button.textContent = t('removeMoon');
        });
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

function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);

    if (options.className) element.className = options.className;
    if (options.text !== undefined) element.textContent = options.text;

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([name, value]) => {
            element.setAttribute(name, String(value));
        });
    }

    if (options.dataset) {
        Object.entries(options.dataset).forEach(([name, value]) => {
            element.dataset[name] = String(value);
        });
    }

    return element;
}

function replaceChildren(parent, children) {
    parent.replaceChildren(...children);
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
