import * as THREE from "three";
import { t } from "./i18n.js";

let isAudioLoaded = false;
let userInteracted = false;

export function setupAudio(camera, audioPath) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    const muteButton = document.getElementById('muteButton');

    function updateMuteButton() {
        if (!muteButton) return;

        muteButton.textContent = sound.isPlaying ? t('soundOnShort') : t('soundOffShort');
        muteButton.textContent = sound.isPlaying ? t('soundOnShort') : t('soundOffShort');
        muteButton.setAttribute('aria-label', sound.isPlaying ? t('soundOn') : t('soundOff'));
    }

    function playSound() {
        if (!isAudioLoaded || !userInteracted || sound.isPlaying) return;

        sound.play();
        updateMuteButton();
    }

    audioLoader.load(
        audioPath,
        function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            isAudioLoaded = true;
            playSound();
        },
        undefined,
        function(err) {
            console.error('An error occurred while loading audio:', err);
        }
    );

    window.addEventListener('click', () => {
        userInteracted = true;
        playSound();
    }, { once: true });

    if (muteButton) {
        updateMuteButton();

        muteButton.addEventListener('click', event => {
            event.stopPropagation();
            userInteracted = true;

            if (!isAudioLoaded) return;

            if (sound.isPlaying) {
                sound.pause();
            } else {
                sound.play();
            }

            updateMuteButton();
        });
    }

    return sound;
}
