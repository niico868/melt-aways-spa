import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import ambienceAsset from "@/assets/ambience.mp3.asset.json";

const STORAGE_KEY = "meltaways:ambience";
const TARGET_VOLUME = 0.45;
const MAX_PLAYS = 2;

export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playCountRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // First-visit hint (only if user hasn't decided yet)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      const t = setTimeout(() => setShowHint(true), 1200);
      const dismiss = setTimeout(() => setShowHint(false), 6500);
      return () => { clearTimeout(t); clearTimeout(dismiss); };
    }
  }, []);

  const fadeTo = (target: number, done?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    const start = audio.volume;
    const steps = 12;
    const stepMs = 35;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      audio.volume = Math.max(0, Math.min(1, start + (target - start) * (i / steps)));
      if (i >= steps) {
        clearInterval(id);
        done?.();
      }
    }, stepMs);
  };

  const toggle = async () => {
    setShowHint(false);
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      fadeTo(0, () => {
        audio.pause();
        setPlaying(false);
      });
      window.localStorage.setItem(STORAGE_KEY, "off");
    } else {
      playCountRef.current = 0;
      audio.currentTime = 0;
      audio.volume = 0;
      try {
        await audio.play();
        setPlaying(true);
        fadeTo(TARGET_VOLUME);
        window.localStorage.setItem(STORAGE_KEY, "on");
      } catch {
        // Autoplay blocked; leave paused.
      }
    }
  };

  const handleEnded = () => {
    const audio = audioRef.current;
    if (!audio) return;
    playCountRef.current += 1;
    if (playCountRef.current < MAX_PLAYS) {
      audio.currentTime = 0;
      void audio.play();
    } else {
      setPlaying(false);
      playCountRef.current = 0;
    }
  };

  return (
    <>
      <audio ref={audioRef} src={ambienceAsset.url} preload="none" onEnded={handleEnded} />
      <div
        className="fixed left-4 z-30 flex items-center gap-2"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Mute background music" : "Play background music"}
          aria-pressed={playing}
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-background/85 backdrop-blur border border-border/60 text-primary shadow-md hover:shadow-lg hover:bg-background transition"
        >
          {!playing && showHint && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-primary/50 motion-safe:animate-ping"
            />
          )}
          {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
        {showHint && !playing && (
          <span className="hidden sm:inline-flex items-center rounded-full bg-background/85 backdrop-blur border border-border/60 px-3 py-1.5 text-xs text-foreground/80 shadow-sm">
            Tap for ambience
          </span>
        )}
      </div>
    </>
  );
}