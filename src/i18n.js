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
        title: "Orbit - Interaktywny uklad sloneczny",
        appControls: "Sterowanie aplikacja",
        toggleSound: "Przelacz dzwiek",
        languageSelector: "Jezyk",
        controls: "Sterowanie",
        openMenu: "Otworz menu",
        closeMenu: "Zamknij menu",
        resetView: "Resetuj widok",
        hideLabels: "Ukryj etykiety",
        showLabels: "Pokaz etykiety",
        addPlanet: "+ Dodaj planete",
        addMoon: "+ Dodaj ksiezyc",
        removeSun: "Usun Slonce",
        removePlanet: "Usun planete",
        removeMoon: "Usun ksiezyc",
        globalSettings: "Ustawienia globalne",
        focusPlanet: "Skup na planecie",
        planetEditor: "Edytor planet",
        globalSize: "Rozmiar globalny",
        orbitSpeed: "Predkosc orbity",
        rotationSpeed: "Predkosc obrotu",
        name: "Nazwa",
        radius: "Promien",
        orbitalRadius: "Promien orbity",
        color: "Kolor",
        axialTilt: "Nachylenie osi",
        size: "Rozmiar",
        distance: "Odleglosc",
        yearLength: "Dlugosc roku",
        funFact: "Ciekawostka",
        units: "jednostek",
        newPlanet: "Nowa planeta",
        newMoon: "Nowy ksiezyc",
        customPlanetFact: "Wlasna planeta.",
        customMoonFact: "Wlasny ksiezyc.",
        soundOn: "Wycisz muzyke w tle",
        soundOff: "Odtworz muzyke w tle",
        soundOnShort: "On",
        soundOffShort: "Off",
        musicCredit: "Muzyka: \"Ex Machina\" autorstwa Scotta Buckleya",
        licensedUnder: "Licencja",
        planets: {
            Sun: { name: "Slonce", funFact: "Slonce zawiera 99,86% masy ukladu slonecznego.", yearLength: "-" },
            Mercury: { name: "Merkury", funFact: "Merkury ma najwieksza roznice temperatur w ukladzie slonecznym.", yearLength: "88 dni" },
            Venus: { name: "Wenus", funFact: "Wenus obraca sie w przeciwnym kierunku niz wiekszosc planet.", yearLength: "225 dni" },
            Earth: { name: "Ziemia", funFact: "Ziemia jest jedyna znana planeta z zyciem.", yearLength: "365 dni" },
            Mars: { name: "Mars", funFact: "Mars ma najwyzszy wulkan w ukladzie slonecznym.", yearLength: "687 dni" },
            Jupiter: { name: "Jowisz", funFact: "W Jowiszu zmiesciloby sie ponad 1300 Ziem.", yearLength: "11,86 roku" },
            Saturn: { name: "Saturn", funFact: "Saturn jest tak lekki, ze moglby unosic sie na wodzie.", yearLength: "29,5 roku" },
            Uranus: { name: "Uran", funFact: "Uran obraca sie na boku.", yearLength: "84 lata" },
            Neptune: { name: "Neptun", funFact: "Neptun ma najszybsze wiatry w ukladzie slonecznym.", yearLength: "165 lat" },
            Moon: { name: "Ksiezyc", funFact: "Ksiezyc zawsze pokazuje Ziemi te sama strone.", yearLength: "27 dni" }
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
