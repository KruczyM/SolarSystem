const supportedLanguages = ["en", "pl", "fi"];

const translations = {
    en: {
        title: "Orbit - Interactive Solar System",
        appControls: "Application controls",
        toggleSound: "Toggle sound",
        languageSelector: "Language",
        controls: "Controls",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        resetView: "Reset view",
        hideLabels: "Hide labels",
        showLabels: "Show labels",
        addPlanet: "+ Add planet",
        addMoon: "+ Add moon",
        removeSun: "Remove Sun",
        removePlanet: "Remove planet",
        removeMoon: "Remove moon",
        globalSettings: "Global settings",
        focusPlanet: "Focus planet",
        planetEditor: "Planet editor",
        globalSize: "Global size",
        orbitSpeed: "Orbit speed",
        rotationSpeed: "Rotation speed",
        name: "Name",
        radius: "Radius",
        orbitalRadius: "Orbital radius",
        color: "Color",
        axialTilt: "Axial tilt",
        size: "Size",
        distance: "Distance",
        yearLength: "Year Length",
        funFact: "Fun Fact",
        units: "units",
        newPlanet: "New Planet",
        newMoon: "New Moon",
        customPlanetFact: "Custom planet.",
        customMoonFact: "Custom moon.",
        soundOn: "Mute background music",
        soundOff: "Play background music",
        soundOnShort: "On",
        soundOffShort: "Off",
        musicCredit: "Music: \"Ex Machina\" by Scott Buckley",
        licensedUnder: "Licensed under",
        planets: {}
    },
    pl: {
        title: "Orbit - Interaktywny uk\u0142ad s\u0142oneczny",
        appControls: "Sterowanie aplikacj\u0105",
        toggleSound: "Prze\u0142\u0105cz d\u017awi\u0119k",
        languageSelector: "J\u0119zyk",
        controls: "Sterowanie",
        openMenu: "Otw\u00f3rz menu",
        closeMenu: "Zamknij menu",
        resetView: "Resetuj widok",
        hideLabels: "Ukryj etykiety",
        showLabels: "Poka\u017c etykiety",
        addPlanet: "+ Dodaj planet\u0119",
        addMoon: "+ Dodaj ksi\u0119\u017cyc",
        removeSun: "Usu\u0144 S\u0142o\u0144ce",
        removePlanet: "Usu\u0144 planet\u0119",
        removeMoon: "Usu\u0144 ksi\u0119\u017cyc",
        globalSettings: "Ustawienia globalne",
        focusPlanet: "Skup na planecie",
        planetEditor: "Edytor planet",
        globalSize: "Rozmiar globalny",
        orbitSpeed: "Pr\u0119dko\u015b\u0107 orbity",
        rotationSpeed: "Pr\u0119dko\u015b\u0107 obrotu",
        name: "Nazwa",
        radius: "Promie\u0144",
        orbitalRadius: "Promie\u0144 orbity",
        color: "Kolor",
        axialTilt: "Nachylenie osi",
        size: "Rozmiar",
        distance: "Odleg\u0142o\u015b\u0107",
        yearLength: "D\u0142ugo\u015b\u0107 roku",
        funFact: "Ciekawostka",
        units: "jednostek",
        newPlanet: "Nowa planeta",
        newMoon: "Nowy ksi\u0119\u017cyc",
        customPlanetFact: "W\u0142asna planeta.",
        customMoonFact: "W\u0142asny ksi\u0119\u017cyc.",
        soundOn: "Wycisz muzyk\u0119 w tle",
        soundOff: "Odtw\u00f3rz muzyk\u0119 w tle",
        soundOnShort: "On",
        soundOffShort: "Off",
        musicCredit: "Muzyka: \"Ex Machina\" autorstwa Scotta Buckleya",
        licensedUnder: "Licencja",
        planets: {
            Sun: { name: "S\u0142ońce", funFact: "S\u0142o\u0144ce zawiera 99,86% masy uk\u0142adu s\u0142onecznego.", yearLength: "-" },
            Mercury: { name: "Merkury", funFact: "Merkury ma najwi\u0119ksz\u0105 r\u00f3\u017cnic\u0119 temperatur w uk\u0142adzie s\u0142onecznym.", yearLength: "88 dni" },
            Venus: { name: "Wenus", funFact: "Wenus obraca si\u0119 w przeciwnym kierunku ni\u017c wi\u0119kszo\u015b\u0107 planet.", yearLength: "225 dni" },
            Earth: { name: "Ziemia", funFact: "Ziemia jest jedyn\u0105 znan\u0105 planet\u0105 z \u017cyciem.", yearLength: "365 dni" },
            Mars: { name: "Mars", funFact: "Mars ma najwy\u017cszy wulkan w uk\u0142adzie s\u0142onecznym.", yearLength: "687 dni" },
            Jupiter: { name: "Jowisz", funFact: "W Jowiszu zmie\u015bci\u0142oby si\u0119 ponad 1300 Ziem.", yearLength: "11,86 roku" },
            Saturn: { name: "Saturn", funFact: "Saturn jest tak lekki, \u017ce m\u00f3g\u0142by unosi\u0107 si\u0119 na wodzie.", yearLength: "29,5 roku" },
            Uranus: { name: "Uran", funFact: "Uran obraca si\u0119 na boku.", yearLength: "84 lata" },
            Neptune: { name: "Neptun", funFact: "Neptun ma najszybsze wiatry w uk\u0142adzie s\u0142onecznym.", yearLength: "165 lat" },
            Moon: { name: "Księżyc", funFact: "Ksi\u0119\u017cyc zawsze pokazuje Ziemi t\u0119 sam\u0105 stron\u0119.", yearLength: "27 dni" }
        }
    },
    fi: {
        title: "Orbit - Interaktiivinen aurinkokunta",
        appControls: "Sovelluksen ohjaimet",
        toggleSound: "Vaihda aani",
        languageSelector: "Kieli",
        controls: "Ohjaimet",
        openMenu: "Avaa valikko",
        closeMenu: "Sulje valikko",
        resetView: "Palauta nakyma",
        hideLabels: "Piilota nimet",
        showLabels: "Nayta nimet",
        addPlanet: "+ Lisaa planeetta",
        addMoon: "+ Lisaa kuu",
        removeSun: "Poista Aurinko",
        removePlanet: "Poista planeetta",
        removeMoon: "Poista kuu",
        globalSettings: "Yleiset asetukset",
        focusPlanet: "Kohdista planeettaan",
        planetEditor: "Planeettaeditori",
        globalSize: "Yleiskoko",
        orbitSpeed: "Kiertonopeus",
        rotationSpeed: "Pyorimisnopeus",
        name: "Nimi",
        radius: "Sade",
        orbitalRadius: "Kiertoradan sade",
        color: "Vari",
        axialTilt: "Akselikallistus",
        size: "Koko",
        distance: "Etaisyys",
        yearLength: "Vuoden pituus",
        funFact: "Hauska fakta",
        units: "yksikkoa",
        newPlanet: "Uusi planeetta",
        newMoon: "Uusi kuu",
        customPlanetFact: "Mukautettu planeetta.",
        customMoonFact: "Mukautettu kuu.",
        soundOn: "Mykista taustamusiikki",
        soundOff: "Soita taustamusiikki",
        soundOnShort: "On",
        soundOffShort: "Off",
        musicCredit: "Musiikki: \"Ex Machina\" by Scott Buckley",
        licensedUnder: "Lisenssi",
        planets: {
            Sun: { name: "Aurinko", funFact: "Aurinko sisaltaa 99,86% aurinkokunnan massasta.", yearLength: "-" },
            Mercury: { name: "Merkurius", funFact: "Merkuriuksella on aurinkokunnan suurin lampotilaero.", yearLength: "88 paivaa" },
            Venus: { name: "Venus", funFact: "Venus pyorii vastakkaiseen suuntaan kuin useimmat planeetat.", yearLength: "225 paivaa" },
            Earth: { name: "Maa", funFact: "Maa on ainoa tunnettu planeetta, jolla on elamaa.", yearLength: "365 paivaa" },
            Mars: { name: "Mars", funFact: "Marsissa on aurinkokunnan korkein tulivuori.", yearLength: "687 paivaa" },
            Jupiter: { name: "Jupiter", funFact: "Jupiterin sisaan mahtuisi yli 1300 Maata.", yearLength: "11,86 vuotta" },
            Saturn: { name: "Saturnus", funFact: "Saturnus on niin kevyt, etta se voisi kellua vedessa.", yearLength: "29,5 vuotta" },
            Uranus: { name: "Uranus", funFact: "Uranus pyorii kyljellaan.", yearLength: "84 vuotta" },
            Neptune: { name: "Neptunus", funFact: "Neptunuksella on aurinkokunnan nopeimmat tuulet.", yearLength: "165 vuotta" },
            Moon: { name: "Kuu", funFact: "Kuu nayttaa Maalle aina saman puolen.", yearLength: "27 paivaa" }
        }
    }
};

export function getLanguage() {
    const language = new URLSearchParams(window.location.search).get("lang") || "en";
    return supportedLanguages.includes(language) ? language : "en";
}

export function getLanguages() {
    return supportedLanguages;
}

export function setLanguage(language) {
    if (!supportedLanguages.includes(language)) return;

    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.location.assign(url.toString());
}

export function t(key) {
    const language = getLanguage();
    return translations[language]?.[key] ?? translations.en[key] ?? key;
}

export function translateBodies(items) {
    const language = getLanguage();
    const planetTranslations = translations[language]?.planets ?? {};

    return items.map(item => ({
        ...item,
        ...(planetTranslations[item.name] ?? {})
    }));
}
