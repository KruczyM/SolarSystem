import { FontLoader } from "three/examples/jsm/Addons.js";

let loadedFont = null;

export async function loadFont(url) {
    if (loadedFont) return loadedFont;

    loadedFont = await new Promise((resolve, reject) => {
        const loader = new FontLoader();
        loader.load(
            url,
            font => resolve(font),
            undefined,
            err => reject(err)
        );
    });

    return loadedFont;
}

export function getFont() {
    return loadedFont;
}