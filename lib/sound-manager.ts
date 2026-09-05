const DEFAULT_VOLUMES: Record<string, number> = {
  "/sounds/hover.wav": 0.1,
  "/sounds/tap.wav": 0.18,
  "/sounds/copy.wav": 0.2,
  "/sounds/woosh.wav": 0.15,
};

class SoundManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  playAudio(url: string, volume?: number) {
    if (typeof window === "undefined") return;

    let audio = this.audioCache.get(url);

    if (!audio) {
      audio = new Audio(url);
      audio.preload = "none";
      this.audioCache.set(url, audio);
    }

    const targetVolume = volume ?? DEFAULT_VOLUMES[url] ?? 0.18;
    audio.volume = Math.max(0, Math.min(1, targetVolume));
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.warn(`Audio play failed for ${url}:`, err);
    });
  }

  playClick() {
    this.playAudio(
      "https://assets.mnsh.site/audio/ui-sounds/click.wav",
      0.15
    );
  }

  playTap() {
    this.playAudio("/sounds/tap.wav", 0.18);
  }

  playCopy() {
    this.playAudio("/sounds/copy.wav", 0.2);
  }

  playWoosh() {
    this.playAudio("/sounds/woosh.wav", 0.15);
  }
}

const soundManager = new SoundManager();

export default soundManager;
