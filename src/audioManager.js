import * as THREE from "three";

let isAudioLoaded = false;
let userInteracted = false;

export function setupAudio(camera, audioPath) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    const playSound = () => {
        if (isAudioLoaded && userInteracted && !sound.isPlaying) {
            sound.play();
            const muteButton = document.getElementById('muteButton');
            if (muteButton) muteButton.textContent = '🔊';
        }
    };

    audioLoader.load(audioPath,
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
        });
    
    window.addEventListener('click', () => {
        userInteracted = true;
        playSound();
    }, { once: true });

    const muteButton = document.getElementById('muteButton');
    if (muteButton) {
        muteButton.addEventListener('click', () => {
            if (sound.isPlaying) {
                sound.pause();
                muteButton.textContent = '🔇';
            } else {
                sound.play();
                muteButton.textContent = '🔊';
            }
        });
    }
    return sound;
}
