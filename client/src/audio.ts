export const AudioHandler = {
  init: () => {
    Object.entries(AudioHandler.files).forEach(([name, file]) => {
      AudioHandler.audioObjects[name as AudioName] = new Audio(
        AudioHandler.path + "/" + file
      );
    });
  },
  path: "/sounds",
  files: {
    button: "button.wav",
    confirm: "confirm.wav",
    defeat: "defeat.mp3",
    fire: "fire.mp3",
    start: "start.wav",
    victory: "victory.mp3",
  } as { [key in AudioName]: string },

  audioObjects: {} as { [key in AudioName]: HTMLAudioElement },
  play: (name: AudioName) => {
    console.log("Play", name);
    AudioHandler.audioObjects[name].play();
  },
};

type AudioName = "button" | "confirm" | "defeat" | "fire" | "start" | "victory";

AudioHandler.init();
