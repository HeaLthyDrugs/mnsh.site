class SoundManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  playAudio(url: string) {
    if (typeof window === "undefined") return;

    let audio = this.audioCache.get(url);

    if (!audio) {
      audio = new Audio(url);
      audio.preload = "none";
      this.audioCache.set(url, audio);
    }

    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn(`Audio play failed for ${url}:`, err);
    });
  }

  playClick() {
    this.playAudio(
      "https://assets.mnsh.online/audio/ui-sounds/click.wav" // Source: iOS UI Sounds
    );
  }

  playTap() {
    this.playAudio("/sounds/tap.wav");
  }

  playWoosh() {
    this.playAudio("/sounds/woosh.wav");
  }
}

const soundManager = new SoundManager();

export default soundManager;
